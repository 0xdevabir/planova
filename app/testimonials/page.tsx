"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader, StatTile } from "@/components/ui";

const voices = [
  {
    quote: "Cost clarity killed my tab chaos. I booked in one evening.",
    name: "Nora A.",
    title: "Product designer, solo traveler",
    location: "Brooklyn, NY",
  },
  {
    quote: "Vibe filter kept us aligned for a romantic anniversary trip. No surprises.",
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
    quote: "Day-by-day itinerary saved me hours of planning. Loved the cost breakdowns.",
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
    quote: "The compare modal helped me decide in 5 minutes.",
    name: "Alex P.",
    title: "Budget backpacker",
    location: "Melbourne, AU",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />
      <HeroSection
        image
        eyebrow="Testimonials"
        title={
          <>
            Travelers who switched
            <br />
            <span className="gradient-text">to calm planning</span>
          </>
        }
        description="Real feedback from people who needed clarity, speed, and transparent budgets."
      />

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile accent="cyan" label="Active users" value="12k+" />
            <StatTile accent="emerald" label="Destinations searched" value="850k+" />
            <StatTile accent="violet" label="Avg. satisfaction" value="4.8/5" />
          </div>

          <SectionHeader
            eyebrow="Voices"
            title="What people are saying"
            align="center"
            className="max-w-2xl mx-auto"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voices.map((voice) => (
              <Card key={voice.name} variant="solid" interactive className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-800 text-lg leading-relaxed font-medium italic">"{voice.quote}"</p>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{voice.name}</div>
                    <div className="text-xs text-slate-500">{voice.title}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span aria-hidden>📍</span>
                    <span>{voice.location}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card variant="solid" padding="roomy" className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest font-bold text-cyan-700">Ready to plan calm?</p>
              <h3 className="text-2xl font-bold text-slate-900">Join travelers who trust Planova</h3>
              <p className="text-slate-700">Start planning your next adventure with clarity and confidence.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold hover:from-teal-800 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl">
                Get started free
              </Link>
              <Link href="/how-it-works" className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 font-bold hover:border-cyan-600 hover:bg-white transition-colors">
                Learn more
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}