// lib/services/budgetCalculator.ts

import { SearchParams, DestinationResult, Destination } from "@/lib/types";
import { getFlightPrices, getAverageFlightCost } from "./flightService";
import { getHotelPrices, getAverageHotelCost } from "./hotelService";
import { getWeatherData } from "./weatherService";

// Estimated daily expenses by country (in USD)
const dailyExpenseEstimates: Record<string, number> = {
  France: 80,
  Japan: 100,
  Thailand: 40,
  Spain: 70,
  UK: 90,
  USA: 100,
  Australia: 110,
  India: 30,
  Mexico: 50,
  Brazil: 60,
};

const BUDGET_BREAKDOWN = {
  flights: 0.4,
  accommodation: 0.35,
  food: 0.15,
  activities: 0.1,
};

export async function calculateDestinationCosts(
  destination: Destination,
  searchParams: SearchParams,
  originCity: string = "New York"
): Promise<Omit<DestinationResult, "placeId" | "name" | "latitude" | "longitude" | "address" | "description" | "image" | "rating" | "reviews">> {
  try {
    const tripDays = Math.ceil(
      (searchParams.endDate.getTime() - searchParams.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate flight costs
    const flights = await getFlightPrices(
      originCity,
      destination.name,
      searchParams.startDate,
      searchParams.endDate
    );
    const flightCost = getAverageFlightCost(flights, searchParams.travelers);

    // Calculate hotel costs
    const hotels = await getHotelPrices(
      destination.name,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.travelers
    );
    const hotelCost = getAverageHotelCost(hotels);

    // Calculate daily expenses
    const country = extractCountry(destination.address || destination.name);
    const dailyRate = dailyExpenseEstimates[country] || 60;
    const dailyCost = dailyRate * tripDays * searchParams.travelers;

    // Cost breakdown (based on budget allocation)
    const totalEstimatedCost = flightCost + hotelCost + dailyCost;

    const costBreakdown = {
      flights: flightCost,
      accommodation: hotelCost,
      food: dailyCost * (BUDGET_BREAKDOWN.food / (1 - BUDGET_BREAKDOWN.flights - BUDGET_BREAKDOWN.accommodation)),
      activities: dailyCost * (BUDGET_BREAKDOWN.activities / (1 - BUDGET_BREAKDOWN.flights - BUDGET_BREAKDOWN.accommodation)),
    };

    // Check availability
    const flightAvailability = flights.length > 0 ? "Available" : "Unavailable";
    const hotelAvailability = hotels.length > 0 ? "Available" : "Unavailable";

    // Get weather data
    const weather = await getWeatherData(destination.latitude, destination.longitude);

    // Calculate value score (0-100)
    const budgetRemaining = searchParams.budgetMax - totalEstimatedCost;
    const valueScore = Math.max(
      0,
      Math.min(100, (budgetRemaining / searchParams.budgetMax) * 100)
    );

    return {
      estimatedFlightCost: flightCost,
      estimatedHotelCost: hotelCost,
      estimatedDailyCost: dailyCost,
      totalEstimatedCost,
      flightAvailability: flightAvailability as "Available" | "Limited" | "Unavailable",
      hotelAvailability: hotelAvailability as "Available" | "Limited" | "Unavailable",
      weather,
      safetyRating: Math.random() * 3 + 7, // Mock rating 7-10
      valueScore,
      costBreakdown,
    };
  } catch (error) {
    console.error("Error calculating costs:", error);
    // Return fallback values
    return {
      estimatedFlightCost: 500,
      estimatedHotelCost: 800,
      estimatedDailyCost: 400,
      totalEstimatedCost: 1700,
      flightAvailability: "Available",
      hotelAvailability: "Available",
      valueScore: 50,
      costBreakdown: {
        flights: 500,
        accommodation: 800,
        food: 200,
        activities: 200,
      },
    };
  }
}

function extractCountry(address: string): string {
  const parts = address.split(",");
  if (parts.length > 0) {
    const country = parts[parts.length - 1].trim();
    return country;
  }
  return "USA";
}
