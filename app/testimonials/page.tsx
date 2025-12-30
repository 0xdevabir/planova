import type React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const voices = [
  {
    quote: "Cost clarity killed my tab chaos. I booked in one evening.",
    name: "Nora A.",
    title: "Product designer, solo traveler",
  },
  {
    quote: "Budget filters kept us honest for team offsites. No surprises.",
    name: "Jalen R.",
    title: "Team lead",
  },
  {
    quote: "Map + recs felt curated, not ads. UI is peaceful on mobile.",
    name: "Sofia M.",
    title: "Weekend explorer",
  },
  {
    quote: "Signals show me weather and availability instantly—no digging.",
    name: "Liam T.",
    title: "Adventure planner",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-white text-white">
      <Navbar />
      <section className="relative parallax-shell overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="grid-veil" />
        <div className="parallax-layer">
          <div className="glow-orb w-72 h-72 bg-cyan-400/25 -left-6 top-14 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-4 bottom-8 parallax-drift" style={{ animationDelay: "-1.5s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Testimonials</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Travelers who switched to calm planning</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Real feedback from people who needed clarity, speed, and transparent budgets.
          </p>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voices.map((voice, idx) => (
              <div key={voice.name} className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${60 + idx * 60}ms` } as React.CSSProperties}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-800 text-lg leading-relaxed mb-6 font-medium italic">"{voice.quote}"</p>
                <div className="border-t border-slate-200 pt-4">
                  <div className="text-sm font-bold text-slate-900">{voice.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{voice.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-linear-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] reveal-on-scroll">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-widest font-bold text-cyan-600">Ready to plan calm?</p>
                <h3 className="text-3xl font-bold text-slate-900">Join travelers who trust Planova</h3>
                <p className="text-slate-700 text-lg">Start planning your next adventure with clarity and confidence.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/" className="px-7 py-3 rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  Get started free
                </Link>
                <Link href="/how-it-works" className="px-7 py-3 rounded-full border-2 border-slate-300 text-slate-900 font-bold hover:border-cyan-600 hover:bg-white transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Why they stay</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Budget guardrails prevent surprise totals</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Signals (weather/safety/availability) upfront</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Touch-friendly search bar for mobile use</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Calm, focused interface with no popups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
