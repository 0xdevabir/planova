import type React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const faqs = [
  {
    q: "What if a city has no results?",
    a: "We query multiple sources (Google + OSM). Try a broader region, widen budget/dates, or adjust the radius.",
  },
  {
    q: "Do I need paid APIs?",
    a: "No. Planova runs on free-friendly defaults. Add your own keys only if you want richer details.",
  },
  {
    q: "Can I save destinations?",
    a: "Favorites are coming soon. For now, copy a result and we keep totals stable for your session.",
  },
  {
    q: "Is pricing live?",
    a: "We refresh frequently. Re-run a search to sync flight and stay estimates before you book.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-white text-white">
      <Navbar />
      <section className="relative parallax-shell overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="grid-veil" />
        <div className="parallax-layer">
          <div className="glow-orb w-72 h-72 bg-cyan-400/25 -left-12 top-10 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-6 bottom-8 parallax-drift" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Support</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">We keep things calm and clear</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Quick answers and status details so you always know what to expect.
          </p>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-10 border-2 border-emerald-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll" style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Status</p>
                <h3 className="text-2xl font-semibold">Services are healthy</h3>
                <p className="text-white/80">Live pricing, weather assist, and budget guardrails are online.</p>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex justify-between"><span>Live pricing</span><span className="font-semibold text-emerald-200">Operational</span></div>
                <div className="flex justify-between"><span>Weather assist</span><span className="font-semibold text-emerald-200">Operational</span></div>
                <div className="flex justify-between"><span>Budget guardrails</span><span className="font-semibold text-emerald-200">Operational</span></div>
                <div className="flex justify-between"><span>Multi-source data</span><span className="font-semibold text-emerald-200">Operational</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((item, idx) => (
              <div key={item.q} className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${120 + idx * 60}ms` } as React.CSSProperties}>
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 text-cyan-600 font-bold">?</div>
                <div className="text-lg font-bold text-slate-900 mb-3">{item.q}</div>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-linear-to-r from-cyan-50 via-blue-50 to-indigo-50 border-2 border-cyan-200 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] reveal-on-scroll" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Can't find what you need?</h3>
                <p className="text-slate-700 mb-4 text-lg">Reach out to our support team. We reply within one business day.</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <a href="mailto:support@planova.app" className="px-6 py-3 rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                    Email us
                  </a>
                  <Link href="/features" className="px-6 py-3 rounded-full border-2 border-slate-300 text-slate-900 font-bold hover:border-cyan-600 hover:bg-white transition-colors">
                    Explore features
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t-2 border-cyan-200">
                <div>
                  <div className="font-bold text-slate-900 mb-1">Email</div>
                  <div className="text-slate-700">support@planova.app</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Response time</div>
                  <div className="text-slate-700">Within 1 business day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
