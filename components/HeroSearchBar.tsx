// components/HeroSearchBar.tsx

"use client";

import { useState, useRef, useEffect } from "react";

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
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Glow effect behind the search bar */}
      <div className="absolute -inset-2 bg-linear-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 blur-3xl rounded-full" />

      <div className="relative bg-white/95 backdrop-blur-lg rounded-full shadow-2xl shadow-cyan-500/25">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {/* Location Input */}
          <div className="relative flex items-center gap-3 px-6 py-4 sm:py-3.5 flex-1 min-w-0" ref={autocompleteRef}>
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
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
              className="bg-transparent text-gray-700 placeholder-gray-400 text-sm w-full focus:outline-none"
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
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
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
              className="w-full sm:w-auto flex items-center gap-2 px-6 py-4 sm:py-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Date</span>
                <span className="text-sm text-gray-700 font-medium truncate">{formatDateRange()}</span>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDatePicker && (
              <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-72">
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
              className="w-full sm:w-auto flex items-center gap-2 px-6 py-4 sm:py-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Budget</span>
                <span className="text-sm text-gray-700 font-medium truncate">
                  ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showBudgetPicker && (
              <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl p-5 z-50 w-80">
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
              className="w-full sm:w-auto flex items-center gap-2 px-6 py-4 sm:py-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Guests</span>
                <span className="text-sm text-gray-700 font-medium truncate">
                  {travelers} Guest{travelers > 1 ? "s" : ""}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
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
          <div className="p-2 sm:p-1.5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white pl-8 pr-8 sm:pl-6 sm:pr-6 py-3 sm:py-2.5 rounded-full font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 whitespace-nowrap"
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
