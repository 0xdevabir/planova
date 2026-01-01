// components/MapPickerClient.tsx

"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapPickerClientProps {
  latitude: number;
  longitude: number;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
}

// Custom marker icon
const customIcon = icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb' width='32' height='32'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function ClickHandler({ onSelect }: { onSelect: (coords: { latitude: number; longitude: number }) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

function CenterMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 6);
  }, [latitude, longitude, map]);
  return null;
}

export default function MapPickerClient({ latitude, longitude, onSelect }: MapPickerClientProps) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[latitude, longitude]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        className="rounded-xl cursor-pointer"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon} title="Selected Location" />
        <ClickHandler onSelect={onSelect} />
        <CenterMap latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}
