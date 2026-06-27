#!/usr/bin/env node

/**
 * Initialize JSON database with sample email data
 * Run with: node scripts/init-db.js
 */

const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'backend', 'database');
const dbPath = path.join(dbDir, 'emails.json');

// Create directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created directory: ${dbDir}`);
}

// Sample emails
const sampleEmails = [
  {
    id: 1,
    subject: 'Urgent: Server Down',
    content: 'Our production server is down! Need immediate action. The service is completely unavailable.',
    priority: 'High',
    email_size: 0.25,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    subject: 'Meeting reminder',
    content: 'Just a reminder about our meeting tomorrow at 2pm. Please come prepared with your updates.',
    priority: 'Medium',
    email_size: 0.18,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    subject: 'Newsletter for April',
    content: 'Here is your monthly newsletter with company updates. FYI only, no action needed.',
    priority: 'Low',
    email_size: 0.42,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 4,
    subject: 'Critical Database Issue',
    content: 'ASAP: The database is experiencing performance issues. This is urgent and needs immediate attention.',
    priority: 'High',
    email_size: 0.31,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 5,
    subject: 'Weekly Status Report',
    content: 'Here is the weekly status report for your review. Please check the attachments.',
    priority: 'Medium',
    email_size: 0.28,
    created_at: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: 6,
    subject: 'Unsubscribe from marketing',
    content: 'Click here to unsubscribe from our marketing communications.',
    priority: 'Low',
    email_size: 0.15,
    created_at: new Date(Date.now() - 21600000).toISOString()
  }
];

const database = {
  emails: sampleEmails
};

// Write to file
try {
  fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
  console.log(`Database initialized at: ${dbPath}`);
  console.log(`Inserted ${sampleEmails.length} sample emails`);
  console.log('Database is ready!');
  process.exit(0);
} catch (error) {
  console.error('Error creating database:', error);
  process.exit(1);
}
