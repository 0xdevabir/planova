"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSearchBar from "@/components/HeroSearchBar";
import DestinationCard from "@/components/DestinationCard";
import ResultsMap from "@/components/ResultsMap";
import { SearchResponse } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const results = await response.json();

      // Navigate to recommendations page with search data
      const searchParams = new URLSearchParams({
        destination: formData.destination,
        latitude: formData.latitude.toString(),
        longitude: formData.longitude.toString(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budgetMin: formData.budgetMin.toString(),
        budgetMax: formData.budgetMax.toString(),
        travelers: formData.travelers.toString(),
        currency: formData.currency,
      });

      if (formData.vibes && Array.isArray(formData.vibes) && formData.vibes.length > 0) {
        searchParams.set("vibes", formData.vibes.join(","));
      }

      router.push(`/recommendations?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
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
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 w-full h-screen -z-10" 
        style={{ 
          backgroundImage: "url('/heroBg.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundAttachment: "fixed" 
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Navbar />

      {/* Fixed Hero Content */}
      <section className="fixed inset-0 w-full h-screen flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <div className="relative w-full max-w-5xl mx-auto px-4 pt-24 pb-16 lg:pt-28 text-center space-y-6 pointer-events-auto">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight reveal-on-scroll" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
            Your next adventure starts right here
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto reveal-on-scroll" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
            Discover tailored trips that fit your budget and style.
          </p>

          <div className="relative max-w-5xl mx-auto reveal-on-scroll" style={{ "--reveal-delay": "160ms" } as CSSProperties}>
            <HeroSearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </section>

      {/* Content Sections - with top spacing */}
      <div className="pt-screen" />
      <section className="relative bg-white rounded-t-3xl pt-16 pb-20 z-20">
          <div className="container mx-auto px-4 space-y-20 text-gray-900">
          <div id="features" className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3 reveal-on-scroll" style={{ "--reveal-delay": "40ms" } as CSSProperties}>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Built for modern travelers</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Futuristic, minimal, and human-friendly</h2>
              <p className="text-lg text-gray-600">Every module is responsive, with premium glass surfaces and tactile controls that work beautifully on small and large screens.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                title: "Map-first selection",
                desc: "Tap the map or use smart autocomplete with fallback geocoding so you never get stuck.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  </svg>
                ),
              }, {
                title: "Budget intelligence",
                desc: "Live guardrails plus transparent breakdowns for flights, stays, food, and activities.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              }, {
                title: "Signals you can trust",
                desc: "Availability, safety, and weather surface instantly so you can act fast.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              }].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] reveal-on-scroll"
                  style={{ "--reveal-delay": "80ms" } as CSSProperties}
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="how-it-works" className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3 reveal-on-scroll" style={{ "--reveal-delay": "40ms" } as CSSProperties}>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Three calm steps</p>
              <h2 className="text-3xl sm:text-4xl font-bold">From idea to itinerary faster</h2>
              <p className="text-lg text-gray-600">Designed for busy teams and solo explorers who want clarity without the chaos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                title: "1 · Set your intent",
                desc: "Choose place, dates, travelers, and budgets. Mobile controls keep everything thumb-reachable.",
              }, {
                title: "2 · Preview the signals",
                desc: "Instant map, live availability, and cost breakdowns so you can shortlist with confidence.",
              }, {
                title: "3 · Save and book",
                desc: "Pick the best-fit destination and keep a transparent total before you book.",
              }].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] reveal-on-scroll"
                  style={{ "--reveal-delay": "80ms" } as CSSProperties}
                >
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="impact" className="space-y-6">
            <div className="bg-linear-to-r from-cyan-50 via-white to-blue-50 border border-cyan-100 rounded-3xl p-10 shadow-[0_25px_80px_rgba(14,165,233,0.08)] reveal-on-scroll" style={{ "--reveal-delay": "60ms" } as CSSProperties}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-cyan-700">120K+</div>
                  <p className="text-gray-600 mt-2">Trips designed with Planova's calm planner</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cyan-700">18%</div>
                  <p className="text-gray-600 mt-2">Average savings with budget guardrails on</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cyan-700">4.8★</div>
                  <p className="text-gray-600 mt-2">Travelers love the clarity and speed</p>
                </div>
              </div>
            </div>
          </div>

          <div id="testimonials" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 reveal-on-scroll" style={{ "--reveal-delay": "40ms" } as CSSProperties}>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Voices from the road</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Travelers who switched to calm</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                quote: "Cost clarity killed my tab chaos. I booked in one evening.",
                name: "Nora A.",
                title: "Product designer, solo traveler",
              }, {
                quote: "Budget filters kept us honest for team offsites. No surprises.",
                name: "Jalen R.",
                title: "Team lead",
              }, {
                quote: "Map + recs felt curated, not ads. UI is peaceful on mobile.",
                name: "Sofia M.",
                title: "Weekend explorer",
              }].map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] reveal-on-scroll"
                  style={{ "--reveal-delay": "80ms" } as CSSProperties}
                >
                  <p className="text-gray-800 text-base leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="faq" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 reveal-on-scroll" style={{ "--reveal-delay": "40ms" } as CSSProperties}>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Questions, answered</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Clarity before you commit</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{
                    q: "What if a city has no results?",
                    a: "We try multiple data sources (Google + OpenStreetMap). Broaden the region or widen budget and dates to unlock more choices.",
                  }, {
                    q: "Do I need paid APIs?",
                    a: "No. Planova works with free-friendly defaults. Add your own keys only if you want richer detail.",
                  }, {
                    q: "Can I save destinations?",
                    a: "Favorites are coming. For now, copy a result and we’ll keep totals stable for your session.",
                  }, {
                    q: "Will prices stay current?",
                    a: "We refresh frequently. Re-run a search to sync flight and stay estimates before you book.",
                  }].map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] reveal-on-scroll"
                  style={{ "--reveal-delay": "80ms" } as CSSProperties}
                >
                  <div className="text-base font-semibold text-gray-900 mb-2">{item.q}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="support" className="space-y-6">
            <div className="bg-gray-900 text-white rounded-[28px] p-10 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-white/10 reveal-on-scroll" style={{ "--reveal-delay": "60ms" } as CSSProperties}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-3xl font-bold">Plan faster. Spend smarter.</h3>
                  <p className="text-gray-200 text-base">
                    Get curated destinations, transparent budgets, and a calm interface designed to help you book with confidence.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      Start planning
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a href="#faq" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                      Read FAQs
                    </a>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-sm text-gray-100 space-y-2">
                  <div className="flex justify-between"><span>Live pricing</span><span className="font-semibold">Enabled</span></div>
                  <div className="flex justify-between"><span>Weather assist</span><span className="font-semibold">Included</span></div>
                  <div className="flex justify-between"><span>Budget guardrails</span><span className="font-semibold">On</span></div>
                  <div className="flex justify-between"><span>Multi-source data</span><span className="font-semibold">Google + OSM</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <span className="font-semibold text-lg">Planova</span>
            </div>
            <div className="flex items-center gap-6 text-white/70 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-white/50 text-sm">© 2025 Planova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
