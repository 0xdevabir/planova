"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader, Badge } from "@/components/ui";

const steps = [
  {
    emoji: "🎯",
    title: "Drop a pin or search",
    desc: "Autocomplete and geocoding use our curated catalog first, with OpenStreetMap as enrichment.",
    detail: "Set radius and currency up front to bias the search toward what matters to you.",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    emoji: "🎛️",
    title: "Tune budget + dates",
    desc: "Guardrails keep results inside your min/max, currency, traveler count, and trip style.",
    detail: "Thumb-friendly sliders and date pickers update the pipeline instantly.",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    emoji: "🧭",
    title: "Pick vibes, review signals",
    desc: "Tell Planova the mood; rank by value, weather, availability, and safety before shortlisting.",
    detail: "Jump to booking, generate a day-by-day itinerary, or share the result.",
    gradient: "from-pink-400 to-purple-500",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />
      <HeroSection
        theme="indigo"
        image
        eyebrow="How it works"
        title={
          <>
            From tap to tailored
            <br />
            <span className="gradient-text">destinations</span>
          </>
        }
        description="Planova runs a resilient pipeline: capture intent, fan-out to providers, enrich with cost and weather, then rank for value."
        action={
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
            <Badge tone="vibe">Google + OSM fallback</Badge>
            <Badge tone="vibe">Budget guardrails</Badge>
            <Badge tone="vibe">Vibe-aware ranking</Badge>
          </div>
        }
      />

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Card key={step.title} variant="solid" interactive className="space-y-3">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-2xl`}>
                  <span aria-hidden>{step.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-700 leading-relaxed">{step.desc}</p>
                <p className="text-sm text-slate-600 leading-relaxed bg-cyan-50/60 rounded-xl p-3 border border-cyan-100">{step.detail}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <Card variant="solid" padding="roomy" className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Pipeline</p>
              <h3 className="text-2xl font-semibold text-slate-900">What happens after you search</h3>
              <ol className="mt-4 space-y-3 text-slate-700 text-sm">
                {[
                  "Resolve places from the curated catalog, then enrich with OpenStreetMap.",
                  "Fan-out to Places search; dedupe and normalize to destination cards.",
                  "Estimate flights/hotels/food to derive total and valueScore.",
                  "Apply vibe match bonus + sort by user-selected sort key.",
                  "Cache results for fast reruns and lower external calls.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="h-7 w-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
            <Card variant="solid" padding="roomy" className="bg-slate-900 text-white border-white/10 space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">Stack</p>
              <h3 className="text-2xl font-semibold">What powers Planova</h3>
              <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-white/85">
                {["Next.js App Router", "Tailwind 4", "TypeScript", "Leaflet", "OpenStreetMap", "Open-Meteo", "In-memory cache", "localStorage favorites"].map((item) => (
                  <div key={item} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm text-white/70 leading-relaxed">
                Production tip: set NEXT_PUBLIC_BASE_URL and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY so server fetches resolve correctly in your deployed domain.
              </div>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/features" className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-700 to-teal-600 text-white font-semibold hover:from-teal-800 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl">
              Explore features
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