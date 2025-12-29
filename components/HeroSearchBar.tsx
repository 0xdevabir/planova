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

export default function HeroSearchBar({ onSearch, loading }: HeroSearchBarProps) {
  const [destination, setDestination] = useState("");
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    onSearch({
      destination,
      latitude: 40.7128,
      longitude: -74.006,
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
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-0">
      {/* Glow effect behind the search bar */}
      <div className="absolute inset-0 bg-cyan-400/15 blur-2xl rounded-3xl md:rounded-full scale-105" />

      <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-white/95 backdrop-blur-sm rounded-3xl md:rounded-full shadow-2xl shadow-black/20 gap-3 md:gap-0 px-3 md:px-2 py-3 md:py-2 border border-white/70">
        {/* Location Input */}
        <div className="flex flex-1 md:flex-none items-center gap-2 px-4 py-2 border border-gray-200 md:border-r md:border-l-0 md:border-y-0 rounded-2xl md:rounded-none md:rounded-l-full w-full">
          <svg
            className="w-5 h-5 text-gray-400"
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
            onChange={(e) => setDestination(e.target.value)}
            className="bg-transparent text-gray-700 placeholder-gray-400 text-sm w-full md:w-44 focus:outline-none"
          />
        </div>

        {/* Date Picker */}
        <div className="relative w-full md:w-auto" ref={dateRef}>
          <button
            type="button"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowBudgetPicker(false);
              setShowGuestsPicker(false);
            }}
            className="w-full md:w-auto flex items-center gap-2 px-4 py-2 border border-gray-200 md:border-r md:border-l-0 md:border-y-0 hover:bg-gray-50 rounded-2xl md:rounded-none transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
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
            <span className="text-sm text-gray-700">{formatDateRange()}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-4 z-50 min-w-70">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Picker */}
        <div className="relative w-full md:w-auto" ref={budgetRef}>
          <button
            type="button"
            onClick={() => {
              setShowBudgetPicker(!showBudgetPicker);
              setShowDatePicker(false);
              setShowGuestsPicker(false);
            }}
            className="w-full md:w-auto flex items-center gap-2 px-4 py-2 border border-gray-200 md:border-r md:border-l-0 md:border-y-0 hover:bg-gray-50 rounded-2xl md:rounded-none transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
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
            <span className="text-sm text-gray-700">
              ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showBudgetPicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-4 z-50 min-w-70">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Budget</label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-sm text-gray-700 mt-1">${budgetMin.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Budget</label>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="100"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-sm text-gray-700 mt-1">${budgetMax.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Guests Picker */}
        <div className="relative w-full md:w-auto" ref={guestsRef}>
          <button
            type="button"
            onClick={() => {
              setShowGuestsPicker(!showGuestsPicker);
              setShowDatePicker(false);
              setShowBudgetPicker(false);
            }}
            className="w-full md:w-auto flex items-center gap-2 px-4 py-2 hover:bg-gray-50 border border-gray-200 md:border-0 rounded-2xl md:rounded-none transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
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
            <span className="text-sm text-gray-700">
              {travelers} Guest{travelers > 1 ? "s" : ""}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuestsPicker && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-4 z-50 min-w-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Travelers</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{travelers}</span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 md:px-6 py-3 rounded-2xl md:rounded-full font-medium md:ml-2 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50"
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
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
