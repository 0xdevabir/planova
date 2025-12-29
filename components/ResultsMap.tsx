// components/ResultsMap.tsx

"use client";

import GoogleMapReact from "google-map-react";
import { DestinationResult } from "@/lib/types";

interface ResultsMapProps {
  destinations: DestinationResult[];
}

const Marker = ({ label = "" }: { label?: string }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs shadow-lg">
    {label || "●"}
  </div>
);

export default function ResultsMap({ destinations }: ResultsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return null;
  }

  const defaultCenter = destinations[0]
    ? { lat: destinations[0].latitude, lng: destinations[0].longitude }
    : { lat: 40.7128, lng: -74.006 };

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={4}
      >
        {destinations.map((dest) => (
          <Marker key={dest.placeId} lat={dest.latitude} lng={dest.longitude} label={dest.name} />
        ))}
      </GoogleMapReact>
    </div>
  );
}
