// components/ui/Skeleton.tsx
"use client";

import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  /** Override width/height as inline style */
  style?: CSSProperties;
  /** Render as a circle when true */
  circle?: boolean;
}

export function Skeleton({ className = "", style, circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={[
        "shimmer rounded-2xl bg-slate-200/70",
        circle ? "rounded-full" : "",
        className,
      ].join(" ")}
      style={style}
    />
  );
}

export function SkeletonStack({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${60 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

export default Skeleton;