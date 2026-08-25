// components/ResultsMapClient.tsx

"use client";

import type React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DestinationResult } from "@/lib/types";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import { useEffect } from "react";
import MapPopup from "./MapPopup";

interface ResultsMapClientProps {
  destinations: DestinationResult[];
  currency?: string;
  highlightedId?: string | null;
  onOpen?: (destination: DestinationResult) => void;
  onHover?: (placeId: string | null) => void;
}

function getMarkerIcon(dest: DestinationResult, highlighted: boolean): L.DivIcon {
  const vibe = dest.vibes?.[0] ? VIBE_BY_ID[dest.vibes[0]] : null;
  const gradient = vibe?.gradient ?? "from-cyan-500 to-blue-500";
  const emoji = vibe?.emoji ?? "📍";
  const size = highlighted ? 44 : 36;
  const ringColor = highlighted ? "#0ea5e9" : "rgba(255,255,255,0.85)";
  const shadow = highlighted
    ? "0 0 0 4px rgba(14, 165, 233, 0.25), 0 12px 30px rgba(15, 23, 42, 0.35)"
    : "0 8px 22px rgba(15, 23, 42, 0.25)";
  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:9999px;background:linear-gradient(135deg, var(--tw-gradient-stops)); --tw-gradient-stops: ${gradientMap(gradient)};display:flex;align-items:center;justify-content:center;font-size:${size * 0.42}px;box-shadow:${shadow};border:3px solid ${ringColor};color:#fff;transition:transform 200ms ease, box-shadow 200ms ease;">
      ${emoji}
    </div>
  `;
  return L.divIcon({
    html,
    className: "planova-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function gradientMap(gradient: string): string {
  switch (gradient) {
    case "from-emerald-400 via-teal-500 to-cyan-600":
      return "#34d399, #14b8a6, #0891b2";
    case "from-sky-400 via-blue-400 to-cyan-400":
      return "#38bdf8, #60a5fa, #22d3ee";
    case "from-orange-400 via-rose-500 to-pink-500":
      return "#fb923c, #f43f5e, #ec4899";
    case "from-amber-400 via-orange-500 to-red-500":
      return "#fbbf24, #f97316, #ef4444";
    case "from-pink-400 via-fuchsia-500 to-purple-500":
      return "#f472b6, #d946ef, #a855f7";
    case "from-lime-400 via-green-500 to-emerald-500":
      return "#a3e635, #22c55e, #10b981";
    case "from-violet-400 via-purple-500 to-indigo-500":
      return "#a78bfa, #a855f7, #6366f1";
    case "from-yellow-400 via-amber-500 to-orange-500":
      return "#facc15, #f59e0b, #f97316";
    default:
      return "#06b6d4, #3b82f6, #6366f1";
  }
}

function MapBounds({ destinations }: { destinations: DestinationResult[] }) {
  const map = useMap();

  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = destinations.map((d) => [d.latitude, d.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [destinations, map]);

  return null;
}

export default function ResultsMapClient({
  destinations,
  currency = "USD",
  highlightedId = null,
  onOpen,
  onHover,
}: ResultsMapClientProps) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="w-full h-96 rounded-3xl overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-600">
        No destinations to display
      </div>
    );
  }

  const defaultCenter: [number, number] = [
    destinations[0]?.latitude || 40.7128,
    destinations[0]?.longitude || -74.006,
  ];

  return (
    <div className="w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200/70 shadow">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ width: "100%", height: "100%" }}
        className="rounded-3xl"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {destinations.map((dest, index) => (
          <Marker
            key={dest.placeId || index}
            position={[dest.latitude, dest.longitude]}
            icon={getMarkerIcon(dest, highlightedId === dest.placeId)}
            title={dest.name}
            eventHandlers={{
              mouseover: () => onHover?.(dest.placeId),
              mouseout: () => onHover?.(null),
            }}
          >
            <Popup>
              <MapPopup
                destination={dest}
                currency={currency}
                onOpen={onOpen ? () => onOpen(dest) : undefined}
              />
            </Popup>
          </Marker>
        ))}
        <MapBounds destinations={destinations} />
      </MapContainer>
    </div>
  );
}