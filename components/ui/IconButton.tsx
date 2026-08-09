// components/ui/IconButton.tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Tone: glass for frosted, solid for filled, ghost for transparent */
  tone?: "glass" | "solid" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  label?: string;
}

const TONE = {
  glass: "bg-white/20 border border-white/30 text-white hover:bg-white/30",
  solid: "bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-700 shadow",
  ghost: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50",
  danger: "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700",
};

const SIZE = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function IconButton({
  children,
  className = "",
  tone = "glass",
  size = "md",
  active = false,
  label,
  ...rest
}: IconButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1",
    SIZE[size],
    TONE[tone],
    active ? "ring-2 ring-cyan-400" : "",
    "disabled:opacity-50 disabled:pointer-events-none",
    className,
  ].join(" ");

  return (
    <button type="button" className={classes} aria-label={label} {...rest}>
      {children}
    </button>
  );
}

export default IconButton;