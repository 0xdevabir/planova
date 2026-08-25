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
        "w-full h-full flex items-center gap-2.5 px-3 py-3 sm:px-3.5 text-left transition-colors",
        highlight
          ? "bg-teal-700 text-white"
          : active
            ? "bg-stone-100 text-stone-900"
            : "bg-transparent text-stone-900 hover:bg-stone-50",
      ].join(" ")}
    >
      <span className={["shrink-0", highlight ? "text-white/90" : "text-teal-800"].join(" ")}>
        {icon}
      </span>
      <span className="flex flex-col min-w-0 flex-1">
        <span
          className={[
            "text-[10px] uppercase tracking-[0.14em] font-semibold",
            highlight ? "text-white/70" : "text-stone-500",
          ].join(" ")}
        >
          {label}
        </span>
        <span className="text-sm font-semibold truncate leading-snug">{value}</span>
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

  const openOnly = (panel: "date" | "budget" | "guests" | "vibe") => {
    setShowDatePicker(panel === "date");
    setShowBudgetPicker(panel === "budget");
    setShowGuestsPicker(panel === "guests");
    setShowVibePicker(panel === "vibe");
    setShowAutocomplete(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto sm:max-w-4xl px-0 sm:px-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white shadow-[0_24px_60px_rgba(28,25,23,0.18)] overflow-visible"
      >
        {/* Location — full width top */}
        <div ref={autocompleteRef} className="relative border-b border-stone-100">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
            <svg
              className="w-5 h-5 text-teal-800 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
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
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <label
                htmlFor="hero-location"
                className="text-[10px] uppercase tracking-[0.14em] font-semibold text-stone-500"
              >
                From / explore near
              </label>
              <input
                id="hero-location"
                type="text"
                placeholder="City, region, or country"
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
                className="bg-transparent text-stone-900 placeholder-stone-400 text-base sm:text-sm w-full focus:outline-none font-semibold"
              />
            </div>
            {selectedLocation && (
              <span className="hidden xs:inline sm:inline shrink-0 text-[10px] font-semibold uppercase tracking-wide text-teal-800 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5">
                Ready
              </span>
            )}
          </div>

          {showAutocomplete && (
            <div
              role="listbox"
              className="absolute left-2 right-2 sm:left-3 sm:right-3 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 max-h-72 overflow-y-auto z-50 text-left"
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

        {/* Filters — 2×2 on mobile, 4-col on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-stone-100">
          <div className="relative min-w-0" ref={dateRef}>
            <FieldButton
              icon={<FaCalendarAlt className="w-3.5 h-3.5" />}
              label="Dates"
              value={`${fmtDate(startDate)} – ${fmtDate(endDate)}`}
              active={showDatePicker}
              onClick={() => (showDatePicker ? closeAll() : openOnly("date"))}
            />
            {showDatePicker && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-full sm:w-72 text-left">
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

          <div className="relative min-w-0" ref={budgetRef}>
            <FieldButton
              icon={<FaDollarSign className="w-3.5 h-3.5" />}
              label={`Budget (${currency})`}
              value={`${fmtMoney(budgetMin, currency)} – ${fmtMoney(budgetMax, currency)}`}
              active={showBudgetPicker}
              onClick={() => (showBudgetPicker ? closeAll() : openOnly("budget"))}
            />
            {showBudgetPicker && (
              <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-full sm:w-80 text-left">
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

          <div className="relative min-w-0" ref={guestsRef}>
            <FieldButton
              icon={<FaUser className="w-3.5 h-3.5" />}
              label="Travelers"
              value={`${travelers} ${travelers === 1 ? "person" : "people"}`}
              active={showGuestsPicker}
              onClick={() => (showGuestsPicker ? closeAll() : openOnly("guests"))}
            />
            {showGuestsPicker && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-full sm:w-56 text-left">
                <div className="flex items-center justify-between gap-3">
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

          <div className="relative min-w-0" ref={vibeRef}>
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
              onClick={() => (showVibePicker ? closeAll() : openOnly("vibe"))}
            />
            {showVibePicker && (
              <div className="absolute top-full left-0 right-0 md:left-auto md:right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-full md:w-80 text-left">
                <VibePicker selected={vibes} onChange={setVibes} />
              </div>
            )}
          </div>
        </div>

        {/* Search CTA — full width */}
        <div className="p-3 sm:p-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-colors disabled:opacity-60"
          >
            <FaSearch className="w-4 h-4" />
            {loading ? "Searching…" : "Search trips"}
          </button>
        </div>

        {error && (
          <div className="px-4 pb-4">
            <p className="text-sm font-medium text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-left">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
