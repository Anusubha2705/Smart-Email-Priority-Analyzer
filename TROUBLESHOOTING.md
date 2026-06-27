## Troubleshooting Guide

### Error: "Failed to fetch stats"

**Problem**: The stats, emails, or analytics endpoints are not responding.

**Solutions**:

1. **Initialize Database**:
   ```bash
   npm run init-db
   ```
   This creates the SQLite database with sample emails.

2. **Clear and Rebuild**:
   ```bash
   rm -rf backend/database/emails.db
   npm run init-db
   npm run dev
   ```

3. **Check if backend directory exists**:
   ```bash
   ls -la backend/
   ```
   You should see a `database` folder. If not, the database wasn't created.

---

### Error: "Model not loaded" or ML Analysis Not Working

**Problem**: The machine learning model files are missing.

**Solution**: 
The app now uses a simple keyword-based priority system instead of the ML model. No setup needed! If you want to use the trained ML model:

```bash
python scripts/train_model.py
```

---

### Error: "Cannot find module 'better-sqlite3'"

**Problem**: Dependencies aren't installed.

**Solution**:
```bash
npm install
npm run init-db
npm run dev
```

---

### Error: "Database is locked"

**Problem**: Multiple processes are accessing the database at the same time.

**Solution**:
1. Stop the development server (Ctrl+C)
2. Wait 2-3 seconds
3. Run `npm run dev` again

---

### Stats Show 0 Emails

**Problem**: The database is empty.

**Solution**:
1. Run the init script:
   ```bash
   npm run init-db
   ```

2. Or manually add an email:
   - Go to the "Analyzer" page
   - Submit an email with subject and content
   - Click "Analyze"
   - The email will be saved and stats will update

---

### Port 3000 Already in Use

**Problem**: Another app is using port 3000.

**Solution**:
```bash
npm run dev -- -p 3001
```
Then visit http://localhost:3001

---

### Database Corruption or Errors

**Problem**: Database file is corrupted or tables are missing.

**Solution**:
```bash
# Remove the old database
rm -rf backend/database/

# Recreate it fresh
npm run init-db

# Restart the app
npm run dev
```

---

### API Routes Not Responding

**Problem**: API calls to `/api/stats`, `/api/emails`, etc. are failing.

**Checklist**:
1. Development server is running (`npm run dev`)
2. Database file exists: `backend/database/emails.db`
3. Check browser console for exact error message
4. Try in an incognito window (clear cache)

---

### Slow Performance

**Problem**: App is running slowly.

**Solution**:
1. The database can handle thousands of emails
2. If you have many emails, the initial page load may be slow
3. Tables show max 100 emails - this is intentional
4. Charts show max 30 days of data

---

### How to Reset Everything

**Start fresh**:
```bash
# Remove database and model files
rm -rf backend/

# Reinstall dependencies
rm -rf node_modules
npm install

# Initialize fresh database
npm run init-db

# Start clean
npm run dev
```

---

### Need More Help?

1. Check the browser console for error messages (F12 or right-click → Inspect)
2. Check the terminal where `npm run dev` is running
3. Review the ARCHITECTURE.md file for system overview
4. Review API routes in `app/api/`

---

### Quick Fix Commands

```bash
# Just want it to work?
npm run init-db && npm run dev

# Want a clean slate?
rm -rf backend && npm run init-db && npm run dev

# Want to clear all data but keep DB?
npm run init-db
```

Remember: The app is designed to work with zero configuration. Just run `npm run init-db` and you're good to go!
