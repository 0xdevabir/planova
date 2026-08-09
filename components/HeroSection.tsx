// components/HeroSection.tsx
"use client";

import type { ReactNode, CSSProperties } from "react";

interface HeroSectionProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "home" | "compact";
}

/**
 * Premium hero section with animated gradient backgrounds, floating glow orbs,
 * and a subtle grid veil. Replaces the fixed-background-image scroll hack.
 */
export function HeroSection({
  eyebrow,
  title,
  description,
  action,
  variant = "home",
}: HeroSectionProps) {
  return (
    <section
      className={[
        "relative overflow-hidden",
        variant === "home"
          ? "min-h-[100svh] flex items-center justify-center"
          : "pt-32 pb-16 sm:pt-40",
      ].join(" ")}
    >
      {/* Gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.3), transparent 50%), radial-gradient(circle at 50% 90%, rgba(236, 72, 153, 0.18), transparent 55%)",
        }}
      />
      <div className="grid-veil" />
      <div className="glow-orb w-96 h-96 bg-cyan-400/30 -left-10 top-10 parallax-drift" />
      <div className="glow-orb w-80 h-80 bg-indigo-500/25 right-10 bottom-10 parallax-drift" style={{ animationDelay: "-3s" }} />
      <div className="glow-orb w-64 h-64 bg-pink-500/20 left-1/2 top-1/2 parallax-drift" style={{ animationDelay: "-5s" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300 font-semibold reveal-on-scroll" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
            {eyebrow}
          </p>
        )}
        <h1
          className="text-4xl sm:text-6xl font-semibold text-white leading-[1.1] tracking-tight reveal-on-scroll"
          style={{ "--reveal-delay": "80ms" } as CSSProperties}
        >
          {title}
        </h1>
        {description && (
          <p
            className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto reveal-on-scroll"
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
          >
            {description}
          </p>
        )}
        {action && (
          <div
            className="relative max-w-5xl mx-auto reveal-on-scroll"
            style={{ "--reveal-delay": "220ms" } as CSSProperties}
          >
            {action}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;