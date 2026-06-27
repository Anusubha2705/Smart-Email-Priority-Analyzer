/**
 * API helper functions for communicating with the backend
 */

export interface AnalysisRequest {
  subject: string;
  content: string;
}

export interface AnalysisResponse {
  priority: "High" | "Medium" | "Low";
  email_size: number;
  id?: number;
}

export interface Email {
  id: number;
  subject: string;
  content: string;
  priority: "High" | "Medium" | "Low";
  email_size: number;
  created_at: string;
}

export interface Stats {
  total: number;
  high: number;
  medium: number;
  low: number;
}

export interface PriorityDistribution {
  priority: string;
  count: number;
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface Analytics {
  priority_distribution: PriorityDistribution[];
  daily_activity: DailyActivity[];
}

/**
 * Analyze email and get priority prediction
 */
export async function analyzeEmail(
  request: AnalysisRequest
): Promise<AnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze email");
  }

  return response.json();
}

/**
 * Get list of all analyzed emails
 */
export async function getEmails(): Promise<Email[]> {
  const response = await fetch("/api/emails");

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  const data = await response.json();
  return data.emails;
}

/**
 * Get email statistics (total, by priority)
 */
export async function getStats(): Promise<Stats> {
  const response = await fetch("/api/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}

/**
 * Get analytics data (priority distribution, daily activity)
 */
export async function getAnalytics(): Promise<Analytics> {
  const response = await fetch("/api/analytics");

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}
