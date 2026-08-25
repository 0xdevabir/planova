// lib/data/countryTiers.ts
// Country-level pricing tiers. Used by the cost estimators to ground numbers
// in reality without needing a live API. Tier 1 = most expensive; Tier 4 = least.

export type CountryTier = 1 | 2 | 3 | 4;

export interface CountryPricing {
  iso2: string;
  name: string;
  tier: CountryTier;
  /** Average nightly rate for a 3★ double room, in USD */
  hotelBaseUsd: number;
  /** Cost per kilometre of great-circle flight, in USD (incl. fuel + tax) */
  flightPerKmUsd: number;
  /** Average food + local transport cost per person per day, in USD */
  dailyCostUsd: number;
}

export const COUNTRY_PRICING: CountryPricing[] = [
  { iso2: "US", name: "United States", tier: 2, hotelBaseUsd: 165, flightPerKmUsd: 0.16, dailyCostUsd: 95 },
  { iso2: "CA", name: "Canada", tier: 2, hotelBaseUsd: 155, flightPerKmUsd: 0.16, dailyCostUsd: 90 },
  { iso2: "MX", name: "Mexico", tier: 3, hotelBaseUsd: 85, flightPerKmUsd: 0.13, dailyCostUsd: 55 },
  { iso2: "BR", name: "Brazil", tier: 3, hotelBaseUsd: 80, flightPerKmUsd: 0.12, dailyCostUsd: 50 },
  { iso2: "AR", name: "Argentina", tier: 3, hotelBaseUsd: 78, flightPerKmUsd: 0.13, dailyCostUsd: 48 },
  { iso2: "CL", name: "Chile", tier: 2, hotelBaseUsd: 110, flightPerKmUsd: 0.14, dailyCostUsd: 65 },
  { iso2: "GB", name: "United Kingdom", tier: 1, hotelBaseUsd: 180, flightPerKmUsd: 0.17, dailyCostUsd: 95 },
  { iso2: "IE", name: "Ireland", tier: 1, hotelBaseUsd: 175, flightPerKmUsd: 0.17, dailyCostUsd: 95 },
  { iso2: "FR", name: "France", tier: 1, hotelBaseUsd: 170, flightPerKmUsd: 0.17, dailyCostUsd: 90 },
  { iso2: "DE", name: "Germany", tier: 1, hotelBaseUsd: 160, flightPerKmUsd: 0.17, dailyCostUsd: 85 },
  { iso2: "ES", name: "Spain", tier: 2, hotelBaseUsd: 130, flightPerKmUsd: 0.15, dailyCostUsd: 75 },
  { iso2: "PT", name: "Portugal", tier: 2, hotelBaseUsd: 125, flightPerKmUsd: 0.15, dailyCostUsd: 70 },
  { iso2: "IT", name: "Italy", tier: 1, hotelBaseUsd: 165, flightPerKmUsd: 0.17, dailyCostUsd: 90 },
  { iso2: "NL", name: "Netherlands", tier: 1, hotelBaseUsd: 170, flightPerKmUsd: 0.17, dailyCostUsd: 90 },
  { iso2: "CH", name: "Switzerland", tier: 1, hotelBaseUsd: 240, flightPerKmUsd: 0.18, dailyCostUsd: 120 },
  { iso2: "SE", name: "Sweden", tier: 1, hotelBaseUsd: 175, flightPerKmUsd: 0.17, dailyCostUsd: 95 },
  { iso2: "NO", name: "Norway", tier: 1, hotelBaseUsd: 200, flightPerKmUsd: 0.18, dailyCostUsd: 110 },
  { iso2: "DK", name: "Denmark", tier: 1, hotelBaseUsd: 180, flightPerKmUsd: 0.17, dailyCostUsd: 100 },
  { iso2: "FI", name: "Finland", tier: 2, hotelBaseUsd: 150, flightPerKmUsd: 0.16, dailyCostUsd: 85 },
  { iso2: "IS", name: "Iceland", tier: 1, hotelBaseUsd: 220, flightPerKmUsd: 0.18, dailyCostUsd: 115 },
  { iso2: "GR", name: "Greece", tier: 2, hotelBaseUsd: 120, flightPerKmUsd: 0.14, dailyCostUsd: 70 },
  { iso2: "TR", name: "Turkey", tier: 3, hotelBaseUsd: 90, flightPerKmUsd: 0.13, dailyCostUsd: 55 },
  { iso2: "JP", name: "Japan", tier: 1, hotelBaseUsd: 175, flightPerKmUsd: 0.18, dailyCostUsd: 90 },
  { iso2: "KR", name: "South Korea", tier: 2, hotelBaseUsd: 130, flightPerKmUsd: 0.16, dailyCostUsd: 75 },
  { iso2: "CN", name: "China", tier: 3, hotelBaseUsd: 95, flightPerKmUsd: 0.13, dailyCostUsd: 55 },
  { iso2: "HK", name: "Hong Kong", tier: 1, hotelBaseUsd: 200, flightPerKmUsd: 0.18, dailyCostUsd: 100 },
  { iso2: "TW", name: "Taiwan", tier: 2, hotelBaseUsd: 125, flightPerKmUsd: 0.15, dailyCostUsd: 70 },
  { iso2: "TH", name: "Thailand", tier: 3, hotelBaseUsd: 70, flightPerKmUsd: 0.12, dailyCostUsd: 40 },
  { iso2: "VN", name: "Vietnam", tier: 4, hotelBaseUsd: 55, flightPerKmUsd: 0.10, dailyCostUsd: 35 },
  { iso2: "ID", name: "Indonesia", tier: 3, hotelBaseUsd: 80, flightPerKmUsd: 0.12, dailyCostUsd: 45 },
  { iso2: "PH", name: "Philippines", tier: 3, hotelBaseUsd: 75, flightPerKmUsd: 0.12, dailyCostUsd: 45 },
  { iso2: "MY", name: "Malaysia", tier: 3, hotelBaseUsd: 85, flightPerKmUsd: 0.12, dailyCostUsd: 50 },
  { iso2: "SG", name: "Singapore", tier: 1, hotelBaseUsd: 210, flightPerKmUsd: 0.18, dailyCostUsd: 110 },
  { iso2: "IN", name: "India", tier: 4, hotelBaseUsd: 55, flightPerKmUsd: 0.10, dailyCostUsd: 30 },
  { iso2: "BD", name: "Bangladesh", tier: 4, hotelBaseUsd: 45, flightPerKmUsd: 0.10, dailyCostUsd: 25 },
  { iso2: "LK", name: "Sri Lanka", tier: 4, hotelBaseUsd: 60, flightPerKmUsd: 0.11, dailyCostUsd: 35 },
  { iso2: "NP", name: "Nepal", tier: 4, hotelBaseUsd: 50, flightPerKmUsd: 0.11, dailyCostUsd: 30 },
  { iso2: "AE", name: "United Arab Emirates", tier: 1, hotelBaseUsd: 195, flightPerKmUsd: 0.17, dailyCostUsd: 95 },
  { iso2: "EG", name: "Egypt", tier: 3, hotelBaseUsd: 80, flightPerKmUsd: 0.13, dailyCostUsd: 50 },
  { iso2: "ZA", name: "South Africa", tier: 3, hotelBaseUsd: 90, flightPerKmUsd: 0.13, dailyCostUsd: 55 },
  { iso2: "AU", name: "Australia", tier: 2, hotelBaseUsd: 150, flightPerKmUsd: 0.16, dailyCostUsd: 90 },
  { iso2: "NZ", name: "New Zealand", tier: 2, hotelBaseUsd: 145, flightPerKmUsd: 0.16, dailyCostUsd: 85 },
  { iso2: "CR", name: "Costa Rica", tier: 3, hotelBaseUsd: 95, flightPerKmUsd: 0.13, dailyCostUsd: 60 },
  { iso2: "PE", name: "Peru", tier: 3, hotelBaseUsd: 80, flightPerKmUsd: 0.13, dailyCostUsd: 50 },
];

export const COUNTRY_BY_ISO: Record<string, CountryPricing> = COUNTRY_PRICING.reduce(
  (acc, c) => {
    acc[c.iso2] = c;
    return acc;
  },
  {} as Record<string, CountryPricing>,
);

/**
 * Resolve country from a free-form address string (e.g. "Paris, France").
 * Looks for the ISO2 code as a 2-letter token, otherwise falls back to a
 * name match. Returns null when nothing matches.
 */
export function resolveCountry(text: string): CountryPricing | null {
  if (!text) return null;
  const upper = text.toUpperCase();
  // Look for " XX" or ",XX" tokens where XX is 2 letters
  const tokenMatch = upper.match(/\b([A-Z]{2})\b/g);
  if (tokenMatch) {
    for (const t of tokenMatch) {
      if (COUNTRY_BY_ISO[t]) return COUNTRY_BY_ISO[t];
    }
  }
  const lower = text.toLowerCase();
  for (const c of COUNTRY_PRICING) {
    if (lower.includes(c.name.toLowerCase())) return c;
  }
  return null;
}

/** US/EU baseline used when a country isn't found. */
export const DEFAULT_PRICING: CountryPricing = {
  iso2: "ZZ",
  name: "Unknown",
  tier: 2,
  hotelBaseUsd: 130,
  flightPerKmUsd: 0.15,
  dailyCostUsd: 75,
};