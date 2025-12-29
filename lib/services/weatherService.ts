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
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // Return mock data if API key not configured
      return getMockWeather();
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const weather: WeatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      precipitation: data.rain?.["1h"] || 0,
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
