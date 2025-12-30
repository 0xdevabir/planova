// lib/services/searchService.ts

import { SearchParams, SearchResponse, DestinationResult } from "@/lib/types";
import { getNearbyDestinations } from "./destinationService";
import { calculateDestinationCosts } from "./budgetCalculator";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

export async function searchDestinations(
  params: SearchParams
): Promise<SearchResponse> {
  const cacheKey = generateCacheKey(
    "search",
    params.destination,
    params.budgetMin.toString(),
    params.budgetMax.toString(),
    params.startDate.toISOString().split("T")[0]
  );

  const cached = getCached<SearchResponse>(cacheKey);
  if (cached) return cached;

  try {
    // Get nearby destinations
    const nearby = await getNearbyDestinations(
      params.latitude,
      params.longitude,
      params.radius,
      20,
      params.destination
    );

    // Calculate costs for each destination
    const resultsPromises = nearby.map(async (dest) => {
      const costs = await calculateDestinationCosts(dest, params);

      const result: DestinationResult = {
        ...dest,
        ...costs,
      };
      return result;
    });

    const allResults = await Promise.all(resultsPromises);

    // Filter by budget
    const filteredResults = allResults.filter(
      (r) => r.totalEstimatedCost <= params.budgetMax && r.totalEstimatedCost >= params.budgetMin
    );

    // Sort by value score (highest first)
    const sortedResults = filteredResults.sort(
      (a, b) => b.valueScore - a.valueScore
    );

    const response: SearchResponse = {
      query: params,
      results: sortedResults.slice(0, 10), // Top 10 results
      totalCount: sortedResults.length,
      timestamp: new Date(),
    };

    // Cache for 6 hours
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
