// components/ui/StatTile.tsx
"use client";

import type { ReactNode } from "react";
import Card from "./Card";

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: "up" | "down" | "flat";
  icon?: ReactNode;
  accent?: "teal" | "cyan" | "amber" | "emerald" | "rose" | "violet" | "sky";
  className?: string;
}

const ACCENT: Record<NonNullable<StatTileProps["accent"]>, string> = {
  teal: "from-teal-100 via-teal-50 to-white text-teal-800",
  cyan: "from-cyan-100 via-cyan-50 to-white text-cyan-700",
  amber: "from-amber-100 via-amber-50 to-white text-amber-700",
  emerald: "from-emerald-100 via-emerald-50 to-white text-emerald-700",
  rose: "from-rose-100 via-rose-50 to-white text-rose-700",
  violet: "from-violet-100 via-violet-50 to-white text-violet-700",
  sky: "from-sky-100 via-sky-50 to-white text-sky-700",
};

export function StatTile({ label, value, hint, trend, icon, accent = "teal", className = "" }: StatTileProps) {
  const TrendIcon =
    trend === "up" ? "▲" : trend === "down" ? "▼" : "→";
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500";

  return (
    <Card
      variant="solid"
      padding="tight"
      className={`bg-gradient-to-br ${ACCENT[accent]} overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="opacity-80">{icon}</span>}
        <p className="text-[10px] uppercase tracking-[0.14em] font-semibold opacity-70">{label}</p>
      </div>
      <p className="text-2xl sm:text-3xl font-semibold leading-tight">{value}</p>
      {(hint || trend) && (
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trend && <span className={`${trendColor} font-semibold`}>{TrendIcon}</span>}
          {hint && <span className="text-slate-500">{hint}</span>}
        </div>
      )}
    </Card>
  );
}

export default StatTile;
