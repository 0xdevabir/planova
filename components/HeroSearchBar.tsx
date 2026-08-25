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
  initialDestination?: string;
  initialCoordinates?: { latitude: number; longitude: number; placeId?: string };
  onDestinationChange?: (value: string) => void;
  autoSubmitOnSelect?: boolean;
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
  name: string;
  context?: string;
  description: string;
  kind?: "city" | "region" | "country" | "place";
  lat?: string;
  lng?: string;
}

const today = () => new Date().toISOString().split("T")[0];
const inDays = (n: number) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtMoney(amount: number, currency: string) {
  return formatCurrencyCompact(amount, currency);
}

const KIND_LABEL: Record<string, string> = {
  city: "City",
  region: "Region",
  country: "Country",
  place: "Place",
};

function FieldButton({
  icon,
  label,
  value,
  active,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active?: boolean;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-colors border",
        highlight
          ? "bg-teal-700 border-teal-700 text-white"
          : active
            ? "bg-stone-50 border-teal-700/40 text-stone-900"
            : "bg-transparent border-transparent hover:bg-stone-50 text-stone-900",
      ].join(" ")}
    >
      <span className={highlight ? "text-white/90" : "text-teal-800"}>{icon}</span>
      <span className="flex flex-col min-w-0 flex-1">
        <span
          className={[
            "text-[10px] uppercase tracking-[0.14em] font-semibold",
            highlight ? "text-white/70" : "text-stone-500",
          ].join(" ")}
        >
          {label}
        </span>
        <span className="text-sm font-semibold truncate">{value}</span>
      </span>
    </button>
  );
}

export default function HeroSearchBar({
  onSearch,
  loading,
  initialDestination,
  initialCoordinates,
  onDestinationChange,
  autoSubmitOnSelect,
}: HeroSearchBarProps) {
  const [destination, setDestination] = useState(initialDestination || "");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
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

  useEffect(() => {
    if (selectedLocation && destination === selectedLocation.name) return;
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
        const list: PlacePrediction[] = (data.predictions || []).map((p: PlacePrediction) => ({
          ...p,
          name: p.name || p.description?.split(",")[0] || "Place",
          context: p.context || p.description?.split(",").slice(1).join(",").trim(),
        }));
        setPredictions(list);
        setShowAutocomplete(true);
        setHighlightIndex(-1);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setPredictions([]);
      } finally {
        setAutocompleteLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [destination, selectedLocation]);

  useEffect(() => {
    if (!initialDestination) return;
    if (selectedLocation && selectedLocation.name === initialDestination) return;

    setDestination(initialDestination);
    onDestinationChange?.(initialDestination);

    if (initialCoordinates) {
      setSelectedLocation({
        placeId: initialCoordinates.placeId || "prefilled",
        name: initialDestination,
        latitude: initialCoordinates.latitude,
        longitude: initialCoordinates.longitude,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDestination, initialCoordinates?.latitude, initialCoordinates?.longitude]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const node = e.target as Node;
      if (dateRef.current && !dateRef.current.contains(node)) setShowDatePicker(false);
      if (budgetRef.current && !budgetRef.current.contains(node)) setShowBudgetPicker(false);
      if (guestsRef.current && !guestsRef.current.contains(node)) setShowGuestsPicker(false);
      if (vibeRef.current && !vibeRef.current.contains(node)) setShowVibePicker(false);
      if (autocompleteRef.current && !autocompleteRef.current.contains(node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const closeAll = useCallback(() => {
    setShowDatePicker(false);
    setShowBudgetPicker(false);
    setShowGuestsPicker(false);
    setShowVibePicker(false);
    setShowAutocomplete(false);
  }, []);

  const applyPrediction = useCallback(
    (prediction: PlacePrediction) => {
      if (!prediction.lat || !prediction.lng) return;
      const name = prediction.name || prediction.description.split(",")[0].trim();
      setSelectedLocation({
        placeId: prediction.place_id,
        name,
        latitude: parseFloat(prediction.lat),
        longitude: parseFloat(prediction.lng),
      });
      setDestination(name);
      setShowAutocomplete(false);
      setError(null);
      onDestinationChange?.(name);
    },
    [onDestinationChange],
  );

  const handleSubmit = useCallback(async () => {
    setError(null);
    closeAll();

    if (!destination.trim()) {
      setError("Tell us where you’re starting from.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }
    if (budgetMin > budgetMax) {
      setError("Budget minimum can’t exceed maximum.");
      return;
    }

    let loc = selectedLocation;
    if (!loc) {
      // Prefer first autocomplete hit if the user typed but didn’t click
      if (predictions[0]?.lat && predictions[0]?.lng) {
        const p = predictions[0];
        loc = {
          placeId: p.place_id,
          name: p.name || p.description.split(",")[0].trim(),
          latitude: parseFloat(p.lat as string),
          longitude: parseFloat(p.lng as string),
        };
      } else {
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
          } else {
            setError(
              data.message ||
                `Couldn't locate "${destination}". Pick a place from the suggestions.`,
            );
            setShowAutocomplete(true);
            return;
          }
        } catch (err) {
          console.error("Geocode error:", err);
        }
      }
    }

    if (!loc) {
      setError(`Couldn't locate "${destination}". Pick a place from the suggestions.`);
      setShowAutocomplete(true);
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
    predictions,
  ]);

  useEffect(() => {
    if (!autoSubmitOnSelect || !initialCoordinates || !initialDestination) return;
    if (!selectedLocation) return;
    const t = setTimeout(() => handleSubmit(), 0);
    return () => clearTimeout(t);
    // only when prefill lands
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation?.placeId, autoSubmitOnSelect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowAutocomplete(true);
      setHighlightIndex((i) => Math.min(i + 1, predictions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showAutocomplete && highlightIndex >= 0 && predictions[highlightIndex]) {
        applyPrediction(predictions[highlightIndex]);
        return;
      }
      handleSubmit();
    }
    if (e.key === "Escape") setShowAutocomplete(false);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative rounded-2xl border border-stone-200/90 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.12)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          {/* Location */}
          <div ref={autocompleteRef} className="relative flex-[1.4] min-w-0 p-2">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl focus-within:bg-stone-50 transition-colors">
              <svg
                className="w-4 h-4 text-teal-800 shrink-0"
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
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-stone-500">
                  From / explore near
                </span>
                <input
                  type="text"
                  placeholder="Search city, region, or country"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setSelectedLocation(null);
                    onDestinationChange?.(e.target.value);
                  }}
                  onFocus={() => {
                    if (predictions.length > 0) setShowAutocomplete(true);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-label="Location"
                  aria-autocomplete="list"
                  aria-expanded={showAutocomplete}
                  autoComplete="off"
                  className="bg-transparent text-stone-900 placeholder-stone-400 text-sm w-full focus:outline-none font-semibold"
                />
              </div>
              {selectedLocation && (
                <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wide text-teal-800 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5">
                  Matched
                </span>
              )}
            </div>

            {showAutocomplete && (
              <div
                role="listbox"
                className="absolute left-2 right-2 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 max-h-80 overflow-y-auto z-50"
              >
                {autocompleteLoading && predictions.length === 0 && (
                  <div className="px-4 py-3 text-sm text-stone-500">Searching places…</div>
                )}
                {predictions.map((prediction, index) => (
                  <button
                    key={prediction.place_id}
                    type="button"
                    role="option"
                    aria-selected={index === highlightIndex}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => applyPrediction(prediction)}
                    className={[
                      "w-full px-4 py-3 text-left flex items-start gap-3 border-b border-stone-100 last:border-b-0 transition-colors",
                      index === highlightIndex ? "bg-teal-50" : "hover:bg-stone-50",
                    ].join(" ")}
                  >
                    <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800 bg-teal-50 border border-teal-100 rounded px-1.5 py-0.5 shrink-0">
                      {KIND_LABEL[prediction.kind || "place"]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-stone-900 truncate">
                        {prediction.name}
                      </span>
                      {prediction.context && (
                        <span className="block text-xs text-stone-500 truncate mt-0.5">
                          {prediction.context}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
                {!autocompleteLoading && predictions.length === 0 && destination.trim() && (
                  <div className="px-4 py-3 text-sm text-stone-500">
                    No places found. Try a city name like “Dhaka” or “Paris”.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="relative flex-1 min-w-[140px] p-2" ref={dateRef}>
            <FieldButton
              icon={<FaCalendarAlt className="w-3.5 h-3.5" />}
              label="Dates"
              value={`${fmtDate(startDate)} – ${fmtDate(endDate)}`}
              active={showDatePicker}
              onClick={() => {
                setShowDatePicker((v) => !v);
                setShowBudgetPicker(false);
                setShowGuestsPicker(false);
                setShowVibePicker(false);
              }}
            />
            {showDatePicker && (
              <div className="absolute top-full left-2 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-72">
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs font-medium text-stone-600 mb-1">Start</span>
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
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-stone-600 mb-1">End</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="relative flex-1 min-w-[140px] p-2" ref={budgetRef}>
            <FieldButton
              icon={<FaDollarSign className="w-3.5 h-3.5" />}
              label={`Budget (${currency})`}
              value={`${fmtMoney(budgetMin, currency)} – ${fmtMoney(budgetMax, currency)}`}
              active={showBudgetPicker}
              onClick={() => {
                setShowBudgetPicker((v) => !v);
                setShowDatePicker(false);
                setShowGuestsPicker(false);
                setShowVibePicker(false);
              }}
            />
            {showBudgetPicker && (
              <div className="absolute top-full left-2 right-2 sm:right-auto mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-80">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value);
                        setBudgetMin(800);
                        setBudgetMax(5000);
                      }}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} · {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs text-stone-600">
                      <span>Min</span>
                      <span className="font-semibold text-stone-900">
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
                      className="w-full accent-teal-700"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs text-stone-600">
                      <span>Max</span>
                      <span className="font-semibold text-stone-900">
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
                      className="w-full accent-teal-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Travelers */}
          <div className="relative flex-1 min-w-[120px] p-2" ref={guestsRef}>
            <FieldButton
              icon={<FaUser className="w-3.5 h-3.5" />}
              label="Travelers"
              value={`${travelers} ${travelers === 1 ? "person" : "people"}`}
              active={showGuestsPicker}
              onClick={() => {
                setShowGuestsPicker((v) => !v);
                setShowDatePicker(false);
                setShowBudgetPicker(false);
                setShowVibePicker(false);
              }}
            />
            {showGuestsPicker && (
              <div className="absolute top-full right-2 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-56">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Travelers</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:border-teal-700 hover:text-teal-800"
                      aria-label="Decrease travelers"
                    >
                      −
                    </button>
                    <span className="text-base font-bold text-stone-900 w-6 text-center">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(20, travelers + 1))}
                      className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:border-teal-700 hover:text-teal-800"
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
          <div className="relative flex-1 min-w-[120px] p-2" ref={vibeRef}>
            <FieldButton
              icon={<FaRegSmile className="w-3.5 h-3.5" />}
              label="Vibes"
              value={
                vibes.length === 0
                  ? "Any mood"
                  : vibes.length === 1
                    ? vibes[0]
                    : `${vibes.length} selected`
              }
              active={showVibePicker}
              highlight={vibes.length > 0}
              onClick={() => {
                setShowVibePicker((v) => !v);
                setShowDatePicker(false);
                setShowBudgetPicker(false);
                setShowGuestsPicker(false);
              }}
            />
            {showVibePicker && (
              <div className="absolute top-full right-2 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-80">
                <VibePicker selected={vibes} onChange={setVibes} />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="p-2 flex items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              <FaSearch className="w-3.5 h-3.5" />
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 pb-3">
            <p className="text-sm font-medium text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
