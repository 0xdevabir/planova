// lib/services/destinationService.ts
// Resolves nearby destinations by hitting the internal /api/places/search
// route, which itself fans out to Google Places (preferred) or OpenStreetMap
// (fallback). Cached to avoid hitting external providers on every keystroke.

import { Destination } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";
import { inferVibes } from "@/lib/data/vibes";

export async function getNearbyDestinations(
  latitude: number,
  longitude: number,
  radius: number = 25,
  limit: number = 10,
  query?: string,
): Promise<Destination[]> {
  const cacheKey = generateCacheKey(
    "destinations",
    latitude.toString(),
    longitude.toString(),
    radius.toString(),
    (query || "").toLowerCase(),
  );

  const cached = getCached<Destination[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/places/search?query=${encodeURIComponent(
      query || "tourist attractions",
    )}&latitude=${latitude}&longitude=${longitude}`;

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const seenIds = new Set<string>();
        const seenNames = new Set<string>();

        const destinations: Destination[] = data.places
          .filter((place: { placeId?: string; name?: string }) => {
            const id = place.placeId || "";
            const name = (place.name || "").toLowerCase();
            if (seenIds.has(id) || seenNames.has(name)) return false;
            seenIds.add(id);
            seenNames.add(name);
            return true;
          })
          .map((place: {
            placeId: string;
            name: string;
            latitude: number;
            longitude: number;
            address?: string;
            description?: string;
            rating?: number;
            reviews?: number;
          }) => ({
            placeId: place.placeId,
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.address,
            description: place.description || "Tourist destination",
            rating: place.rating || 4.0,
            reviews: place.reviews || 0,
            vibes: inferVibes(`${place.name || ""} ${place.description || ""}`),
          }));

        setCached(cacheKey, destinations, 24 * 60 * 60 * 1000);
        return destinations.slice(0, limit);
      }
    }

    const emptyResult: Destination[] = [];
    setCached(cacheKey, emptyResult, 24 * 60 * 60 * 1000);
    return emptyResult;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}