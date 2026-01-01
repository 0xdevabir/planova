"use client";

import { useEffect, useMemo, useState, CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import ResultsMap from "@/components/ResultsMap";
import { SearchResponse } from "@/lib/types";

export default function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
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
        };

        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const results = await response.json();
          console.log("Search results received:", results);
          console.log("Results count:", results.results?.length);
          setSearchResults(results);
        } else {
          // Fallback empty results
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

  const hasResults = !!(searchResults && searchResults.results.length > 0);

  console.log("hasResults:", hasResults);
  console.log("searchResults:", searchResults);
  console.log("results array:", searchResults?.results);

  const resultStats = useMemo(() => {
    if (!hasResults || !searchResults) return null;
    const totals = searchResults.results.map((d) => d.totalEstimatedCost);
    const averageCost = Math.round(totals.reduce((sum, cost) => sum + cost, 0) / totals.length);
    const bestValue = Math.max(...searchResults.results.map((d) => d.valueScore || 0));
    const weatherReady = searchResults.results.filter((d) => d.weather).length;
    const flightReady = searchResults.results.filter((d) => d.flightAvailability === "Available").length;
    return { averageCost, bestValue, weatherReady, flightReady };
  }, [hasResults, searchResults]);

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
  }, [searchResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Finding your perfect destinations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16 lg:py-20 space-y-12 text-gray-900 mt-20">
        {/* Header Section */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </button>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Smart recommendations</p>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                  {hasResults ? searchResults.results.length : "0"} destinations for {searchResults?.query.destination}
                </h1>
                <p className="text-slate-600 mt-2">Curated mix of value, availability, weather, and safety.</p>
              </div>

              {resultStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                  {[
                    { label: "Avg trip", value: `$${resultStats.averageCost.toLocaleString()}`, hint: "per person" },
                    { label: "Value", value: `${Math.round(resultStats.bestValue)}/10`, hint: "best score" },
                    { label: "Weather", value: `${resultStats.weatherReady}`, hint: "ready" },
                    { label: "Flights", value: `${resultStats.flightReady}`, hint: "available" },
                  ].map((stat, index) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 hover-lift reveal-on-scroll" style={{ "--reveal-delay": `${80 + index * 60}ms` } as CSSProperties}>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                      <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasResults && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200/80 hover-lift reveal-on-scroll" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                <ResultsMap destinations={searchResults.results} />
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {hasResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.results.map((destination, index) => (
              <div key={destination.placeId || index}>
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {searchResults && searchResults.results.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md border border-cyan-200 rounded-3xl p-10 text-center max-w-3xl mx-auto shadow-lg shadow-cyan-500/15 reveal-on-scroll">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-3xl font-semibold text-cyan-900 mb-3">
              No destinations found in {searchResults.query.destination}
            </h3>
            <p className="text-cyan-800 mb-6">
              Try a nearby city, widen the radius, or soften the budget guardrails to reveal more options.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-left text-sm text-cyan-900">
              {[
                "Search for a larger region or landmark",
                "Adjust budget range to include more picks",
                "Change dates to a more flexible window",
                "Check spelling or try another language",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 bg-white/80 border border-cyan-100 rounded-xl px-4 py-3">
                  <span className="mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Try a new search
            </button>
          </div>
        )}
      </div>

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
            <p className="text-white/50 text-sm">© 2025 Planova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
