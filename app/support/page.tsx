"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import type { CSSProperties } from "react";

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
  {
    q: "Why are destinations empty after deployment?",
    a: "Set NEXT_PUBLIC_BASE_URL to your live domain in production env vars so server fetches resolve correctly.",
  },
  {
    q: "How accurate are the cost estimates?",
    a: "Flight and hotel prices are estimates based on market data. Always verify final prices with booking providers.",
  },
  {
    q: "Can I use Planova offline?",
    a: "No, Planova requires an internet connection to fetch live destination data, weather, and pricing.",
  },
  {
    q: "Is my search data private?",
    a: "Yes. We don't track or sell your search history. Your privacy is our priority.",
  },
];

const troubleshooting = [
  {
    title: "No destinations showing",
    steps: [
      "Check NEXT_PUBLIC_BASE_URL is set in production",
      "Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured",
      "Try widening search radius or budget range",
      "Check browser console for API errors",
    ],
  },
  {
    title: "Map not loading",
    steps: [
      "Ensure Google Maps API key is valid",
      "Check API key has Maps JavaScript API enabled",
      "Verify domain restrictions allow your site",
      "Clear browser cache and reload",
    ],
  },
  {
    title: "Slow search results",
    steps: [
      "First search warms the cache (expect 2-4s)",
      "Subsequent searches use cached data (< 500ms)",
      "Check network tab for slow external API calls",
      "Consider reducing search radius",
    ],
  },
];

const resources = [
  { title: "Getting Started", desc: "Quick setup guide", href: "#" },
  { title: "API Reference", desc: "Documentation for developers", href: "#" },
  { title: "Best Practices", desc: "Tips for optimal searches", href: "#" },
  { title: "Changelog", desc: "Latest updates and features", href: "#" },
];

export default function SupportPage() {
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
          <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-10 border-2 border-emerald-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.35)] reveal-on-scroll" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
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
              <div key={item.q} className="rounded-3xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all reveal-on-scroll hover-lift" style={{ "--reveal-delay": `${120 + idx * 60}ms` } as CSSProperties}>
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 text-cyan-600 font-bold">?</div>
                <div className="text-lg font-bold text-slate-900 mb-3">{item.q}</div>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 reveal-on-scroll">
            {troubleshooting.map((guide, idx) => (
              <div key={guide.title} className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]" style={{ "--reveal-delay": `${200 + idx * 60}ms` } as CSSProperties}>
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{guide.title}</h3>
                <ol className="space-y-2 text-sm text-slate-700">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-600 font-semibold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal-on-scroll">
            {resources.map((resource) => (
              <Link key={resource.title} href={resource.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:border-cyan-300 transition-all hover-lift">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{resource.title}</div>
                    <div className="text-xs text-slate-600 mt-1">{resource.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-3xl bg-linear-to-r from-cyan-50 via-blue-50 to-indigo-50 border-2 border-cyan-200 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] reveal-on-scroll">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-cyan-200">
                <div>
                  <div className="font-bold text-slate-900 mb-1">Email</div>
                  <div className="text-slate-700">support@planova.app</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Response time</div>
                  <div className="text-slate-700">Within 1 business day</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Community</div>
                  <div className="text-slate-700">GitHub Discussions</div>
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
            <Link href="/testimonials" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors">
              Read testimonials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
