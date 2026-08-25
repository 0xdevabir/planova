// components/HeroSection.tsx
"use client";

import { useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";

interface HeroSectionProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "home" | "compact";
  /** @deprecated Kept for call-site compatibility; ignored in favor of clean light heroes. */
  theme?: string;
  /** Soft photo wash behind the hero (defaults to heroBg.jpg when true). */
  image?: boolean | string;
}

/**
 * Clean light marketing hero — no colorful orbs or neon washes.
 */
export function HeroSection({
  eyebrow,
  title,
  description,
  action,
  variant = "compact",
  image = false,
}: HeroSectionProps) {
  const imageSrc =
    typeof image === "string" && image.length > 0 ? image : "/heroBg.jpg";

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".hero-reveal"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={[
        "relative overflow-hidden border-b border-stone-200/80",
        variant === "home"
          ? "min-h-[100svh] flex items-center justify-center"
          : "pt-32 pb-16 sm:pt-36 sm:pb-20",
      ].join(" ")}
    >
      <div className="absolute inset-0 -z-20 bg-[#f7f6f3]" />

      {image && (
        <>
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.18]"
            style={{ backgroundImage: `url(${imageSrc})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f7f6f3]/70 via-[#f7f6f3]/92 to-[#f7f6f3]"
            aria-hidden
          />
        </>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-5">
        {eyebrow && (
          <p
            className="hero-reveal text-xs uppercase tracking-[0.2em] font-semibold text-teal-800"
            style={{ "--reveal-delay": "40ms" } as CSSProperties}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="hero-reveal font-display text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.1]"
          style={{ "--reveal-delay": "80ms" } as CSSProperties}
        >
          {title}
        </h1>
        {description && (
          <p
            className="hero-reveal text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            {description}
          </p>
        )}
        {action && (
          <div
            className="hero-reveal pt-2 flex justify-center"
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
          >
            {action}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
