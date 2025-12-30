import Link from "next/link";
import Navbar from "@/components/Navbar";
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-2xl font-semibold">Built to stay responsive</h3>
                <p className="text-white/80">Our layout system keeps controls thumb-friendly on mobile while preserving density on desktop.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Thumb reach safe zones</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Adaptive grids</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Micro-interactions</span>
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
