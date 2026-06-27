#!/usr/bin/env python3
"""
Database Setup Script
Initializes SQLite database with emails table.
"""

import sqlite3
from pathlib import Path

# Create database directory
db_dir = Path("backend/database")
db_dir.mkdir(parents=True, exist_ok=True)

# Database path
db_path = db_dir / "emails.db"

# Connect to database (creates if doesn't exist)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create emails table
create_table_sql = """
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low')),
    email_size REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""

cursor.execute(create_table_sql)

# Create index on created_at for faster queries
cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_emails_created_at 
ON emails(created_at DESC)
""")

# Create index on priority for faster filtering
cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_emails_priority 
ON emails(priority)
""")

conn.commit()
conn.close()

print(f"✓ Database initialized: {db_path}")
print(f"✓ Table 'emails' created with columns:")
print(f"  - id (INTEGER PRIMARY KEY)")
print(f"  - subject (TEXT)")
print(f"  - content (TEXT)")
print(f"  - priority (TEXT: High/Medium/Low)")
print(f"  - email_size (REAL)")
print(f"  - created_at (TIMESTAMP)")
print(f"✓ Indexes created for optimized queries")
