// components/ui/Card.tsx
"use client";

import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Variant: glass for frosted surface, solid for opaque panel, outline for border-only */
  variant?: "glass" | "solid" | "outline";
  /** Adds hover lift + shadow */
  interactive?: boolean;
  /** Adds a subtle gradient border glow */
  glow?: boolean;
  padding?: "none" | "tight" | "base" | "roomy";
}

const PADDING = {
  none: "",
  tight: "p-3",
  base: "p-5 sm:p-6",
  roomy: "p-7 sm:p-8",
};

const VARIANT = {
  glass: "glass-card",
  solid: "bg-white/95 border border-slate-200/80 shadow-[0_18px_50px_rgba(0,0,0,0.06)]",
  outline: "border border-slate-200/80 bg-transparent",
};

export function Card({
  children,
  className = "",
  variant = "glass",
  interactive = false,
  glow = false,
  padding = "base",
  ...rest
}: CardProps) {
  const classes = [
    "relative rounded-3xl",
    VARIANT[variant],
    PADDING[padding],
    interactive ? "hover-lift cursor-pointer" : "",
    glow ? "ring-1 ring-cyan-300/40 shadow-[0_0_0_1px_rgba(91,225,255,0.25),0_30px_80px_rgba(91,225,255,0.18)]" : "",
    "transition-all duration-200",
    className,
  ].join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default Card;