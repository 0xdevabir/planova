// components/ComparisonModal.tsx
"use client";

import type { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { formatCurrency } from "@/lib/utils/money";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ComparisonModalProps {
  open: boolean;
  destinations: DestinationResult[];
  onClose: () => void;
  currency: string;
}

export function ComparisonModal({ open, destinations, onClose, currency }: ComparisonModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || destinations.length === 0) return null;

  const rows: { label: string; render: (d: DestinationResult) => React.ReactNode }[] = [
    {
      label: "Value score",
      render: (d) => (
        <span className="font-bold gradient-text text-2xl">{Math.round(d.valueScore)}/100</span>
      ),
    },
    {
      label: "Total cost",
      render: (d) => (
        <span className="font-bold text-slate-900">{formatCurrency(d.totalEstimatedCost, currency)}</span>
      ),
    },
    {
      label: "Per day",
      render: (d) => formatCurrency(Math.round(d.totalEstimatedCost / Math.max(1, d.durationDays)), currency),
    },
    {
      label: "Flights",
      render: (d) => formatCurrency(d.costBreakdown.flights, currency),
    },
    {
      label: "Accommodation",
      render: (d) => formatCurrency(d.costBreakdown.accommodation, currency),
    },
    {
      label: "Food & activities",
      render: (d) => formatCurrency(d.costBreakdown.food + d.costBreakdown.activities, currency),
    },
    {
      label: "Rating",
      render: (d) =>
        d.rating ? <span className="font-semibold text-amber-600">{d.rating.toFixed(1)}★</span> : <span className="text-slate-400">—</span>,
    },
    {
      label: "Safety",
      render: (d) =>
        d.safetyRating ? <span className="font-semibold text-emerald-700">{d.safetyRating.toFixed(1)}/10</span> : <span className="text-slate-400">—</span>,
    },
    {
      label: "Weather",
      render: (d) =>
        d.weather ? (
          <span className="flex items-center gap-1">
            <span aria-hidden>{d.weather.emoji || "☁️"}</span>
            <span className="font-medium text-slate-700">{d.weather.condition}</span>
            <span className="text-slate-400 ml-1">{d.weather.temperature}°C</span>
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      label: "Vibes",
      render: (d) => (
        <div className="flex flex-wrap gap-1">
          {(d.vibes || []).map((v) => {
            const cfg = VIBE_BY_ID[v];
            if (!cfg) return null;
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
      ),
    },
    {
      label: "Flight status",
      render: (d) => (
        <span
          className={[
            "text-xs font-semibold rounded-full px-2 py-0.5",
            d.flightAvailability === "Available"
              ? "bg-emerald-50 text-emerald-700"
              : d.flightAvailability === "Limited"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          {d.flightAvailability}
        </span>
      ),
    },
    {
      label: "Hotels",
      render: (d) => (
        <span
          className={[
            "text-xs font-semibold rounded-full px-2 py-0.5",
            d.hotelAvailability === "Available"
              ? "bg-emerald-50 text-emerald-700"
              : d.hotelAvailability === "Limited"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          {d.hotelAvailability}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="compare-title" className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700 font-semibold">Side-by-side</p>
            <h2 id="compare-title" className="text-2xl font-bold text-slate-900">Compare {destinations.length} destinations</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold w-48">
                  Detail
                </th>
                {destinations.map((d) => {
                  const vibe = d.vibes?.[0] ? VIBE_BY_ID[d.vibes[0]] : null;
                  return (
                    <th key={d.placeId} className="text-left p-4 min-w-[180px] align-top">
                      <div className={`bg-gradient-to-br ${vibe?.gradient ?? "from-cyan-500 to-blue-500"} rounded-2xl p-4 text-white`}>
                        <div className="text-2xl mb-1" aria-hidden>{vibe?.emoji ?? "📍"}</div>
                        <div className="font-bold text-lg leading-tight">{d.name}</div>
                        <div className="text-xs text-white/80 truncate">{d.address}</div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-4 text-xs uppercase tracking-wider text-slate-500 font-semibold align-top">
                    {row.label}
                  </td>
                  {destinations.map((d) => (
                    <td key={d.placeId} className="p-4 text-sm text-slate-800 align-top">
                      {row.render(d)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComparisonModal;