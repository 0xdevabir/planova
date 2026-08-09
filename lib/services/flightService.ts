// lib/services/flightService.ts
// Pure function-based flight cost estimator. Haversine distance × per-km rate
// (sourced from country tiers) + fixed airport fees + seasonality. No third-party
// API required to give travelers a defensible estimate.

import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";
import { haversineKm, estimateFlightDurationKm, clamp } from "@/lib/utils/geo";
import { resolveCountry, DEFAULT_PRICING } from "@/lib/data/countryTiers";
import type { FlightEstimate, TripVibe } from "@/lib/types";

export interface EstimateFlightInput {
  originName: string;
  originLat: number;
  originLng: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  destinationCountry?: string;
  travelers: number;
  /** Trip vibes can slightly nudge flight cost (luxury = business-class bias) */
  vibes?: TripVibe[];
  /** ISO date string for departure */
  startDate: string;
  /** ISO date string for return */
  endDate?: string;
}

const AVG_AIRPORT_FEES_USD = 95;
const ROUNDTRIP_MULTIPLIER = 1.85; // round-trip is ~85% more than one-way for the same distance

/**
 * Estimate the cost of a round-trip flight using geography and country tier data.
 * The result is cached for 6 hours keyed by route + travelers.
 */
export async function estimateFlight(input: EstimateFlightInput): Promise<FlightEstimate> {
  const cacheKey = generateCacheKey(
    "flight:v2",
    input.originName,
    input.destinationName,
    input.startDate,
    input.travelers.toString(),
    (input.vibes || []).sort().join(","),
  );
  const cached = getCached<FlightEstimate>(cacheKey);
  if (cached) return cached;

  const distanceKm = haversineKm(
    { latitude: input.originLat, longitude: input.originLng },
    { latitude: input.destinationLat, longitude: input.destinationLng },
  );

  const destinationPricing = resolveCountry(input.destinationCountry || input.destinationName) || DEFAULT_PRICING;

  // Long-haul premium above 6,000 km (e.g. transpacific) gets a small surcharge
  const longHaulSurcharge = distanceKm > 6000 ? 1.18 : 1;
  // Short-haul budget flights below 800 km are usually cheaper
  const shortHaulDiscount = distanceKm < 800 ? 0.85 : 1;

  const oneWayPerPerson = distanceKm * destinationPricing.flightPerKmUsd * longHaulSurcharge * shortHaulDiscount;
  // Optional small luxury multiplier (capped)
  const luxuryBias = (input.vibes || []).includes("luxury") ? 1.15 : 1;

  const baseRoundTripPerPerson = oneWayPerPerson * ROUNDTRIP_MULTIPLIER * luxuryBias;
  const mid = baseRoundTripPerPerson + AVG_AIRPORT_FEES_USD;
  const low = mid * 0.78;
  const high = mid * 1.35;

  const duration = estimateFlightDurationKm(distanceKm);

  const perPerson = Math.round(mid);
  const total = perPerson * Math.max(1, input.travelers);

  const stops: 0 | 1 | 2 =
    distanceKm < 1500 ? 0 : distanceKm < 5500 ? 1 : 2;

  const result: FlightEstimate = {
    origin: input.originName,
    destination: input.destinationName,
    distanceKm: Math.round(distanceKm),
    duration: duration.label,
    stops,
    low: Math.round(low),
    mid,
    high: Math.round(high),
    perPerson,
    total,
    currency: "USD",
  };

  setCached(cacheKey, result, 6 * 60 * 60 * 1000);
  return result;
}

/**
 * Estimate the cost of a flight given a destination placeId and a search origin.
 * Convenience wrapper for places that don't have parsed coordinates yet.
 */
export async function estimateFlightFromPlace(
  origin: { name: string; latitude: number; longitude: number },
  destination: { name: string; latitude: number; longitude: number; address?: string; vibes?: TripVibe[] },
  startDate: string,
  endDate: string | undefined,
  travelers: number,
): Promise<FlightEstimate> {
  return estimateFlight({
    originName: origin.name,
    originLat: origin.latitude,
    originLng: origin.longitude,
    destinationName: destination.name,
    destinationLat: destination.latitude,
    destinationLng: destination.longitude,
    destinationCountry: destination.address,
    travelers,
    vibes: destination.vibes,
    startDate,
    endDate,
  });
}

/**
 * @deprecated Kept for backwards compatibility. New code should use estimateFlight.
 */
export async function getFlightPrices(
  origin: string,
  destination: string,
  departureDate: Date,
  returnDate?: Date,
): Promise<FlightEstimate[]> {
  const estimate = await estimateFlight({
    originName: origin,
    originLat: 40.6413,
    originLng: -73.7781, // NYC default
    destinationName: destination,
    destinationLat: 0,
    destinationLng: 0,
    travelers: 1,
    startDate: departureDate.toISOString().split("T")[0],
    endDate: returnDate?.toISOString().split("T")[0],
  });
  return [estimate];
}

/**
 * Average flight cost for a list of estimates (kept for the legacy API).
 */
export function getAverageFlightCost(flights: FlightEstimate[], travelers: number): number {
  if (flights.length === 0) return 0;
  const avg = flights.reduce((sum, f) => sum + f.mid, 0) / flights.length;
  return avg * Math.max(1, travelers);
}

/**
 * Cheap seasonality heuristic: month 1-based.
 * Returns 0.85 - 1.25 multiplier. Skip caching; it's O(1).
 */
export function seasonalFactor(isoDate: string): number {
  const d = new Date(isoDate);
  const m = d.getMonth() + 1;
  // Northern-hemisphere shoulder season heuristic
  if (m === 6 || m === 7 || m === 8) return 1.2; // summer peak
  if (m === 12 || m === 1) return 1.15; // winter holidays
  if (m === 3 || m === 4 || m === 5 || m === 9 || m === 10) return 1.0;
  return 0.92; // shoulder
}

export { clamp };
