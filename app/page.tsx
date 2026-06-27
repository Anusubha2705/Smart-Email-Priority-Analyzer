"use client";

import { useEffect, useState } from "react";
import { DashboardCards } from "@/components/dashboard-cards";
import { EmailTable } from "@/components/email-table";
import { getStats, getEmails } from "@/lib/api";
import type { Stats, Email } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const [statsData, emailsData] = await Promise.all([
          getStats(),
          getEmails(),
        ]);
        setStats(statsData);
        setEmails(emailsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Email Priority Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze and track email priorities using machine learning
          </p>
        </div>

        {/* Stats Cards */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <DashboardCards
            total={stats?.total ?? 0}
            high={stats?.high ?? 0}
            medium={stats?.medium ?? 0}
            low={stats?.low ?? 0}
            isLoading={isLoading}
          />
        </div>

        {/* Email Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Emails
          </h2>
          <EmailTable emails={emails} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
