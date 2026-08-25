// components/DestinationCard.tsx

import { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { formatCurrency } from "@/lib/utils/money";
import FavoriteButton from "./FavoriteButton";
import { FaRoute } from "react-icons/fa";

interface DestinationCardProps {
  destination: DestinationResult;
  onSelect?: (destination: DestinationResult) => void;
  onOpen?: (destination: DestinationResult) => void;
  onItinerary?: (destination: DestinationResult) => void;
  currency?: string;
  compact?: boolean;
  highlighted?: boolean;
}

export default function DestinationCard({
  destination,
  onSelect,
  onOpen,
  onItinerary,
  currency = "USD",
  highlighted = false,
}: DestinationCardProps) {
  const primaryVibe = destination.vibes?.[0] ? VIBE_BY_ID[destination.vibes[0]] : null;
  const headerGradient = "from-teal-800 to-teal-700";
  const vibeEmojis = (destination.vibes || [])
    .slice(0, 3)
    .map((v) => VIBE_BY_ID[v]?.emoji)
    .filter(Boolean);

  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover-lift relative ${
        highlighted
          ? "border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-300/50"
          : "border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl"
      }`}
      onMouseEnter={() => {
        /* parent may listen via data attribute */
      }}
      data-place-id={destination.placeId}
    >
      <div className={`bg-gradient-to-br ${headerGradient} p-5 text-white relative overflow-hidden`}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -right-2 top-8 w-12 h-12 bg-white/10 rounded-full" />

        <div className="relative flex justify-between items-start gap-3">
          <div className="min-w-0">
            {vibeEmojis.length > 0 && (
              <div className="flex items-center gap-1 text-lg mb-1.5" aria-hidden>
                {vibeEmojis.map((emoji, i) => (
                  <span key={i}>{emoji}</span>
                ))}
              </div>
            )}
            <h3 className="font-display text-2xl font-semibold truncate">{destination.name}</h3>
            <p className="text-white/80 text-sm mt-1 truncate">{destination.address}</p>
            {destination.weather && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-black/20 border border-white/20 px-2.5 py-1 text-xs">
                <span aria-hidden>{destination.weather.emoji || "☁️"}</span>
                <span>
                  {destination.weather.condition} · {destination.weather.temperature}°C
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <FavoriteButton destination={destination} size="sm" tone="glass" />
            <div className="text-right">
              <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
                Value
              </div>
              <div className="text-3xl font-bold">{Math.round(destination.valueScore)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {destination.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {destination.description}
          </p>
        )}

        {destination.rating && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-amber-500">★ {destination.rating.toFixed(1)}</span>
            {destination.reviews != null && (
              <span className="text-gray-400">
                ({destination.reviews.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-500">Est. total</span>
            <span className="text-lg font-semibold text-slate-900">
              {formatCurrency(destination.totalEstimatedCost, currency)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex justify-between gap-2">
              <span>Flights</span>
              <span className="font-medium">
                {formatCurrency(destination.costBreakdown.flights, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Stay</span>
              <span className="font-medium">
                {formatCurrency(destination.costBreakdown.accommodation, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Food</span>
              <span className="font-medium">
                {formatCurrency(destination.costBreakdown.food, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Activities</span>
              <span className="font-medium">
                {formatCurrency(destination.costBreakdown.activities, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-full border ${
              destination.flightAvailability === "Available"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : destination.flightAvailability === "Limited"
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-slate-50 text-slate-500 border-slate-100"
            }`}
          >
            Flights {destination.flightAvailability}
          </span>
          <span
            className={`px-2 py-1 rounded-full border ${
              destination.hotelAvailability === "Available"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : destination.hotelAvailability === "Limited"
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-slate-50 text-slate-500 border-slate-100"
            }`}
          >
            Stay {destination.hotelAvailability}
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {onOpen && (
            <button
              type="button"
              onClick={() => onOpen(destination)}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Open destination
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onItinerary?.(destination)}
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 rounded-xl transition-colors text-sm"
            >
              <FaRoute className="text-xs" />
              Quick plan
            </button>
            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(destination)}
                className="inline-flex items-center justify-center gap-2 bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 font-semibold py-2 rounded-xl transition-colors text-sm"
              >
                Plan from here
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
