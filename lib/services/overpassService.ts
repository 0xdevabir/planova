// lib/services/overpassService.ts
// Query OpenStreetMap Overpass for hotels, restaurants, and attractions.
// Aggressive caching + timeouts so high traffic never hangs the UI.

import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";
import { haversineKm } from "@/lib/utils/geo";
import type { OsmPoi, OsmPoiKind } from "@/lib/types";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const TIMEOUT_MS = 12_000;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface OverpassQueryInput {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function buildQuery(kind: OsmPoiKind, lat: number, lng: number, radius: number): string {
  const around = `(around:${radius},${lat},${lng})`;
  if (kind === "hotel") {
    return `
[out:json][timeout:10];
(
  node["tourism"="hotel"]${around};
  way["tourism"="hotel"]${around};
  node["tourism"="guest_house"]${around};
  node["tourism"="hostel"]${around};
  node["tourism"="motel"]${around};
);
out center 40;
`;
  }
  if (kind === "restaurant") {
    return `
[out:json][timeout:10];
(
  node["amenity"="restaurant"]${around};
  node["amenity"="cafe"]${around};
  node["amenity"="fast_food"]${around};
  way["amenity"="restaurant"]${around};
);
out center 50;
`;
  }
  return `
[out:json][timeout:10];
(
  node["tourism"="attraction"]${around};
  node["tourism"="museum"]${around};
  node["tourism"="viewpoint"]${around};
  node["historic"]${around};
  node["leisure"="park"]${around};
);
out center 40;
`;
}

function elementToPoi(
  el: OverpassElement,
  kind: OsmPoiKind,
  originLat: number,
  originLng: number,
): OsmPoi | null {
  const tags = el.tags || {};
  const name = tags.name || tags["name:en"];
  if (!name) return null;
  const latitude = el.lat ?? el.center?.lat;
  const longitude = el.lon ?? el.center?.lon;
  if (latitude == null || longitude == null) return null;

  const stars = tags.stars ? parseFloat(tags.stars) : undefined;
  const website = tags.website || tags["contact:website"] || tags.url;
  const phone = tags.phone || tags["contact:phone"];
  const cuisine = tags.cuisine?.replace(/;/g, ", ");
  const osmType = el.type === "way" || el.type === "relation" ? el.type : "node";

  return {
    id: `osm_${el.type}_${el.id}`,
    name,
    kind,
    latitude,
    longitude,
    distanceKm: Math.round(haversineKm(
      { latitude: originLat, longitude: originLng },
      { latitude, longitude },
    ) * 10) / 10,
    stars: Number.isFinite(stars) ? stars : undefined,
    rating: Number.isFinite(stars) ? Math.min(5, stars!) : undefined,
    cuisine,
    phone,
    website,
    osmUrl: `https://www.openstreetmap.org/${osmType}/${el.id}`,
    tags,
  };
}

async function fetchOverpass(query: string): Promise<OverpassElement[]> {
  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": "planova-app/1.0 (contact@planova.app)",
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timer);
      if (!res.ok) {
        lastError = new Error(`Overpass ${res.status}`);
        continue;
      }
      const data = await res.json();
      return Array.isArray(data?.elements) ? data.elements : [];
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
    }
  }
  console.error("[overpass] all endpoints failed:", lastError);
  return [];
}

async function queryPois(
  kind: OsmPoiKind,
  input: OverpassQueryInput,
): Promise<OsmPoi[]> {
  const radius = Math.min(Math.max(input.radiusMeters ?? 3500, 800), 12000);
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 40);
  const cacheKey = generateCacheKey(
    `overpass:${kind}:v1`,
    (Math.round(input.latitude * 1000) / 1000).toString(),
    (Math.round(input.longitude * 1000) / 1000).toString(),
    radius.toString(),
    limit.toString(),
  );
  const cached = getCached<OsmPoi[]>(cacheKey);
  if (cached) return cached;

  const elements = await fetchOverpass(
    buildQuery(kind, input.latitude, input.longitude, radius),
  );
  const pois = elements
    .map((el) => elementToPoi(el, kind, input.latitude, input.longitude))
    .filter((p): p is OsmPoi => Boolean(p))
    .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
    .slice(0, limit);

  setCached(cacheKey, pois, CACHE_TTL_MS);
  return pois;
}

export function fetchHotels(input: OverpassQueryInput): Promise<OsmPoi[]> {
  return queryPois("hotel", input);
}

export function fetchRestaurants(input: OverpassQueryInput): Promise<OsmPoi[]> {
  return queryPois("restaurant", input);
}

export function fetchAttractions(input: OverpassQueryInput): Promise<OsmPoi[]> {
  return queryPois("attraction", input);
}
