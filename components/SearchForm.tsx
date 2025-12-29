// components/SearchForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Range } from "react-range";
import MapPicker from "@/components/MapPicker";

interface SearchFormProps {
  onSearch?: (results: any) => void;
}

const BUDGET_MIN = 100;
const BUDGET_MAX = 20000;

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
    tripType: "Adventure",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["travelers", "budgetMin", "budgetMax"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
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
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip Type
          </label>
          <select
            name="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Adventure</option>
            <option>Relax</option>
            <option>City</option>
            <option>Nature</option>
            <option>Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>JPY</option>
          </select>
        </div>

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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range (USD)
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <Range
            values={[formData.budgetMin, formData.budgetMax]}
            step={50}
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            onChange={(values) =>
              setFormData((prev) => ({
                ...prev,
                budgetMin: values[0],
                budgetMax: values[1],
              }))
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-2 bg-gray-200 rounded-full"
                style={props.style}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="w-4 h-4 bg-blue-600 rounded-full shadow"
                style={props.style}
              />
            )}
          />
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>${formData.budgetMin.toLocaleString()}</span>
            <span>${formData.budgetMax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>Map Selection</span>
          <span className="font-medium">
            {formData.latitude.toFixed(3)}, {formData.longitude.toFixed(3)}
          </span>
        </div>
        <MapPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onSelect={({ latitude, longitude }) =>
            setFormData((prev) => ({ ...prev, latitude, longitude }))
          }
        />
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
