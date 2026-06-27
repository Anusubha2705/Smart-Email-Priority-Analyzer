"use client";

import { PredictForm } from "@/components/predict-form";

export default function PredictPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Analyze Email Priority
          </h1>
          <p className="text-gray-600 mt-2">
            Enter an email subject and content to predict its priority level
          </p>
        </div>

        {/* Predict Form */}
        <PredictForm />
      </div>
    </main>
  );
}
