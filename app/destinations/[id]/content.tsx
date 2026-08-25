"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { loadDestination, storeDestination } from "@/lib/utils/destinationCache";
import { findById } from "@/lib/data/destinations";
import type { DestinationResult, OsmPoi, Itinerary } from "@/lib/types";
import ResultsMap from "@/components/ResultsMap";
import PoiList from "@/components/PoiList";
import { formatCurrency } from "@/lib/utils/money";
import { generateItineraryFromPois } from "@/lib/services/itineraryService";
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
  const [hotels, setHotels] = useState<OsmPoi[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsLoaded, setHotelsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState<OsmPoi[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [plan, setPlan] = useState<Itinerary | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);

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

  // Fetch hotels when Stay tab opens (lazy)
  useEffect(() => {
    if (tab !== "stay" || !destination || hotelsLoaded) return;
    let cancelled = false;
    (async () => {
      setHotelsLoading(true);
      try {
        const res = await fetch(
          `/api/places/hotels?lat=${destination.latitude}&lng=${destination.longitude}&limit=20`,
        );
        const data = await res.json();
        if (!cancelled) {
          setHotels(Array.isArray(data.hotels) ? data.hotels : []);
          setHotelsLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setHotels([]);
          setHotelsLoaded(true);
        }
      } finally {
        if (!cancelled) setHotelsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, destination, hotelsLoaded]);

  // Fetch restaurants when Eat tab opens (lazy)
  useEffect(() => {
    if (tab !== "eat" || !destination || restaurantsLoaded) return;
    let cancelled = false;
    (async () => {
      setRestaurantsLoading(true);
      try {
        const res = await fetch(
          `/api/places/restaurants?lat=${destination.latitude}&lng=${destination.longitude}&limit=24`,
        );
        const data = await res.json();
        if (!cancelled) {
          setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : []);
          setRestaurantsLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setRestaurants([]);
          setRestaurantsLoaded(true);
        }
      } finally {
        if (!cancelled) setRestaurantsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, destination, restaurantsLoaded]);

  // Fetch plan when Plan tab opens (lazy)
  useEffect(() => {
    if (tab !== "plan" || !destination || planLoaded) return;
    let cancelled = false;
    (async () => {
      setPlanLoading(true);
      try {
        const start =
          tripContext.startDate || new Date().toISOString().split("T")[0];
        const end =
          tripContext.endDate ||
          new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
        const [attrRes, foodRes] = await Promise.all([
          fetch(
            `/api/places/attractions?lat=${destination.latitude}&lng=${destination.longitude}&limit=24`,
          ),
          fetch(
            `/api/places/restaurants?lat=${destination.latitude}&lng=${destination.longitude}&limit=18`,
          ),
        ]);
        const attrData = await attrRes.json();
        const foodData = await foodRes.json();
        const itinerary = generateItineraryFromPois(
          destination,
          start,
          end,
          Array.isArray(attrData.attractions) ? attrData.attractions : [],
          Array.isArray(foodData.restaurants) ? foodData.restaurants : [],
        );
        if (!cancelled) {
          setPlan(itinerary);
          setPlanLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setPlan(null);
          setPlanLoaded(true);
        }
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, destination, planLoaded, tripContext.startDate, tripContext.endDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="w-10 h-10 border-2 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] text-stone-900">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 pt-28 text-center space-y-4">
          <h1 className="text-2xl font-semibold">Destination not found</h1>
          <p className="text-stone-500">
            We couldn&apos;t load this place. Head back to recommendations and try again.
          </p>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-700"
          >
            <FaArrowLeft className="text-xs" /> Back to results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 hover:text-teal-800 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
          <span aria-hidden>/</span>
          <span className="text-stone-800">{destination.name}</span>
        </div>

        <header className="frosted-surface rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {destination.name}
              </h1>
              {destination.address && (
                <p className="mt-2 flex items-center gap-2 text-stone-600">
                  <FaMapMarkerAlt className="text-teal-700 text-sm" />
                  {destination.address}
                </p>
              )}
              {destination.description && (
                <p className="mt-3 text-stone-600 max-w-2xl leading-relaxed">
                  {destination.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-stone-500">Value score</div>
              <div className="text-3xl font-semibold text-teal-800">{destination.valueScore}</div>
            </div>
          </div>

          {destination.vibes && destination.vibes.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {destination.vibes.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-full text-xs bg-stone-100 border border-stone-200 text-stone-700 capitalize"
                >
                  {v}
                </span>
              ))}
            </div>
          )}

          {(tripContext.startDate || tripContext.origin) && (
            <p className="text-xs text-stone-500 pt-2">
              {tripContext.origin ? `From ${tripContext.origin}` : "Trip"}
              {tripContext.startDate && tripContext.endDate
                ? ` · ${tripContext.startDate} → ${tripContext.endDate}`
                : ""}
              {tripContext.travelers ? ` · ${tripContext.travelers} traveler(s)` : ""}
            </p>
          )}
        </header>

        <nav
          className="flex gap-1 p-1 rounded-xl bg-white border border-stone-200 overflow-x-auto"
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
                  ? "bg-teal-700 text-white"
                  : "text-stone-500 hover:text-stone-800 border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <section className="frosted-surface rounded-2xl p-6 sm:p-8 min-h-[280px]">
          {tab === "overview" && (
            <div className="space-y-8 text-stone-700">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Trip overview</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Estimated costs, conditions, and location for this stay.
                </p>
              </div>

              <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <dt className="text-xs text-stone-500 uppercase tracking-wide">Est. total</dt>
                  <dd className="text-xl font-semibold text-stone-900 mt-1">
                    {destination.totalEstimatedCost > 0
                      ? formatCurrency(destination.totalEstimatedCost, tripContext.currency)
                      : "—"}
                  </dd>
                </div>
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <dt className="text-xs text-stone-500 uppercase tracking-wide">Duration</dt>
                  <dd className="text-xl font-semibold text-stone-900 mt-1">
                    {destination.durationDays} day{destination.durationDays === 1 ? "" : "s"}
                  </dd>
                </div>
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <dt className="text-xs text-stone-500 uppercase tracking-wide">Travelers</dt>
                  <dd className="text-xl font-semibold text-stone-900 mt-1">{tripContext.travelers}</dd>
                </div>
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <dt className="text-xs text-stone-500 uppercase tracking-wide">Rating</dt>
                  <dd className="text-xl font-semibold text-stone-900 mt-1">
                    {destination.rating ? `${destination.rating.toFixed(1)} / 5` : "—"}
                  </dd>
                </div>
              </dl>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Cost breakdown</h3>
                <ul className="space-y-2">
                  {[
                    ["Flights", destination.costBreakdown.flights],
                    ["Stay", destination.costBreakdown.accommodation],
                    ["Food", destination.costBreakdown.food],
                    ["Activities", destination.costBreakdown.activities],
                  ].map(([label, amount]) => (
                    <li
                      key={label as string}
                      className="flex items-center justify-between rounded-lg bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm"
                    >
                      <span className="text-stone-500">{label as string}</span>
                      <span className="font-medium text-stone-900">
                        {formatCurrency(amount as number, tripContext.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {destination.weather && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-3">
                    Weather {destination.weather.emoji || ""}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                      <div className="text-stone-500 text-xs">Condition</div>
                      <div className="mt-1 text-stone-900">{destination.weather.condition}</div>
                    </div>
                    <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                      <div className="text-stone-500 text-xs">Temperature</div>
                      <div className="mt-1 text-stone-900">{destination.weather.temperature}°C</div>
                    </div>
                    <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                      <div className="text-stone-500 text-xs">Humidity</div>
                      <div className="mt-1 text-stone-900">{destination.weather.humidity}%</div>
                    </div>
                    <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                      <div className="text-stone-500 text-xs">Travel score</div>
                      <div className="mt-1 text-stone-900">
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
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">Safety</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-full"
                        style={{ width: `${(destination.safetyRating / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-stone-900">
                      {destination.safetyRating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Map</h3>
                <div className="rounded-2xl overflow-hidden border border-stone-200 h-72">
                  <ResultsMap destinations={[destination]} currency={tripContext.currency} />
                </div>
              </div>
            </div>
          )}
          {tab === "plan" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Your day-by-day plan</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Built from nearby OpenStreetMap attractions and restaurants, with vibe templates as fallback.
                </p>
              </div>

              {planLoading && (
                <div className="space-y-3" aria-busy="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-white/5 border border-stone-200 animate-pulse" />
                  ))}
                </div>
              )}

              {!planLoading && !plan && (
                <div className="text-sm text-stone-500">Could not build a plan for these dates.</div>
              )}

              {!planLoading && plan && (
                <div className="space-y-5">
                  <div className="text-sm text-stone-500">
                    {plan.totalDays} days · est. activities{" "}
                    {formatCurrency(plan.estimatedTotalCost, tripContext.currency)}
                  </div>
                  {plan.days.map((day) => (
                    <article
                      key={day.dayNumber}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3"
                    >
                      <header className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-teal-700/80">
                            Day {day.dayNumber}
                          </div>
                          <h3 className="text-stone-900 font-medium">{day.title}</h3>
                        </div>
                        <div className="text-sm text-stone-500">
                          {formatCurrency(day.estimatedDailyCost, tripContext.currency)}
                        </div>
                      </header>
                      <ul className="space-y-2">
                        {day.blocks.map((block) => (
                          <li
                            key={`${day.dayNumber}-${block.slot}`}
                            className="flex gap-3 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2.5"
                          >
                            <span className="text-lg leading-none pt-0.5" aria-hidden>
                              {block.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-stone-900 capitalize">
                                  {block.slot} · {block.title}
                                </span>
                                <span className="text-xs text-stone-500 shrink-0">
                                  {formatCurrency(block.estimatedCost, tripContext.currency)}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">{block.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "stay" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Where to stay</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Real lodgings nearby from OpenStreetMap. Links are free now; commission-ready later.
                </p>
              </div>

              {destination.hotelEstimate?.sampleHotels && destination.hotelEstimate.sampleHotels.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-3">Budget guidance</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {destination.hotelEstimate.sampleHotels.map((h) => (
                      <div
                        key={h.tier}
                        className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-1"
                      >
                        <div className="text-xs uppercase tracking-wide text-teal-700/80">{h.tier}</div>
                        <div className="text-stone-900 font-medium text-sm truncate">{h.name}</div>
                        <div className="text-stone-700 text-sm">
                          {formatCurrency(h.pricePerNight, tripContext.currency)}
                          <span className="text-stone-500"> / night</span>
                        </div>
                        <div className="text-xs text-stone-500">{h.rating.toFixed(1)}★ · estimate</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Nearby hotels</h3>
                <PoiList
                  items={hotels}
                  loading={hotelsLoading}
                  kindLabel="hotels"
                  emptyMessage="No hotels found nearby in OpenStreetMap yet. Try another city or check back later."
                />
              </div>
            </div>
          )}
          {tab === "eat" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Where to eat</h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Restaurants and cafés nearby from OpenStreetMap.
                  </p>
                </div>
                <label className="text-sm text-stone-500">
                  <span className="sr-only">Filter by cuisine</span>
                  <select
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                    className="mt-1 block rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-sm px-3 py-2"
                  >
                    <option value="">All cuisines</option>
                    {Array.from(
                      new Set(
                        restaurants
                          .flatMap((r) => (r.cuisine || "").split(",").map((c) => c.trim().toLowerCase()))
                          .filter(Boolean),
                      ),
                    )
                      .sort()
                      .slice(0, 20)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <PoiList
                items={
                  cuisineFilter
                    ? restaurants.filter((r) =>
                        (r.cuisine || "").toLowerCase().includes(cuisineFilter),
                      )
                    : restaurants
                }
                loading={restaurantsLoading}
                kindLabel="restaurants"
                emptyMessage="No restaurants found nearby in OpenStreetMap yet."
              />
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/?from=${encodeURIComponent(destination.name)}&lat=${destination.latitude}&lng=${destination.longitude}&placeId=${encodeURIComponent(destination.placeId)}`}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-white/5 text-sm font-medium"
          >
            Plan from here
          </Link>
        </div>
      </main>
    </div>
  );
}
