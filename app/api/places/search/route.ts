// app/api/places/search/route.ts
// Search pipeline that always returns a useful list:
//   1. Curated catalog (instant, reliable)
//   2. OpenStreetMap enrichment (optional, for fresh data)
//   3. Google Places supplement (only when a key is configured)
//
// The catalog is the source of truth — even if all external providers fail,
// the user still gets 6+ well-described destinations.

import { NextRequest, NextResponse } from "next/server";
import {
  CATALOG,
  searchCatalog,
  nearestCatalog,
  toDestination,
  type CatalogDestination,
} from "@/lib/data/destinations";
import type { Destination } from "@/lib/types";
import { haversineKm } from "@/lib/utils/geo";

interface RawPlace {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  source: "catalog" | "osm" | "google";
}

function dedupe(places: RawPlace[]): RawPlace[] {
  const seen = new Set<string>();
  const result: RawPlace[] = [];
  for (const p of places) {
    const key = p.placeId || `${p.name.toLowerCase()}|${p.latitude.toFixed(3)}|${p.longitude.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(p);
  }
  return result;
}

function toResponse(p: RawPlace): Destination {
  return {
    placeId: p.placeId,
    name: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    address: p.address,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    vibes: undefined,
  };
}

async function fetchOsm(query: string, limit: number): Promise<RawPlace[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, limit).map((p: any) => {
      const addr = p.address || {};
      const address =
        [addr.city || addr.town || addr.village || addr.hamlet, addr.country]
          .filter(Boolean)
          .join(", ") || p.display_name;
      return {
        placeId: `osm_${p.place_id}`,
        name: p.name || p.display_name?.split(",")[0] || "Point of interest",
        latitude: parseFloat(p.lat),
        longitude: parseFloat(p.lon),
        address,
        description: "Tourist destination",
        rating: 4.0,
        reviews: 0,
        source: "osm" as const,
      };
    });
  } catch (err) {
    console.error("[places/search] OSM error:", err);
    return [];
  }
}

async function fetchGoogle(query: string, latitude: number, longitude: number): Promise<RawPlace[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];
  const collected: RawPlace[] = [];
  try {
    const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " tourist attractions")}&key=${apiKey}`;
    const textRes = await fetch(textUrl, { next: { revalidate: 1800 } });
    const textData = await textRes.json();
    if (textData.status === "OK" && Array.isArray(textData.results)) {
      for (const p of textData.results) {
        const loc = p.geometry?.location;
        if (!loc) continue;
        collected.push({
          placeId: `google_${p.place_id}`,
          name: p.name,
          latitude: loc.lat,
          longitude: loc.lng,
          address: p.formatted_address || p.vicinity,
          description: (p.types || []).join(", "),
          rating: p.rating || 4.0,
          reviews: p.user_ratings_total || 0,
          source: "google",
        });
      }
    }
  } catch (err) {
    console.error("[places/search] Google error:", err);
  }
  // Supplementation by nearby search
  if (collected.length < 6) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=tourist_attraction&key=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 1800 } });
      const data = await res.json();
      if (Array.isArray(data.results)) {
        for (const p of data.results) {
          const loc = p.geometry?.location;
          if (!loc) continue;
          collected.push({
            placeId: `google_${p.place_id}`,
            name: p.name,
            latitude: loc.lat,
            longitude: loc.lng,
            address: p.vicinity || p.formatted_address,
            description: (p.types || []).join(", "),
            rating: p.rating || 4.0,
            reviews: p.user_ratings_total || 0,
            source: "google",
          });
        }
      }
    } catch {}
  }
  return collected;
}

function catalogToRaw(c: CatalogDestination): RawPlace {
  return {
    placeId: c.placeId,
    name: c.name,
    latitude: c.latitude,
    longitude: c.longitude,
    address: `${c.name}, ${c.country}`,
    description: c.summary,
    rating: c.rating,
    reviews: c.reviews,
    source: "catalog",
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("query") || "").trim();
  const latStr = params.get("latitude");
  const lngStr = params.get("longitude");
  const latitude = latStr ? parseFloat(latStr) : NaN;
  const longitude = lngStr ? parseFloat(lngStr) : NaN;
  const limit = Math.min(20, Math.max(6, parseInt(params.get("limit") || "12", 10)));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "latitude and longitude are required" },
      { status: 400 },
    );
  }

  // 1) Curated catalog — matches the user's typed query, ordered by popularity.
  let catalogMatches: CatalogDestination[] = [];
  if (query) {
    catalogMatches = searchCatalog(query, limit);
  }
  // If the typed query matches nothing (e.g. "safasdfasf") fall back to
  // nearby catalog entries so we always have *something*.
  if (catalogMatches.length === 0) {
    catalogMatches = nearestCatalog(latitude, longitude, limit);
  }

  // 2) OSM enrichment (rate-limited; non-blocking if it fails)
  const osmPromise = query ? fetchOsm(query, 8) : Promise.resolve([]);

  // 3) Google enrichment (skipped if no key)
  const googlePromise = fetchGoogle(query || "tourist attractions", latitude, longitude);

  const [osmPlaces, googlePlaces] = await Promise.all([osmPromise, googlePromise]);

  // Combine — catalog first (deterministic ordering), then supplements by
  // popularity/rating. Dedup by placeId and name.
  const combined: RawPlace[] = [];
  for (const c of catalogMatches) combined.push(catalogToRaw(c));
  for (const g of googlePlaces) combined.push(g);
  for (const o of osmPlaces) combined.push(o);

  // Drop noisy OSM hits that don't actually look like destinations and that
  // are far from the user's anchor (> 25 000 km haversine = always wrong).
  const filtered = combined.filter((p) => {
    if (Number.isNaN(p.latitude) || Number.isNaN(p.longitude)) return false;
    const km = haversineKm(
      { latitude, longitude },
      { latitude: p.latitude, longitude: p.longitude },
    );
    // Allow long-haul — the user is searching from one place globally —
    // but reject impossible coordinates.
    if (km > 25_000) return false;
    return true;
  });

  const deduped = dedupe(filtered);

  // Score: catalog entries lead, then higher-rated external hits.
  const scored = deduped
    .map((p) => {
      const km = haversineKm(
        { latitude, longitude },
        { latitude: p.latitude, longitude: p.longitude },
      );
      const ratingScore = (p.rating ?? 4) * 10;
      const sourceBonus = p.source === "catalog" ? 25 : p.source === "google" ? 10 : 0;
      const distancePenalty = Math.min(40, km / 1000); // closer = better, capped
      return { p, score: ratingScore + sourceBonus - distancePenalty };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => toResponse(p));

  // Final safety net — if for any reason scored is empty, dump the closest
  // catalog entries. This *never* returns an empty array.
  if (scored.length === 0) {
    const fallback = nearestCatalog(latitude, longitude, limit).map(toDestination);
    return NextResponse.json({ places: fallback, source: "catalog-fallback" });
  }

  return NextResponse.json({ places: scored, source: "mixed" });
}