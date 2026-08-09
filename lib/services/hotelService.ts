// lib/services/hotelService.ts
// Hotel cost estimator. Uses country-tier nightly base + vibe multiplier. Returns
// a tiered sample of hotel options so the UI can render something realistic.

import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";
import { resolveCountry, DEFAULT_PRICING } from "@/lib/data/countryTiers";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import type { HotelEstimate, TripVibe } from "@/lib/types";

export interface EstimateHotelInput {
  destinationName: string;
  destinationCountry?: string;
  nights: number;
  travelers: number;
  vibes?: TripVibe[];
}

const VIBE_TIER_PREMIA: Record<"Budget" | "Comfort" | "Premium", number> = {
  Budget: 0.55,
  Comfort: 1.0,
  Premium: 1.75,
};

/**
 * Estimate hotel costs and sample three tiers of accommodations for a destination.
 * The result is cached for 24 hours.
 */
export async function estimateHotel(input: EstimateHotelInput): Promise<HotelEstimate> {
  const cacheKey = generateCacheKey(
    "hotel:v2",
    input.destinationName,
    input.destinationCountry || "",
    input.nights.toString(),
    (input.vibes || []).sort().join(","),
  );
  const cached = getCached<HotelEstimate>(cacheKey);
  if (cached) return cached;

  const pricing = resolveCountry(input.destinationCountry || input.destinationName) || DEFAULT_PRICING;

  const vibeCostMultiplier = (input.vibes || []).reduce((acc, v) => {
    const cfg = VIBE_BY_ID[v];
    return acc * (cfg?.costWeight ?? 1);
  }, 1);
  // Damp the multiplier so a luxury vibe doesn't triple the cost
  const ctx = Math.pow(vibeCostMultiplier, 0.6);

  const nightlyBase = pricing.hotelBaseUsd;
  const nightlyAverage = Math.round(nightlyBase * ctx);
  const total = nightlyAverage * Math.max(1, input.nights);

  const sampleHotels = (["Budget", "Comfort", "Premium"] as const).map((tier) => {
    const premium = VIBE_TIER_PREMIA[tier];
    const pricePerNight = Math.round(nightlyBase * ctx * premium);
    const rating = tier === "Budget" ? 3.8 : tier === "Comfort" ? 4.3 : 4.7;
    const amenities =
      tier === "Budget"
        ? ["Free Wi-Fi", "Air conditioning"]
        : tier === "Comfort"
        ? ["Free Wi-Fi", "Breakfast", "Gym", "Air conditioning"]
        : ["Free Wi-Fi", "Breakfast", "Gym", "Spa", "Concierge", "Pool"];
    return {
      name: `${tier === "Budget" ? "Smart" : tier === "Comfort" ? "Boutique" : "Grand"} ${input.destinationName} ${
        tier === "Budget" ? "Stay" : tier === "Comfort" ? "Hotel" : "Resort"
      }`,
      rating,
      pricePerNight,
      amenities,
      tier,
    };
  });

  const result: HotelEstimate = {
    country: pricing.name,
    nights: input.nights,
    nightlyBase,
    nightlyAverage,
    total,
    currency: "USD",
    tier: pricing.tier,
    sampleHotels,
  };

  setCached(cacheKey, result, 24 * 60 * 60 * 1000);
  return result;
}

/**
 * @deprecated Kept for backwards compatibility. New code should use estimateHotel.
 */
export async function getHotelPrices(
  destination: string,
  checkIn: Date,
  checkOut: Date,
  travelers: number,
): Promise<HotelEstimate[]> {
  const nights = Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const estimate = await estimateHotel({
    destinationName: destination,
    nights,
    travelers,
  });
  return [estimate];
}

/**
 * Average hotel cost for legacy callers.
 */
export function getAverageHotelCost(hotels: HotelEstimate[]): number {
  if (hotels.length === 0) return 0;
  return hotels.reduce((sum, h) => sum + h.total, 0) / hotels.length;
}