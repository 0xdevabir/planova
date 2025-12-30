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
  limit: number = 10,
  query?: string
): Promise<Destination[]> {
  const cacheKey = generateCacheKey(
    "destinations",
    latitude.toString(),
    longitude.toString(),
    radius.toString(),
    (query || "").toLowerCase()
  );

  const cached = getCached<Destination[]>(cacheKey);
  if (cached) return cached;

  try {
    // Try to fetch real places from Google Places API via our API route
    // First, try a query-based search (more specific)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/places/search?query=${encodeURIComponent(query || "tourist attractions")}&latitude=${latitude}&longitude=${longitude}`;
    console.log("Fetching destinations from:", url);
    
    let response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log("Received destinations response:", { placesCount: data.places?.length, error: data.error });
      
      if (data.places && data.places.length > 0) {
        // Deduplicate by placeId and name
        const seenIds = new Set<string>();
        const seenNames = new Set<string>();
        
        const destinations: Destination[] = data.places
          .filter((place: any) => {
            const id = place.placeId || "";
            const name = (place.name || "").toLowerCase();
            
            // Skip if we've already seen this placeId or name
            if (seenIds.has(id) || seenNames.has(name)) {
              return false;
            }
            
            seenIds.add(id);
            seenNames.add(name);
            return true;
          })
          .map((place: any) => ({
            placeId: place.placeId,
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.address,
            description: place.description || "Tourist destination",
            rating: place.rating || 4.0,
            reviews: place.reviews || 0,
          }));

        console.log("Deduped destinations:", destinations.length);
        
        // Cache for 24 hours
        setCached(cacheKey, destinations, 24 * 60 * 60 * 1000);
        return destinations.slice(0, limit);
      }
    } else {
      console.log("Destinations API response not ok:", response.status, response.statusText);
    }

    // If API returns no results but was successful, return empty array
    // Don't fall back to mock data - it's misleading
    console.log("No real destinations found from API for query:", query);
    const emptyResult: Destination[] = [];
    setCached(cacheKey, emptyResult, 24 * 60 * 60 * 1000);
    return emptyResult;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    // Only return mock data if there's an actual error, not if API returns nothing
    return [];
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
