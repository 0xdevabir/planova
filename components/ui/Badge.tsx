// components/ui/Badge.tsx
"use client";

import type { ReactNode } from "react";
import { VIBE_BY_ID } from "@/lib/data/vibes";
import type { TripVibe } from "@/lib/types";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "vibe" | "muted";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  vibe?: TripVibe;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}

const TONE: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-cyan-50 text-cyan-700 border-cyan-200",
  muted: "bg-slate-50 text-slate-500 border-slate-200",
  vibe: "bg-white/[0.06] text-white border-white/15",
};

const SIZE = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

export function Badge({
  children,
  tone = "neutral",
  vibe,
  size = "md",
  icon,
  className = "",
}: BadgeProps) {
  const vibeStyle = vibe
    ? {
        background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
        borderColor: "rgba(255,255,255,0.15)",
        color: "white",
      }
    : undefined;

  const classes = [
    "inline-flex items-center rounded-full border font-medium uppercase tracking-[0.08em] backdrop-blur",
    vibe ? "" : TONE[tone],
    SIZE[size],
    "transition-colors",
    className,
  ].join(" ");

  return (
    <span className={classes} style={vibeStyle}>
      {icon}
      {vibe && <span aria-hidden>{VIBE_BY_ID[vibe].emoji}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;