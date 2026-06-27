# Smart Email Priority Analyzer

An AI-powered email priority analyzer that uses machine learning to classify emails as High, Medium, or Low priority. Built with Next.js, React, FastAPI, and scikit-learn.

## Features

- **Intelligent Email Analysis**: Machine learning model trained on 120+ emails to predict priority levels
- **Dashboard**: Real-time statistics and email history with search, filter, and pagination
- **Email Analyzer**: Submit emails for instant priority prediction
- **Analytics**: Visual insights with pie charts, bar charts, and activity trends
- **Persistent Storage**: SQLite database to save all analyzed emails
- **Responsive Design**: Modern UI that works on desktop and mobile

## Quick Start

### 1. Prerequisites
- Node.js 18+
- Python 3.9+

### 2. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
npm install
```

### 3. Setup (Required on First Run)

Run these two scripts in order:

```bash
# Step 1: Train the ML model
python scripts/train_model.py

# Step 2: Initialize the database
python scripts/setup_db.py
```

You should see output confirming both operations completed successfully.

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

### Dashboard
- View email statistics and history
- Search emails by subject or content
- Sort by date, priority, or size
- Browse analyzed emails with pagination

### Analyze
- Paste an email subject and content
- Get instant priority prediction (High/Medium/Low)
- Results automatically saved to database

### Analytics
- View priority distribution across all emails
- Track daily email activity
- Monitor trends with interactive charts

## Project Structure

```
.
├── api/
│   └── analyze.py              # FastAPI backend endpoint
├── app/
│   ├── page.tsx               # Dashboard page
│   ├── predict/
│   │   └── page.tsx           # Email analyzer page
│   ├── analytics/
│   │   └── page.tsx           # Analytics page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── backend/
│   ├── models/                # ML models (generated)
│   ├── dataset/               # Training data (generated)
│   └── database/              # SQLite database (generated)
├── components/
│   ├── navbar.tsx             # Navigation bar
│   ├── priority-badge.tsx     # Priority display badge
│   ├── dashboard-cards.tsx    # Stats cards
│   ├── email-table.tsx        # Email list table
│   ├── predict-form.tsx       # Analysis form
│   └── analytics-charts.tsx   # Chart components
├── lib/
│   ├── api.ts                 # Backend API client
│   └── utils.ts               # Utility functions
├── scripts/
│   ├── train_model.py         # Model training script
│   └── setup_db.py            # Database setup script
└── requirements.txt           # Python dependencies
```

## API Endpoints

### POST /api/analyze
Analyze email and predict priority

**Request:**
```json
{
  "subject": "Meeting Tomorrow at 2 PM",
  "content": "Hi, just confirming our meeting tomorrow..."
}
```

**Response:**
```json
{
  "priority": "Medium",
  "email_size": 0.45,
  "id": 1
}
```

### GET /api/emails
Fetch analyzed emails (max 100 most recent)

### GET /api/stats
Get email statistics (total, by priority)

### GET /api/analytics
Get analytics data (priority distribution, daily activity)

## Machine Learning Model Details

- **Algorithm**: Multinomial Naive Bayes
- **Feature Extraction**: TF-IDF Vectorizer
- **Training Data**: 120 synthetic emails
- **Expected Accuracy**: 90-95%
- **Features**: Unigrams and bigrams, max 500 features, English stop words removed

## Configuration

### Environment Variables
No environment variables required for local development. The app uses SQLite and pre-trained models.

### Model Training Parameters
Edit `scripts/train_model.py` to adjust:
- Dataset size and distribution
- TF-IDF parameters (max_features, ngram_range, etc.)
- Naive Bayes alpha value

## Troubleshooting

### "Model not loaded" error
**Solution**: Run `python scripts/train_model.py`

### "Database not found" error
**Solution**: Run `python scripts/setup_db.py`

### "ModuleNotFoundError" for Python packages
**Solution**: Run `pip install -r requirements.txt`

### Port 3000 already in use
**Solution**: Run on a different port: `npm run dev -- -p 3001`

## Development

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run typecheck
```

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Ensure Python dependencies are in `requirements.txt`
4. The `/api/analyze.py` file will be deployed as a Serverless Function
5. Run setup scripts after first deployment

### Requirements for Production
- Python 3.9+ runtime support
- Persistent storage for database and models (consider external database for scalability)
- Environment variables for sensitive configuration (if needed)

## Performance Considerations

- Models are loaded once at API startup for optimal performance
- SQLite indexes on `created_at` and `priority` for fast queries
- Frontend uses SWR for efficient data fetching and caching
- Email previews truncated to 50 characters for UI performance

## Future Enhancements

- Multi-language support
- Custom training data upload
- Email attachment analysis
- Export analytics reports
- Real Gmail integration
- User accounts and personalization
- Advanced ML models (transformers, etc.)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the SETUP.md file for detailed setup instructions
2. Review API endpoint documentation above
3. Check browser console for frontend errors
4. Review server logs for backend errors

## Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [scikit-learn](https://scikit-learn.org/) - Machine learning library
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Recharts](https://recharts.org/) - Charting library
