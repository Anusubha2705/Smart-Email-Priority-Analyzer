# Quick Start Guide

## Start Here (2 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database with Sample Data
```bash
npm run init-db
```
This creates the SQLite database and adds sample emails for testing.

### Step 3: Start Developing
```bash
npm run dev
```
Visit http://localhost:3000

You'll see the dashboard with stats and sample emails right away!

## Key Commands

```bash
# Database
npm run init-db       # Initialize database with sample emails

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm start             # Run production build

# ML Model
python scripts/train_model.py    # Train or retrain model
python scripts/setup_db.py       # Initialize database

# Checking
npm run typecheck    # Check TypeScript types
npm run lint         # Lint code (if configured)
```

## Using the App

### Dashboard (/)
- View stats cards (total, high, medium, low)
- Browse email history
- Search by subject or content
- Sort by date, priority, or size

### Analyzer (/predict)
1. Paste email subject
2. Paste email content
3. Click "Analyze Email"
4. Get priority prediction
5. Result automatically saved

### Analytics (/analytics)
- See priority distribution pie chart
- View email count bar chart
- Track daily activity over 30 days

## File Structure Cheat Sheet

```
Frontend (React/Next.js)
├── app/
│   ├── page.tsx           # Dashboard
│   ├── predict/page.tsx   # Analyzer
│   ├── analytics/page.tsx # Charts
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Styles
├── components/            # Reusable components
├── lib/api.ts            # API calls
└── package.json          # Node dependencies

Backend (Python/FastAPI)
├── api/analyze.py        # Main endpoint
├── scripts/
│   ├── train_model.py    # Train ML model
│   └── setup_db.py       # Create database
├── backend/
│   ├── models/           # ML models (generated)
│   ├── dataset/          # Training data (generated)
│   └── database/         # SQLite database (generated)
└── requirements.txt      # Python dependencies
```

## API Endpoints Quick Reference

```
POST /api/analyze
├─ Input: { subject, content }
└─ Output: { priority, email_size, id }

GET /api/emails
└─ Output: { emails: [...], total: N }

GET /api/stats
└─ Output: { total, high, medium, low }

GET /api/analytics
└─ Output: { priority_distribution, daily_activity }
```

## Example Email to Try

**Subject:** URGENT: Server Down - Immediate Action Required

**Content:** 
Our production server is down. All users are affected. Need immediate action to restore service. This is critical business impact.

Expected result: **High Priority**

---

**Subject:** Team Meeting Tomorrow

**Content:**
Hi everyone, just confirming our team sync tomorrow at 10 AM. Looking forward to discussing the project status.

Expected result: **Medium Priority**

---

**Subject:** Office Supplies Available

**Content:**
Just a reminder that office supplies are now available for pickup in the lobby. Coffee machines have been updated.

Expected result: **Low Priority**

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Model not loaded" | Run `python scripts/train_model.py` |
| "Database not found" | Run `python scripts/setup_db.py` |
| "Port 3000 in use" | Run `npm run dev -- -p 3001` |
| "ModuleNotFoundError" | Run `pip install -r requirements.txt` |
| Slow predictions | Check if model loaded (check logs) |
| No data showing | Analyze an email first to populate DB |

## Common Tasks

### Retrain Model with Custom Data
1. Edit `scripts/train_model.py`
2. Replace email datasets with your own
3. Run `python scripts/train_model.py`
4. Restart dev server

### Export Email Data
```python
import sqlite3
conn = sqlite3.connect('backend/database/emails.db')
emails = conn.execute('SELECT * FROM emails').fetchall()
# Process emails as needed
```

### Clear Database
```bash
# Delete database file
rm backend/database/emails.db

# Recreate empty database
python scripts/setup_db.py
```

### Check Model Accuracy
Look at output of:
```bash
python scripts/train_model.py
```
Accuracy metrics shown after training.

## IDE Setup

### VS Code
Recommended extensions:
- ESLint
- Prettier
- Python
- SQLite

### PyCharm
- Built-in Python and JavaScript support
- File → Open → Select project folder

## Git Workflow

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push

# In Vercel dashboard
# Changes auto-deploy when pushed to main
```

## Performance Tips

1. **Don't commit model files** - Run scripts on deployment
2. **Use SSD** - Faster database operations
3. **Keep database clean** - Archive old emails
4. **Monitor browser console** - Check for client errors
5. **Check server logs** - Debug backend issues

## Environment Variables (Optional)

Currently none required for local development. For production, you might add:
- Database URL (if using external DB)
- API keys (if using external services)
- Environment-specific settings

Set in Vercel dashboard → Settings → Environment Variables

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [scikit-learn Guide](https://scikit-learn.org/stable/)
- [SQLite Tutorial](https://www.sqlite.org/cli.html)
- [Recharts Examples](https://recharts.org/en-US/examples)

## Need Help?

1. Check SETUP.md for detailed setup
2. Check ARCHITECTURE.md for system design
3. Check API response messages
4. Check browser console (F12)
5. Check server logs
6. Read code comments

## Next Steps

- Customize email dataset
- Adjust ML model parameters
- Add authentication
- Connect to real email service
- Deploy to production
- Add more features

Good luck! 🚀
