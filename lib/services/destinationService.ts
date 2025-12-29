// lib/services/destinationService.ts

import { Destination } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

const mockDestinations: Record<string, Destination[]> = {
  default: [
    {
      placeId: "paris",
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      address: "Paris, France",
      description: "City of Light - iconic landmarks and museums",
      rating: 4.7,
      reviews: 45000,
    },
    {
      placeId: "tokyo",
      name: "Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
      address: "Tokyo, Japan",
      description: "Modern metropolis with ancient temples",
      rating: 4.6,
      reviews: 38000,
    },
    {
      placeId: "bangkok",
      name: "Bangkok",
      latitude: 13.7563,
      longitude: 100.5018,
      address: "Bangkok, Thailand",
      description: "Vibrant street food and temples",
      rating: 4.5,
      reviews: 35000,
    },
    {
      placeId: "barcelona",
      name: "Barcelona",
      latitude: 41.3851,
      longitude: 2.1734,
      address: "Barcelona, Spain",
      description: "Gaudí architecture and Mediterranean beaches",
      rating: 4.6,
      reviews: 42000,
    },
    {
      placeId: "london",
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      address: "London, UK",
      description: "Historic landmarks and vibrant culture",
      rating: 4.5,
      reviews: 50000,
    },
  ],
};

export async function getNearbyDestinations(
  latitude: number,
  longitude: number,
  radius: number = 25,
  limit: number = 10
): Promise<Destination[]> {
  const cacheKey = generateCacheKey(
    "destinations",
    latitude.toString(),
    longitude.toString(),
    radius.toString()
  );

  const cached = getCached<Destination[]>(cacheKey);
  if (cached) return cached;

  try {
    // Real implementation would use Google Places API
    // For MVP: return mock destinations filtered by distance
    const allDestinations = mockDestinations.default;

    // Simple distance calculation (Haversine formula)
    const destinations = allDestinations
      .map((dest) => ({
        ...dest,
        distance: getDistance(latitude, longitude, dest.latitude, dest.longitude),
      }))
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(({ distance, ...dest }) => dest); // Remove distance field

    // If no nearby destinations, return defaults
    const results = destinations.length > 0 ? destinations : allDestinations.slice(0, limit);

    // Cache for 24 hours
    setCached(cacheKey, results, 24 * 60 * 60 * 1000);
    return results;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return mockDestinations.default;
  }
}

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
