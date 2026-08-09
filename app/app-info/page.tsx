"use client";

import Link from "next/link";
import type React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, SectionHeader } from "@/components/ui";

export default function AppInfoPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection
        theme="violet"
        eyebrow="Get the app"
        title={
          <>
            Planova in your
            <br />
            <span className="gradient-text">pocket</span>
          </>
        }
        description="Native mobile experience is on the way. Sign up for early access and we'll let you know when it's ready."
        variant="compact"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Plan on the web
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              See features
            </Link>
          </div>
        }
      />

      <section className="relative bg-white text-slate-900 rounded-t-4xl -mt-8 pb-16 pt-10">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <SectionHeader
            eyebrow="What's coming"
            title="Mobile-first, with the same calm"
            description="Favorites offline, push notifications when prices drop, and a faster way to tinker on the go."
            align="center"
            className="max-w-2xl mx-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="solid" interactive className="space-y-2">
              <div className="text-3xl" aria-hidden>📱</div>
              <h3 className="text-xl font-semibold">iOS & Android</h3>
              <p className="text-slate-600 text-sm">Native shells with the same glassmorphic UI you love on the web.</p>
            </Card>
            <Card variant="solid" interactive className="space-y-2">
              <div className="text-3xl" aria-hidden>🔔</div>
              <h3 className="text-xl font-semibold">Smart alerts</h3>
              <p className="text-slate-600 text-sm">Opt-in notifications when prices drop or your saved destinations update.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}