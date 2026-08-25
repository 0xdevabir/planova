import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Travel Guides — Plan Better Trips",
  description:
    "Practical trip planning guides: how to plan a trip, budget travel tips, and weekend getaway ideas. Pair each guide with Planova’s free trip planner.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Travel Guides | Planova",
    description: "How-to guides for itineraries, budgets, and weekend trips.",
    url: `${getSiteUrl()}/guides`,
  },
};

const GUIDES = [
  {
    href: "/guides/how-to-plan-a-trip",
    title: "How to plan a trip (step by step)",
    blurb:
      "From picking dates to locking an itinerary — a clear process that works for first trips and frequent travelers.",
  },
  {
    href: "/guides/budget-trip-planner",
    title: "Budget trip planner guide",
    blurb:
      "Estimate flights, stays, food, and activities before you book — and find destinations that fit your number.",
  },
  {
    href: "/guides/weekend-getaway-ideas",
    title: "Weekend getaway ideas",
    blurb:
      "Short trips that feel complete: nearby cities, packing light, and a 2–3 day plan you can actually finish.",
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16 relative z-10 space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-teal-800">Guides</p>
          <h1 className="font-display text-4xl font-semibold text-stone-900 tracking-tight">
            Travel planning guides
          </h1>
          <p className="text-stone-600 leading-relaxed">
            Short, practical articles for people searching how to plan trips, stretch a budget, or
            escape for a weekend. Use each guide with{" "}
            <Link href="/" className="text-teal-800 font-semibold hover:underline">
              Planova
            </Link>{" "}
            or browse{" "}
            <Link href="/explore" className="text-teal-800 font-semibold hover:underline">
              destinations
            </Link>
            .
          </p>
        </header>

        <ul className="space-y-4">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="block rounded-2xl border border-stone-200 bg-white p-6 hover:border-teal-700/40 hover:shadow-md transition-all"
              >
                <h2 className="font-display text-2xl font-semibold text-stone-900">{g.title}</h2>
                <p className="text-stone-600 mt-2 leading-relaxed">{g.blurb}</p>
                <p className="text-sm text-teal-800 font-semibold mt-4">Read guide →</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
