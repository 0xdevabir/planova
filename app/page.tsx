"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import DestinationCard from "@/components/DestinationCard";
import ResultsMap from "@/components/ResultsMap";
import { SearchResponse } from "@/lib/types";

"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import DestinationCard from "@/components/DestinationCard";
import { SearchResponse } from "@/lib/types";

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);

  const handleSearch = (results: SearchResponse) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,75 Q25,50 50,75 T100,75" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Next Adventure Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Plan trips based on your budget, preferences, and map selection.
              Get real-time travel recommendations powered by AI.
            </p>
          </div>

          {/* Search Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Plan Your Trip</h2>
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {searchResults && searchResults.results.length > 0 && (
        <div className="container mx-auto px-4 py-16 space-y-10">
          <div className="mb-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Perfect Destinations for You
            </h2>
            <p className="text-lg text-gray-600">
              {searchResults.results.length} destinations found matching your criteria
            </p>
          </div>

          <ResultsMap destinations={searchResults.results} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.results.map((destination) => (
              <DestinationCard key={destination.placeId} destination={destination} />
            ))}
          </div>
        </div>
      )}

      {searchResults && searchResults.results.length === 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-900 mb-2">
              No Destinations Found
            </h3>
            <p className="text-yellow-700">
              No destinations match your budget and date criteria. Try adjusting your budget or dates.
            </p>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Planova?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Map Selection
              </h3>
              <p className="text-gray-600">
                Click on the map to select your destination with precision
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Budget Aware
              </h3>
              <p className="text-gray-600">
                Only show destinations within your budget with detailed cost breakdowns
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Real-Time Data
              </h3>
              <p className="text-gray-600">
                Live flight prices, weather, hotels, and events at your fingertips
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Planova?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Map Selection
              </h3>
              <p className="text-gray-600">
                Click on the map to select your destination with precision
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Budget Aware
              </h3>
              <p className="text-gray-600">
                Only show destinations within your budget with detailed cost breakdowns
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Real-Time Data
              </h3>
              <p className="text-gray-600">
                Live flight prices, weather, hotels, and events at your fingertips
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
