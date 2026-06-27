import fs from 'fs';
import path from 'path';

interface Email {
  id: number;
  subject: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  email_size: number;
  created_at: string;
}

interface Database {
  emails: Email[];
}

const dbDir = path.join(process.cwd(), 'backend', 'database');
const dbPath = path.join(dbDir, 'emails.json');

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

// Load database from file
function loadDatabase(): Database {
  ensureDir();
  
  if (fs.existsSync(dbPath)) {
    try {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('[v0] Failed to load database, creating new one');
      return { emails: [] };
    }
  }
  
  return { emails: [] };
}

// Save database to file
function saveDatabase(db: Database) {
  ensureDir();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('[v0] Failed to save database:', error);
  }
}

// Add email to database
export async function addEmail(
  subject: string,
  content: string,
  priority: 'High' | 'Medium' | 'Low',
  email_size: number
): Promise<boolean> {
  try {
    const db = loadDatabase();
    
    const newEmail: Email = {
      id: db.emails.length + 1,
      subject,
      content,
      priority,
      email_size,
      created_at: new Date().toISOString()
    };
    
    db.emails.push(newEmail);
    saveDatabase(db);
    return true;
  } catch (error) {
    console.error('[v0] Error adding email:', error);
    return false;
  }
}

// Get all emails
export async function getEmails(): Promise<Email[]> {
  try {
    const db = loadDatabase();
    
    // Return emails sorted by creation date (newest first), limited to 100
    return db.emails
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 100)
      .map(email => ({
        ...email,
        content: email.content.substring(0, 100) // Truncate for list view
      }));
  } catch (error) {
    console.error('[v0] Error getting emails:', error);
    return [];
  }
}

// Get statistics
export async function getStats(): Promise<{
  total: number;
  high: number;
  medium: number;
  low: number;
}> {
  try {
    const db = loadDatabase();
    
    const stats = {
      total: db.emails.length,
      high: 0,
      medium: 0,
      low: 0
    };
    
    db.emails.forEach(email => {
      if (email.priority === 'High') stats.high++;
      if (email.priority === 'Medium') stats.medium++;
      if (email.priority === 'Low') stats.low++;
    });
    
    return stats;
  } catch (error) {
    console.error('[v0] Error getting stats:', error);
    return { total: 0, high: 0, medium: 0, low: 0 };
  }
}

// Get analytics data
export async function getAnalytics(): Promise<{
  priority_distribution: Array<{ priority: string; count: number }>;
  daily_activity: Array<{ date: string; count: number }>;
}> {
  try {
    const db = loadDatabase();
    
    // Priority distribution
    const priorityCounts: Record<string, number> = {
      High: 0,
      Medium: 0,
      Low: 0
    };
    
    db.emails.forEach(email => {
      priorityCounts[email.priority]++;
    });
    
    const priority_distribution = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count
    }));
    
    // Daily activity (group by date)
    const dailyMap: Record<string, number> = {};
    
    db.emails.forEach(email => {
      const date = new Date(email.created_at).toISOString().split('T')[0];
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    
    const daily_activity = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      priority_distribution,
      daily_activity
    };
  } catch (error) {
    console.error('[v0] Error getting analytics:', error);
    return {
      priority_distribution: [],
      daily_activity: []
    };
  }
}
