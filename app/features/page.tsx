"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import type { CSSProperties } from "react";

const featureSets = [
  {
    title: "Map-first discovery",
    desc: "Tap anywhere, autocomplete smartly guesses intent, and we fetch details across providers for resilience.",
    points: ["Google + OSM fallback", "Tap-to-set coordinates", "Instant nearby relevance"],
  },
  {
    title: "Budget guardrails",
    desc: "Live ranges for flights, stays, food, and activities so you never fall in love with out-of-range options.",
    points: ["Transparent breakdowns", "Currency-aware inputs", "Sane defaults with quick sliders"],
  },
  {
    title: "Signal-rich cards",
    desc: "Safety, weather, availability, and value score are surfaced upfront for faster shortlists.",
    points: ["Availability badges", "Weather quick-look", "Value scoring at a glance"],
  },
  {
    title: "Calm UI everywhere",
    desc: "Responsive grids, thumb-friendly controls, and gentle micro-interactions that respect your focus.",
    points: ["Adaptive layouts", "Hover + scroll reveals", "Parallax atmospherics"],
  },
];

export default function FeaturesPage() {
  // Ensure reveal-on-scroll elements become visible in production where hydration might delay class application.
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
          <div className="glow-orb w-80 h-80 bg-cyan-400/25 -left-10 top-20 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-6 bottom-10 parallax-drift" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Features</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Everything you need to plan with clarity</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            From map-first selection to budget guardrails and signal-rich cards, Planova keeps every decision transparent.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Autocomplete + map picking</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Value scoring</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Safety + weather signals</span>
          </div>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal-on-scroll">
            {[{ label: "Live destinations fetched", value: "150k+" }, { label: "Avg. response time", value: "< 350ms" }, { label: "Coverage", value: "190+ countries" }].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <p className="text-sm text-slate-500 uppercase tracking-[0.12em]">{stat.label}</p>
                <p className="text-3xl font-semibold mt-2 text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureSets.map((item, idx) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] transition-shadow reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${60 + idx * 80}ms` } as CSSProperties}>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-100 to-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 16.382V5.618a1 1 0 00-1.553-.894L15 7" />}
                    {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    {idx === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />}
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-900">{item.title}</h2>
                <p className="text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
                <ul className="space-y-3 text-sm text-slate-700">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Experience</p>
                <h3 className="text-3xl font-semibold">Built to stay responsive</h3>
                <p className="text-white/80">Controls stay thumb-friendly on mobile, dense on desktop, and animated just enough to feel alive without slowing anything down.</p>
                <div className="flex flex-wrap gap-2 text-sm text-white/80">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Thumb reach safe zones</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Adaptive grids</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Micro-interactions</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Fast hydration</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                {["SSR + streaming", "Edge-friendly fetches", "Optimistic UI hooks", "Graceful fallbacks"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/85">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch reveal-on-scroll">
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pipeline</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2">From tap to tailored list</h3>
              <ol className="mt-4 space-y-3 text-slate-700 text-sm">
                {[
                  "User taps map or types a destination; we geocode and set coordinates.",
                  "API fan-out hits Google Places first; OSM/Nominatim backfills when needed.",
                  "Flight + hotel estimators generate cost ranges per traveler and date window.",
                  "Weather and availability signals enrich the card; valueScore ranks results.",
                  "Cache trims repeat calls so reruns are instant for similar queries.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="h-7 w-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Stack</p>
              <h3 className="text-2xl font-semibold mt-2">What powers Planova</h3>
              <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-white/85">
                {["Next.js App Router", "Server Actions", "Edge-ready APIs", "TypeScript", "Tailwind/PostCSS", "OpenStreetMap", "Google Places", "In-memory cache"].map((item) => (
                  <div key={item} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm text-white/70 leading-relaxed">
                Production note: set `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` so server fetches resolve to your live domain with full data quality.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/how-it-works" className="px-6 py-3 rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
              See how it works
            </Link>
            <Link href="/testimonials" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              Hear from travelers
            </Link>
            <Link href="/support" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              Get support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
