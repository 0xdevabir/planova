"use client";

import type { OsmPoi } from "@/lib/types";

interface PoiListProps {
  items: OsmPoi[];
  loading?: boolean;
  emptyMessage: string;
  kindLabel: string;
}

function affiliateUrl(poi: OsmPoi): string {
  // Commission-ready outbound: prefer official site, else OSM.
  // Future: swap website for affiliate deep-link when partners are live.
  if (poi.website) {
    try {
      const u = new URL(poi.website.startsWith("http") ? poi.website : `https://${poi.website}`);
      u.searchParams.set("utm_source", "planova");
      u.searchParams.set("utm_medium", "referral");
      u.searchParams.set("utm_campaign", poi.kind);
      return u.toString();
    } catch {
      return poi.website;
    }
  }
  return poi.osmUrl;
}

export default function PoiList({ items, loading, emptyMessage, kindLabel }: PoiListProps) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label={`Loading ${kindLabel}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-white/5 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((poi) => (
        <li
          key={poi.id}
          className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="min-w-0 space-y-1">
            <div className="font-medium text-white truncate">{poi.name}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              {typeof poi.distanceKm === "number" && <span>{poi.distanceKm} km away</span>}
              {typeof poi.stars === "number" && <span>{poi.stars}★</span>}
              {typeof poi.rating === "number" && !poi.stars && (
                <span>{poi.rating.toFixed(1)} rating</span>
              )}
              {poi.cuisine && <span className="capitalize">{poi.cuisine}</span>}
            </div>
          </div>
          <a
            href={affiliateUrl(poi)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-400/25 hover:bg-cyan-500/25 transition-colors"
          >
            {poi.website ? "Visit site" : "View on map"}
          </a>
        </li>
      ))}
    </ul>
  );
}
