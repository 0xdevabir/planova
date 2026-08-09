// components/ItineraryModal.tsx
"use client";

import type { DestinationResult } from "@/lib/types";
import { useEffect, useState } from "react";
import { FaTimes, FaCalendarDay } from "react-icons/fa";
import { generateItinerary } from "@/lib/services/itineraryService";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils/money";
import { formatLongDate } from "@/lib/utils/dates";
import { VIBE_BY_ID } from "@/lib/data/vibes";

interface ItineraryModalProps {
  destination: DestinationResult | null;
  startDate: string;
  endDate: string;
  currency: string;
  onClose: () => void;
}

const SLOT_LABEL = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function ItineraryModal({ destination, startDate, endDate, currency, onClose }: ItineraryModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (destination) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "";
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [destination, onClose]);

  if (!destination || !show) return null;

  const itinerary = generateItinerary(destination, startDate, endDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700 font-semibold">Day-by-day</p>
            <h2 className="text-2xl font-bold text-slate-900">
              {itinerary.totalDays}-day itinerary for {destination.name}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {itinerary.vibes.map((v) => {
                const cfg = VIBE_BY_ID[v];
                return (
                  <span
                    key={v}
                    className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-gradient-to-br ${cfg.gradient} text-white`}
                  >
                    {cfg.emoji} {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close itinerary"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-cyan-700 shadow">
                <FaCalendarDay />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estimated activities total</p>
                <p className="text-2xl font-bold gradient-text">
                  {formatCurrency(itinerary.estimatedTotalCost, currency)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-[180px] text-right">
              On top of flights & hotel. Per person approximations.
            </p>
          </div>

          <div className="space-y-5">
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-300 via-cyan-200 to-transparent" />
                <div className="absolute left-0 top-0 -translate-x-1/2 h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center shadow">
                  {day.dayNumber}
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{formatLongDate(day.date)}</p>
                  <h3 className="text-lg font-bold text-slate-900">{day.title}</h3>
                  <div className="mt-3 space-y-2">
                    {day.blocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3 hover-lift"
                      >
                        <div className="h-10 w-10 rounded-xl bg-slate-50 text-2xl flex items-center justify-center shrink-0">
                          <span aria-hidden>{block.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                              {SLOT_LABEL[block.slot]} · {block.category}
                            </p>
                            <p className="text-xs text-slate-700 font-semibold">{formatCurrencyCompact(block.estimatedCost, currency)}</p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{block.title}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Day total: <span className="font-semibold text-slate-800">{formatCurrency(day.estimatedDailyCost, currency)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryModal;