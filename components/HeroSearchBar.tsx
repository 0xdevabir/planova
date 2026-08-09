// components/HeroSearchBar.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaUser,
  FaRegSmile,
  FaSearch,
} from "react-icons/fa";
import VibePicker from "@/components/VibePicker";
import type { TripVibe } from "@/lib/types";
import { CURRENCIES, formatCurrencyCompact } from "@/lib/utils/money";

interface HeroSearchBarProps {
  onSearch: (data: SearchData) => void;
  loading?: boolean;
}

export interface SearchData {
  destination: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  travelers: number;
  currency: string;
  vibes: TripVibe[];
}

interface PlacePrediction {
  place_id: string;
  description: string;
  lat?: string;
  lng?: string;
}

const today = () => new Date().toISOString().split("T")[0];
const inDays = (n: number) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtMoney(amount: number, currency: string) {
  return formatCurrencyCompact(amount, currency);
}

export default function HeroSearchBar({
  onSearch,
  loading,
}: HeroSearchBarProps) {
  const [destination, setDestination] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    placeId: string;
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [showVibePicker, setShowVibePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(inDays(7));
  const [budgetMin, setBudgetMin] = useState(800);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [travelers, setTravelers] = useState(2);
  const [currency, setCurrency] = useState("USD");
  const [vibes, setVibes] = useState<TripVibe[]>([]);

  const dateRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const vibeRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // ----- Autocomplete (debounced) -----
  useEffect(() => {
    if (selectedLocation && destination === selectedLocation.name) {
      return; // don't refetch when the user just selected a suggestion
    }
    if (destination.trim().length < 1) {
      setPredictions([]);
      setShowAutocomplete(false);
      return;
    }

    setAutocompleteLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(destination)}`,
        );
        const data = await res.json();
        setPredictions(data.predictions || []);
        setShowAutocomplete(true);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setPredictions([]);
      } finally {
        setAutocompleteLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [destination, selectedLocation]);

  // ----- Click outside closes dropdowns -----
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const node = e.target as Node;
      if (dateRef.current && !dateRef.current.contains(node)) setShowDatePicker(false);
      if (budgetRef.current && !budgetRef.current.contains(node)) setShowBudgetPicker(false);
      if (guestsRef.current && !guestsRef.current.contains(node)) setShowGuestsPicker(false);
      if (vibeRef.current && !vibeRef.current.contains(node)) setShowVibePicker(false);
      if (autocompleteRef.current && !autocompleteRef.current.contains(node)) setShowAutocomplete(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ----- Pick a suggestion -----
  const handlePlaceSelect = (
    placeId: string,
    description: string,
    lat?: string,
    lng?: string,
  ) => {
    if (lat && lng) {
      setSelectedLocation({
        placeId,
        name: description.split(",")[0].trim(),
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
      setDestination(description.split(",")[0].trim());
      setShowAutocomplete(false);
      setError(null);
    }
  };

  const closeAll = useCallback(() => {
    setShowDatePicker(false);
    setShowBudgetPicker(false);
    setShowGuestsPicker(false);
    setShowVibePicker(false);
    setShowAutocomplete(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    closeAll();

    if (!destination.trim()) {
      setError("Tell us where you want to go.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    if (budgetMin > budgetMax) {
      setError("Budget minimum can't exceed maximum.");
      return;
    }

    let loc = selectedLocation;
    if (!loc) {
      try {
        const res = await fetch(`/api/geocode?query=${encodeURIComponent(destination)}`);
        const data = await res.json();
        if (res.ok && data.latitude && data.longitude) {
          loc = {
            placeId: data.placeId || "geocoded",
            name: (data.name || destination).split(",")[0].trim(),
            latitude: data.latitude,
            longitude: data.longitude,
          };
        }
      } catch (err) {
        console.error("Geocode error:", err);
      }
    }

    if (!loc) {
      setError(`Couldn't locate "${destination}". Try a more specific city name.`);
      return;
    }

    onSearch({
      destination: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      travelers,
      currency,
      vibes,
    });
  }, [
    destination,
    endDate,
    startDate,
    budgetMin,
    budgetMax,
    selectedLocation,
    travelers,
    currency,
    vibes,
    onSearch,
    closeAll,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Glow halo */}
      <div className="absolute -inset-6 bg-cyan-400/20 blur-3xl rounded-full opacity-70 pointer-events-none" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative rounded-3xl border border-white/30 bg-white/15 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
      >
        {/* Top row: Location + Search button */}
        <div className="flex items-stretch gap-2 sm:gap-3 p-3 sm:p-4">
          <div ref={autocompleteRef} className="relative flex-1 min-w-0">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/85 rounded-2xl border border-white/60 focus-within:ring-2 focus-within:ring-cyan-400 transition-all">
              <svg
                className="w-5 h-5 text-gray-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Destination
                </span>
                <input
                  type="text"
                  placeholder="City, region, or country"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setSelectedLocation(null);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-label="Destination"
                  className="bg-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base w-full focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Autocomplete dropdown */}
            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                {autocompleteLoading && predictions.length === 0 && (
                  <div className="px-5 py-3 text-sm text-gray-500">Searching…</div>
                )}
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    type="button"
                    onClick={() =>
                      handlePlaceSelect(
                        prediction.place_id,
                        prediction.description,
                        prediction.lat,
                        prediction.lng,
                      )
                    }
                    className="w-full px-5 py-3 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <svg
                      className="w-4 h-4 text-cyan-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-800 font-medium">
                      {prediction.description}
                    </span>
                  </button>
                ))}
                {!autocompleteLoading && predictions.length === 0 && (
                  <div className="px-5 py-3 text-sm text-gray-500">
                    No matches. Try a different city name.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 sm:px-7 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 shadow-[0_8px_24px_rgba(6,182,212,0.35)] whitespace-nowrap"
          >
            <FaSearch className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{loading ? "Searching…" : "Search"}</span>
          </button>
        </div>

        {/* Bottom row: filter chips */}
        <div className="flex flex-wrap items-stretch gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
          {/* Dates */}
          <div className="relative flex-1 min-w-[180px]" ref={dateRef}>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker((v) => !v);
                setShowBudgetPicker(false);
                setShowGuestsPicker(false);
                setShowVibePicker(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/85 hover:bg-white rounded-2xl border border-white/60 text-left text-gray-900 transition-all"
            >
              <FaCalendarAlt className="w-4 h-4 text-cyan-600 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Dates
                </span>
                <span className="text-sm font-semibold truncate">
                  {fmtDate(startDate)} – {fmtDate(endDate)}
                </span>
              </div>
            </button>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl p-4 z-50 w-72">
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Start date
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      min={today()}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (e.target.value >= endDate) {
                          const next = new Date(e.target.value);
                          next.setDate(next.getDate() + 1);
                          setEndDate(next.toISOString().split("T")[0]);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      End date
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="relative flex-1 min-w-[180px]" ref={budgetRef}>
            <button
              type="button"
              onClick={() => {
                setShowBudgetPicker((v) => !v);
                setShowDatePicker(false);
                setShowGuestsPicker(false);
                setShowVibePicker(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/85 hover:bg-white rounded-2xl border border-white/60 text-left text-gray-900 transition-all"
            >
              <FaDollarSign className="w-4 h-4 text-cyan-600 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Budget ({currency})
                </span>
                <span className="text-sm font-semibold truncate">
                  {fmtMoney(budgetMin, currency)} – {fmtMoney(budgetMax, currency)}
                </span>
              </div>
            </button>
            {showBudgetPicker && (
              <div className="absolute top-full left-0 right-0 sm:right-auto mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-80">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCurrency(next);
                        // Reset default budget range when currency changes
                        setBudgetMin(800);
                        setBudgetMax(5000);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} · {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-600">Min</label>
                      <span className="text-sm font-semibold text-gray-900">
                        {fmtMoney(budgetMin, currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="20000"
                      step="50"
                      value={budgetMin}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setBudgetMin(v);
                        if (v > budgetMax) setBudgetMax(v + 200);
                      }}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-600">Max</label>
                      <span className="text-sm font-semibold text-gray-900">
                        {fmtMoney(budgetMax, currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="100"
                      value={budgetMax}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setBudgetMax(v);
                        if (v < budgetMin) setBudgetMin(Math.max(100, v - 200));
                      }}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Travelers */}
          <div className="relative flex-1 min-w-[140px]" ref={guestsRef}>
            <button
              type="button"
              onClick={() => {
                setShowGuestsPicker((v) => !v);
                setShowDatePicker(false);
                setShowBudgetPicker(false);
                setShowVibePicker(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/85 hover:bg-white rounded-2xl border border-white/60 text-left text-gray-900 transition-all"
            >
              <FaUser className="w-4 h-4 text-cyan-600 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Travelers
                </span>
                <span className="text-sm font-semibold truncate">
                  {travelers} {travelers === 1 ? "person" : "people"}
                </span>
              </div>
            </button>
            {showGuestsPicker && (
              <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl p-4 z-50 w-56">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Travelers</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-cyan-500 hover:text-cyan-600 transition-colors font-bold"
                      aria-label="Decrease travelers"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold text-gray-900 w-8 text-center">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(20, travelers + 1))}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-cyan-500 hover:text-cyan-600 transition-colors font-bold"
                      aria-label="Increase travelers"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vibes */}
          <div className="relative flex-1 min-w-[180px]" ref={vibeRef}>
            <button
              type="button"
              onClick={() => {
                setShowVibePicker((v) => !v);
                setShowDatePicker(false);
                setShowBudgetPicker(false);
                setShowGuestsPicker(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-left transition-all ${
                vibes.length > 0
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-500 text-white shadow-md"
                  : "bg-white/85 hover:bg-white border-white/60 text-gray-900"
              }`}
            >
              <FaRegSmile className={`w-4 h-4 shrink-0 ${vibes.length > 0 ? "text-white" : "text-cyan-600"}`} />
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold ${
                    vibes.length > 0 ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  Vibes
                </span>
                <span className="text-sm font-semibold truncate">
                  {vibes.length === 0
                    ? "Any mood"
                    : vibes.length === 1
                    ? vibes[0]
                    : `${vibes.length} selected`}
                </span>
              </div>
            </button>
            {showVibePicker && (
              <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl p-4 z-50 w-80">
                <VibePicker selected={vibes} onChange={setVibes} />
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 pb-3 -mt-1">
            <p className="text-sm font-medium text-rose-100 bg-rose-500/90 border border-rose-300 px-3 py-2 rounded-xl shadow-sm">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}