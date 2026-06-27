# Smart Email Priority Analyzer - Architecture

## System Overview

This document describes the architecture and design of the Smart Email Priority Analyzer application.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  Dashboard       │  │  Analyzer Page   │  │  Analytics    │  │
│  │  - Stats Cards   │  │  - Email Form    │  │  - Pie Chart  │  │
│  │  - Email Table   │  │  - Result Badge  │  │  - Bar Chart  │  │
│  │  - Search/Sort   │  │  - Size Display  │  │  - Line Chart │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│         ↓                      ↓                      ↓           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            React Components & SWR Hooks                    │  │
│  │  - priority-badge.tsx       - email-table.tsx             │  │
│  │  - dashboard-cards.tsx      - predict-form.tsx            │  │
│  │  - analytics-charts.tsx     - navbar.tsx                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│         ↓                                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │         API Client (lib/api.ts)                            │  │
│  │  - analyzeEmail()    - getStats()                          │  │
│  │  - getEmails()       - getAnalytics()                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↓ HTTP Requests (JSON)
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ api/analyze.py - FastAPI Application                        │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Endpoints:                                           │   │ │
│  │  │ - POST   /api/analyze  - Analyze email              │   │ │
│  │  │ - GET    /api/emails   - Fetch emails               │   │ │
│  │  │ - GET    /api/stats    - Get statistics             │   │ │
│  │  │ - GET    /api/analytics- Get analytics data         │   │ │
│  │  │ - GET    /            - Health check                │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Request Handler Flow:                                │   │ │
│  │  │ 1. Validate input (subject, content)                 │   │ │
│  │  │ 2. Combine subject + content                         │   │ │
│  │  │ 3. Calculate email size                              │   │ │
│  │  │ 4. Vectorize text using TF-IDF                       │   │ │
│  │  │ 5. Predict priority with Naive Bayes                 │   │ │
│  │  │ 6. Save to SQLite database                           │   │ │
│  │  │ 7. Return response with priority & size              │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓ Load/Save          ↓ Load Models        ↓ SQL Queries
┌──────────────────┐  ┌──────────────────────┐  ┌────────────────┐
│   ML Models      │  │  Model Loading       │  │   Database     │
│                  │  │                      │  │                │
│ ┌──────────────┐ │  │ ┌────────────────┐  │  │ ┌────────────┐  │
│ │ Naive Bayes  │ │  │ │ Load on Startup│  │  │ │ emails.db  │  │
│ │ Classifier   │ │  │ │ - pickle files │  │  │ │  (SQLite)  │  │
│ │ (pkl)        │ │  │ │ - model        │  │  │ │            │  │
│ └──────────────┘ │  │ │ - vectorizer   │  │  │ │ Columns:   │  │
│ ┌──────────────┐ │  │ │ Cache in memory│  │  │ │ - id       │  │
│ │ TF-IDF       │ │  │ │ for speed      │  │  │ │ - subject  │  │
│ │ Vectorizer   │ │  │ └────────────────┘  │  │ │ - content  │  │
│ │ (pkl)        │ │  │                      │  │ │ - priority │  │
│ └──────────────┘ │  │                      │  │ │ - size     │  │
│ ┌──────────────┐ │  │                      │  │ │ - date     │  │
│ │ Training     │ │  │                      │  │ │            │  │
│ │ Dataset      │ │  │                      │  │ │ Indexes:   │  │
│ │ (csv)        │ │  │                      │  │ │ - date_at  │  │
│ └──────────────┘ │  │                      │  │ │ - priority │  │
└──────────────────┘  └──────────────────────┘  └────────────────┘
```

## Component Architecture

### Frontend Layer

#### Pages
1. **Dashboard** (`/app/page.tsx`)
   - Fetches stats and emails on mount
   - Displays statistics cards
   - Shows email table with history
   - Handles loading and error states

2. **Predict** (`/app/predict/page.tsx`)
   - Form to input email subject and content
   - Calls /api/analyze endpoint
   - Displays prediction results
   - Shows success/error feedback

3. **Analytics** (`/app/analytics/page.tsx`)
   - Fetches analytics data on mount
   - Renders three charts
   - Handles loading states

#### Components
1. **Navbar** (`navbar.tsx`)
   - Navigation between pages
   - Active page highlighting
   - Sticky positioning

2. **Priority Badge** (`priority-badge.tsx`)
   - Color-coded priority display
   - Reusable across pages
   - High (red), Medium (yellow), Low (green)

3. **Dashboard Cards** (`dashboard-cards.tsx`)
   - Stats display (total, high, medium, low)
   - Color-coded cards
   - Loading skeleton state

4. **Email Table** (`email-table.tsx`)
   - Searchable email list
   - Sort options (date, priority, size)
   - Pagination (10 per page)
   - Subject, content preview, priority, size, date

5. **Predict Form** (`predict-form.tsx`)
   - Subject and content inputs
   - Submit button with loading state
   - Result display with priority badge
   - Error handling

6. **Analytics Charts** (`analytics-charts.tsx`)
   - Pie chart for priority distribution
   - Bar chart for email counts
   - Line chart for daily activity (30 days)
   - Recharts library integration

#### Utilities
- **API Client** (`lib/api.ts`)
  - Async functions for backend calls
  - Type-safe request/response handling
  - Error propagation

### Backend Layer

#### FastAPI Application (`api/analyze.py`)

**Initialization:**
- Loads ML model and vectorizer on startup (cached in memory)
- Initializes database connection pool
- Sets up global state for performance

**Endpoints:**

1. **POST /api/analyze**
   - Input: email subject and content
   - Process:
     - Validate inputs
     - Combine subject + content
     - Calculate email size (KB)
     - Vectorize using TF-IDF
     - Predict using Naive Bayes
     - Save to database
     - Return result
   - Output: priority, email_size, id

2. **GET /api/emails**
   - Returns 100 most recent emails
   - Ordered by created_at descending
   - Includes preview of content (100 chars)

3. **GET /api/stats**
   - Counts total and by priority
   - Single query with GROUP BY

4. **GET /api/analytics**
   - Priority distribution (count per priority)
   - Daily activity (last 30 days)
   - Used for chart data

5. **GET /**
   - Health check
   - Returns status OK

### ML Model Layer

#### Training Pipeline (`scripts/train_model.py`)

1. **Dataset Generation**
   - 40 high-priority emails (urgent, time-sensitive)
   - 40 medium-priority emails (important but not urgent)
   - 40 low-priority emails (informational, FYI)
   - Synthetic/realistic email examples

2. **Preprocessing**
   - No preprocessing - raw text used
   - TF-IDF vectorizer handles feature extraction

3. **Vectorization**
   - TF-IDF (Term Frequency-Inverse Document Frequency)
   - Parameters:
     - max_features: 500 (top 500 most important terms)
     - ngram_range: (1, 2) (unigrams and bigrams)
     - stop_words: 'english'
     - min_df: 1, max_df: 0.9

4. **Model Training**
   - Algorithm: Multinomial Naive Bayes
   - Parameter: alpha=0.1 (Laplace smoothing)
   - Target accuracy: 90-95%

5. **Model Saving**
   - Pickles model and vectorizer
   - Saves metadata (accuracy, metrics, config)
   - Files stored in `backend/models/`

### Database Layer

#### SQLite Schema

```sql
CREATE TABLE emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low')),
    email_size REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emails_created_at ON emails(created_at DESC);
CREATE INDEX idx_emails_priority ON emails(priority);
```

**Data Types:**
- `id`: Auto-incrementing integer primary key
- `subject`: Email subject line (TEXT)
- `content`: Full email content (TEXT)
- `priority`: Predicted priority level (TEXT, enum-like check constraint)
- `email_size`: Email size in KB (REAL)
- `created_at`: Timestamp of prediction (TIMESTAMP)

**Indexes:**
- `created_at` DESC - Fast retrieval of recent emails
- `priority` - Fast filtering by priority

## Data Flow

### Email Analysis Flow
```
User Input (Subject + Content)
    ↓
[Frontend Form Component]
    ↓
[Submit] → POST /api/analyze
    ↓
[FastAPI Endpoint]
    ↓
1. Validate input
2. Combine text
3. Calculate size
    ↓
[TF-IDF Vectorizer] (cached model)
    ↓
[Naive Bayes] (cached model)
    ↓
Priority Prediction
    ↓
[SQLite Insert]
    ↓
Return Response → [Frontend Component]
    ↓
Display Result (Priority Badge + Size)
    ↓
Save to Local State
```

### Dashboard Data Flow
```
Dashboard Component Mount
    ↓
[useEffect] triggers
    ↓
Parallel Fetch:
├─ GET /api/stats
└─ GET /api/emails
    ↓
[FastAPI Endpoints]
    ↓
Query SQLite:
├─ COUNT(*) for total
├─ COUNT(*) GROUP BY priority
└─ SELECT * ORDER BY created_at DESC LIMIT 100
    ↓
Return JSON → [Frontend]
    ↓
[State Update]
    ↓
Render Components:
├─ DashboardCards (stats)
└─ EmailTable (emails)
```

## Performance Optimizations

1. **Model Caching**
   - Load ML model once on startup
   - Keep in memory for requests
   - Avoid disk I/O on each prediction

2. **Database Indexing**
   - Index on created_at for fast sorting
   - Index on priority for fast filtering
   - Improves query performance

3. **API Response Caching**
   - Frontend uses SWR for automatic caching
   - Revalidate data on focus or time interval
   - Reduces unnecessary API calls

4. **Content Truncation**
   - Email content limited to 100 chars in preview
   - Reduces data transfer
   - Full content stored in database

5. **Pagination**
   - Email table shows 10 items per page
   - Frontend pagination (no server-side)
   - Improves perceived performance

## Error Handling

### Frontend
- Try-catch blocks in async functions
- User-friendly error messages
- Loading states during async operations
- Validation before submission

### Backend
- Input validation on all endpoints
- Graceful fallback if models not loaded
- Database error handling
- JSON error responses

### Model Initialization
- Check if model files exist
- Graceful degradation if not available
- Warning messages in logs

## Security Considerations

1. **Input Validation**
   - All endpoints validate input
   - SQL parameters use prepared statements
   - No SQL injection possible

2. **CORS**
   - Same-origin requests only
   - Frontend and backend on same domain

3. **Data Persistence**
   - SQLite file should be protected
   - Model files are read-only after training
   - No sensitive data in requests/responses

4. **Model Integrity**
   - Pickle files are signed data
   - Cannot be modified without detection
   - Loaded in protected environment

## Scalability Considerations

### Current Limitations
- Single SQLite database (suitable for single-machine)
- Models loaded in memory (must fit in RAM)
- Single Python process

### Scaling Strategies
1. **Database**: Migrate to PostgreSQL/MySQL for multi-process support
2. **Model Serving**: Use dedicated model serving (TensorFlow Serving, etc.)
3. **Caching**: Add Redis for API response caching
4. **Async**: Use async database drivers
5. **Load Balancing**: Multiple FastAPI instances behind load balancer

## Development Workflow

1. **Setup**: Install dependencies, run training and DB scripts
2. **Development**: `npm run dev` starts dev server with hot reload
3. **Type Checking**: TypeScript for frontend type safety
4. **Testing**: Manual testing via browser
5. **Deployment**: Push to GitHub, deploy via Vercel

## Deployment Architecture

### Vercel Deployment
```
GitHub Repository
    ↓
Vercel Build Pipeline
    ├─ npm run build (Next.js build)
    ├─ Python dependencies install
    └─ Model + DB files preserved
    ↓
Edge Network (Frontend)
    ↓
Serverless Function (api/analyze.py)
    ↓
Persistent Storage (Models + DB)
```

**Important**: Model files and database must be available to Serverless Functions, may require external storage for production scalability.

## Future Architecture Improvements

1. **Vector Database**: Use embeddings with FAISS for similarity search
2. **Streaming**: WebSocket for real-time updates
3. **Microservices**: Separate ML service from API
4. **Caching Layer**: Redis for frequently accessed data
5. **Message Queue**: Async processing for bulk emails
6. **Monitoring**: Prometheus/Grafana for metrics
7. **Authentication**: User accounts and email ownership
