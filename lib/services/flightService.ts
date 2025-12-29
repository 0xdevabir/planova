// lib/services/flightService.ts

import { FlightPrice } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

// Mock flight data for MVP - replace with real API calls
const mockFlightPrices: Record<string, number> = {
  "New York-Paris": 600,
  "New York-Tokyo": 800,
  "New York-Bangkok": 550,
  "New York-Barcelona": 450,
  "Los Angeles-London": 500,
  "Los Angeles-Sydney": 850,
};

export async function getFlightPrices(
  origin: string,
  destination: string,
  departureDate: Date,
  returnDate?: Date
): Promise<FlightPrice[]> {
  const cacheKey = generateCacheKey(
    "flights",
    origin,
    destination,
    departureDate.toISOString()
  );

  const cached = getCached<FlightPrice[]>(cacheKey);
  if (cached) return cached;

  try {
    // Real API would call Amadeus, Skyscanner, or Kiwi
    // For MVP: return mock data
    const key = `${origin}-${destination}`;
    const basePrice = mockFlightPrices[key] || Math.random() * 500 + 300;

    const flights: FlightPrice[] = [
      {
        departure: origin,
        arrival: destination,
        departureDate,
        returnDate,
        price: basePrice,
        currency: "USD",
        airline: "Airline A",
        duration: "8h 30m",
        stops: 0,
      },
      {
        departure: origin,
        arrival: destination,
        departureDate,
        returnDate,
        price: basePrice * 0.85,
        currency: "USD",
        airline: "Airline B",
        duration: "10h 15m",
        stops: 1,
      },
    ];

    // Cache for 6 hours
    setCached(cacheKey, flights, 6 * 60 * 60 * 1000);
    return flights;
  } catch (error) {
    console.error("Error fetching flight prices:", error);
    throw new Error("Failed to fetch flight prices");
  }
}

export function getAverageFlightCost(
  flights: FlightPrice[],
  travelers: number
): number {
  if (flights.length === 0) return 0;
  const avgPrice = flights.reduce((sum, f) => sum + f.price, 0) / flights.length;
  return avgPrice * travelers;
}
