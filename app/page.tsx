"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSearchBar from "@/components/HeroSearchBar";
import ScrollIndicator from "@/components/ScrollIndicator";
import DestinationCard from "@/components/DestinationCard";
import ResultsMap from "@/components/ResultsMap";
import { SearchResponse } from "@/lib/types";

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }
      
      const results = await response.json();
      setSearchResults(results);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Search error:", error);
      // Show error to user with empty results, preserving shape of SearchResponse
      setSearchResults({
        query: {
          destination: formData.destination,
          latitude: Number(formData.latitude) || 0,
          longitude: Number(formData.longitude) || 0,
          radius: Number((formData as any).radius) || 25,
          budgetMin: Number(formData.budgetMin) || 0,
          budgetMax: Number(formData.budgetMax) || 0,
          currency: formData.currency || "USD",
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          travelers: Number(formData.travelers) || 1,
          tripType: (formData as any).tripType,
        },
        results: [],
        totalCount: 0,
        timestamp: new Date(),
      });
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/heroBg.jpg')" }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Your next adventure
            <br />
            starts right here
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Discover tailored trips that fit your budget and style, with 24/7 support.
          </p>

          {/* Search Bar */}
          <HeroSearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* Results Section */}
      <section id="results" className="min-h-screen bg-linear-to-b from-slate-50 to-white">
        {searchResults && searchResults.results.length > 0 && (
          <div className="container mx-auto px-4 py-16 md:py-20 space-y-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Perfect Destinations for You
              </h2>
              <p className="text-lg text-gray-600">
                {searchResults.results.length} destinations found matching your criteria
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <ResultsMap destinations={searchResults.results} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.results.map((destination) => (
                <DestinationCard key={destination.placeId} destination={destination} />
              ))}
            </div>
          </div>
        )}

        {searchResults && searchResults.results.length === 0 && (
          <div className="container mx-auto px-4 py-20">
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-cyan-900 mb-4">
                No Destinations Found in {searchResults.query.destination}
              </h3>
              <p className="text-cyan-700 mb-6">
                We couldn't find any tourist destinations or places of interest in this location that match your search criteria.
              </p>
              <div className="bg-white/60 rounded-xl p-4 text-sm text-cyan-800">
                <p className="font-medium mb-2">Try:</p>
                <ul className="text-left space-y-1">
                  <li>• Searching for a larger city or region</li>
                  <li>• Adjusting your budget range</li>
                  <li>• Changing your travel dates</li>
                  <li>• Checking if the location name is spelled correctly</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!searchResults && (
          <div className="container mx-auto px-4 py-20">
            {/* Features Section */}
            <div id="features" className="mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                Why Choose Planova?
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Plan your perfect trip with our intelligent travel planning platform
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Smart Map Selection
                  </h3>
                  <p className="text-gray-600">
                    Click on the map to select your destination with precision. Explore nearby attractions and hidden gems.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Budget Aware
                  </h3>
                  <p className="text-gray-600">
                    Only show destinations within your budget with detailed cost breakdowns for flights, hotels, and activities.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Real-Time Data
                  </h3>
                  <p className="text-gray-600">
                    Live flight prices, weather forecasts, hotel availability, and local events at your fingertips.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Plan your trip in three simple steps
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-cyan-500/30">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Set Your Preferences</h3>
                  <p className="text-gray-600">
                    Enter your destination, dates, budget, and number of travelers
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-cyan-500/30">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Explore Options</h3>
                  <p className="text-gray-600">
                    Browse personalized destination recommendations with real-time pricing
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-cyan-500/30">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Book & Travel</h3>
                  <p className="text-gray-600">
                    Save your favorite destinations and book your perfect trip
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <span className="font-semibold text-lg">Planova</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 Planova. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
