"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader, Badge } from "@/components/ui";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection
        theme="mint"
        image
        eyebrow="Support"
        title={
          <>
            We've got your
            <br />
            <span className="gradient-text">back, always</span>
          </>
        }
        description="Quick answers, helpful docs, and a friendly inbox — pick whichever channel works for you."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Badge tone="vibe">24h email response</Badge>
            <Badge tone="vibe">Self-serve docs</Badge>
            <Badge tone="vibe">Status page</Badge>
          </div>
        }
      />

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: "📧", title: "Email", desc: "Reach the team at support@planova.app — usually within 24 hours." },
              { emoji: "📚", title: "Docs", desc: "Search the knowledge base for the most common questions." },
              { emoji: "🛟", title: "Status", desc: "Live status for places, weather, and our API integrations." },
            ].map((c) => (
              <Card key={c.title} variant="solid" interactive className="space-y-2">
                <div className="text-3xl" aria-hidden>{c.emoji}</div>
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-slate-600 text-sm">{c.desc}</p>
              </Card>
            ))}
          </div>

          <SectionHeader
            eyebrow="FAQ"
            title="Quick answers"
            align="center"
            className="max-w-2xl mx-auto"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "Is Planova free?",
                a: "Yes — the planner and favorites are free. Premium tiers will add group planning and live booking later.",
              },
              {
                q: "Do you sell my data?",
                a: "Never. Favorites stay in your browser. Server logs are minimal and never sold.",
              },
              {
                q: "Why are estimates sometimes off?",
                a: "We use geography + country-tier data to estimate without paid APIs. Re-run before booking.",
              },
              {
                q: "Can I suggest a destination?",
                a: "Absolutely — use the contact channel below and our team adds new places weekly.",
              },
            ].map((item) => (
              <Card key={item.q} variant="solid" padding="tight" className="space-y-2">
                <div className="text-base font-semibold text-slate-900">{item.q}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </Card>
            ))}
          </div>

          <Card variant="solid" padding="roomy" className="bg-slate-900 text-white border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">Still stuck?</p>
              <h3 className="text-2xl font-bold mt-1">Drop us a line</h3>
              <p className="text-white/70 text-sm mt-1">Our team responds within one business day, often sooner.</p>
            </div>
            <Link
              href="mailto:support@planova.app"
              className="px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors"
            >
              support@planova.app
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}