// components/MapPicker.tsx

"use client";

import GoogleMapReact from "google-map-react";

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
}

const Marker = ({ label = "" }: { label?: string; lat?: number; lng?: number }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs shadow-lg">
    {label || "●"}
  </div>
);

export default function MapPicker({ latitude, longitude, onSelect }: MapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const invalidKey = !apiKey || apiKey.trim() === ".." || apiKey.trim() === "..." || apiKey.trim().length < 25;
  if (invalidKey) {
    return (
      <div className="w-full h-64 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 bg-gray-50">
        Configure a valid Google Maps API key in .env.local (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) to enable map selection.
      </div>
    );
  }

  const handleClick = ({ lat, lng }: { lat: number; lng: number }) => {
    onSelect({ latitude: lat, longitude: lng });
  };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={6}
        onClick={handleClick}
      >
        <Marker lat={latitude} lng={longitude} />
      </GoogleMapReact>
    </div>
  );
}
