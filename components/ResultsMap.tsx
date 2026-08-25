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

function MapSkeleton() {
  return (
    <div
      className="w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 relative"
      aria-busy="true"
      aria-label="Loading map"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 via-stone-50 to-teal-50/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm font-medium text-stone-500">Loading map…</p>
      </div>
    </div>
  );
}

const DynamicMap = dynamic(() => import("./ResultsMapClient"), {
  loading: () => <MapSkeleton />,
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
