// app/api/places/autocomplete/route.ts
// Combines catalog hits (instant, reliable) with OSM suggestions (broader).
// Catalog first means typing "par" instantly surfaces "Paris" without waiting
// for an external round-trip.

import { NextRequest, NextResponse } from "next/server";
import { CATALOG, searchCatalog } from "@/lib/data/destinations";

interface Prediction {
  place_id: string;
  description: string;
  lat: string;
  lng: string;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const input = (params.get("input") || "").trim();

  if (!input || input.length < 1) {
    return NextResponse.json({ predictions: [] });
  }

  // 1) Catalog predictions — instant, deterministic.
  const catalogPredictions: Prediction[] = searchCatalog(input, 6).map((c) => ({
    place_id: c.placeId,
    description: `${c.name}, ${c.country}`,
    lat: c.latitude.toString(),
    lng: c.longitude.toString(),
  }));

  // 2) OSM predictions — broader but slower, rate-limited.
  let osmPredictions: Prediction[] = [];
  if (input.length >= 2) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&accept-language=en&q=${encodeURIComponent(input)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          osmPredictions = data
            .filter((p: any) => p.lat && p.lon)
            .map((p: any) => ({
              place_id: `osm_${p.place_id}`,
              description: p.display_name,
              lat: p.lat,
              lng: p.lon,
            }));
        }
      }
    } catch (err) {
      console.error("[autocomplete] OSM error:", err);
    }
  }

  // Merge — catalog first, then OSM hits we haven't already shown.
  const seen = new Set(catalogPredictions.map((p) => p.place_id));
  const merged = [...catalogPredictions];
  for (const p of osmPredictions) {
    if (seen.has(p.place_id)) continue;
    seen.add(p.place_id);
    merged.push(p);
    if (merged.length >= 8) break;
  }

  return NextResponse.json({ predictions: merged.slice(0, 8) });
}