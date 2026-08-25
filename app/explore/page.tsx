import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CATALOG, toSlug } from "@/lib/data/destinations";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Explore Destinations — Trip Ideas by City",
  description:
    "Browse trip destinations worldwide. Open any city for a budget trip plan, itinerary ideas, hotels, and restaurants with Planova.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore Destinations | Planova",
    description: "City-by-city trip ideas with budget estimates and itineraries.",
    url: `${getSiteUrl()}/explore`,
  },
};

export default function ExploreIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}) {
  return <ExploreIndex searchParams={searchParams} />;
}

async function ExploreIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().toLowerCase();
  const region = (sp.region || "").trim();

  const regions = Array.from(new Set(CATALOG.map((c) => c.region))).sort();
  let list = CATALOG.slice().sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
  if (region) list = list.filter((c) => c.region === region);
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q),
    );
  }

  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 relative z-10 space-y-8">
        <header className="space-y-3 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-teal-800">Explore</p>
          <h1 className="font-display text-4xl font-semibold text-stone-900 tracking-tight">
            Destinations worth planning
          </h1>
          <p className="text-stone-600 leading-relaxed">
            Pick a city to see trip ideas, budget ranges, and a one-click start into the Planova
            planner. Built for searches like “Paris itinerary”, “budget trip to Bali”, and
            “weekend from Dhaka”.
          </p>
        </header>

        <form className="flex flex-col sm:flex-row gap-3" action="/explore" method="get">
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="Search city or country"
            className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900"
          />
          <select
            name="region"
            defaultValue={region}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-teal-700 text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-800"
          >
            Filter
          </button>
        </form>

        <p className="text-sm text-stone-500">
          Showing {list.length} destination{list.length === 1 ? "" : "s"}
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => (
            <li key={c.placeId}>
              <Link
                href={`/explore/${toSlug(c)}`}
                className="block h-full rounded-2xl border border-stone-200 bg-white p-5 hover:border-teal-700/40 hover:shadow-md transition-all"
              >
                <div className="text-xs uppercase tracking-wide text-stone-500">{c.region}</div>
                <h2 className="font-display text-xl font-semibold text-stone-900 mt-1">{c.name}</h2>
                <p className="text-sm text-stone-600 mt-1">{c.country}</p>
                <p className="text-sm text-stone-500 mt-3 line-clamp-2">{c.summary || c.description}</p>
                <p className="text-xs text-teal-800 font-semibold mt-4">Plan a trip →</p>
              </Link>
            </li>
          ))}
        </ul>

        {list.length === 0 && (
          <p className="text-stone-600">No matches. Try another city or clear filters.</p>
        )}
      </main>
    </div>
  );
}
