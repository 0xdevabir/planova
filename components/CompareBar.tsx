// components/CompareBar.tsx
"use client";

import type { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { formatCurrency } from "@/lib/utils/money";

interface CompareBarProps {
  selected: DestinationResult[];
  onRemove: (placeId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function CompareBar({ selected, onRemove, onCompare, onClear }: CompareBarProps) {
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-[calc(100%-2rem)]">
      <div className="glass-card rounded-3xl shadow-2xl border border-cyan-200/60 p-3 flex items-center gap-3">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
          <span aria-hidden>🆚</span> Compare
        </div>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selected.map((d) => {
            const vibe = d.vibes?.[0] ? VIBE_BY_ID[d.vibes[0]] : null;
            return (
              <div
                key={d.placeId}
                className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full pl-1 pr-2 py-1 shrink-0"
              >
                <div
                  className={`h-7 w-7 rounded-full bg-gradient-to-br ${vibe?.gradient ?? "from-cyan-500 to-blue-500"} flex items-center justify-center text-white text-xs font-bold`}
                  aria-hidden
                >
                  {vibe?.emoji ?? "📍"}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{d.name}</span>
                  <span className="text-[10px] text-slate-500">{formatCurrency(d.totalEstimatedCost)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(d.placeId)}
                  aria-label={`Remove ${d.name}`}
                  className="text-slate-400 hover:text-rose-500 text-xs"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={selected.length < 2}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare {selected.length}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompareBar;