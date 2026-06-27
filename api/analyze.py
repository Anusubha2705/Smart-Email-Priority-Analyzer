"""
FastAPI backend for email priority analysis.
Loads pre-trained ML model and vectorizer, predicts email priority, saves to SQLite.
"""

import os
import pickle
import sqlite3
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Models and vectorizer storage
MODEL = None
VECTORIZER = None
MODEL_LOADED = False

# Paths
MODELS_DIR = Path(__file__).parent.parent / "backend" / "models"
DB_PATH = Path(__file__).parent.parent / "backend" / "database" / "emails.db"


def load_model():
    """Load pre-trained model and vectorizer from pickle files."""
    global MODEL, VECTORIZER, MODEL_LOADED
    
    if MODEL_LOADED:
        return
    
    try:
        model_path = MODELS_DIR / "priority_model.pkl"
        vectorizer_path = MODELS_DIR / "vectorizer.pkl"
        
        if not model_path.exists() or not vectorizer_path.exists():
            print("[v0] Warning: Model files not found. Please run scripts/train_model.py first.")
            return False
        
        with open(model_path, "rb") as f:
            MODEL = pickle.load(f)
        
        with open(vectorizer_path, "rb") as f:
            VECTORIZER = pickle.load(f)
        
        MODEL_LOADED = True
        print("[v0] Model and vectorizer loaded successfully")
        return True
    except Exception as e:
        print(f"[v0] Error loading model: {e}")
        return False


def init_db():
    """Initialize database if not already initialized."""
    try:
        if not DB_PATH.exists():
            print("[v0] Database not found. Please run scripts/setup_db.py first.")
            return False
        return True
    except Exception as e:
        print(f"[v0] Error checking database: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Load models on startup."""
    load_model()
    init_db()


class AnalysisRequest(BaseModel):
    """Request model for email analysis."""
    subject: str
    content: str


class AnalysisResponse(BaseModel):
    """Response model for email analysis."""
    priority: str
    email_size: float
    id: int | None = None


@app.post("/api/analyze")
async def analyze_email(request: AnalysisRequest) -> JSONResponse:
    """
    Analyze email and predict priority.
    
    Args:
        request: AnalysisRequest with subject and content
        
    Returns:
        JSONResponse with priority prediction and email size
    """
    
    # Check if model is loaded
    if not MODEL_LOADED or MODEL is None or VECTORIZER is None:
        return JSONResponse(
            status_code=503,
            content={"error": "Model not loaded. Please run scripts/train_model.py first."}
        )
    
    try:
        # Validate input
        subject = request.subject.strip() if request.subject else ""
        content = request.content.strip() if request.content else ""
        
        if not subject or not content:
            return JSONResponse(
                status_code=400,
                content={"error": "Subject and content are required"}
            )
        
        # Combine subject and content
        text = f"{subject} {content}"
        
        # Calculate email size (rough estimate in KB)
        email_size = len(text.encode()) / 1024
        
        # Vectorize and predict
        text_vectorized = VECTORIZER.transform([text])
        priority = MODEL.predict(text_vectorized)[0]
        
        # Save to database
        email_id = None
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO emails (subject, content, priority, email_size)
                VALUES (?, ?, ?, ?)
                """,
                (subject, content, priority, email_size)
            )
            conn.commit()
            email_id = cursor.lastrowid
            conn.close()
        except Exception as db_error:
            print(f"[v0] Warning: Database save failed: {db_error}")
        
        return JSONResponse(
            status_code=200,
            content={
                "priority": priority,
                "email_size": round(email_size, 2),
                "id": email_id
            }
        )
    
    except Exception as e:
        print(f"[v0] Error in analyze_email: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )


@app.get("/api/emails")
async def get_emails():
    """Fetch all analyzed emails from database."""
    
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute(
            """
            SELECT id, subject, content, priority, email_size, created_at
            FROM emails
            ORDER BY created_at DESC
            LIMIT 100
            """
        )
        rows = cursor.fetchall()
        conn.close()
        
        emails = [
            {
                "id": row["id"],
                "subject": row["subject"],
                "content": row["content"][:100],  # Preview only
                "priority": row["priority"],
                "email_size": row["email_size"],
                "created_at": row["created_at"]
            }
            for row in rows
        ]
        
        return JSONResponse(
            status_code=200,
            content={"emails": emails, "total": len(emails)}
        )
    
    except Exception as e:
        print(f"[v0] Error fetching emails: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to fetch emails: {str(e)}"}
        )


@app.get("/api/stats")
async def get_stats():
    """Fetch email statistics for dashboard."""
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT COUNT(*) as total FROM emails")
        total = cursor.fetchone()[0]
        
        # Get counts by priority
        cursor.execute(
            """
            SELECT priority, COUNT(*) as count
            FROM emails
            GROUP BY priority
            """
        )
        priority_counts = {row[0]: row[1] for row in cursor.fetchall()}
        
        conn.close()
        
        return JSONResponse(
            status_code=200,
            content={
                "total": total,
                "high": priority_counts.get("High", 0),
                "medium": priority_counts.get("Medium", 0),
                "low": priority_counts.get("Low", 0)
            }
        )
    
    except Exception as e:
        print(f"[v0] Error fetching stats: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to fetch stats: {str(e)}"}
        )


@app.get("/api/analytics")
async def get_analytics():
    """Fetch analytics data for charts."""
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Priority distribution
        cursor.execute(
            """
            SELECT priority, COUNT(*) as count
            FROM emails
            GROUP BY priority
            """
        )
        priority_dist = [
            {"priority": row[0], "count": row[1]}
            for row in cursor.fetchall()
        ]
        
        # Daily activity
        cursor.execute(
            """
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM emails
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
            """
        )
        daily_activity = [
            {"date": row[0], "count": row[1]}
            for row in cursor.fetchall()
        ]
        daily_activity.reverse()  # Chronological order
        
        conn.close()
        
        return JSONResponse(
            status_code=200,
            content={
                "priority_distribution": priority_dist,
                "daily_activity": daily_activity
            }
        )
    
    except Exception as e:
        print(f"[v0] Error fetching analytics: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to fetch analytics: {str(e)}"}
        )


@app.get("/")
async def root():
    """Health check endpoint."""
    return JSONResponse(
        status_code=200,
        content={"status": "ok", "message": "Email Priority Analyzer API"}
    )
