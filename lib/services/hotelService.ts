// lib/services/hotelService.ts

import { HotelPrice } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

// Mock hotel data for MVP
const mockHotels: Record<string, HotelPrice[]> = {
  Paris: [
    {
      name: "Hotel Le Marais",
      rating: 4.5,
      price: 1200,
      currency: "USD",
      pricePerNight: 120,
      nights: 10,
      amenities: ["WiFi", "Breakfast", "Gym"],
    },
    {
      name: "Budget Stay Paris",
      rating: 3.8,
      price: 600,
      currency: "USD",
      pricePerNight: 60,
      nights: 10,
      amenities: ["WiFi", "Lounge"],
    },
  ],
  Tokyo: [
    {
      name: "Tokyo Palace Hotel",
      rating: 4.8,
      price: 1800,
      currency: "USD",
      pricePerNight: 180,
      nights: 10,
      amenities: ["WiFi", "Breakfast", "Gym", "Spa"],
    },
    {
      name: "Tokyo Budget Inn",
      rating: 3.9,
      price: 800,
      currency: "USD",
      pricePerNight: 80,
      nights: 10,
      amenities: ["WiFi"],
    },
  ],
};

export async function getHotelPrices(
  destination: string,
  checkIn: Date,
  checkOut: Date,
  travelers: number
): Promise<HotelPrice[]> {
  const cacheKey = generateCacheKey(
    "hotels",
    destination,
    checkIn.toISOString(),
    checkOut.toISOString()
  );

  const cached = getCached<HotelPrice[]>(cacheKey);
  if (cached) return cached;

  try {
    // Real API would call Booking.com, Expedia, or Airbnb
    // For MVP: return mock data
    const hotels = mockHotels[destination] || [];

    if (hotels.length === 0) {
      // Generate mock hotels for unknown destinations
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const mockHotels: HotelPrice[] = [
        {
          name: `${destination} Luxury Hotel`,
          rating: 4.5,
          pricePerNight: 150,
          nights,
          price: 150 * nights,
          currency: "USD",
          amenities: ["WiFi", "Breakfast", "Gym"],
        },
        {
          name: `${destination} Budget Hotel`,
          rating: 3.8,
          pricePerNight: 60,
          nights,
          price: 60 * nights,
          currency: "USD",
          amenities: ["WiFi"],
        },
      ];
      setCached(cacheKey, mockHotels, 24 * 60 * 60 * 1000); // Cache for 24 hours
      return mockHotels;
    }

    // Cache for 24 hours
    setCached(cacheKey, hotels, 24 * 60 * 60 * 1000);
    return hotels;
  } catch (error) {
    console.error("Error fetching hotel prices:", error);
    throw new Error("Failed to fetch hotel prices");
  }
}

export function getAverageHotelCost(hotels: HotelPrice[]): number {
  if (hotels.length === 0) return 0;
  return hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length;
}
