"use client";

import { Card } from "@/components/ui/card";

interface DashboardCardsProps {
  total: number;
  high: number;
  medium: number;
  low: number;
  isLoading?: boolean;
}

export function DashboardCards({
  total,
  high,
  medium,
  low,
  isLoading = false,
}: DashboardCardsProps) {
  const cards = [
    {
      label: "Total Emails",
      value: total,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      label: "High Priority",
      value: high,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
    {
      label: "Medium Priority",
      value: medium,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
    },
    {
      label: "Low Priority",
      value: low,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`p-6 border-2 ${card.borderColor} ${card.bgColor}`}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <p
              className={`text-3xl font-bold ${card.textColor} ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? "-" : card.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
