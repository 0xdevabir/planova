import type { Metadata } from "next";
import Link from "next/link";
import { GuideH2, GuideShell } from "@/components/GuideShell";
import { getSiteUrl } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/jsonld";

const title = "Budget Trip Planner — Estimate Costs Before You Book";
const description =
  "Use a budget trip planner approach to estimate flights, hotels, food, and activities. Find destinations that fit your number and avoid surprise vacation costs.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "budget trip planner",
    "vacation budget calculator",
    "cheap trip planner",
    "travel cost estimate",
    "budget travel tips",
  ],
  alternates: { canonical: "/guides/budget-trip-planner" },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/guides/budget-trip-planner`,
    type: "article",
  },
};

export default function BudgetTripPlannerGuidePage() {
  const siteUrl = getSiteUrl();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      author: { "@type": "Organization", name: "Planova" },
      publisher: { "@type": "Organization", name: "Planova", url: siteUrl },
      mainEntityOfPage: `${siteUrl}/guides/budget-trip-planner`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What should I include in a trip budget?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Include transport, lodging, food, activities, local transit, and a 10–15% buffer for tips, snacks, and surprises.",
          },
        },
        {
          "@type": "Question",
          name: "How do I find destinations that fit my budget?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Search from your city with a max budget and trip length. Compare nearby options first — lower flight costs often matter more than cheap hotels alone.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <GuideShell
        eyebrow="Budget travel"
        title="Budget trip planner: spend on purpose"
        lead="A budget isn’t a punishment — it’s a filter. When you know your ceiling, you can compare cities fairly and stop doom-scrolling destinations you can’t afford this month."
      >
        <GuideH2>Build the number first</GuideH2>
        <p>
          Write one total: what you’re willing to spend for the whole trip. Then subtract fixed
          costs you already know (passports, travel insurance, pet sitters). What’s left is your
          travel envelope for flights, stay, food, and fun.
        </p>

        <GuideH2>Estimate the four big buckets</GuideH2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-stone-900">Transport</strong> — flights, trains, or fuel +
            tolls. Often the swing factor between “nearby weekend” and “long-haul.”
          </li>
          <li>
            <strong className="text-stone-900">Lodging</strong> — nightly rate × nights. Mid-range
            cities vary widely; check each destination’s nightly baseline on{" "}
            <Link href="/explore" className="text-teal-800 font-semibold hover:underline">
              Explore
            </Link>
            .
          </li>
          <li>
            <strong className="text-stone-900">Food</strong> — daily per person × days. Street food
            vs sit-down meals can double this line.
          </li>
          <li>
            <strong className="text-stone-900">Activities</strong> — tickets, tours, day trips. Keep
            a buffer for one paid highlight.
          </li>
        </ul>

        <GuideH2>Use the planner the right way</GuideH2>
        <p>
          In{" "}
          <Link href="/" className="text-teal-800 font-semibold hover:underline">
            Planova
          </Link>
          , search from your real location with dates and a budget. Results prioritize destinations
          that can fit the envelope, then you can open a city for a cost breakdown, itinerary, and
          nearby stays. That beats picking a dream city and reverse-engineering whether you can pay
          for it.
        </p>

        <GuideH2>Levers that actually save money</GuideH2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Travel mid-week when possible</li>
          <li>Stay longer in fewer places (less transit waste)</li>
          <li>Choose a walkable neighborhood over a “cheap” stay far out</li>
          <li>Compare 2–3 nearby cities, not 20 far-flung ones</li>
          <li>Keep one free day — paid tours add up quietly</li>
        </ul>

        <GuideH2>FAQ</GuideH2>
        <p>
          <strong className="text-stone-900">What should I include in a trip budget?</strong>
          <br />
          Transport, lodging, food, activities, local transit, and a 10–15% buffer.
        </p>
        <p>
          <strong className="text-stone-900">How do I find destinations that fit?</strong>
          <br />
          Search with your max budget and trip length, then compare nearby options first. Lower
          flight costs often matter more than cheap hotels alone.
        </p>
      </GuideShell>
    </>
  );
}
