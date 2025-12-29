// components/DestinationCard.tsx

import { DestinationResult } from "@/lib/types";

interface DestinationCardProps {
  destination: DestinationResult;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const budgetUtilization =
    (destination.totalEstimatedCost / 
      (destination.costBreakdown.flights + 
       destination.costBreakdown.accommodation + 
       destination.costBreakdown.food + 
       destination.costBreakdown.activities)) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">{destination.name}</h3>
            <p className="text-blue-100">{destination.address}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Value Score</div>
            <div className="text-3xl font-bold">{Math.round(destination.valueScore)}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {destination.description && (
          <p className="text-gray-600">{destination.description}</p>
        )}

        {/* Rating */}
        {destination.rating && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-semibold">{destination.rating}/5</span>
            <span className="text-gray-500 text-sm">
              ({destination.reviews?.toLocaleString()} reviews)
            </span>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-gray-50 rounded p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Flights</span>
              <span className="font-medium">${destination.costBreakdown.flights.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accommodation</span>
              <span className="font-medium">${destination.costBreakdown.accommodation.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Food</span>
              <span className="font-medium">${destination.costBreakdown.food.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activities</span>
              <span className="font-medium">${destination.costBreakdown.activities.toFixed(0)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg text-blue-600">
                ${destination.totalEstimatedCost.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-semibold text-gray-700">Flights</div>
            <div className={
              destination.flightAvailability === "Available"
                ? "text-green-600"
                : "text-orange-600"
            }>
              {destination.flightAvailability}
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-semibold text-gray-700">Hotels</div>
            <div className={
              destination.hotelAvailability === "Available"
                ? "text-green-600"
                : "text-orange-600"
            }>
              {destination.hotelAvailability}
            </div>
          </div>
        </div>

        {/* Weather */}
        {destination.weather && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Weather</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Condition:</span>
                <p className="font-medium">{destination.weather.condition}</p>
              </div>
              <div>
                <span className="text-gray-600">Temperature:</span>
                <p className="font-medium">{destination.weather.temperature}°C</p>
              </div>
              <div>
                <span className="text-gray-600">Humidity:</span>
                <p className="font-medium">{destination.weather.humidity}%</p>
              </div>
              <div>
                <span className="text-gray-600">Wind:</span>
                <p className="font-medium">{destination.weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        )}

        {/* Safety Rating */}
        {destination.safetyRating && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Safety Rating:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(destination.safetyRating / 10) * 100}%`,
                }}
              ></div>
            </div>
            <span className="font-semibold">{destination.safetyRating.toFixed(1)}/10</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            View Details
          </button>
          <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition">
            Save Destination
          </button>
        </div>
      </div>
    </div>
  );
}
