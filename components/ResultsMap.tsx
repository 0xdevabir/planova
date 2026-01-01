// components/ResultsMap.tsx

"use client";

import dynamic from "next/dynamic";
import { DestinationResult } from "@/lib/types";

interface ResultsMapProps {
  destinations: DestinationResult[];
}

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(
  () => import("./ResultsMapClient"),
  { 
    loading: () => (
      <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-600">
        Loading map...
      </div>
    ),
    ssr: false 
  }
);

export default function ResultsMap({ destinations }: ResultsMapProps) {
  return <DynamicMap destinations={destinations} />;
}
