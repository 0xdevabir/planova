"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader, Badge } from "@/components/ui";

const featureSets = [
  {
    emoji: "🗺️",
    title: "Map-first discovery",
    desc: "Tap anywhere, autocomplete smartly guesses intent, and we fetch details across providers for resilience.",
    points: ["Catalog-first search", "OSM enrichment", "Tap-to-set coordinates"],
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    emoji: "💸",
    title: "Budget guardrails",
    desc: "Live ranges for flights, stays, food, and activities so you never fall in love with out-of-range options.",
    points: ["Transparent breakdowns", "Currency-aware inputs", "Sane defaults with quick sliders"],
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    emoji: "🎯",
    title: "Vibe-aware ranking",
    desc: "Tell us the mood — adventure, beach, food, romance — and Planova biases the list accordingly.",
    points: ["8 trip vibes", "Match bonus on value", "Mood-driven placeholders"],
    gradient: "from-pink-400 to-purple-500",
  },
  {
    emoji: "📅",
    title: "Day-by-day itinerary",
    desc: "Open any destination for a day plan built from real OpenStreetMap attractions and restaurants.",
    points: ["Real OSM places", "Stay & Eat tabs", "Cost estimates per day"],
    gradient: "from-amber-400 to-orange-500",
  },
  {
    emoji: "🆚",
    title: "Side-by-side compare",
    desc: "Select up to 3 destinations and see them in a rich comparison table — value, weather, vibes, availability.",
    points: ["Up to 3 picks", "Rich comparison modal", "Quick remove + clear"],
    gradient: "from-violet-400 to-indigo-500",
  },
  {
    emoji: "💖",
    title: "Save & share",
    desc: "Heart any destination for later, copy a shareable link, or post to WhatsApp in two clicks.",
    points: ["LocalStorage favorites", "Copy + X + WhatsApp + email", "Toast feedback everywhere"],
    gradient: "from-rose-400 to-pink-500",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection
        theme="cyan"
        image
        eyebrow="Features"
        title={
          <>
            Everything you need to plan
            <br />
            <span className="gradient-text">with clarity</span>
          </>
        }
        description="From map-first selection to budget guardrails and signal-rich cards, Planova keeps every decision transparent."
        action={
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
          >
            Start planning
          </Link>
        }
      />

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <SectionHeader
            eyebrow="Built for calm decisions"
            title="Why Planova feels different"
            description="Each feature was designed to remove a tiny bit of friction from planning — and add a little bit of joy."
            align="center"
            className="max-w-3xl mx-auto"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureSets.map((item, idx) => (
              <Card key={item.title} variant="solid" interactive className="space-y-3">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-2xl`}>
                  <span aria-hidden>{item.emoji}</span>
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm pt-6">
            <Link
              href="/how-it-works"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              See how it works
            </Link>
            <Link
              href="/testimonials"
              className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:border-cyan-600 hover:bg-cyan-50 transition-colors"
            >
              Hear from travelers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}