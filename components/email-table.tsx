"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/priority-badge";
import type { Email } from "@/lib/api";

interface EmailTableProps {
  emails: Email[];
  isLoading?: boolean;
}

export function EmailTable({ emails, isLoading = false }: EmailTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "size" | "priority">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSorted = useMemo(() => {
    let filtered = emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "size") {
      filtered.sort((a, b) => b.email_size - a.email_size);
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      filtered.sort(
        (a, b) =>
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    }

    return filtered;
  }, [emails, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedEmails = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-col md:flex-row">
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1"
          disabled={isLoading}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm"
          disabled={isLoading}
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Size
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Loading emails...
                </td>
              </tr>
            ) : paginatedEmails.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No emails found
                </td>
              </tr>
            ) : (
              paginatedEmails.map((email) => (
                <tr
                  key={email.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium truncate max-w-md">
                      {email.subject}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-md">
                      {email.content.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <PriorityBadge priority={email.priority} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {email.email_size.toFixed(2)} KB
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(email.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredAndSorted.length} emails)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
