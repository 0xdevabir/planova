// lib/types/index.ts

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
}

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

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
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
}

export interface DestinationResult extends Destination {
  estimatedFlightCost: number;
  estimatedHotelCost: number;
  estimatedDailyCost: number;
  totalEstimatedCost: number;
  flightAvailability: "Available" | "Limited" | "Unavailable";
  hotelAvailability: "Available" | "Limited" | "Unavailable";
  weather?: WeatherData;
  safetyRating?: number;
  valueScore: number;
  costBreakdown: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
  };
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
