// lib/services/budgetCalculator.ts
// Composite cost calculator + value-score ranking. Pulls flight/hotel estimates
// from the dedicated services, blends weather + safety + rating signals, and
// returns a normalized 0-100 value score that's actually meaningful.

import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";
import { estimateFlight } from "./flightService";
import { estimateHotel } from "./hotelService";
import { getWeatherData } from "./weatherService";
import { resolveCountry, DEFAULT_PRICING } from "@/lib/data/countryTiers";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { clamp } from "@/lib/utils/geo";
import type {
  Availability,
  Destination,
  DestinationResult,
  FlightEstimate,
  HotelEstimate,
  TripVibe,
  WeatherData,
} from "@/lib/types";

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  local: number;
  activities: number;
  total: number;
  perPerson: number;
  valueScore: number;
  weather: WeatherData;
  safetyRating: number;
  hotelEstimate: HotelEstimate;
  flightEstimate: FlightEstimate;
}

export interface ComputeBudgetInput {
  destination: Destination;
  origin: { name: string; latitude: number; longitude: number };
  startDate: Date;
  endDate: Date;
  travelers: number;
  budgetMin: number;
  budgetMax: number;
  vibes?: TripVibe[];
}

const FOOD_SHARE = 0.18;
const ACTIVITIES_SHARE = 0.12;
const LOCAL_SHARE = 0.1;

function dayCount(start: Date, end: Date): number {
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function inferAvailability(
  value: number,
  availableThreshold: number,
  limitedThreshold: number,
): Availability {
  if (value >= availableThreshold) return "Available";
  if (value >= limitedThreshold) return "Limited";
  return "Unavailable";
}

function weatherTravelScore(weather: WeatherData): {
  score: number;
  condition: string;
  emoji: string;
} {
  const score = clamp(
    100 - Math.abs(weather.temperature - 22) * 3 - weather.windSpeed * 1.5,
    25,
    100,
  );
  const condition = weather.condition;
  const emoji = /rain|drizzle|shower|thunder/i.test(condition)
    ? "🌧️"
    : /snow/i.test(condition)
      ? "❄️"
      : /fog/i.test(condition)
        ? "🌫️"
        : /cloud|overcast/i.test(condition)
          ? "☁️"
          : /clear|sunny/i.test(condition)
            ? "☀️"
            : "🌤️";
  return { score, condition, emoji };
}

export async function computeBudget(input: ComputeBudgetInput): Promise<BudgetBreakdown> {
  const cacheKey = generateCacheKey(
    "budget:v3",
    input.destination.placeId,
    input.startDate.toISOString().split("T")[0],
    input.endDate.toISOString().split("T")[0],
    input.travelers.toString(),
    input.budgetMin.toString(),
    input.budgetMax.toString(),
    (input.vibes || []).sort().join(","),
  );
  const cached = getCached<BudgetBreakdown>(cacheKey);
  if (cached?.weather && cached?.hotelEstimate) return cached;

  const nights = dayCount(input.startDate, input.endDate);
  const travelers = Math.max(1, input.travelers);

  const [flight, hotel, weather] = await Promise.all([
    estimateFlight({
      originName: input.origin.name,
      originLat: input.origin.latitude,
      originLng: input.origin.longitude,
      destinationName: input.destination.name,
      destinationLat: input.destination.latitude,
      destinationLng: input.destination.longitude,
      destinationCountry: input.destination.address,
      travelers,
      vibes: input.vibes,
      startDate: input.startDate.toISOString().split("T")[0],
      endDate: input.endDate.toISOString().split("T")[0],
    }),
    estimateHotel({
      destinationName: input.destination.name,
      destinationCountry: input.destination.address,
      nights,
      travelers,
      vibes: input.vibes,
    }),
    getWeatherData(input.destination.latitude, input.destination.longitude),
  ]);

  const country =
    resolveCountry(input.destination.address || input.destination.name) || DEFAULT_PRICING;
  const dailyCostPerPerson =
    country.dailyCostUsd * (1 + (input.vibes?.includes("luxury") ? 0.4 : 0));

  const food = Math.round(dailyCostPerPerson * FOOD_SHARE * 2 * nights * travelers);
  const activities = Math.round(
    dailyCostPerPerson * ACTIVITIES_SHARE * 2 * nights * travelers,
  );
  const local = Math.round(dailyCostPerPerson * LOCAL_SHARE * 2 * nights * travelers);
  const accommodation = hotel.total;
  const flights = flight.total;
  const total = flights + accommodation + food + activities + local;
  const perPerson = Math.round(total / travelers);

  const budgetFit = clamp(
    100 - ((total - input.budgetMin) / Math.max(1, input.budgetMax - input.budgetMin)) * 100,
    0,
    100,
  );
  const rating = clamp(((input.destination.rating ?? 4.2) / 5) * 100, 0, 100);
  const safety = clamp(((input.destination.rating ?? 4.4) / 5) * 100, 0, 100);
  const weatherMeta = weatherTravelScore(weather);
  const enrichedWeather: WeatherData = { ...weather, ...weatherMeta };
  const safetyRating = clamp((input.destination.rating ?? 4.4) * 0.9 + 0.6, 1, 10);

  const vibeWeight = (input.vibes || []).reduce(
    (acc, v) => acc * (VIBE_BY_ID[v]?.ratingWeight ?? 1),
    1,
  );
  const valueScore = clamp(
    (0.4 * budgetFit + 0.3 * rating + 0.2 * safety + 0.1 * weatherMeta.score) *
      Math.pow(vibeWeight, 0.4),
    0,
    100,
  );

  const result: BudgetBreakdown = {
    flights,
    accommodation,
    food,
    local,
    activities,
    total,
    perPerson,
    valueScore: Math.round(valueScore),
    weather: enrichedWeather,
    safetyRating,
    hotelEstimate: hotel,
    flightEstimate: flight,
  };

  setCached(cacheKey, result, 30 * 60 * 1000);
  return result;
}

/**
 * Annotate a destination with availability + weather + valueScore for the UI.
 */
export async function annotateDestination(
  destination: Destination,
  input: Omit<ComputeBudgetInput, "destination">,
): Promise<DestinationResult> {
  const budget = await computeBudget({ ...input, destination });

  const flightAvailability: Availability = inferAvailability(100 - budget.valueScore, 60, 35);
  const hotelAvailability: Availability = inferAvailability(
    100 - budget.valueScore * 0.7,
    60,
    30,
  );

  return {
    ...destination,
    estimatedFlightCost: budget.flights,
    estimatedHotelCost: budget.accommodation,
    estimatedDailyCost: budget.food + budget.local + budget.activities,
    totalEstimatedCost: budget.total,
    flightAvailability,
    hotelAvailability,
    weather: budget.weather,
    safetyRating: budget.safetyRating,
    hotelEstimate: budget.hotelEstimate,
    flightEstimate: budget.flightEstimate,
    valueScore: budget.valueScore,
    durationDays: dayCount(input.startDate, input.endDate),
    costBreakdown: {
      flights: budget.flights,
      accommodation: budget.accommodation,
      food: budget.food,
      activities: budget.activities + budget.local,
    },
  };
}

/**
 * @deprecated Prefer annotateDestination / computeBudget.
 */
export async function calculateDestinationCosts(
  destination: Destination,
  searchParams: {
    budgetMin: number;
    budgetMax: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    travelers: number;
    tripType?: string;
  },
  originCity: string = "New York",
): Promise<
  Omit<
    DestinationResult,
    | "placeId"
    | "name"
    | "latitude"
    | "longitude"
    | "address"
    | "description"
    | "image"
    | "rating"
    | "reviews"
    | "vibes"
  >
> {
  const budget = await computeBudget({
    destination,
    origin: { name: originCity, latitude: 40.6413, longitude: -73.7781 },
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    travelers: searchParams.travelers,
    budgetMin: searchParams.budgetMin,
    budgetMax: searchParams.budgetMax,
    vibes: [],
  });

  return {
    estimatedFlightCost: budget.flights,
    estimatedHotelCost: budget.accommodation,
    estimatedDailyCost: budget.food + budget.local + budget.activities,
    totalEstimatedCost: budget.total,
    flightAvailability: inferAvailability(100 - budget.valueScore, 60, 35),
    hotelAvailability: inferAvailability(100 - budget.valueScore * 0.7, 60, 30),
    weather: budget.weather,
    safetyRating: budget.safetyRating,
    hotelEstimate: budget.hotelEstimate,
    flightEstimate: budget.flightEstimate,
    valueScore: budget.valueScore,
    durationDays: dayCount(searchParams.startDate, searchParams.endDate),
    costBreakdown: {
      flights: budget.flights,
      accommodation: budget.accommodation,
      food: budget.food,
      activities: budget.activities + budget.local,
    },
  };
}
