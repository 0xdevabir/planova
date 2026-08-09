// components/HeroSection.tsx
"use client";

import { useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";

export type HeroTheme =
  | "home"
  | "aurora"
  | "indigo"
  | "sunset"
  | "mint"
  | "violet"
  | "cyan";

interface HeroSectionProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "home" | "compact";
  /**
   * Visual theme — controls the gradient + glow orbs used behind the hero.
   * Defaults to `home` for full-bleed, `aurora` for compact variants.
   */
  theme?: HeroTheme;
  /**
   * Use a photographic backdrop (matches the home page hero image) with a
   * dark glassmorphic overlay. Theme still tints the orbs and color wash.
   */
  image?: boolean | string;
}

interface ThemeSpec {
  base: string;
  veil: string;
  orbs: { className: string; style: CSSProperties }[];
}

const THEMES: Record<HeroTheme, ThemeSpec> = {
  home: {
    base: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
    veil:
      "radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.3), transparent 50%), radial-gradient(circle at 50% 90%, rgba(236, 72, 153, 0.18), transparent 55%)",
    orbs: [
      { className: "w-96 h-96 bg-cyan-400/30 -left-10 top-10", style: {} },
      {
        className: "w-80 h-80 bg-indigo-500/25 right-10 bottom-10",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-64 h-64 bg-pink-500/20 left-1/2 top-1/2",
        style: { animationDelay: "-5s" },
      },
    ],
  },
  aurora: {
    base: "bg-gradient-to-br from-slate-950 via-[#04111c] to-slate-950",
    veil:
      "radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.32), transparent 50%), radial-gradient(circle at 85% 20%, rgba(59, 130, 246, 0.28), transparent 55%), radial-gradient(circle at 50% 95%, rgba(14, 165, 233, 0.22), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-cyan-400/35 -top-20 -left-20", style: {} },
      {
        className: "w-96 h-96 bg-blue-500/30 top-10 right-0",
        style: { animationDelay: "-4s" },
      },
      {
        className: "w-72 h-72 bg-sky-400/25 left-1/3 bottom-0",
        style: { animationDelay: "-7s" },
      },
    ],
  },
  indigo: {
    base: "bg-gradient-to-br from-slate-950 via-[#0b0f25] to-slate-950",
    veil:
      "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.35), transparent 50%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.3), transparent 55%), radial-gradient(circle at 50% 90%, rgba(56, 189, 248, 0.2), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-indigo-500/35 -top-24 -left-24", style: {} },
      {
        className: "w-96 h-96 bg-violet-500/30 top-12 right-0",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-80 h-80 bg-blue-500/25 left-1/2 bottom-0",
        style: { animationDelay: "-6s" },
      },
    ],
  },
  sunset: {
    base: "bg-gradient-to-br from-slate-950 via-[#1a0a1f] to-slate-950",
    veil:
      "radial-gradient(circle at 20% 25%, rgba(244, 114, 182, 0.32), transparent 50%), radial-gradient(circle at 80% 15%, rgba(251, 146, 60, 0.28), transparent 55%), radial-gradient(circle at 50% 90%, rgba(217, 70, 239, 0.22), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-pink-500/35 -top-20 left-1/4", style: {} },
      {
        className: "w-96 h-96 bg-orange-400/30 top-10 right-0",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-72 h-72 bg-fuchsia-500/25 left-0 bottom-0",
        style: { animationDelay: "-6s" },
      },
    ],
  },
  mint: {
    base: "bg-gradient-to-br from-slate-950 via-[#031a14] to-slate-950",
    veil:
      "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.32), transparent 50%), radial-gradient(circle at 80% 15%, rgba(20, 184, 166, 0.28), transparent 55%), radial-gradient(circle at 50% 95%, rgba(34, 197, 94, 0.18), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-emerald-400/35 -top-20 -left-16", style: {} },
      {
        className: "w-96 h-96 bg-teal-400/30 top-10 right-0",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-72 h-72 bg-green-400/25 left-1/2 bottom-0",
        style: { animationDelay: "-6s" },
      },
    ],
  },
  violet: {
    base: "bg-gradient-to-br from-slate-950 via-[#150823] to-slate-950",
    veil:
      "radial-gradient(circle at 18% 22%, rgba(168, 85, 247, 0.32), transparent 50%), radial-gradient(circle at 82% 18%, rgba(217, 70, 239, 0.28), transparent 55%), radial-gradient(circle at 50% 90%, rgba(99, 102, 241, 0.22), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-purple-500/35 -top-20 left-1/4", style: {} },
      {
        className: "w-96 h-96 bg-fuchsia-500/30 top-10 right-0",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-72 h-72 bg-indigo-500/25 left-0 bottom-0",
        style: { animationDelay: "-6s" },
      },
    ],
  },
  cyan: {
    base: "bg-gradient-to-br from-slate-950 via-[#031620] to-slate-950",
    veil:
      "radial-gradient(circle at 22% 22%, rgba(34, 211, 238, 0.35), transparent 50%), radial-gradient(circle at 78% 18%, rgba(6, 182, 212, 0.3), transparent 55%), radial-gradient(circle at 50% 95%, rgba(59, 130, 246, 0.22), transparent 60%)",
    orbs: [
      { className: "w-[28rem] h-[28rem] bg-cyan-400/40 -top-20 -left-20", style: {} },
      {
        className: "w-96 h-96 bg-sky-400/30 top-10 right-0",
        style: { animationDelay: "-3s" },
      },
      {
        className: "w-72 h-72 bg-blue-500/25 left-1/2 bottom-0",
        style: { animationDelay: "-6s" },
      },
    ],
  },
};

/**
 * Premium hero section with animated gradient backgrounds, floating glow orbs,
 * and a subtle grid veil. Per-page `theme` controls the visual identity so each
 * marketing page has its own cohesive feel.
 */
export function HeroSection({
  eyebrow,
  title,
  description,
  action,
  variant = "home",
  theme,
  image = false,
}: HeroSectionProps) {
  const activeTheme: HeroTheme =
    theme ?? (variant === "home" ? "home" : "aurora");
  const spec = THEMES[activeTheme];
  const imageSrc =
    typeof image === "string" && image.length > 0 ? image : "/heroBg.jpg";

  // Reveal-on-scroll observer — runs locally so the marketing pages animate
  // without depending on app/page.tsx's setup.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".hero-reveal"),
    );
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
        "relative overflow-hidden",
        variant === "home"
          ? "min-h-[100svh] flex items-center justify-center"
          : "pt-32 pb-20 sm:pt-40 sm:pb-24",
      ].join(" ")}
    >
      {/* Base gradient (always present as a fallback) */}
      <div className={`absolute inset-0 -z-20 ${spec.base}`} />

      {/* Photographic backdrop — matches the home page hero image. */}
      {image && (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageSrc})`,
          }}
          aria-hidden
        />
      )}

      {/* Dark glassmorphic overlay layered on top of the image. The first
          div is a black wash for legibility; the second is a frosted
          gradient that fades into the bottom edge so the content card
          reads as a true glass surface. */}
      {image && (
        <>
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <div className="absolute inset-0 -z-10 backdrop-blur-[2px]" />
          <div
            className="absolute inset-0 -z-10 opacity-70"
            style={{ backgroundImage: spec.veil }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950 pointer-events-none" />
        </>
      )}

      {/* Color wash veil (used when no image is supplied) */}
      {!image && (
        <div
          className="absolute inset-0 -z-10 opacity-80"
          style={{ backgroundImage: spec.veil }}
        />
      )}

      {/* Subtle grid veil */}
      <div className="grid-veil" />

      {/* Floating glow orbs */}
      {spec.orbs.map((orb, idx) => (
        <div
          key={idx}
          className={`glow-orb parallax-drift ${orb.className}`}
          style={orb.style}
        />
      ))}

      {/* Bottom edge fade so content below reads as glassmorphic lift */}
      <div className="absolute inset-x-0 bottom-0 h-32 -z-10 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
        {eyebrow && (
          <p
            className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.28em] text-cyan-200/90 font-semibold px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md hero-reveal"
            style={{ "--reveal-delay": "0ms" } as CSSProperties}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
            {eyebrow}
          </p>
        )}
        <h1
          className="text-4xl sm:text-6xl font-semibold text-white leading-[1.1] tracking-tight hero-reveal"
          style={{ "--reveal-delay": "80ms" } as CSSProperties}
        >
          {title}
        </h1>
        {description && (
          <p
            className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto hero-reveal"
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
          >
            {description}
          </p>
        )}
        {action && (
          <div
            className="relative max-w-5xl mx-auto hero-reveal"
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