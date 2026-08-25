// components/MapPickerClient.tsx

"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L, { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapPickerClientProps {
  latitude: number;
  longitude: number;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
}

const WORLD_BOUNDS = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

const customIcon = icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230f766e' width='32' height='32'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function ClickHandler({
  onSelect,
}: {
  onSelect: (coords: { latitude: number; longitude: number }) => void;
}) {
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
    map.invalidateSize({ animate: false });
    map.setView([latitude, longitude], Math.max(map.getZoom(), 6), { animate: false });
  }, [latitude, longitude, map]);
  return null;
}

export default function MapPickerClient({ latitude, longitude, onSelect }: MapPickerClientProps) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
      <MapContainer
        center={[latitude, longitude]}
        zoom={6}
        minZoom={3}
        maxZoom={12}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        style={{ width: "100%", height: "100%", background: "#f5f5f4" }}
        className="rounded-xl cursor-pointer"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          noWrap
          bounds={WORLD_BOUNDS}
          updateWhenIdle
        />
        <Marker position={[latitude, longitude]} icon={customIcon} title="Selected Location" />
        <ClickHandler onSelect={onSelect} />
        <CenterMap latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}
