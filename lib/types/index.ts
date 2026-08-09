// lib/types/index.ts
// Core domain types for Planova. Keep this file lean — it's the contract every
// service, component, and API route agrees on.

export type TripVibe =
  | "adventure"
  | "beach"
  | "food"
  | "culture"
  | "romance"
  | "nature"
  | "city"
  | "luxury";

export const TRIP_VIBES: TripVibe[] = [
  "adventure",
  "beach",
  "food",
  "culture",
  "romance",
  "nature",
  "city",
  "luxury",
];

export type Availability = "Available" | "Limited" | "Unavailable";

export type SortKey = "value" | "price" | "rating" | "duration";

export interface SearchParams {
  destination: string;
  latitude: number;
  longitude: number;
  radius?: number;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  tripType?: string;
  /** Trip vibes the user wants to bias results toward */
  vibes?: TripVibe[];
}

export interface FlightEstimate {
  origin: string;
  destination: string;
  /** Distance in kilometres great-circle */
  distanceKm: number;
  duration: string;
  stops: 0 | 1 | 2;
  low: number;
  mid: number;
  high: number;
  perPerson: number;
  total: number;
  currency: string;
}

export interface HotelEstimate {
  country: string;
  nights: number;
  nightlyBase: number;
  nightlyAverage: number;
  total: number;
  currency: string;
  tier: 1 | 2 | 3 | 4;
  sampleHotels: {
    name: string;
    rating: number;
    pricePerNight: number;
    amenities: string[];
    tier: "Budget" | "Comfort" | "Premium";
  }[];
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  emoji?: string;
  travelScore?: number; // 0-100, higher = better for general travel
}

export interface Destination {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  /** Inferred or user-selected vibes */
  vibes?: TripVibe[];
}

export interface DestinationResult extends Destination {
  estimatedFlightCost: number;
  estimatedHotelCost: number;
  estimatedDailyCost: number;
  totalEstimatedCost: number;
  flightAvailability: Availability;
  hotelAvailability: Availability;
  weather?: WeatherData;
  safetyRating?: number;
  /** 0-100 composite score combining budget fit, rating, safety, weather */
  valueScore: number;
  costBreakdown: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
  };
  flightEstimate?: FlightEstimate;
  hotelEstimate?: HotelEstimate;
  /** Number of days in the planned trip */
  durationDays: number;
}

export interface SearchResponse {
  query: SearchParams;
  results: DestinationResult[];
  totalCount: number;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// ---------- Favorites ----------

export interface FavoriteTrip {
  placeId: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  image?: string;
  rating?: number;
  totalEstimatedCost?: number;
  currency?: string;
  vibes?: TripVibe[];
  savedAt: number;
}

// ---------- Itinerary ----------

export interface ItineraryBlock {
  slot: "morning" | "afternoon" | "evening";
  title: string;
  description: string;
  estimatedCost: number;
  emoji: string;
  category: "sight" | "food" | "activity" | "transport" | "rest";
}

export interface ItineraryDay {
  dayNumber: number;
  date: string; // ISO date
  title: string;
  blocks: ItineraryBlock[];
  estimatedDailyCost: number;
}

export interface Itinerary {
  destinationName: string;
  totalDays: number;
  vibes: TripVibe[];
  days: ItineraryDay[];
  estimatedTotalCost: number;
}

// ---------- Comparison ----------

export interface CompareItem {
  placeId: string;
  totalEstimatedCost: number;
  valueScore: number;
  rating?: number;
  safetyRating?: number;
  weather?: WeatherData;
  vibes?: TripVibe[];
  flightAvailability: Availability;
  hotelAvailability: Availability;
}

// ---------- Backwards-compatible aliases (used by legacy code paths during Phase 2 migration) ----------

/** @deprecated Use FlightEstimate instead. */
export interface FlightPrice {
  departure: string;
  arrival: string;
  departureDate: Date;
  returnDate?: Date;
  price: number;
  currency: string;
  airline: string;
  duration: string;
  stops: number;
}

/** @deprecated Use HotelEstimate instead. */
export interface HotelPrice {
  name: string;
  rating: number;
  price: number;
  currency: string;
  pricePerNight: number;
  nights: number;
  amenities: string[];
  image?: string;
}