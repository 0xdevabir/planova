// components/VibePicker.tsx
"use client";

import { VIBES, VIBE_BY_ID } from "@/lib/data/vibes";
import type { TripVibe } from "@/lib/types";

interface VibePickerProps {
  selected: TripVibe[];
  onChange: (next: TripVibe[]) => void;
  max?: number;
}

export function VibePicker({ selected, onChange, max = 4 }: VibePickerProps) {
  const toggle = (id: TripVibe) => {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
      return;
    }
    if (selected.length >= max) {
      onChange([...selected.slice(1), id]);
      return;
    }
    onChange([...selected, id]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600">Trip vibes</p>
        <p className="text-xs text-slate-500">
          {selected.length === 0 ? "Pick any that match your mood" : `${selected.length} selected`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {VIBES.map((vibe) => {
          const isSelected = selected.includes(vibe.id);
          return (
            <button
              key={vibe.id}
              type="button"
              onClick={() => toggle(vibe.id)}
              aria-pressed={isSelected}
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-150",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                isSelected
                  ? `bg-gradient-to-br ${vibe.gradient} text-white border-transparent shadow-[0_8px_24px_rgba(0,0,0,0.18)]`
                  : "bg-white/70 text-slate-700 border-slate-200 hover:border-cyan-300 hover:text-cyan-700",
              ].join(" ")}
            >
              <span aria-hidden>{vibe.emoji}</span>
              <span>{vibe.label}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-slate-500 leading-relaxed">
          {selected.map((id) => VIBE_BY_ID[id].blurb).join(" · ")}
        </p>
      )}
    </div>
  );
}

export default VibePicker;