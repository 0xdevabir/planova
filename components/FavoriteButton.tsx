// components/FavoriteButton.tsx
"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import type { DestinationResult } from "@/lib/types";

interface FavoriteButtonProps {
  destination: DestinationResult;
  size?: "sm" | "md" | "lg";
  tone?: "glass" | "solid" | "ghost";
  onChange?: (isFavorited: boolean) => void;
  className?: string;
}

const SIZE = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

const TONE = {
  glass: "bg-white/80 border border-white/60 text-slate-700 hover:bg-white",
  solid: "bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600",
  ghost: "bg-transparent border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600",
};

export function FavoriteButton({
  destination,
  size = "md",
  tone = "solid",
  onChange,
  className = "",
}: FavoriteButtonProps) {
  const { has, toggle, isHydrated } = useFavorites();
  const [pulse, setPulse] = useState(false);

  const isFav = isHydrated && has(destination.placeId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle({
      placeId: destination.placeId,
      name: destination.name,
      address: destination.address,
      latitude: destination.latitude,
      longitude: destination.longitude,
      rating: destination.rating,
      totalEstimatedCost: destination.totalEstimatedCost,
      currency: destination.costBreakdown ? "USD" : undefined,
      vibes: destination.vibes,
    });
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    onChange?.(!isFav);
  };

  const aria = isFav ? "Remove from favorites" : "Save to favorites";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={aria}
      title={aria}
      className={[
        "inline-flex items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
        SIZE[size],
        TONE[tone],
        isFav ? "!text-rose-600 !bg-rose-50 !border-rose-200" : "",
        pulse ? "scale-125" : "scale-100",
        className,
      ].join(" ")}
    >
      {isFav ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default FavoriteButton;