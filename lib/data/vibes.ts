// lib/data/vibes.ts
// Catalog of trip "vibes" users can filter by. Each vibe has a color token,
// emoji, and weight modifiers used by the cost models and ranking algorithm.

import type { TripVibe } from "@/lib/types";

export interface VibeConfig {
  id: TripVibe;
  label: string;
  emoji: string;
  blurb: string;
  /** Tailwind-compatible gradient classes for cards/badges */
  gradient: string;
  /** Soft background tint used behind icons */
  tint: string;
  /** Foreground color for badges */
  text: string;
  /** Cost multiplier applied to hotel estimates (1 = neutral) */
  costWeight: number;
  /** Multiplier applied to a destination's rating before it contributes to valueScore */
  ratingWeight: number;
}

export const VIBES: VibeConfig[] = [
  {
    id: "adventure",
    label: "Adventure",
    emoji: "🏔️",
    blurb: "Treks, climbs, and pulse-raising days.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    tint: "bg-emerald-50",
    text: "text-emerald-700",
    costWeight: 0.85,
    ratingWeight: 1.05,
  },
  {
    id: "beach",
    label: "Beach",
    emoji: "🏖️",
    blurb: "Sand, sun, and slow afternoons.",
    gradient: "from-sky-400 via-blue-400 to-cyan-400",
    tint: "bg-sky-50",
    text: "text-sky-700",
    costWeight: 1.2,
    ratingWeight: 1.0,
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍜",
    blurb: "Markets, michelin, midnight ramen.",
    gradient: "from-orange-400 via-rose-500 to-pink-500",
    tint: "bg-rose-50",
    text: "text-rose-700",
    costWeight: 1.1,
    ratingWeight: 1.15,
  },
  {
    id: "culture",
    label: "Culture",
    emoji: "🏛️",
    blurb: "Museums, ruins, and old town strolls.",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    tint: "bg-amber-50",
    text: "text-amber-700",
    costWeight: 1.0,
    ratingWeight: 1.2,
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "💞",
    blurb: "Candlelight, canals, cozy hideaways.",
    gradient: "from-pink-400 via-fuchsia-500 to-purple-500",
    tint: "bg-pink-50",
    text: "text-pink-700",
    costWeight: 1.25,
    ratingWeight: 1.05,
  },
  {
    id: "nature",
    label: "Nature",
    emoji: "🌲",
    blurb: "Forests, fjords, and quiet horizons.",
    gradient: "from-lime-400 via-green-500 to-emerald-500",
    tint: "bg-green-50",
    text: "text-green-700",
    costWeight: 0.95,
    ratingWeight: 1.0,
  },
  {
    id: "city",
    label: "City",
    emoji: "🌆",
    blurb: "Skyline nights, design districts, transit.",
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    tint: "bg-violet-50",
    text: "text-violet-700",
    costWeight: 1.15,
    ratingWeight: 1.1,
  },
  {
    id: "luxury",
    label: "Luxury",
    emoji: "✨",
    blurb: "Suites, spas, and a personal concierge.",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    tint: "bg-yellow-50",
    text: "text-amber-700",
    costWeight: 2.5,
    ratingWeight: 1.0,
  },
];

export const VIBE_BY_ID: Record<TripVibe, VibeConfig> = VIBES.reduce(
  (acc, vibe) => {
    acc[vibe.id] = vibe;
    return acc;
  },
  {} as Record<TripVibe, VibeConfig>,
);

/**
 * Best-effort vibe assignment based on a destination's name/description.
 * Deterministic so the same city always gets the same vibe.
 */
export function inferVibes(text: string): TripVibe[] {
  const t = text.toLowerCase();
  const matched: TripVibe[] = [];
  const keywords: Record<TripVibe, string[]> = {
    adventure: ["mountain", "hike", "trek", "alpine", "summit", "volcano", "safari"],
    beach: ["beach", "coast", "island", "bay", "reef", "maldives", "caribbean", "sea"],
    food: ["food", "cuisine", "ramen", "tapas", "bistro", "street food", "market"],
    culture: ["museum", "history", "temple", "cathedral", "ancient", "heritage", "old town"],
    romance: ["romantic", "venice", "paris", "sunset", "vineyard", "proposal"],
    nature: ["forest", "fjord", "lake", "park", "rainforest", "waterfall", "canyon"],
    city: ["city", "skyline", "metropolitan", "downtown", "urban", "rooftop"],
    luxury: ["resort", "spa", "palace", "five-star", "luxury", "premium"],
  };
  (Object.keys(keywords) as TripVibe[]).forEach((vibe) => {
    if (keywords[vibe].some((kw) => t.includes(kw))) {
      matched.push(vibe);
    }
  });
  if (matched.length === 0) {
    // Default fallback to two generic vibes
    return ["culture", "city"];
  }
  return matched.slice(0, 3);
}