import type { Metadata } from "next";
import Link from "next/link";
import { GuideH2, GuideShell } from "@/components/GuideShell";
import { getSiteUrl } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/jsonld";

const title = "How to Plan a Trip — Step-by-Step Guide";
const description =
  "Learn how to plan a trip from scratch: choose dates, set a budget, pick destinations, build a day-by-day itinerary, and book stays without overwhelm.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "how to plan a trip",
    "trip planning checklist",
    "travel itinerary guide",
    "vacation planning steps",
  ],
  alternates: { canonical: "/guides/how-to-plan-a-trip" },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/guides/how-to-plan-a-trip`,
    type: "article",
  },
};

export default function HowToPlanTripPage() {
  const siteUrl = getSiteUrl();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: "Planova" },
    publisher: { "@type": "Organization", name: "Planova", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/guides/how-to-plan-a-trip`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <GuideShell
        eyebrow="Trip planning"
        title="How to plan a trip (without the chaos)"
        lead="A simple sequence most travelers skip: lock constraints first, then explore options. You’ll waste less time comparing cities that don’t fit your dates or money."
      >
        <GuideH2>1. Lock the non‑negotiables</GuideH2>
        <p>
          Start with departure city, travel window, trip length, and who is going. These four facts
          cut thousands of destinations down to a realistic shortlist. Soft preferences (beach vs
          city, food vs hiking) come later.
        </p>

        <GuideH2>2. Set a total budget, then split it</GuideH2>
        <p>
          Decide a ceiling for the whole trip, then roughly allocate: transport, lodging, food, and
          activities. A common starting split for mid-range trips is ~35% lodging, ~30% transport,
          ~25% food, ~10% activities — adjust for your style. Use a{" "}
          <Link href="/guides/budget-trip-planner" className="text-teal-800 font-semibold hover:underline">
            budget trip planner
          </Link>{" "}
          to sanity-check whether a destination fits before you fall in love with it.
        </p>

        <GuideH2>3. Shortlist destinations that match constraints</GuideH2>
        <p>
          Search from your home city and compare nearby or same-region options first — shorter
          flights and trains often beat “dream faraway” trips on time and cost. Browse{" "}
          <Link href="/explore" className="text-teal-800 font-semibold hover:underline">
            Planova destinations
          </Link>{" "}
          for city pages with budget snapshots, then run a live search with your dates.
        </p>

        <GuideH2>4. Sketch a day-by-day outline</GuideH2>
        <p>
          Aim for 2–3 anchors per day (one morning, one afternoon, one evening) with buffer for
          meals and transit. Overpacking an itinerary is the fastest way to hate a good city. Leave
          one flexible half-day for weather or spontaneous finds.
        </p>

        <GuideH2>5. Book lodging and major transport</GuideH2>
        <p>
          Once the skeleton is set, lock flights or trains and a stay in a walkable area. Hotels and
          restaurants near your base matter more than a perfect map pin — Planova’s Stay and Eat
          tabs pull nearby places so you can plan around one neighborhood.
        </p>

        <GuideH2>6. Confirm documents and packing</GuideH2>
        <p>
          Check passport validity, visas, and any entry rules. Pack for the itinerary you actually
          built, not an imaginary adventure. For short trips, see{" "}
          <Link
            href="/guides/weekend-getaway-ideas"
            className="text-teal-800 font-semibold hover:underline"
          >
            weekend getaway ideas
          </Link>
          .
        </p>

        <GuideH2>Trip planning checklist</GuideH2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Dates and traveler count confirmed</li>
          <li>Total budget written down</li>
          <li>2–4 destination options compared</li>
          <li>Day outline drafted</li>
          <li>Transport and lodging booked</li>
          <li>Backup rainy-day activity saved</li>
        </ul>
      </GuideShell>
    </>
  );
}
