"use client";

import { Suspense } from "react";
import RecommendationsContent from "./content";

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Finding your perfect destinations...</p>
        </div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
