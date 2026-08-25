// lib/services/destinationService.ts
// Resolves nearby destinations by hitting the internal /api/places/search route.
// The catalog there guarantees results — even if external providers fail, we
// still get well-described destinations back.
//
// Caching policy: we cache successful results for 24h, but never cache empty
// arrays — that was the root cause of "sometimes nothing" bugs.

import { Destination } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

export interface GetNearbyOptions {
  radius?: number;
  limit?: number;
  query?: string;
}

export async function getNearbyDestinations(
  latitude: number,
  longitude: number,
  radius: number = 25,
  limit: number = 18,
  query?: string,
): Promise<Destination[]> {
  void radius; // catalog/OSM results are global; radius is conceptual
  const cacheKey = generateCacheKey(
    "destinations:v4",
    (Math.round(latitude * 100) / 100).toString(),
    (Math.round(longitude * 100) / 100).toString(),
    (query || "").toLowerCase(),
    limit.toString(),
  );

  const cached = getCached<Destination[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/places/search?query=${encodeURIComponent(query || "")}&latitude=${latitude}&longitude=${longitude}&limit=${limit}`;
    const response = await fetch(url, { cache: "no-store" });

    if (response.ok) {
      const data = await response.json();
      const places: any[] = Array.isArray(data?.places) ? data.places : [];
      if (places.length > 0) {
        const destinations: Destination[] = places.map((place) => ({
          placeId: place.placeId,
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          description: place.description || "Popular destination",
          rating: place.rating || 4.3,
          reviews: place.reviews || 0,
          vibes: Array.isArray(place.vibes) ? place.vibes : undefined,
        }));
        setCached(cacheKey, destinations, 24 * 60 * 60 * 1000);
        return destinations;
      }
    }
    return [];
  } catch (error) {
    console.error("[getNearbyDestinations] error:", error);
    return [];
  }
}
