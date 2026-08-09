// components/FilterSidebar.tsx
"use client";

import type { TripVibe, DestinationResult, SortKey } from "@/lib/types";
import { VIBES } from "@/lib/data/vibes";
import { Badge, IconButton } from "@/components/ui";
import { FaFilter, FaTimes } from "react-icons/fa";

export interface FilterState {
  vibes: TripVibe[];
  minRating: number;
  hasFlights: boolean;
  hasHotels: boolean;
  priceMin: number;
  priceMax: number;
  sort: SortKey;
}

interface FilterSidebarProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
  totalCount: number;
  bounds: { min: number; max: number };
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "value", label: "Best value" },
  { value: "price", label: "Lowest price" },
  { value: "rating", label: "Highest rated" },
  { value: "duration", label: "By duration" },
];

export function FilterSidebar({ state, onChange, resultCount, totalCount, bounds }: FilterSidebarProps) {
  const toggleVibe = (v: TripVibe) => {
    const next = state.vibes.includes(v) ? state.vibes.filter((x) => x !== v) : [...state.vibes, v];
    onChange({ ...state, vibes: next });
  };

  const clearAll = () => {
    onChange({
      vibes: [],
      minRating: 0,
      hasFlights: false,
      hasHotels: false,
      priceMin: bounds.min,
      priceMax: bounds.max,
      sort: "value",
    });
  };

  return (
    <aside className="glass-card rounded-3xl p-5 space-y-5 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 flex items-center gap-2">
          <FaFilter className="text-cyan-600" /> Filters
        </h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-slate-500 hover:text-cyan-700 font-medium"
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-800">{resultCount}</span> of {totalCount} destinations
      </p>

      {/* Sort */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sort by</p>
        <div className="grid grid-cols-2 gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...state, sort: opt.value })}
              className={[
                "text-xs font-semibold rounded-full px-3 py-1.5 transition-all border",
                state.sort === opt.value
                  ? "bg-cyan-600 text-white border-cyan-600 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:border-cyan-400",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe chips */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Vibes</p>
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map((vibe) => {
            const active = state.vibes.includes(vibe.id);
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => toggleVibe(vibe.id)}
                className={[
                  "text-[10px] uppercase tracking-[0.1em] font-semibold rounded-full px-2.5 py-1 border transition-all",
                  active
                    ? `bg-gradient-to-br ${vibe.gradient} text-white border-transparent`
                    : "bg-white text-slate-700 border-slate-200 hover:border-cyan-400",
                ].join(" ")}
                aria-pressed={active}
              >
                <span className="mr-1" aria-hidden>{vibe.emoji}</span>
                {vibe.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Min rating */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Min rating</p>
          <span className="text-xs text-slate-500 font-semibold">{state.minRating.toFixed(1)}★+</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={state.minRating}
          onChange={(e) => onChange({ ...state, minRating: Number(e.target.value) })}
          className="w-full accent-cyan-500"
        />
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Price</p>
          <span className="text-xs text-slate-500 font-semibold">
            ${state.priceMin.toLocaleString()} – ${state.priceMax.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={50}
            value={state.priceMin}
            onChange={(e) =>
              onChange({ ...state, priceMin: Math.min(Number(e.target.value), state.priceMax) })
            }
            className="w-full accent-cyan-500"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={50}
            value={state.priceMax}
            onChange={(e) =>
              onChange({ ...state, priceMax: Math.max(Number(e.target.value), state.priceMin) })
            }
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Availability</p>
        <Toggle
          label="Has flights"
          active={state.hasFlights}
          onChange={(v) => onChange({ ...state, hasFlights: v })}
        />
        <Toggle
          label="Has hotels"
          active={state.hasHotels}
          onChange={(v) => onChange({ ...state, hasHotels: v })}
        />
      </div>
    </aside>
  );
}

function Toggle({ label, active, onChange }: { label: string; active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className="flex items-center justify-between w-full text-sm text-slate-700 hover:text-cyan-700"
    >
      <span>{label}</span>
      <span
        className={[
          "h-5 w-9 rounded-full p-0.5 transition-colors",
          active ? "bg-cyan-500" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "block h-4 w-4 rounded-full bg-white shadow transition-transform",
            active ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

export default FilterSidebar;