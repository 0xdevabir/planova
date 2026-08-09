"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSearchBar from "@/components/HeroSearchBar";
import DestinationCard from "@/components/DestinationCard";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader, Badge } from "@/components/ui";

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

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection
        eyebrow="Planova · Smart travel planner"
        title={
          <>
            Your next adventure
            <br />
            <span className="gradient-text">starts right here</span>
          </>
        }
        description="Pick a place, dates, budget, and the vibe you're after. Planova surfaces destinations ranked by value, weather, availability, and safety — so you can book with confidence."
        action={<HeroSearchBar onSearch={handleSearch} loading={loading} />}
      />

      <section className="relative bg-white rounded-t-3xl pt-16 pb-20 z-20">
        <div className="container mx-auto px-4 space-y-20 text-gray-900">
          <div id="features" className="space-y-10">
            <SectionHeader
              eyebrow="Built for modern travelers"
              title="Futuristic, calm, and human-friendly"
              description="Every module is responsive, with premium glass surfaces and tactile controls that work beautifully on small and large screens."
              align="center"
              className="max-w-3xl mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Map-first selection",
                  desc: "Tap the map or use smart autocomplete with fallback geocoding so you never get stuck.",
                  emoji: "🗺️",
                  gradient: "from-cyan-400 via-sky-500 to-blue-500",
                },
                {
                  title: "Budget intelligence",
                  desc: "Live guardrails plus transparent breakdowns for flights, stays, food, and activities.",
                  emoji: "💸",
                  gradient: "from-emerald-400 via-teal-500 to-cyan-500",
                },
                {
                  title: "Vibe-aware ranking",
                  desc: "Tell us the mood — adventure, beach, food — and Planova biases the list accordingly.",
                  emoji: "✨",
                  gradient: "from-pink-400 via-fuchsia-500 to-purple-500",
                },
              ].map((item) => (
                <Card key={item.title} variant="solid" interactive className="space-y-3">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-2xl`}>
                    <span aria-hidden>{item.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div id="how-it-works" className="space-y-10">
            <SectionHeader
              eyebrow="Three calm steps"
              title="From idea to itinerary faster"
              description="Designed for busy teams and solo explorers who want clarity without the chaos."
              align="center"
              className="max-w-3xl mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "1 · Set your intent",
                  desc: "Choose place, dates, travelers, budget, and a vibe. Mobile controls keep everything thumb-reachable.",
                },
                {
                  title: "2 · Preview the signals",
                  desc: "Instant map, live availability, and cost breakdowns so you can shortlist with confidence.",
                },
                {
                  title: "3 · Save, share, or plan",
                  desc: "Compare side-by-side, copy a shareable link, and pull up a day-by-day itinerary.",
                },
              ].map((item) => (
                <Card key={item.title} variant="solid" className="space-y-3">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div id="impact" className="space-y-6">
            <Card variant="solid" padding="roomy" className="bg-gradient-to-r from-cyan-50 via-white to-blue-50 border-cyan-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {[
                  { value: "120K+", label: "Trips designed with Planova's calm planner" },
                  { value: "18%", label: "Average savings with budget guardrails on" },
                  { value: "4.8★", label: "Travelers love the clarity and speed" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                    <p className="text-gray-600 mt-2 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div id="testimonials" className="space-y-8">
            <SectionHeader
              eyebrow="Voices from the road"
              title="Travelers who switched to calm"
              align="center"
              className="max-w-2xl mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Cost clarity killed my tab chaos. I booked in one evening.",
                  name: "Nora A.",
                  title: "Product designer, solo traveler",
                },
                {
                  quote: "Vibe filter kept us aligned for a romantic anniversary trip. No surprises.",
                  name: "Jalen R.",
                  title: "Team lead",
                },
                {
                  quote: "Map + recs felt curated, not ads. UI is peaceful on mobile.",
                  name: "Sofia M.",
                  title: "Weekend explorer",
                },
              ].map((t) => (
                <Card key={t.name} variant="solid" className="space-y-3">
                  <p className="text-gray-800 text-base leading-relaxed">"{t.quote}"</p>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.title}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div id="faq" className="space-y-8">
            <SectionHeader
              eyebrow="Questions, answered"
              title="Clarity before you commit"
              align="center"
              className="max-w-2xl mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: "What if a city has no results?",
                  a: "We try Google Places first and fall back to OpenStreetMap. Broaden the region or widen the budget to unlock more choices.",
                },
                {
                  q: "Do I need paid APIs?",
                  a: "No. Planova works with free-friendly defaults and ships smart estimators that don't require a key.",
                },
                {
                  q: "Can I save destinations?",
                  a: "Yes — heart any card to add it to your local favorites. They persist across reloads.",
                },
                {
                  q: "Will prices stay current?",
                  a: "Estimates use geographic distance and country-tier data. Re-run a search before booking to refresh.",
                },
              ].map((item) => (
                <Card key={item.q} variant="solid" padding="tight" className="space-y-2">
                  <div className="text-base font-semibold text-gray-900">{item.q}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>

          <div id="support" className="space-y-6">
            <Card variant="solid" padding="roomy" className="bg-slate-900 text-white border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-3xl font-bold">Plan faster. Spend smarter.</h3>
                  <p className="text-gray-200 text-base">
                    Get curated destinations, transparent budgets, and a calm interface designed to help you book with confidence.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#features"
                      className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Start planning
                    </a>
                    <a
                      href="#faq"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                    >
                      Read FAQs
                    </a>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-sm text-gray-100 space-y-2">
                  <div className="flex justify-between"><span>Live pricing</span><span className="font-semibold">Enabled</span></div>
                  <div className="flex justify-between"><span>Weather assist</span><span className="font-semibold">Included</span></div>
                  <div className="flex justify-between"><span>Budget guardrails</span><span className="font-semibold">On</span></div>
                  <div className="flex justify-between"><span>Vibe ranking</span><span className="font-semibold">Yes</span></div>
                </div>
              </div>
            </Card>
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
            <p className="text-white/50 text-sm">© 2026 Planova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}