"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import type { CSSProperties } from "react";

const voices = [
  {
    quote: "Cost clarity killed my tab chaos. I booked in one evening.",
    name: "Nora A.",
    title: "Product designer, solo traveler",
    location: "Brooklyn, NY",
  },
  {
    quote: "Budget filters kept us honest for team offsites. No surprises.",
    name: "Jalen R.",
    title: "Team lead",
    location: "Austin, TX",
  },
  {
    quote: "Map + recs felt curated, not ads. UI is peaceful on mobile.",
    name: "Sofia M.",
    title: "Weekend explorer",
    location: "Madrid, Spain",
  },
  {
    quote: "Signals show me weather and availability instantly—no digging.",
    name: "Liam T.",
    title: "Adventure planner",
    location: "Vancouver, BC",
  },
  {
    quote: "Finally a travel tool that doesn't feel like a sales funnel.",
    name: "Maya K.",
    title: "Digital nomad",
    location: "Bali, Indonesia",
  },
  {
    quote: "The value score helped me pick the best destination for my budget.",
    name: "Alex P.",
    title: "Budget backpacker",
    location: "Melbourne, AU",
  },
];

const stats = [
  { label: "Active users", value: "12k+" },
  { label: "Destinations searched", value: "850k+" },
  { label: "Avg. satisfaction", value: "4.8/5" },
];

export default function TestimonialsPage() {
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
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal-on-scroll">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <p className="text-sm text-slate-500 uppercase tracking-[0.12em]">{stat.label}</p>
                <p className="text-3xl font-semibold mt-2 text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voices.map((voice, idx) => (
              <div key={voice.name} className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${60 + idx * 60}ms` } as CSSProperties}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-800 text-lg leading-relaxed mb-6 font-medium italic">"{voice.quote}"</p>
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{voice.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{voice.title}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{voice.location}</span>
                  </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch reveal-on-scroll">
            <div className="rounded-3xl bg-slate-900 text-white p-8 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Why they stay</p>
                <h3 className="text-3xl font-semibold">What keeps travelers coming back</h3>
                <ul className="grid grid-cols-1 gap-3 text-sm text-white/85">
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <span>Budget guardrails prevent surprise totals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <span>Signals (weather/safety/availability) upfront</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <span>Touch-friendly search bar for mobile use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <span>Calm, focused interface with no popups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <span>Value scoring helps pick best-fit destinations</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-cyan-50 to-blue-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Trust signals</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2 mb-6">Built with transparency</h3>
              <div className="space-y-4 text-slate-700 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-cyan-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Privacy first</div>
                    <div className="text-slate-600">No tracking pixels, no hidden data sales. Your search history stays yours.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-cyan-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Honest costs</div>
                    <div className="text-slate-600">Transparent breakdowns, no affiliate redirects disguised as "recommendations."</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-cyan-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Always improving</div>
                    <div className="text-slate-600">We listen to user feedback and ship updates regularly to make planning easier.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/features" className="px-6 py-3 rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
              Explore features
            </Link>
            <Link href="/how-it-works" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              See how it works
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
