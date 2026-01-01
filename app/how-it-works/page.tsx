"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import type { CSSProperties } from "react";

const steps = [
  {
    title: "Drop a pin or search",
    desc: "Map tap or autocomplete resolves coordinates with Google first and OSM as a resilient fallback.",
    detail: "Set radius and currency up front to bias the search toward what matters to you.",
  },
  {
    title: "Tune budget + dates",
    desc: "Guardrails keep results inside your min/max, currency, traveler count, and trip style.",
    detail: "Thumb-friendly sliders and date pickers update the pipeline instantly.",
  },
  {
    title: "Review signals, then shortlist",
    desc: "Value score, availability, safety, and weather surface early so you can act fast.",
    detail: "Jump to booking with transparent totals, or save favorites (coming soon).",
  },
];

const pillars = [
  {
    title: "Data resilience",
    points: ["Google Places primary", "OSM/Nominatim fallback", "Cache to cut redundant calls"],
  },
  {
    title: "Budget clarity",
    points: ["Flight + hotel estimators", "Daily cost band", "ValueScore ranks what’s worth it"],
  },
  {
    title: "Signal-first UI",
    points: ["Availability badges", "Weather + safety hints", "Micro-interactions kept subtle"],
  },
  {
    title: "Fast everywhere",
    points: ["Edge-friendly fetches", "Deferred hydration cues", "Lightweight in-memory cache"],
  },
];

export default function HowItWorks() {
  // Reveal-on-scroll support with graceful fallback when IntersectionObserver is unavailable.
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll")) as HTMLElement[];
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-white text-white">
      <Navbar />

      <section className="relative parallax-shell overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="grid-veil" />
        <div className="parallax-layer">
          <div className="glow-orb w-72 h-72 bg-cyan-400/25 -left-10 top-12 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-2 bottom-12 parallax-drift" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">How it works</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">From tap to tailored destinations</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Planova runs a resilient pipeline: capture intent, fan-out to providers, enrich with cost and weather, then rank for value.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Google + OSM fallback</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Budget guardrails</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Value scoring</span>
          </div>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-18 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal-on-scroll">
            {[{ label: "Coverage", value: "190+ countries" }, { label: "Median API latency", value: "< 350ms" }, { label: "Cache window", value: "6–24h smart" }].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <p className="text-sm text-slate-500 uppercase tracking-[0.12em]">{stat.label}</p>
                <p className="text-3xl font-semibold mt-2 text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift"
                style={{ "--reveal-delay": `${60 + idx * 80}ms` } as CSSProperties}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="text-xs uppercase tracking-widest font-bold text-cyan-600">Step {idx + 1}</div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-900">{step.title}</h2>
                <p className="text-slate-700 mb-3 leading-relaxed font-medium">{step.desc}</p>
                <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 rounded-xl p-3 border border-blue-200">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch reveal-on-scroll">
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pipeline</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2">What happens after you search</h3>
              <ol className="mt-4 space-y-3 text-slate-700 text-sm">
                {["Geocode via Google first; fall back to OSM when needed.", "Fan-out to Places search; dedupe and normalize to destination cards.", "Estimate flights/hotels/food to derive total and ValueScore.", "Fetch weather + availability signals; annotate cards.", "Cache results for fast reruns and lower external calls."].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="h-7 w-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Pillars</p>
              <h3 className="text-2xl font-semibold mt-2">Why it feels reliable</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-white/85">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="text-white font-semibold text-sm">{pillar.title}</div>
                    {pillar.points.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-white/80">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm text-white/70 leading-relaxed">
                Production tip: set NEXT_PUBLIC_BASE_URL and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY so server fetches resolve correctly in your deployed domain.
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Experience</p>
                <h3 className="text-3xl font-semibold">Stay in flow</h3>
                <p className="text-white/80">Auto-scroll to results, minimal popups, and instant feedback on each tweak keep you moving without friction.</p>
                <div className="flex flex-wrap gap-2 text-sm text-white/80">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Optimistic UI paths</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Scroll-linked reveals</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Thumb-friendly controls</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">No modal traps</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 text-sm text-white/85">
                {["SSR + streaming for speed", "Edge-friendly fetch strategy", "IntersectionObserver reveals", "Graceful fallback when JS is delayed"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/features" className="px-6 py-3 rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
              Explore features
            </Link>
            <Link href="/support" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              Get support
            </Link>
            <Link href="/testimonials" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              Hear from travelers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
