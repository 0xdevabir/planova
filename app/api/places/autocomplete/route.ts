// app/api/places/autocomplete/route.ts
// Advanced location search: curated catalog + Nominatim place-type filtering.
// Returns structured predictions (name, context, type, coords) for a rich UI.

import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/data/destinations";

export type PlaceKind = "city" | "region" | "country" | "place";

export interface PlacePrediction {
  place_id: string;
  /** Short primary label, e.g. "Dhaka" */
  name: string;
  /** Secondary context, e.g. "Dhaka Division, Bangladesh" */
  context: string;
  /** Full display string for legacy callers */
  description: string;
  kind: PlaceKind;
  lat: string;
  lng: string;
  source: "catalog" | "osm";
}

const PLACE_TYPES = new Set([
  "city",
  "town",
  "village",
  "municipality",
  "borough",
  "suburb",
  "hamlet",
  "state",
  "province",
  "region",
  "county",
  "country",
  "administrative",
]);

function kindFromOsm(type: string, cls: string): PlaceKind {
  if (type === "country" || cls === "boundary" && type === "administrative") {
    // refined below with admin_level if needed
  }
  if (type === "country") return "country";
  if (["state", "province", "region", "county"].includes(type)) return "region";
  if (["city", "town", "municipality", "borough"].includes(type)) return "city";
  if (cls === "place" && PLACE_TYPES.has(type)) return "city";
  if (cls === "boundary") return "region";
  return "place";
}

function shortName(p: any): string {
  return (
    p.name ||
    p.address?.city ||
    p.address?.town ||
    p.address?.village ||
    p.address?.state ||
    p.address?.country ||
    (p.display_name || "").split(",")[0] ||
    "Place"
  );
}

function contextFromOsm(p: any): string {
  const a = p.address || {};
  const parts = [
    a.state || a.region || a.county,
    a.country,
  ].filter(Boolean);
  // Avoid duplicating the short name
  const name = shortName(p).toLowerCase();
  return parts.filter((x: string) => x.toLowerCase() !== name).join(", ");
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const input = (params.get("input") || "").trim();

  if (!input || input.length < 1) {
    return NextResponse.json({ predictions: [] as PlacePrediction[] });
  }

  const catalogPredictions: PlacePrediction[] = searchCatalog(input, 6).map((c) => ({
    place_id: c.placeId,
    name: c.name,
    context: `${c.region} · ${c.country}`,
    description: `${c.name}, ${c.country}`,
    kind: "city" as const,
    lat: c.latitude.toString(),
    lng: c.longitude.toString(),
    source: "catalog" as const,
  }));

  let osmPredictions: PlacePrediction[] = [];
  if (input.length >= 2) {
    try {
      // Prefer settlements / admin areas over POIs
      const url =
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&addressdetails=1` +
        `&accept-language=en&featureType=settlement` +
        `&q=${encodeURIComponent(input)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          osmPredictions = data
            .filter((p: any) => p.lat && p.lon)
            .filter((p: any) => {
              const t = (p.type || "").toLowerCase();
              const c = (p.class || "").toLowerCase();
              if (PLACE_TYPES.has(t)) return true;
              if (c === "place" || c === "boundary") return true;
              // Keep high-importance admin hits
              return typeof p.importance === "number" && p.importance >= 0.4;
            })
            .map((p: any) => {
              const name = shortName(p);
              const context = contextFromOsm(p);
              return {
                place_id: `osm_${p.place_id}`,
                name,
                context,
                description: context ? `${name}, ${context}` : name,
                kind: kindFromOsm((p.type || "").toLowerCase(), (p.class || "").toLowerCase()),
                lat: String(p.lat),
                lng: String(p.lon),
                source: "osm" as const,
              };
            });
        }
      }
    } catch (err) {
      console.error("[autocomplete] OSM error:", err);
    }
  }

  // Merge: catalog first, then OSM; dedupe by normalized name+approx coords
  const seen = new Set<string>();
  const merged: PlacePrediction[] = [];
  const keyOf = (p: PlacePrediction) =>
    `${p.name.toLowerCase()}|${Number(p.lat).toFixed(1)}|${Number(p.lng).toFixed(1)}`;

  for (const p of [...catalogPredictions, ...osmPredictions]) {
    const k = keyOf(p);
    if (seen.has(k) || seen.has(p.place_id)) continue;
    seen.add(k);
    seen.add(p.place_id);
    merged.push(p);
    if (merged.length >= 10) break;
  }

  return NextResponse.json({ predictions: merged });
}
