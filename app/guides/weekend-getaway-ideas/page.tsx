import type { Metadata } from "next";
import Link from "next/link";
import { GuideH2, GuideShell } from "@/components/GuideShell";
import { getSiteUrl } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/jsonld";

const title = "Weekend Getaway Ideas — Plan a Short Trip That Feels Complete";
const description =
  "Weekend getaway ideas and a simple 2–3 day planning framework. Find nearby cities, pack light, and build a short itinerary that doesn’t feel rushed.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "weekend getaway ideas",
    "weekend trip planner",
    "short trip itinerary",
    "2 day trip ideas",
    "nearby weekend trips",
  ],
  alternates: { canonical: "/guides/weekend-getaway-ideas" },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/guides/weekend-getaway-ideas`,
    type: "article",
  },
};

export default function WeekendGetawayIdeasPage() {
  const siteUrl = getSiteUrl();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: "Planova" },
    publisher: { "@type": "Organization", name: "Planova", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/guides/weekend-getaway-ideas`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <GuideShell
        eyebrow="Short trips"
        title="Weekend getaway ideas that actually fit a weekend"
        lead="The best short trips are nearby, focused, and lightly planned. You need one vibe, one base neighborhood, and a short list of must-dos — not a week’s worth of FOMO."
      >
        <GuideH2>Pick nearby first</GuideH2>
        <p>
          For Friday–Sunday, travel time eats your vacation. Prioritize destinations within a few
          hours by air or a half-day by train or car. In Planova, search from your city and sort by
          what fits your dates and budget — then open{" "}
          <Link href="/explore" className="text-teal-800 font-semibold hover:underline">
            city pages
          </Link>{" "}
          to compare vibes.
        </p>

        <GuideH2>A simple 48-hour shape</GuideH2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-stone-900">Arrival evening</strong> — check in, walk the
            neighborhood, one good dinner.
          </li>
          <li>
            <strong className="text-stone-900">Full day</strong> — morning highlight, lunch, afternoon
            wander or one paid activity, relaxed evening.
          </li>
          <li>
            <strong className="text-stone-900">Departure day</strong> — café + one compact sight near
            your route home. No ambitious day trips.
          </li>
        </ul>

        <GuideH2>Idea themes (adapt to your region)</GuideH2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Food city — markets, one signature meal, café hopping</li>
          <li>Nature reset — trail + small town base</li>
          <li>Culture hit — museum morning, old town afternoon</li>
          <li>Beach or lake — one swim spot, sunset, early night</li>
          <li>Friend reunion — shared stay, low logistics, one group dinner</li>
        </ul>

        <GuideH2>Keep logistics tiny</GuideH2>
        <p>
          One lodging. Walkable stay. Carry-on only if you can. Book the outbound and return before
          filling the middle. Use Planova’s Stay and Eat lists so you’re not researching restaurants
          on the train there.
        </p>

        <GuideH2>Next steps</GuideH2>
        <p>
          Set your home city and a weekend date range in the{" "}
          <Link href="/" className="text-teal-800 font-semibold hover:underline">
            trip planner
          </Link>
          , or read{" "}
          <Link
            href="/guides/how-to-plan-a-trip"
            className="text-teal-800 font-semibold hover:underline"
          >
            how to plan a trip
          </Link>{" "}
          if you want the full framework for longer vacations.
        </p>
      </GuideShell>
    </>
  );
}
