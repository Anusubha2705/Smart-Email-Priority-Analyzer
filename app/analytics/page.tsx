"use client";

import { useEffect, useState } from "react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { getAnalytics } from "@/lib/api";
import type { Analytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 mt-2">
            View email priority distribution and activity trends
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Charts */}
        {analytics && (
          <AnalyticsCharts
            priorityDistribution={analytics.priority_distribution}
            dailyActivity={analytics.daily_activity}
            isLoading={isLoading}
          />
        )}

        {!analytics && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No analytics data available yet. Analyze some emails first!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
