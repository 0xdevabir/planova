// components/HeroSearchBar.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaDollarSign, FaUser } from "react-icons/fa";

interface HeroSearchBarProps {
  onSearch: (data: SearchData) => void;
  loading?: boolean;
}

interface SearchData {
  destination: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  travelers: number;
  currency: string;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  lat?: string; // present for OSM fallback
  lng?: string; // present for OSM fallback
}

export default function HeroSearchBar({ onSearch, loading }: HeroSearchBarProps) {
  const [destination, setDestination] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    placeId: string;
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [travelers, setTravelers] = useState(1);

  const dateRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete search
  useEffect(() => {
    const fetchPredictions = async () => {
      if (destination.length < 2) {
        setPredictions([]);
        setShowAutocomplete(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(destination)}`
        );
        const data = await response.json();
        setPredictions(data.predictions || []);
        setShowAutocomplete(true);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setPredictions([]);
      }
    };

    const timer = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(timer);
  }, [destination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setShowBudgetPicker(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuestsPicker(false);
      }
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaceSelect = async (placeId: string, description: string, lat?: string, lng?: string) => {
    try {
      if (lat && lng) {
        setSelectedLocation({
          placeId,
          name: description,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        });
        setDestination(description);
        setShowAutocomplete(false);
        return;
      }

      const response = await fetch(`/api/places/details?placeId=${placeId}`);
      const data = await response.json();
      if (data.latitude && data.longitude) {
        setSelectedLocation({ placeId, name: data.name, latitude: data.latitude, longitude: data.longitude });
        setDestination(description);
        setShowAutocomplete(false);
      }
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  const handleSubmit = async () => {
    let loc = selectedLocation;
    if (!loc) {
      try {
        const res = await fetch(`/api/geocode?query=${encodeURIComponent(destination)}`);
        const data = await res.json();
        if (res.ok && data.latitude && data.longitude) {
          loc = {
            placeId: "manual",
            name: data.name || destination,
            latitude: data.latitude,
            longitude: data.longitude,
          };
        }
      } catch {}
    }

    if (!loc) {
      alert("Couldn't locate that place. Please try a different name.");
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
      currency: "USD",
    });
  };

  const formatDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4">
      <div className="absolute -inset-4 bg-white/12 blur-3xl opacity-80 pointer-events-none" />
      <div className="relative rounded-full border border-white/25 bg-white/20 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
          {/* Location Input */}
          <div className="relative flex items-center gap-3 px-4 py-3 bg-white/70 rounded-full flex-1 min-w-0" ref={autocompleteRef}>
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
            <input
              type="text"
              placeholder="Where you want to go?"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSelectedLocation(null);
              }}
              className="bg-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base w-full focus:outline-none"
            />

            {/* Autocomplete Dropdown */}
            {showAutocomplete && predictions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    type="button"
                    onClick={() => handlePlaceSelect(prediction.place_id, prediction.description, prediction.lat, prediction.lng)}
                    className="w-full px-5 py-3 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400 shrink-0"
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
                    <span className="text-sm text-gray-700">{prediction.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowBudgetPicker(false);
                setShowGuestsPicker(false);
              }}
              aria-label={`Change dates (${formatDateRange()})`}
              className="h-12 w-12 sm:h-14 sm:w-14 inline-flex items-center justify-center rounded-full bg-white/30 border border-white/25 text-gray-700 hover:bg-white/50 hover:border-white/40 transition-colors"
            >
              <FaCalendarAlt className="w-5 h-5 shrink-0" />
            </button>

            {showDatePicker && (
              <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-72">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Picker */}
          <div className="relative" ref={budgetRef}>
            <button
              type="button"
              onClick={() => {
                setShowBudgetPicker(!showBudgetPicker);
                setShowDatePicker(false);
                setShowGuestsPicker(false);
              }}
              aria-label={`Adjust budget (${budgetMin.toLocaleString()} to ${budgetMax.toLocaleString()})`}
              className="h-12 w-12 sm:h-14 sm:w-14 inline-flex items-center justify-center rounded-full bg-white/30 border border-white/25 text-gray-700 hover:bg-white/50 hover:border-white/40 transition-colors"
            >
              <FaDollarSign className="w-5 h-5 shrink-0" />
            </button>

            {showBudgetPicker && (
              <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-80">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-600">Min Budget</label>
                      <span className="text-sm font-semibold text-gray-900">${budgetMin.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-600">Max Budget</label>
                      <span className="text-sm font-semibold text-gray-900">${budgetMax.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="100"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guests Picker */}
          <div className="relative" ref={guestsRef}>
            <button
              type="button"
              onClick={() => {
                setShowGuestsPicker(!showGuestsPicker);
                setShowDatePicker(false);
                setShowBudgetPicker(false);
              }}
              aria-label={`Guests (${travelers})`}
              className="h-12 w-12 sm:h-14 sm:w-14 inline-flex items-center justify-center rounded-full bg-white/30 border border-white/25 text-gray-700 hover:bg-white/50 hover:border-white/40 transition-colors"
            >
              <FaUser className="w-5 h-5 shrink-0" />
            </button>

            {showGuestsPicker && (
              <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-64">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Travelers</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-cyan-500 hover:text-cyan-500 transition-colors font-semibold"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travelers}</span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(20, travelers + 1))}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-cyan-500 hover:text-cyan-500 transition-colors font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-[#212a21] via-[#151c15] to-[#151d15]  text-white px-6 sm:px-7 py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-50 shadow-[0_6px_10px_rgb(21,29,21)] hover:shadow-[0_8px_16px_rgb(21,29,21)] whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
