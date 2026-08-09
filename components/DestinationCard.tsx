// components/DestinationCard.tsx

import { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { formatCurrency } from "@/lib/utils/money";
import FavoriteButton from "./FavoriteButton";

interface DestinationCardProps {
  destination: DestinationResult;
  onSelect?: (destination: DestinationResult) => void;
  currency?: string;
  compact?: boolean;
}

export default function DestinationCard({ destination, onSelect, currency = "USD", compact = false }: DestinationCardProps) {
  const primaryVibe = destination.vibes?.[0] ? VIBE_BY_ID[destination.vibes[0]] : null;
  const headerGradient = primaryVibe?.gradient ?? "from-cyan-500 via-blue-500 to-indigo-600";
  const vibeEmojis = (destination.vibes || []).slice(0, 3).map((v) => VIBE_BY_ID[v]?.emoji).filter(Boolean);

  return (
    <div
      onClick={() => onSelect?.(destination)}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300 border border-gray-100 group hover-lift relative"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-br ${headerGradient} p-5 text-white relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -right-2 top-8 w-12 h-12 bg-white/10 rounded-full" />

        <div className="relative flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {vibeEmojis.length > 0 && (
                <div className="flex items-center gap-1 text-xl">
                  {vibeEmojis.map((emoji, i) => (
                    <span key={i} aria-hidden>{emoji}</span>
                  ))}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold truncate">{destination.name}</h3>
            <p className="text-white/80 text-sm mt-1 truncate">{destination.address}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <FavoriteButton destination={destination} size="sm" tone="glass" />
            <div className="text-right">
              <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Value</div>
              <div className="text-3xl font-bold">{Math.round(destination.valueScore)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description */}
        {destination.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{destination.description}</p>
        )}

        {/* Rating */}
        {destination.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(destination.rating!) ? "text-amber-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-medium text-gray-900">{destination.rating}</span>
            <span className="text-gray-400 text-sm">
              ({destination.reviews?.toLocaleString()} reviews)
            </span>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Cost Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                Flights
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(destination.costBreakdown.flights, currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Accommodation
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(destination.costBreakdown.accommodation, currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Food
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(destination.costBreakdown.food, currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                Activities
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(destination.costBreakdown.activities, currency)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold gradient-text">
                {formatCurrency(destination.totalEstimatedCost, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Availability Badges */}
        <div className="flex gap-2">
          <div className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-medium ${
            destination.flightAvailability === "Available"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            ✈️ Flights {destination.flightAvailability}
          </div>
          <div className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-medium ${
            destination.hotelAvailability === "Available"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            🏨 Hotels {destination.hotelAvailability}
          </div>
        </div>

        {/* Weather */}
        {destination.weather && (
          <div className="bg-gradient-to-br from-sky-50 to-cyan-50 p-4 rounded-xl border border-sky-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
              <span aria-hidden>{destination.weather.emoji || "☁️"}</span> Weather Snapshot
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Condition</span>
                <span className="font-medium text-gray-900">{destination.weather.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Temp</span>
                <span className="font-medium text-gray-900">{destination.weather.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Humidity</span>
                <span className="font-medium text-gray-900">{destination.weather.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Wind</span>
                <span className="font-medium text-gray-900">{destination.weather.windSpeed} km/h</span>
              </div>
            </div>
            {typeof destination.weather.travelScore === "number" && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Travel score</span>
                  <span className="font-semibold text-slate-700">{destination.weather.travelScore}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-sky-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    style={{ width: `${destination.weather.travelScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Safety Rating */}
        {destination.safetyRating && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Safety</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(destination.safetyRating / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">{destination.safetyRating.toFixed(1)}/10</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover-lift">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
