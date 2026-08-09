// lib/utils/geo.ts
// Geographic helpers used across cost models and map interactions.

export interface LatLng {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Great-circle distance between two coordinates, in kilometres.
 * Uses the Haversine formula, accurate enough for short/long haul travel planning.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Convert kilometres to statute miles for travelers used to imperial units.
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Estimate flight duration from a great-circle distance. Assumes average
 * cruise speed of 850 km/h + 30 min for takeoff/landing/taxi.
 */
export function estimateFlightDurationKm(km: number): { hours: number; minutes: number; label: string } {
  const totalMinutes = Math.round((km / 850) * 60 + 30);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    hours,
    minutes,
    label: `${hours}h ${minutes.toString().padStart(2, "0")}m`,
  };
}

/**
 * Clamp a number into a closed range. Used everywhere we compute scores.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Format coordinates for compact display, e.g. `48.86°N, 2.35°E`.
 */
export function formatCoords(latitude: number, longitude: number): string {
  const latHemi = latitude >= 0 ? "N" : "S";
  const lonHemi = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(2)}°${latHemi}, ${Math.abs(longitude).toFixed(2)}°${lonHemi}`;
}