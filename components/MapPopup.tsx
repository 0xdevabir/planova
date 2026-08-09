// components/MapPopup.tsx
"use client";

import type { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { formatCurrency } from "@/lib/utils/money";

interface MapPopupProps {
  destination: DestinationResult;
  currency: string;
}

export function MapPopup({ destination, currency }: MapPopupProps) {
  const vibe = destination.vibes?.[0] ? VIBE_BY_ID[destination.vibes[0]] : null;
  const gradient = vibe?.gradient ?? "from-cyan-500 to-blue-500";
  return (
    <div className="min-w-[220px] max-w-[260px] space-y-2 font-sans">
      <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 text-white`}>
        <div className="text-xl" aria-hidden>{vibe?.emoji ?? "📍"}</div>
        <div className="font-bold text-base leading-tight">{destination.name}</div>
        <div className="text-xs text-white/80 truncate">{destination.address}</div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Value</span>
        <span className="font-bold gradient-text">{Math.round(destination.valueScore)}/100</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Total</span>
        <span className="font-medium text-slate-900">{formatCurrency(destination.totalEstimatedCost, currency)}</span>
      </div>
      {destination.weather && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Weather</span>
          <span className="flex items-center gap-1">
            <span aria-hidden>{destination.weather.emoji || "☁️"}</span>
            <span className="font-medium text-slate-700">{destination.weather.temperature}°C</span>
          </span>
        </div>
      )}
      <a
        href={`https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=12/${destination.latitude}/${destination.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs font-semibold bg-cyan-600 text-white rounded-full px-3 py-1.5 hover:bg-cyan-700"
      >
        Open in OSM
      </a>
    </div>
  );
}

export default MapPopup;