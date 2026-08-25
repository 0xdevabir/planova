// app/api/places/search/route.ts
// Geography-first destination search.
// Catalog is the source of truth. External APIs may enrich nearby POIs only —
// they must never drown out nearby catalog destinations with famous far cities.

import { NextRequest, NextResponse } from "next/server";
import {
  searchCatalog,
  nearestCatalog,
  toDestination,
  findById,
  CATALOG,
  type CatalogDestination,
} from "@/lib/data/destinations";
import type { Destination, TripVibe } from "@/lib/types";
import { haversineKm } from "@/lib/utils/geo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RawPlace {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  vibes?: TripVibe[];
  source: "catalog" | "osm" | "google";
  countryCode?: string;
}

const ADMIN_SUFFIX =
  /\b(division|district|province|region|state|city|metro|area|county|municipality)\b/gi;

function cleanQuery(query: string): string {
  return query.replace(ADMIN_SUFFIX, " ").replace(/\s+/g, " ").trim();
}

function resolveVibes(p: RawPlace): TripVibe[] | undefined {
  if (p.vibes && p.vibes.length > 0) return p.vibes;
  const byId = findById(p.placeId);
  if (byId?.vibes?.length) return byId.vibes;
  const byName = searchCatalog(p.name, 1)[0];
  if (byName && byName.name.toLowerCase() === p.name.toLowerCase()) {
    return byName.vibes;
  }
  return undefined;
}

function dedupe(places: RawPlace[]): RawPlace[] {
  const seen = new Set<string>();
  const result: RawPlace[] = [];
  for (const p of places) {
    const key =
      p.placeId ||
      `${p.name.toLowerCase()}|${p.latitude.toFixed(2)}|${p.longitude.toFixed(2)}`;
    if (seen.has(key)) continue;
    const nearDup = result.some(
      (r) =>
        r.name.toLowerCase() === p.name.toLowerCase() &&
        haversineKm(
          { latitude: r.latitude, longitude: r.longitude },
          { latitude: p.latitude, longitude: p.longitude },
        ) < 30,
    );
    if (nearDup) continue;
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
    vibes: resolveVibes(p),
  };
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
    vibes: c.vibes,
    source: "catalog",
    countryCode: c.countryCode,
  };
}

function inferOriginCity(latitude: number, longitude: number): CatalogDestination {
  return nearestCatalog(latitude, longitude, 1)[0] || CATALOG[0];
}

function scorePlace(
  p: RawPlace,
  origin: { latitude: number; longitude: number },
  originCountry: string,
): { p: RawPlace; km: number; score: number; tier: number } {
  const km = haversineKm(origin, {
    latitude: p.latitude,
    longitude: p.longitude,
  });

  let tier: number;
  if (p.countryCode === originCountry || km <= 450) tier = 0;
  else if (km <= 900) tier = 1;
  else if (km <= 1600) tier = 2;
  else tier = 3;

  const ratingScore = (p.rating ?? 4) * 2;
  const sourceBonus = p.source === "catalog" ? 12 : p.source === "google" ? 2 : 1;
  const sameCountryBonus = p.countryCode === originCountry ? 40 : 0;
  const distancePenalty = km / 10;
  const nearBonus = km <= 250 ? 30 : km <= 450 ? 18 : km <= 900 ? 8 : 0;

  const score = ratingScore + sourceBonus + sameCountryBonus + nearBonus - distancePenalty;
  return { p, km, score, tier };
}

async function fetchOsmNearby(
  latitude: number,
  longitude: number,
  limit: number,
): Promise<RawPlace[]> {
  try {
    const delta = 3.5;
    const url =
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}` +
      `&addressdetails=1&accept-language=en` +
      `&viewbox=${longitude - delta},${latitude + delta},${longitude + delta},${latitude - delta}` +
      `&bounded=1` +
      `&q=${encodeURIComponent("city")}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, limit).map((item: Record<string, unknown>) => {
      const addr = (item.address || {}) as Record<string, string>;
      const address =
        [addr.city || addr.town || addr.village || addr.state, addr.country]
          .filter(Boolean)
          .join(", ") || String(item.display_name || "");
      return {
        placeId: `osm_${item.place_id}`,
        name: String(item.name || String(item.display_name || "").split(",")[0] || "Place"),
        latitude: parseFloat(String(item.lat)),
        longitude: parseFloat(String(item.lon)),
        address,
        description: "Nearby destination",
        rating: 4.0,
        reviews: 0,
        source: "osm" as const,
        countryCode: addr.country_code?.toUpperCase(),
      };
    });
  } catch (err) {
    console.error("[places/search] OSM error:", err);
    return [];
  }
}

async function fetchGoogleNearby(
  latitude: number,
  longitude: number,
): Promise<RawPlace[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];
  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${latitude},${longitude}&radius=120000&type=tourist_attraction&key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    if (!Array.isArray(data.results)) return [];
    return data.results.slice(0, 8).map((item: Record<string, any>) => {
      const loc = item.geometry?.location;
      return {
        placeId: `google_${item.place_id}`,
        name: item.name as string,
        latitude: loc?.lat as number,
        longitude: loc?.lng as number,
        address: item.vicinity || item.formatted_address,
        description: (item.types || []).join(", "),
        rating: item.rating || 4.0,
        reviews: item.user_ratings_total || 0,
        source: "google" as const,
      };
    });
  } catch (err) {
    console.error("[places/search] Google error:", err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawQuery = (params.get("query") || "").trim();
  const query = cleanQuery(rawQuery);
  const latitude = parseFloat(params.get("latitude") || "");
  const longitude = parseFloat(params.get("longitude") || "");
  const limit = Math.min(20, Math.max(6, parseInt(params.get("limit") || "12", 10)));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "latitude and longitude are required" },
      { status: 400 },
    );
  }

  const origin = { latitude, longitude };
  const originCity = inferOriginCity(latitude, longitude);
  const originCountry = originCity.countryCode;

  const nearbyMatches = nearestCatalog(latitude, longitude, Math.max(limit * 2, 24));
  const textMatches = query ? searchCatalog(query, 8) : [];

  const seed: CatalogDestination[] = [];
  const seen = new Set<string>();
  for (const c of [...nearbyMatches, ...textMatches]) {
    if (seen.has(c.placeId)) continue;
    seen.add(c.placeId);
    seed.push(c);
  }

  // Catalog already covers densest regions — only enrich when local pool is thin
  const localCatalogCount = seed.filter((c) => {
    const km = haversineKm(origin, { latitude: c.latitude, longitude: c.longitude });
    return km <= 900;
  }).length;

  let osmPlaces: RawPlace[] = [];
  let googlePlaces: RawPlace[] = [];
  if (localCatalogCount < 6) {
    [osmPlaces, googlePlaces] = await Promise.all([
      fetchOsmNearby(latitude, longitude, 6),
      fetchGoogleNearby(latitude, longitude),
    ]);
    // Keep enrichment in-country / very near — drop random OSM villages
    osmPlaces = osmPlaces.filter((p) => {
      const km = haversineKm(origin, { latitude: p.latitude, longitude: p.longitude });
      return p.countryCode === originCountry || km <= 350;
    });
  }

  const combined: RawPlace[] = [
    ...seed.map(catalogToRaw),
    ...googlePlaces,
    ...osmPlaces,
  ];

  const ORIGIN_EXCLUDE_KM = 80;
  const filtered = combined.filter((p) => {
    if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) return false;
    const km = haversineKm(origin, {
      latitude: p.latitude,
      longitude: p.longitude,
    });
    if (km < ORIGIN_EXCLUDE_KM) return false;
    if (km > 20_000) return false;
    return true;
  });

  const deduped = dedupe(filtered);
  const scored = deduped
    .map((p) => scorePlace(p, origin, originCountry))
    .sort((a, b) => a.tier - b.tier || b.score - a.score || a.km - b.km);

  const localQuota = Math.min(limit, Math.max(6, Math.ceil(limit * 0.65)));
  const regionalQuota = Math.min(
    Math.max(0, limit - localQuota),
    Math.max(2, Math.ceil(limit * 0.2)),
  );
  const wideQuota = Math.max(0, limit - localQuota - regionalQuota);

  const picked: RawPlace[] = [];
  const pushFromTier = (tiers: number[], max: number) => {
    let added = 0;
    for (const row of scored) {
      if (picked.length >= limit || added >= max) break;
      if (!tiers.includes(row.tier)) continue;
      if (picked.some((x) => x.placeId === row.p.placeId)) continue;
      picked.push(row.p);
      added += 1;
    }
  };

  pushFromTier([0], localQuota);
  pushFromTier([1], regionalQuota);
  pushFromTier([2, 3], wideQuota);

  // Top up only with nearby/regional — never pad the list with famous far cities
  // when we already have a solid local set (the original Dhaka→India bug).
  const localPicked = picked.filter(
    (p) => scorePlace(p, origin, originCountry).tier === 0,
  ).length;
  if (picked.length < limit) {
    for (const row of scored) {
      if (picked.length >= limit) break;
      if (picked.some((x) => x.placeId === row.p.placeId)) continue;
      if (localPicked >= 6 && row.tier >= 2) continue;
      if (row.tier >= 3) continue;
      picked.push(row.p);
    }
  }

  if (picked.length === 0) {
    const fallback = nearestCatalog(latitude, longitude, limit + 3)
      .filter(
        (c) =>
          haversineKm(origin, { latitude: c.latitude, longitude: c.longitude }) >=
          ORIGIN_EXCLUDE_KM,
      )
      .slice(0, limit)
      .map(toDestination);
    return NextResponse.json({
      places: fallback,
      source: "catalog-fallback",
      meta: { strategy: "nearby-first-v2", originCountry },
    });
  }

  return NextResponse.json({
    places: picked.map(toResponse),
    source: "mixed",
    meta: {
      strategy: "nearby-first-v2",
      originCountry,
      originCity: originCity.name,
      query: query || null,
    },
  });
}
