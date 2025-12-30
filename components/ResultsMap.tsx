// components/ResultsMap.tsx

"use client";

import type React from "react";
import GoogleMapReact from "google-map-react";
import { DestinationResult } from "@/lib/types";

interface ResultsMapProps {
  destinations: DestinationResult[];
}

const Marker = ({ label = "", style }: { label?: string; style?: React.CSSProperties; lat?: number; lng?: number }) => (
  <div
    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-[11px] shadow-lg marker-pop"
    style={style}
  >
    {label || "●"}
  </div>
);

export default function ResultsMap({ destinations }: ResultsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const invalidKey = !apiKey || apiKey.trim() === ".." || apiKey.trim() === "..." || apiKey.trim().length < 25;
  if (invalidKey) {
    return (
      <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-600">
        Configure a valid Google Maps API key in .env.local as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
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
        {destinations.map((dest, index) => (
          <Marker
            key={dest.placeId}
            lat={dest.latitude}
            lng={dest.longitude}
            label={dest.name}
            style={{ animationDelay: `${Math.min(index * 90, 600)}ms` }}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}
