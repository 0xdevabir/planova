// lib/utils/filters.ts
// Pure helpers used by FilterSidebar to sort and filter DestinationResult lists.

import type { DestinationResult, SortKey, TripVibe } from "@/lib/types";
import { dayCount } from "./dates";

export function applyFilters(
  results: DestinationResult[],
  filters: {
    vibes: TripVibe[];
    minRating: number;
    hasFlights: boolean;
    hasHotels: boolean;
    priceMin: number;
    priceMax: number;
  },
): DestinationResult[] {
  return results.filter((r) => {
    if (filters.minRating > 0 && (r.rating ?? 0) < filters.minRating) return false;
    if (filters.hasFlights && r.flightAvailability === "Unavailable") return false;
    if (filters.hasHotels && r.hotelAvailability === "Unavailable") return false;
    if (r.totalEstimatedCost < filters.priceMin) return false;
    if (r.totalEstimatedCost > filters.priceMax) return false;
    if (filters.vibes.length > 0) {
      const rv = r.vibes || [];
      if (!filters.vibes.some((v) => rv.includes(v))) return false;
    }
    return true;
  });
}

export function sortResults(results: DestinationResult[], sort: SortKey): DestinationResult[] {
  const copy = [...results];
  switch (sort) {
    case "value":
      return copy.sort((a, b) => b.valueScore - a.valueScore);
    case "price":
      return copy.sort((a, b) => a.totalEstimatedCost - b.totalEstimatedCost);
    case "rating":
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "duration":
      return copy.sort((a, b) => b.durationDays - a.durationDays);
    default:
      return copy;
  }
}

export function priceBounds(results: DestinationResult[]): { min: number; max: number } {
  if (results.length === 0) return { min: 0, max: 10000 };
  let min = Infinity;
  let max = 0;
  for (const r of results) {
    if (r.totalEstimatedCost < min) min = r.totalEstimatedCost;
    if (r.totalEstimatedCost > max) max = r.totalEstimatedCost;
  }
  return { min: Math.floor(min / 100) * 100, max: Math.ceil(max / 100) * 100 };
}

// Helper kept here so other files can import durationDays consistently
export { dayCount };