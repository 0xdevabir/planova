"use client";

import { useEffect, useMemo, useState, CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import ResultsMap from "@/components/ResultsMap";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import CompareBar from "@/components/CompareBar";
import ComparisonModal from "@/components/ComparisonModal";
import ItineraryModal from "@/components/ItineraryModal";
import { Card, EmptyState, Skeleton, SkeletonStack, StatTile } from "@/components/ui";
import { SearchResponse, DestinationResult } from "@/lib/types";
import { applyFilters, sortResults, priceBounds } from "@/lib/utils/filters";
import { formatCurrency } from "@/lib/utils/money";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

const DEFAULT_FILTERS: FilterState = {
  vibes: [],
  minRating: 0,
  hasFlights: false,
  hasHotels: false,
  priceMin: 0,
  priceMax: 0,
  sort: "value",
};

export default function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [itineraryTarget, setItineraryTarget] = useState<DestinationResult | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const vibesParam = searchParams.get("vibes") || "";
        const formData = {
          destination: searchParams.get("destination"),
          latitude: parseFloat(searchParams.get("latitude") || "0"),
          longitude: parseFloat(searchParams.get("longitude") || "0"),
          startDate: searchParams.get("startDate"),
          endDate: searchParams.get("endDate"),
          budgetMin: parseFloat(searchParams.get("budgetMin") || "0"),
          budgetMax: parseFloat(searchParams.get("budgetMax") || "0"),
          travelers: parseInt(searchParams.get("travelers") || "1"),
          currency: searchParams.get("currency") || "USD",
          vibes: vibesParam ? vibesParam.split(",").filter(Boolean) : [],
        };

        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          // Initialize priceMin/Max to bounds of the result set
          if (results.results && results.results.length > 0) {
            const bounds = priceBounds(results.results);
            setFilters((prev) => ({
              ...prev,
              priceMin: bounds.min,
              priceMax: bounds.max,
            }));
          }
        } else {
          setSearchResults({
            query: {
              destination: formData.destination || "Unknown",
              latitude: formData.latitude,
              longitude: formData.longitude,
              radius: 25,
              budgetMin: formData.budgetMin,
              budgetMax: formData.budgetMax,
              currency: formData.currency,
              startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
              endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
              travelers: formData.travelers,
              tripType: "leisure",
            },
            results: [],
            totalCount: 0,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get("destination")) {
      fetchResults();
    }
  }, [searchParams]);

  const currency = searchResults?.query.currency || "USD";
  const hasResults = !!(searchResults && searchResults.results.length > 0);

  const bounds = useMemo(() => (hasResults ? priceBounds(searchResults!.results) : { min: 0, max: 10000 }), [hasResults, searchResults]);

  // Ensure filters use real bounds
  useEffect(() => {
    if (!hasResults) return;
    setFilters((prev) => {
      if (prev.priceMin === 0 && prev.priceMax === 0) {
        return { ...prev, priceMin: bounds.min, priceMax: bounds.max };
      }
      return prev;
    });
  }, [bounds, hasResults]);

  const filteredResults = useMemo(() => {
    if (!hasResults) return [];
    return sortResults(applyFilters(searchResults!.results, filters), filters.sort);
  }, [hasResults, searchResults, filters]);

  const stats = useMemo(() => {
    if (!hasResults || filteredResults.length === 0) return null;
    const totals = filteredResults.map((d) => d.totalEstimatedCost);
    const averageCost = Math.round(totals.reduce((sum, c) => sum + c, 0) / totals.length);
    const bestValue = Math.max(...filteredResults.map((d) => d.valueScore));
    const weatherReady = filteredResults.filter((d) => d.weather).length;
    const flightReady = filteredResults.filter((d) => d.flightAvailability === "Available").length;
    return { averageCost, bestValue, weatherReady, flightReady };
  }, [hasResults, filteredResults]);

  const toggleCompare = (destination: DestinationResult) => {
    setCompareIds((prev) => {
      if (prev.includes(destination.placeId)) {
        return prev.filter((id) => id !== destination.placeId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, destination.placeId];
    });
  };

  const compareList = useMemo(() => {
    if (!searchResults) return [];
    return compareIds
      .map((id) => searchResults.results.find((d) => d.placeId === id))
      .filter((d): d is DestinationResult => Boolean(d));
  }, [compareIds, searchResults]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 lg:py-16 mt-24 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8 text-gray-900 mt-24">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-2 text-sm"
        >
          <FaArrowLeft className="text-xs" /> Back to search
        </button>

        {/* Header card */}
        <Card variant="glass" padding="base" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-700 font-semibold">Smart recommendations</p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                {hasResults ? filteredResults.length : "0"}{" "}
                <span className="text-slate-500 font-medium text-2xl">
                  of {searchResults?.totalCount || 0} for
                </span>{" "}
                <span className="gradient-text">{searchResults?.query.destination}</span>
              </h1>
              <p className="text-slate-600 mt-2">Curated by value score, vibes, weather, and availability.</p>
            </div>
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <StatTile
                  accent="cyan"
                  label="Avg trip"
                  value={formatCurrency(stats.averageCost, currency)}
                  hint="per trip"
                />
                <StatTile
                  accent="emerald"
                  label="Best value"
                  value={`${Math.round(stats.bestValue)}/100`}
                  hint="top score"
                />
                <StatTile accent="sky" label="Weather" value={stats.weatherReady} hint="with forecast" />
                <StatTile accent="amber" label="Flights" value={stats.flightReady} hint="available" />
              </div>
            )}
          </div>

          {hasResults && (
            <div className="rounded-3xl overflow-hidden border border-white/60 hover-lift">
              <ResultsMap destinations={filteredResults} />
            </div>
          )}
        </Card>

        {/* Results layout */}
        {hasResults && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
            <FilterSidebar
              state={filters}
              onChange={setFilters}
              resultCount={filteredResults.length}
              totalCount={searchResults!.results.length}
              bounds={bounds}
            />

            <div>
              {filteredResults.length === 0 ? (
                <EmptyState
                  icon={<FaSearch />}
                  title="No matches with current filters"
                  description="Try widening the price range, removing vibes, or lowering the minimum rating."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                  {filteredResults.map((destination, index) => (
                    <div
                      key={destination.placeId || index}
                      onMouseEnter={() => setHoveredId(destination.placeId)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative"
                    >
                      {hoveredId === destination.placeId && (
                        <span className="absolute -top-2 -right-2 z-10 text-xs font-semibold bg-cyan-600 text-white rounded-full px-2 py-0.5 shadow">
                          {Math.round(destination.valueScore)}/100
                        </span>
                      )}
                      <CompareCheckbox
                        active={compareIds.includes(destination.placeId)}
                        onToggle={() => toggleCompare(destination)}
                        disabled={!compareIds.includes(destination.placeId) && compareIds.length >= 3}
                      />
                      <DestinationCard
                        destination={destination}
                        currency={currency}
                        onItinerary={(d) => setItineraryTarget(d)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!hasResults && searchResults && (
          <EmptyState
            icon={<FaSearch />}
            title={`No destinations found in ${searchResults.query.destination}`}
            description="Try a nearby city, widen the radius, or soften the budget guardrails to reveal more options."
            action={
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-semibold shadow hover:shadow-lg transition-shadow"
              >
                Try a new search
              </button>
            }
          />
        )}
      </div>

      <CompareBar
        selected={compareList}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onCompare={() => setCompareOpen(true)}
        onClear={() => setCompareIds([])}
      />

      <ComparisonModal
        open={compareOpen}
        destinations={compareList}
        onClose={() => setCompareOpen(false)}
        currency={currency}
      />

      <ItineraryModal
        destination={itineraryTarget}
        startDate={searchParams.get("startDate") || new Date().toISOString().split("T")[0]}
        endDate={searchParams.get("endDate") || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
        currency={currency}
        onClose={() => setItineraryTarget(null)}
      />

      <footer className="bg-slate-950 text-white py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <span className="font-semibold text-lg">Planova</span>
            </div>
            <div className="flex items-center gap-6 text-white/70 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-white/50 text-sm">© 2026 Planova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CompareCheckbox({
  active,
  onToggle,
  disabled,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      className={[
        "absolute top-3 left-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full border transition-all",
        active
          ? "bg-cyan-600 border-cyan-700 text-white"
          : "bg-white/80 border-slate-200 text-slate-500 hover:border-cyan-400 hover:text-cyan-600",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span className="text-xs font-bold">{active ? "✓" : "+"}</span>
    </button>
  );
}