// components/ResultsMap.tsx

"use client";

import dynamic from "next/dynamic";
import { DestinationResult } from "@/lib/types";

interface ResultsMapProps {
  destinations: DestinationResult[];
  currency?: string;
  highlightedId?: string | null;
  onOpen?: (destination: DestinationResult) => void;
  onHover?: (placeId: string | null) => void;
}

const DynamicMap = dynamic(() => import("./ResultsMapClient"), {
  loading: () => (
    <div className="w-full h-96 rounded-3xl overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-600">
      Loading map...
    </div>
  ),
  ssr: false,
});

export default function ResultsMap({
  destinations,
  currency,
  highlightedId,
  onOpen,
  onHover,
}: ResultsMapProps) {
  return (
    <DynamicMap
      destinations={destinations}
      currency={currency}
      highlightedId={highlightedId}
      onOpen={onOpen}
      onHover={onHover}
    />
  );
}
