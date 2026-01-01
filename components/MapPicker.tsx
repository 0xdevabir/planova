// components/MapPicker.tsx

"use client";

import dynamic from "next/dynamic";

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
}

// Dynamically import the map component to avoid SSR issues
const DynamicMapPicker = dynamic(
  () => import("./MapPickerClient"),
  { 
    loading: () => (
      <div className="w-full h-64 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-600">
        Loading map...
      </div>
    ),
    ssr: false 
  }
);

export default function MapPicker({ latitude, longitude, onSelect }: MapPickerProps) {
  return <DynamicMapPicker latitude={latitude} longitude={longitude} onSelect={onSelect} />;
}
