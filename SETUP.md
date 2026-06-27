# Smart Email Priority Analyzer - Setup Guide

This application analyzes emails and predicts their priority (High, Medium, Low) using machine learning.

## Prerequisites

- Node.js 18+ 
- Python 3.9+
- pip or uv package manager

## Initial Setup Steps

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
# OR using uv
uv sync
```

### 2. Generate Training Dataset and Train ML Model

Run the training script to:
- Generate 120 synthetic emails (40 per priority level)
- Train a Naive Bayes classifier with TF-IDF vectorizer
- Save model and vectorizer files

```bash
python scripts/train_model.py
```

Expected output:
```
✓ Dataset created: backend/dataset/email_dataset.csv
  Total emails: 120
  High priority: 40
  Medium priority: 40
  Low priority: 40

✓ Model trained successfully
  Accuracy: ~92%
  Precision: ~92%
  Recall: ~92%
  F1-Score: ~92%

✓ Model saved: backend/models/priority_model.pkl
✓ Vectorizer saved: backend/models/vectorizer.pkl
✓ Metadata saved: backend/models/model_metadata.json
```

### 3. Initialize Database

Create the SQLite database with the emails table:

```bash
python scripts/setup_db.py
```

Expected output:
```
✓ Database initialized: backend/database/emails.db
✓ Table 'emails' created with columns:
  - id (INTEGER PRIMARY KEY)
  - subject (TEXT)
  - content (TEXT)
  - priority (TEXT: High/Medium/Low)
  - email_size (REAL)
  - created_at (TIMESTAMP)
✓ Indexes created for optimized queries
```

### 4. Install Frontend Dependencies

```bash
npm install
# OR
pnpm install
```

### 5. Run Development Server

```bash
npm run dev
# OR
pnpm dev
```

The application will be available at `http://localhost:3000`

## Application Structure

### Backend (FastAPI + ML)
- **api/analyze.py** - Main FastAPI endpoint for email analysis
- **scripts/train_model.py** - ML training script
- **scripts/setup_db.py** - Database initialization
- **backend/models/** - Trained ML model and vectorizer (pickle files)
- **backend/dataset/** - Training dataset CSV
- **backend/database/** - SQLite database

### Frontend (Next.js + React)
- **app/page.tsx** - Dashboard with stats and email history
- **app/predict/page.tsx** - Email analysis form
- **app/analytics/page.tsx** - Analytics and charts
- **components/** - Reusable UI components
- **lib/api.ts** - Backend API client

## Features

### Dashboard
- View statistics (total emails, by priority)
- Browse analyzed email history
- Search and filter emails
- Pagination support

### Analyze
- Submit emails for priority analysis
- Get instant predictions
- View email size and priority badge
- Results saved to database

### Analytics
- Priority distribution pie chart
- Email count by priority bar chart
- Daily activity line chart
- Historical trends and insights

## API Endpoints

### POST /api/analyze
Analyze email and predict priority
```json
Request:
{
  "subject": "string",
  "content": "string"
}

Response:
{
  "priority": "High" | "Medium" | "Low",
  "email_size": number,
  "id": number
}
```

### GET /api/emails
Fetch analyzed emails

```json
Response:
{
  "emails": [{
    "id": number,
    "subject": string,
    "content": string,
    "priority": string,
    "email_size": number,
    "created_at": string
  }],
  "total": number
}
```

### GET /api/stats
Fetch statistics

```json
Response:
{
  "total": number,
  "high": number,
  "medium": number,
  "low": number
}
```

### GET /api/analytics
Fetch analytics data

```json
Response:
{
  "priority_distribution": [{
    "priority": string,
    "count": number
  }],
  "daily_activity": [{
    "date": string,
    "count": number
  }]
}
```

## Machine Learning Model

- **Algorithm**: Multinomial Naive Bayes
- **Feature Extraction**: TF-IDF Vectorizer
- **Training Samples**: 120 emails
- **Test Set Size**: 20 emails (from stratified split)
- **Expected Accuracy**: 90-95%
- **Features**: Word n-grams (1-2 grams), max 500 features

### Model Retraining

To retrain the model with your own dataset:

1. Prepare a CSV file with columns: `subject`, `content`, `priority`
2. Modify `scripts/train_model.py` to load your dataset
3. Run: `python scripts/train_model.py`

## Troubleshooting

### Model Files Not Found
**Error**: "Model not loaded. Please run scripts/train_model.py first."
**Solution**: Run `python scripts/train_model.py` in the project root

### Database Not Found
**Error**: "Database not found. Please run scripts/setup_db.py first."
**Solution**: Run `python scripts/setup_db.py` in the project root

### Port Already in Use
**Error**: "Port 3000 is already in use"
**Solution**: Run on a different port with `npm run dev -- -p 3001`

### Python Module Not Found
**Error**: "ModuleNotFoundError: No module named 'fastapi'"
**Solution**: Run `pip install -r requirements.txt`

## Development Notes

- The application uses SWR for client-side data fetching and caching
- Email analysis is performed in real-time via the FastAPI endpoint
- All data is persisted in SQLite database
- Models are loaded once at API startup for performance
- The frontend automatically handles loading states and error cases

## Production Deployment

When deploying to Vercel:

1. Ensure Python dependencies are in `requirements.txt`
2. The `/api/analyze.py` file will be automatically deployed as a Serverless Function
3. Database and model files must be preserved between deployments
4. Consider using persistent storage solutions for production use

## License

This project is open source and available under the MIT License.
