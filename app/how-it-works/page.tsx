import type React from "react";
import Navbar from "@/components/Navbar";

const steps = [
  {
    title: "Drop a pin or search",
    desc: "Use map tap or autocomplete. We resolve coordinates with Google + OSM fallback to stay resilient.",
    detail: "You can also fine-tune radius and currency up front for better matches.",
  },
  {
    title: "Tune budget + dates",
    desc: "Guardrails make sure results respect min/max, currency, travelers, and trip type preferences.",
    detail: "Live sliders + date pickers are thumb-friendly and update suggestions instantly.",
  },
  {
    title: "Review signals, then shortlist",
    desc: "Each destination surfaces value score, availability, safety, and weather so you can decide fast.",
    detail: "Save favorites (coming soon) or jump to booking with transparent totals.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-white text-white">
      <Navbar />
      <section className="relative parallax-shell overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="grid-veil" />
        <div className="parallax-layer">
          <div className="glow-orb w-72 h-72 bg-cyan-400/25 -left-10 top-12 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-2 bottom-12 parallax-drift" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">How it works</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Three calm steps from idea to itinerary</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Planova keeps the path simple: find, tune, and act—without noise.
          </p>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={step.title} className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${60 + idx * 80}ms` } as React.CSSProperties}>
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

          <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold">Why it feels calmer</h3>
              <p className="text-white/80">No popups, no heavy modals. Just progressive disclosure and quick feedback as you make choices.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Auto-scrolls to results after search</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Transparent cost breakdowns</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Availability badges up front</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Weather + safety signals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
