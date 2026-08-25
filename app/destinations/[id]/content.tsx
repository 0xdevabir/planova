"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { loadDestination, storeDestination } from "@/lib/utils/destinationCache";
import { findById } from "@/lib/data/destinations";
import type { DestinationResult } from "@/lib/types";
import ResultsMap from "@/components/ResultsMap";
import { formatCurrency } from "@/lib/utils/money";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

type TabId = "overview" | "plan" | "stay" | "eat";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "plan", label: "Plan" },
  { id: "stay", label: "Stay" },
  { id: "eat", label: "Eat" },
];

function catalogFallback(placeId: string): DestinationResult | null {
  const cat = findById(placeId);
  if (!cat) return null;
  return {
    placeId: cat.placeId,
    name: cat.name,
    latitude: cat.latitude,
    longitude: cat.longitude,
    address: `${cat.name}, ${cat.country}`,
    description: cat.summary || cat.description,
    rating: cat.rating,
    reviews: cat.reviews,
    vibes: cat.vibes,
    estimatedFlightCost: 0,
    estimatedHotelCost: 0,
    estimatedDailyCost: 0,
    totalEstimatedCost: 0,
    flightAvailability: "Limited",
    hotelAvailability: "Limited",
    valueScore: 70,
    durationDays: 1,
    costBreakdown: { flights: 0, accommodation: 0, food: 0, activities: 0 },
  };
}

export default function DestinationDetailContent({ placeId }: { placeId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState<DestinationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("overview");

  const tripContext = useMemo(
    () => ({
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      travelers: searchParams.get("travelers") || "1",
      currency: searchParams.get("currency") || "USD",
      origin: searchParams.get("origin") || "",
      budgetMin: searchParams.get("budgetMin") || "",
      budgetMax: searchParams.get("budgetMax") || "",
    }),
    [searchParams],
  );

  useEffect(() => {
    const cached = loadDestination(placeId);
    if (cached) {
      setDestination(cached);
      setLoading(false);
      return;
    }
    const fallback = catalogFallback(placeId);
    setDestination(fallback);
    if (fallback) storeDestination(fallback);
    setLoading(false);
  }, [placeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060a]">
        <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#05060a] text-slate-100">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 pt-28 text-center space-y-4">
          <h1 className="text-2xl font-semibold">Destination not found</h1>
          <p className="text-slate-400">
            We couldn&apos;t load this place. Head back to recommendations and try again.
          </p>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
          >
            <FaArrowLeft className="text-xs" /> Back to results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-100">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/heroBg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#05060a]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#05060a]" />
      </div>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
          <span aria-hidden>/</span>
          <span className="text-slate-200">{destination.name}</span>
        </div>

        <header className="frosted-surface rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                {destination.name}
              </h1>
              {destination.address && (
                <p className="mt-2 flex items-center gap-2 text-slate-300">
                  <FaMapMarkerAlt className="text-cyan-400 text-sm" />
                  {destination.address}
                </p>
              )}
              {destination.description && (
                <p className="mt-3 text-slate-300 max-w-2xl leading-relaxed">
                  {destination.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400">Value score</div>
              <div className="text-3xl font-semibold text-cyan-300">{destination.valueScore}</div>
            </div>
          </div>

          {destination.vibes && destination.vibes.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {destination.vibes.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/15 text-slate-200 capitalize"
                >
                  {v}
                </span>
              ))}
            </div>
          )}

          {(tripContext.startDate || tripContext.origin) && (
            <p className="text-xs text-slate-400 pt-2">
              {tripContext.origin ? `From ${tripContext.origin}` : "Trip"}
              {tripContext.startDate && tripContext.endDate
                ? ` · ${tripContext.startDate} → ${tripContext.endDate}`
                : ""}
              {tripContext.travelers ? ` · ${tripContext.travelers} traveler(s)` : ""}
            </p>
          )}
        </header>

        <nav
          className="flex gap-1 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto"
          aria-label="Destination sections"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`flex-1 min-w-[4.5rem] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <section className="frosted-surface rounded-2xl p-6 sm:p-8 min-h-[280px]">
          {tab === "overview" && (
            <div className="space-y-8 text-slate-300">
              <div>
                <h2 className="text-lg font-semibold text-white">Trip overview</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Estimated costs, conditions, and location for this stay.
                </p>
              </div>

              <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <dt className="text-xs text-slate-400 uppercase tracking-wide">Est. total</dt>
                  <dd className="text-xl font-semibold text-white mt-1">
                    {destination.totalEstimatedCost > 0
                      ? formatCurrency(destination.totalEstimatedCost, tripContext.currency)
                      : "—"}
                  </dd>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <dt className="text-xs text-slate-400 uppercase tracking-wide">Duration</dt>
                  <dd className="text-xl font-semibold text-white mt-1">
                    {destination.durationDays} day{destination.durationDays === 1 ? "" : "s"}
                  </dd>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <dt className="text-xs text-slate-400 uppercase tracking-wide">Travelers</dt>
                  <dd className="text-xl font-semibold text-white mt-1">{tripContext.travelers}</dd>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <dt className="text-xs text-slate-400 uppercase tracking-wide">Rating</dt>
                  <dd className="text-xl font-semibold text-white mt-1">
                    {destination.rating ? `${destination.rating.toFixed(1)} / 5` : "—"}
                  </dd>
                </div>
              </dl>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Cost breakdown</h3>
                <ul className="space-y-2">
                  {[
                    ["Flights", destination.costBreakdown.flights],
                    ["Stay", destination.costBreakdown.accommodation],
                    ["Food", destination.costBreakdown.food],
                    ["Activities", destination.costBreakdown.activities],
                  ].map(([label, amount]) => (
                    <li
                      key={label as string}
                      className="flex items-center justify-between rounded-lg bg-black/25 border border-white/10 px-4 py-2.5 text-sm"
                    >
                      <span className="text-slate-400">{label as string}</span>
                      <span className="font-medium text-slate-100">
                        {formatCurrency(amount as number, tripContext.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {destination.weather && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Weather {destination.weather.emoji || ""}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                      <div className="text-slate-400 text-xs">Condition</div>
                      <div className="mt-1 text-white">{destination.weather.condition}</div>
                    </div>
                    <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                      <div className="text-slate-400 text-xs">Temperature</div>
                      <div className="mt-1 text-white">{destination.weather.temperature}°C</div>
                    </div>
                    <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                      <div className="text-slate-400 text-xs">Humidity</div>
                      <div className="mt-1 text-white">{destination.weather.humidity}%</div>
                    </div>
                    <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                      <div className="text-slate-400 text-xs">Travel score</div>
                      <div className="mt-1 text-white">
                        {typeof destination.weather.travelScore === "number"
                          ? `${destination.weather.travelScore}/100`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {typeof destination.safetyRating === "number" && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Safety</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                        style={{ width: `${(destination.safetyRating / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {destination.safetyRating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Map</h3>
                <div className="rounded-2xl overflow-hidden border border-white/10 h-72">
                  <ResultsMap destinations={[destination]} currency={tripContext.currency} />
                </div>
              </div>
            </div>
          )}
          {tab === "plan" && (
            <div className="text-slate-400 text-sm">
              Day-by-day plan with real places is coming next. Open the quick itinerary from results
              for a preview.
            </div>
          )}
          {tab === "stay" && (
            <div className="text-slate-400 text-sm">
              Real hotel listings from OpenStreetMap will appear here.
            </div>
          )}
          {tab === "eat" && (
            <div className="text-slate-400 text-sm">
              Local restaurants and cafés from OpenStreetMap will appear here.
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/?from=${encodeURIComponent(destination.name)}&lat=${destination.latitude}&lng=${destination.longitude}&placeId=${encodeURIComponent(destination.placeId)}`}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 text-sm font-medium"
          >
            Plan from here
          </Link>
        </div>
      </main>
    </div>
  );
}
