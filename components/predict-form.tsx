"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriorityBadge } from "@/components/priority-badge";
import { Spinner } from "@/components/ui/spinner";
import { analyzeEmail } from "@/lib/api";
import type { AnalysisResponse } from "@/lib/api";

export function PredictForm() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const analysisResult = await analyzeEmail({ subject, content });
      setResult(analysisResult);
      setSubject("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Email Content
            </label>
            <textarea
              id="content"
              placeholder="Enter email content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !subject || !content}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Analyzing...
              </>
            ) : (
              "Analyze Email"
            )}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="p-6 bg-red-50 border-2 border-red-200">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Predicted Priority
              </p>
              <PriorityBadge
                priority={result.priority}
                className="text-base px-4 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Email Size</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {result.email_size.toFixed(2)} KB
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  ✓ Saved
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
