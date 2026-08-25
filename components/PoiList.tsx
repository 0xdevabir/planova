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
            className="h-20 rounded-xl bg-stone-100 border border-stone-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((poi) => (
        <li
          key={poi.id}
          className="rounded-xl border border-stone-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="min-w-0 space-y-1">
            <div className="font-medium text-stone-900 truncate">{poi.name}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
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
            className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            {poi.website ? "Visit site" : "View on map"}
          </a>
        </li>
      ))}
    </ul>
  );
}
