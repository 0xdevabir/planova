// lib/services/searchService.ts
// Top-level orchestrator. Resolves nearby destinations, annotates each one
// with budget + weather + availability signals, applies user-selected vibes
// as a ranking boost, and caches the full response.

import { SearchParams, SearchResponse, DestinationResult } from "@/lib/types";
import { getNearbyDestinations } from "./destinationService";
import { computeBudget } from "./budgetCalculator";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

const ORIGIN_NAME = "New York";
const ORIGIN_COORDS = { latitude: 40.6413, longitude: -73.7781 };

export async function searchDestinations(params: SearchParams): Promise<SearchResponse> {
  const cacheKey = generateCacheKey(
    "search:v2",
    params.destination,
    params.budgetMin.toString(),
    params.budgetMax.toString(),
    params.startDate.toISOString().split("T")[0],
    params.endDate.toISOString().split("T")[0],
    params.travelers.toString(),
    (params.vibes || []).sort().join(","),
  );

  const cached = getCached<SearchResponse>(cacheKey);
  if (cached) return cached;

  try {
    const nearby = await getNearbyDestinations(
      params.latitude,
      params.longitude,
      params.radius,
      20,
      params.destination,
    );

    if (nearby.length === 0) {
      return {
        query: params,
        results: [],
        totalCount: 0,
        timestamp: new Date(),
      };
    }

    // Annotate each destination with budget + value score in parallel
    const annotated = await Promise.all(
      nearby.map(async (dest) => {
        const budget = await computeBudget({
          destination: dest,
          origin: { name: ORIGIN_NAME, latitude: ORIGIN_COORDS.latitude, longitude: ORIGIN_COORDS.longitude },
          startDate: params.startDate,
          endDate: params.endDate,
          travelers: params.travelers,
          budgetMin: params.budgetMin,
          budgetMax: params.budgetMax,
          vibes: params.vibes,
        });

        // Apply a vibe match bonus to valueScore
        let vibeBonus = 0;
        if (params.vibes && params.vibes.length > 0) {
          const matched = (dest.vibes || []).filter((v) => params.vibes!.includes(v));
          if (matched.length > 0) {
            vibeBonus = matched.reduce((acc, v) => acc * (VIBE_BY_ID[v]?.ratingWeight ?? 1), 1.0) * 8;
          }
        }

        const finalScore = Math.min(100, budget.valueScore + vibeBonus);
        const result: DestinationResult = {
          ...dest,
          estimatedFlightCost: budget.flights,
          estimatedHotelCost: budget.accommodation,
          estimatedDailyCost: budget.food + budget.local + budget.activities,
          totalEstimatedCost: budget.total,
          flightAvailability: budget.total > params.budgetMax ? "Unavailable" : budget.total > params.budgetMax * 0.9 ? "Limited" : "Available",
          hotelAvailability: budget.total > params.budgetMax ? "Unavailable" : budget.total > params.budgetMax * 0.85 ? "Limited" : "Available",
          valueScore: finalScore,
          durationDays: Math.max(1, Math.round((params.endDate.getTime() - params.startDate.getTime()) / (1000 * 60 * 60 * 24))),
          costBreakdown: {
            flights: budget.flights,
            accommodation: budget.accommodation,
            food: budget.food,
            activities: budget.activities + budget.local,
          },
        };
        return result;
      }),
    );

    // Filter by budget range
    const filteredResults = annotated.filter(
      (r) => r.totalEstimatedCost <= params.budgetMax && r.totalEstimatedCost >= params.budgetMin * 0.5,
    );

    // Sort by value score, descending
    const sortedResults = filteredResults.sort((a, b) => b.valueScore - a.valueScore);

    const response: SearchResponse = {
      query: params,
      results: sortedResults.slice(0, 12),
      totalCount: sortedResults.length,
      timestamp: new Date(),
    };

    setCached(cacheKey, response, 6 * 60 * 60 * 1000);
    return response;
  } catch (error) {
    console.error("Error searching destinations:", error);
    return {
      query: params,
      results: [],
      totalCount: 0,
      timestamp: new Date(),
    };
  }
}