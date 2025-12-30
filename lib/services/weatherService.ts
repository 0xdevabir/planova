// lib/services/weatherService.ts

import { WeatherData } from "@/lib/types";
import { getCached, setCached, generateCacheKey } from "@/lib/utils/cache";

export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const cacheKey = generateCacheKey(
    "weather",
    latitude.toString(),
    longitude.toString()
  );

  const cached = getCached<WeatherData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&wind_speed_unit=kmh`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current_weather;

    // Map WMO weather codes to readable conditions
    const weatherCondition = getWeatherCondition(current.weathercode);

    const weather: WeatherData = {
      temperature: Math.round(current.temperature),
      condition: weatherCondition,
      humidity: 65, // Open-Meteo doesn't provide humidity in current weather
      windSpeed: Math.round(current.windspeed),
      precipitation: 0, // Not available in current endpoint
    };

    // Cache for 3 hours
    setCached(cacheKey, weather, 3 * 60 * 60 * 1000);
    return weather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return getMockWeather();
  }
}

function getMockWeather(): WeatherData {
  return {
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 15,
    precipitation: 0,
  };
}

// Map WMO Weather Codes to readable conditions
function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51 || code === 53 || code === 55) return "Light drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rainy";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95 || code === 96 || code === 99) return "Thunderstorm";
  return "Unknown";
}
