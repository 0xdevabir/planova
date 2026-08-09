// lib/services/itineraryService.ts
// Deterministic day-by-day itinerary generator. We pick morning/afternoon/evening
// blocks per day based on the destination's vibes so the plan feels curated
// without needing a live activity API.

import { dayCount, addDays } from "@/lib/utils/dates";
import type { DestinationResult, Itinerary, ItineraryBlock, ItineraryDay, TripVibe } from "@/lib/types";

interface PoolEntry {
  slot: ItineraryBlock["slot"];
  category: ItineraryBlock["category"];
  emoji: string;
  title: string;
  description: string;
  cost: number;
}

const POOL: Record<TripVibe, PoolEntry[]> = {
  adventure: [
    {
      slot: "morning",
      category: "activity",
      emoji: "🥾",
      title: "Sunrise hike",
      description: "Beat the crowds on a guided peak trail with local guides.",
      cost: 60,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🚣",
      title: "Rapids or coastline",
      description: "Half-day water activity — kayak, raft, or cliff dive.",
      cost: 90,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🔥",
      title: "Trail-side dinner",
      description: "Family-run taverna or grill with regional specialties.",
      cost: 45,
    },
  ],
  beach: [
    {
      slot: "morning",
      category: "rest",
      emoji: "🌅",
      title: "Sunrise yoga on the sand",
      description: "Ease into the day with a guided beach session.",
      cost: 30,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🤿",
      title: "Snorkel or sail",
      description: "Hop on a boat tour or reef snorkel with gear included.",
      cost: 110,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🍹",
      title: "Sunset cocktails",
      description: "Beachfront lounge with live music and a small-plates menu.",
      cost: 60,
    },
  ],
  food: [
    {
      slot: "morning",
      category: "food",
      emoji: "🥐",
      title: "Bakery + market walk",
      description: "Hit the neighborhood patisseries and a working market.",
      cost: 25,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🍳",
      title: "Cooking class",
      description: "Hands-on class with a local chef teaching three classics.",
      cost: 95,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🍷",
      title: "Tasting menu",
      description: "Six-course chef tasting menu at a top-rated restaurant.",
      cost: 140,
    },
  ],
  culture: [
    {
      slot: "morning",
      category: "sight",
      emoji: "🏛️",
      title: "Old town walk",
      description: "Two-hour guided walk through the historic core.",
      cost: 30,
    },
    {
      slot: "afternoon",
      category: "sight",
      emoji: "🖼️",
      title: "Top museum",
      description: "Skip-the-line entry to the headline museum.",
      cost: 35,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🎭",
      title: "Performance night",
      description: "Traditional music, theatre, or dance in a heritage venue.",
      cost: 70,
    },
  ],
  romance: [
    {
      slot: "morning",
      category: "rest",
      emoji: "🥐",
      title: "Breakfast in bed",
      description: "Slow morning with room service and a long brunch.",
      cost: 50,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🍷",
      title: "Wine or champagne tasting",
      description: "Private tasting flight at a boutique cellar.",
      cost: 110,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🌙",
      title: "Candlelit dinner",
      description: "Tasting menu at the city's most romantic restaurant.",
      cost: 180,
    },
  ],
  nature: [
    {
      slot: "morning",
      category: "activity",
      emoji: "🌲",
      title: "Forest walk",
      description: "Quiet trail with lookouts and a packed picnic.",
      cost: 25,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🦌",
      title: "Wildlife watch",
      description: "Boat tour or safari with a local naturalist.",
      cost: 85,
    },
    {
      slot: "evening",
      category: "rest",
      emoji: "🏕️",
      title: "Stargazing",
      description: "Drive to a dark-sky spot with blankets and hot drinks.",
      cost: 30,
    },
  ],
  city: [
    {
      slot: "morning",
      category: "sight",
      emoji: "☕",
      title: "Coffee + skyline",
      description: "Specialty coffee at a rooftop spot with skyline views.",
      cost: 25,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🎨",
      title: "Design district walk",
      description: "Self-guided tour of the city's most creative streets.",
      cost: 20,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "🍸",
      title: "Late-night eats",
      description: "Iconic 24-hour spot where locals go after midnight.",
      cost: 50,
    },
  ],
  luxury: [
    {
      slot: "morning",
      category: "rest",
      emoji: "💆",
      title: "Spa morning",
      description: "90-minute couples massage + thermal circuit.",
      cost: 220,
    },
    {
      slot: "afternoon",
      category: "activity",
      emoji: "🛥️",
      title: "Private boat or helicopter",
      description: "Two-hour chartered tour with champagne service.",
      cost: 480,
    },
    {
      slot: "evening",
      category: "food",
      emoji: "⭐",
      title: "Michelin dinner",
      description: "Chef's table at a Michelin-starred restaurant.",
      cost: 320,
    },
  ],
};

const FALLBACK_DAY: PoolEntry[] = POOL.culture;

function pickPool(vibes: TripVibe[]): PoolEntry[] {
  // Use the first vibe as the primary pool; if multiple, blend slots from the top two.
  const primary = vibes[0] ? POOL[vibes[0]] : FALLBACK_DAY;
  if (vibes.length === 1) return primary;
  const secondary = vibes[1] ? POOL[vibes[1]] : null;
  if (!secondary) return primary;
  return primary.map((entry, i) => {
    const other = secondary[i];
    if (!other) return entry;
    return i === 0 ? entry : { ...other, cost: Math.round((entry.cost + other.cost) / 2) };
  });
}

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h << 5) - h + text.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function rotate<T>(items: T[], offset: number): T[] {
  const n = items.length;
  if (n === 0) return items;
  return items.map((_, i) => items[(i + offset) % n]);
}

export function generateItinerary(destination: DestinationResult, startDate: Date | string, endDate: Date | string): Itinerary {
  const totalDays = dayCount(startDate, endDate);
  const vibes: TripVibe[] = (destination.vibes && destination.vibes.length > 0)
    ? destination.vibes
    : ["culture", "city"];
  const pool = pickPool(vibes);
  const seed = hashSeed(destination.placeId || destination.name);

  const days: ItineraryDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const rotated = rotate(pool, i % pool.length);
    const dayVibes = [vibes[0] || "culture"];
    const tripDay = addDays(startDate, i);
    const blocks: ItineraryBlock[] = rotated.map((entry) => ({
      ...entry,
      estimatedCost: Math.round(entry.cost * (0.9 + ((seed + i) % 5) * 0.04)),
    }));
    const estimatedDailyCost = blocks.reduce((sum, b) => sum + b.estimatedCost, 0);
    const title = i === 0
      ? `Arrival in ${destination.name}`
      : i === totalDays - 1
      ? `Final day in ${destination.name}`
      : `${dayVibes[0].charAt(0).toUpperCase() + dayVibes[0].slice(1)} day`;
    days.push({
      dayNumber: i + 1,
      date: tripDay.toISOString(),
      title,
      blocks,
      estimatedDailyCost,
    });
  }

  const estimatedTotalCost = days.reduce((sum, d) => sum + d.estimatedDailyCost, 0);

  return {
    destinationName: destination.name,
    totalDays,
    vibes,
    days,
    estimatedTotalCost,
  };
}