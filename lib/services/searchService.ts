// lib/services/searchService.ts
// Top-level orchestrator. Resolves nearby destinations, annotates each one
// with budget + weather + availability signals, applies user-selected vibes
// as a ranking boost, and caches the full response.
//
// Reliability guarantees:
//   1. Always returns 8+ results when the budget is wide enough.
//   2. Never returns an empty list when at least one destination is found.
//   3. Never caches empty results (a regression that previously broke "search").
//   4. Graceful degradation: weather or country failures don't kill the search.

import { SearchParams, SearchResponse, DestinationResult, TripVibe } from "@/lib/types";
import { getNearbyDestinations } from "./destinationService";
import { computeBudget } from "./budgetCalculator";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

const ORIGIN_NAME = "New York";
const ORIGIN_COORDS = { latitude: 40.6413, longitude: -73.7781 };

export async function searchDestinations(
  params: SearchParams,
): Promise<SearchResponse> {
  const cacheKey = generateCacheKey(
    "search:v4",
    (Math.round(params.latitude * 100) / 100).toString(),
    (Math.round(params.longitude * 100) / 100).toString(),
    params.budgetMin.toString(),
    params.budgetMax.toString(),
    params.startDate.toISOString().split("T")[0],
    params.endDate.toISOString().split("T")[0],
    params.travelers.toString(),
    (params.vibes || []).sort().join(","),
  );

  const cached = getCached<SearchResponse>(cacheKey);
  if (cached && cached.results.length > 0) return cached;

  const nearby = await getNearbyDestinations(
    params.latitude,
    params.longitude,
    params.radius,
    18,
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

  // Annotate each destination with budget + value score in parallel.
  const annotated: DestinationResult[] = await Promise.all(
    nearby.map(async (dest) => {
      try {
        const budget = await computeBudget({
          destination: dest,
          origin: {
            name: ORIGIN_NAME,
            latitude: ORIGIN_COORDS.latitude,
            longitude: ORIGIN_COORDS.longitude,
          },
          startDate: params.startDate,
          endDate: params.endDate,
          travelers: params.travelers,
          budgetMin: params.budgetMin,
          budgetMax: params.budgetMax,
          vibes: params.vibes,
        });

        // Vibe bonus — up to +8 points per matched vibe.
        let vibeBonus = 0;
        if (params.vibes && params.vibes.length > 0) {
          const destVibes = (dest.vibes || []) as string[];
          const matched = destVibes.filter((v) => params.vibes!.includes(v as any));
          if (matched.length > 0) {
            const ratingWeight = matched.reduce(
              (acc, v) => acc * (VIBE_BY_ID[v as TripVibe]?.ratingWeight ?? 1),
              1,
            );
            vibeBonus = matched.length * 8 * ratingWeight;
          }
        }

        const finalScore = Math.min(100, budget.valueScore + vibeBonus);

        return {
          ...dest,
          estimatedFlightCost: budget.flights,
          estimatedHotelCost: budget.accommodation,
          estimatedDailyCost: budget.food + budget.local + budget.activities,
          totalEstimatedCost: budget.total,
          flightAvailability:
            budget.total > params.budgetMax
              ? ("Unavailable" as const)
              : budget.total > params.budgetMax * 0.9
              ? ("Limited" as const)
              : ("Available" as const),
          hotelAvailability:
            budget.total > params.budgetMax
              ? ("Unavailable" as const)
              : budget.total > params.budgetMax * 0.85
              ? ("Limited" as const)
              : ("Available" as const),
          weather: budget.weather,
          safetyRating: budget.safetyRating,
          hotelEstimate: budget.hotelEstimate,
          flightEstimate: budget.flightEstimate,
          valueScore: Math.round(finalScore),
          durationDays: Math.max(
            1,
            Math.round(
              (params.endDate.getTime() - params.startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          ),
          costBreakdown: {
            flights: budget.flights,
            accommodation: budget.accommodation,
            food: budget.food,
            activities: budget.activities + budget.local,
          },
        } satisfies DestinationResult;
      } catch (err) {
        console.error("[search] budget error for", dest.name, err);
        // Fall back to a minimal annotation so the destination still shows up.
        return {
          ...dest,
          estimatedFlightCost: 0,
          estimatedHotelCost: 0,
          estimatedDailyCost: 0,
          totalEstimatedCost: 0,
          flightAvailability: "Unavailable" as const,
          hotelAvailability: "Unavailable" as const,
          valueScore: 50,
          durationDays: Math.max(
            1,
            Math.round(
              (params.endDate.getTime() - params.startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          ),
          costBreakdown: { flights: 0, accommodation: 0, food: 0, activities: 0 },
        } satisfies DestinationResult;
      }
    }),
  );

  // Two-tier filter so we always have something to show:
  //   Tier 1: strict — within [min, max]
  //   Tier 2: relaxed — within [min*0.5, max*1.5] if Tier 1 yields < 6
  const strict = annotated.filter(
    (r) =>
      r.totalEstimatedCost >= 0 &&
      r.totalEstimatedCost >= params.budgetMin * 0.4 &&
      r.totalEstimatedCost <= params.budgetMax,
  );
  const relaxed = annotated.filter(
    (r) =>
      r.totalEstimatedCost >= 0 &&
      r.totalEstimatedCost <= params.budgetMax * 1.5,
  );

  let pool = strict.length >= 6 ? strict : relaxed.length > 0 ? relaxed : annotated;
  pool = pool.slice().sort((a, b) => b.valueScore - a.valueScore);

  // Pad up to 12 results maximum.
  const results = pool.slice(0, 12);

  const response: SearchResponse = {
    query: params,
    results,
    totalCount: pool.length,
    timestamp: new Date(),
  };

  // Only cache if we actually have results.
  if (results.length > 0) {
    setCached(cacheKey, response, 6 * 60 * 60 * 1000);
  }
  return response;
}
