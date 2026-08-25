// components/ResultsMapClient.tsx

"use client";

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

/** One-world bounds — stops horizontal Earth copies when the container is wide. */
const WORLD_BOUNDS = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

function getMarkerIcon(dest: DestinationResult, highlighted: boolean): L.DivIcon {
  const vibe = dest.vibes?.[0] ? VIBE_BY_ID[dest.vibes[0]] : null;
  const gradient = vibe?.gradient ?? "from-cyan-500 to-blue-500";
  const emoji = vibe?.emoji ?? "📍";
  const size = highlighted ? 44 : 36;
  const ringColor = highlighted ? "#0f766e" : "rgba(255,255,255,0.92)";
  const shadow = highlighted
    ? "0 0 0 4px rgba(15, 118, 110, 0.28), 0 12px 28px rgba(28, 25, 23, 0.22)"
    : "0 8px 20px rgba(28, 25, 23, 0.18)";
  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:9999px;background:linear-gradient(135deg, ${gradientMap(gradient)});display:flex;align-items:center;justify-content:center;font-size:${size * 0.42}px;box-shadow:${shadow};border:3px solid ${ringColor};color:#fff;transform:translateZ(0);">
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
      return "#0d9488, #0f766e, #115e59";
  }
}

function validPoints(destinations: DestinationResult[]): [number, number][] {
  return destinations
    .filter(
      (d) =>
        Number.isFinite(d.latitude) &&
        Number.isFinite(d.longitude) &&
        Math.abs(d.latitude) <= 85 &&
        Math.abs(d.longitude) <= 180,
    )
    .map((d) => [d.latitude, d.longitude] as [number, number]);
}

function MapController({
  destinations,
  highlightedId,
}: {
  destinations: DestinationResult[];
  highlightedId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    const fit = () => {
      map.invalidateSize({ animate: false });
      const pts = validPoints(destinations);
      if (pts.length === 0) return;
      if (pts.length === 1) {
        map.setView(pts[0], 6, { animate: false });
        return;
      }
      const bounds = L.latLngBounds(pts);
      // Keep a tight frame on the cluster — avoid zooming out to “whole world”
      // which is what made the Earth tile horizontally across wide layouts.
      map.fitBounds(bounds, {
        padding: [56, 56],
        maxZoom: 7,
        animate: false,
      });
    };

    map.whenReady(fit);
    // Layout settles after dynamic import / flex resize
    const t1 = window.setTimeout(fit, 80);
    const t2 = window.setTimeout(fit, 320);
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", onResize);
    };
  }, [destinations, map]);

  useEffect(() => {
    if (!highlightedId) return;
    const dest = destinations.find((d) => d.placeId === highlightedId);
    if (!dest || !Number.isFinite(dest.latitude) || !Number.isFinite(dest.longitude)) return;
    map.panTo([dest.latitude, dest.longitude], { animate: true, duration: 0.35 });
  }, [highlightedId, destinations, map]);

  return null;
}

export default function ResultsMapClient({
  destinations,
  currency = "USD",
  highlightedId = null,
  onOpen,
  onHover,
}: ResultsMapClientProps) {
  const pts = validPoints(destinations);

  if (pts.length === 0) {
    return (
      <div className="w-full h-[420px] rounded-3xl overflow-hidden border border-stone-200 flex items-center justify-center bg-stone-50 text-stone-600">
        No destinations to display
      </div>
    );
  }

  const defaultCenter: [number, number] = pts[0];

  return (
    <div className="w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm bg-stone-100">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        minZoom={3}
        maxZoom={12}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        style={{ width: "100%", height: "100%", background: "#f5f5f4" }}
        className="rounded-3xl planova-results-map"
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          noWrap
          bounds={WORLD_BOUNDS}
          updateWhenIdle
          keepBuffer={2}
        />
        {destinations.map((dest, index) => {
          if (!Number.isFinite(dest.latitude) || !Number.isFinite(dest.longitude)) return null;
          return (
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
          );
        })}
        <MapController destinations={destinations} highlightedId={highlightedId} />
      </MapContainer>
    </div>
  );
}
