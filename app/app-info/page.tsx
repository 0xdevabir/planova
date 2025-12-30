import Link from "next/link";
import type React from "react";

export default function AppInfoPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-white text-white">
      <section className="relative parallax-shell overflow-hidden pb-16 pt-28 sm:pt-32">
        <div className="grid-veil" />
        <div className="parallax-layer">
          <div className="glow-orb w-72 h-72 bg-cyan-400/25 -left-12 top-12 parallax-drift" />
          <div className="glow-orb w-64 h-64 bg-indigo-500/25 right-4 bottom-10 parallax-drift" style={{ animationDelay: "-1.8s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Mobile apps</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Planova app is coming soon</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Native iOS and Android apps are in flight. Expect offline-ready shortlists, push signals for price/weather shifts, and shared trip boards.
          </p>
        </div>
      </section>

      <section className="relative bg-white text-slate-900 rounded-t-[32px] -mt-10 pb-16 pt-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: "Offline shortlist",
              desc: "Save destinations and cost breakdowns for offline access on the go.",
            }, {
              title: "Signals to your lock screen",
              desc: "Weather swings, price drops, and availability nudges as timely, quiet notifications.",
            }, {
              title: "Shared boards",
              desc: "Collaborate with friends or teammates, react to picks, and keep budgets aligned.",
            }].map((card, idx) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] reveal-on-scroll" style={{ "--reveal-delay": `${60 + idx * 80}ms` } as React.CSSProperties}>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Get notified when it ships</h3>
                <p className="text-white/80">Join the waitlist and be first to try beta builds.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">iOS TestFlight (planned)</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Android beta (planned)</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Email alerts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            <Link href="/support" className="px-4 py-2 rounded-full border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-colors">
              Visit support
            </Link>
            <Link href="/features" className="px-4 py-2 rounded-full border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-colors">
              Explore features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
