// components/ResultsMapClient.tsx

"use client";

import type React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { DestinationResult } from "@/lib/types";
import { useEffect } from "react";

interface ResultsMapClientProps {
  destinations: DestinationResult[];
}

// Custom marker icon
const customIcon = icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb' width='32' height='32'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapBounds({ destinations }: { destinations: DestinationResult[] }) {
  const map = useMap();

  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = destinations.map((d) => [d.latitude, d.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [destinations, map]);

  return null;
}

export default function ResultsMapClient({ destinations }: ResultsMapClientProps) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-600">
        No destinations to display
      </div>
    );
  }

  const defaultCenter: [number, number] = [
    destinations[0]?.latitude || 40.7128,
    destinations[0]?.longitude || -74.006,
  ];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ width: "100%", height: "100%" }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {destinations.map((dest, index) => (
          <Marker
            key={dest.placeId}
            position={[dest.latitude, dest.longitude]}
            icon={customIcon}
            title={dest.name}
          >
            <Popup>
              <div className="text-sm">
                <strong>{dest.name}</strong>
                <br />
                <span className="text-gray-600">{dest.address || "Location"}</span>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapBounds destinations={destinations} />
      </MapContainer>
    </div>
  );
}
