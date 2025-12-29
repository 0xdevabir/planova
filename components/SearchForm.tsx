// components/SearchForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  onSearch?: (results: any) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    latitude: 40.7128,
    longitude: -74.006,
    budgetMin: 500,
    budgetMax: 5000,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    travelers: 1,
    currency: "USD",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Search failed");

      const results = await response.json();
      
      if (onSearch) {
        onSearch(results);
      } else {
        // Redirect to results page with data
        router.push(
          `/results?query=${encodeURIComponent(JSON.stringify(formData))}`
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="City, country, or landmark"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Number of Travelers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Travelers
          </label>
          <input
            type="number"
            name="travelers"
            min="1"
            value={formData.travelers}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Budget Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Budget (USD)
          </label>
          <input
            type="number"
            name="budgetMin"
            min="0"
            step="100"
            value={formData.budgetMin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Budget Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Budget (USD)
          </label>
          <input
            type="number"
            name="budgetMax"
            min="0"
            step="100"
            value={formData.budgetMax}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-200"
      >
        {loading ? "Searching..." : "Search Destinations"}
      </button>
    </form>
  );
}
