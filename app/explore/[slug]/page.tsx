import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CATALOG, findBySlug, nearestCatalog, toSlug } from "@/lib/data/destinations";
import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATALOG.map((c) => ({ slug: toSlug(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = findBySlug(slug);
  if (!dest) return { title: "Destination not found" };

  const title = `${dest.name} Trip Planner — Itinerary, Budget & Hotels`;
  const description = `Plan a trip to ${dest.name}, ${dest.country}. ${dest.summary || dest.description} Get a budget estimate, day-by-day ideas, stays, and places to eat with ${SITE_NAME}.`;

  return {
    title,
    description,
    keywords: [
      `${dest.name} trip planner`,
      `${dest.name} itinerary`,
      `budget trip to ${dest.name}`,
      `things to do in ${dest.name}`,
      `${dest.name} hotels`,
      `${dest.name} travel guide`,
      dest.country,
    ],
    alternates: { canonical: `/explore/${slug}` },
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}/explore/${slug}`,
      type: "article",
    },
  };
}

export default async function ExploreDestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = findBySlug(slug);
  if (!dest) notFound();

  const nearby = nearestCatalog(dest.latitude, dest.longitude, 7).filter(
    (c) => c.placeId !== dest.placeId,
  );
  const planHref = `/?from=${encodeURIComponent(dest.name)}&lat=${dest.latitude}&lng=${dest.longitude}&placeId=${encodeURIComponent(dest.placeId)}`;
  const siteUrl = getSiteUrl();

  const faq = [
    {
      q: `How much does a trip to ${dest.name} cost?`,
      a: `Typical mid-range nights in ${dest.name} start around $${dest.nightlyBaseUsd} USD. Use Planova to estimate flights, stay, food, and activities for your dates and travelers.`,
    },
    {
      q: `What is ${dest.name} best for?`,
      a: `${dest.description}. Popular vibes here include ${(dest.vibes || []).join(", ") || "city travel"}.`,
    },
    {
      q: `Can I build an itinerary for ${dest.name}?`,
      a: `Yes. Open the planner from this page to get day-by-day ideas plus nearby hotels and restaurants from OpenStreetMap.`,
    },
  ];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: dest.name,
      description: dest.summary || dest.description,
      url: `${siteUrl}/explore/${slug}`,
      touristType: (dest.vibes || []).join(", "),
      address: {
        "@type": "PostalAddress",
        addressCountry: dest.countryCode,
        addressLocality: dest.name,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      ...(dest.rating
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: dest.rating,
              reviewCount: Math.min(dest.reviews || 100, 99999),
              bestRating: 5,
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Explore", item: `${siteUrl}/explore` },
        {
          "@type": "ListItem",
          position: 3,
          name: dest.name,
          item: `${siteUrl}/explore/${slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen page-atmosphere">
      <JsonLd data={ld} />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16 relative z-10 space-y-10">
        <nav className="text-sm text-stone-500">
          <Link href="/" className="hover:text-teal-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/explore" className="hover:text-teal-800">
            Explore
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">{dest.name}</span>
        </nav>

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-teal-800">
            {dest.region} · {dest.country}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
            {dest.name} trip planner
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            {dest.summary || dest.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {(dest.vibes || []).map((v) => (
              <span
                key={v}
                className="px-2.5 py-1 rounded-full text-xs bg-stone-100 border border-stone-200 text-stone-700 capitalize"
              >
                {v}
              </span>
            ))}
          </div>
          <Link
            href={planHref}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors"
          >
            Plan a trip to {dest.name}
          </Link>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-stone-900">
            Why visit {dest.name}?
          </h2>
          <p className="text-stone-600 leading-relaxed">
            {dest.description}
            {dest.rating
              ? `. Travelers rate it about ${dest.rating.toFixed(1)} / 5${
                  dest.reviews ? ` across ${dest.reviews.toLocaleString()} reviews` : ""
                }`
              : ""}
            . Planova helps you turn that inspiration into a dated plan with costs, a day-by-day
            outline, and nearby places to stay and eat.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
          <h2 className="font-display text-2xl font-semibold text-stone-900">Budget snapshot</h2>
          <p className="text-stone-600">
            Mid-range lodging often starts near{" "}
            <strong className="text-stone-900">${dest.nightlyBaseUsd}</strong> per night. Your total
            depends on flight distance, travel dates, and group size — run a Planova search for a
            personalized estimate.
          </p>
          <ul className="grid sm:grid-cols-3 gap-3 text-sm">
            <li className="rounded-xl bg-stone-50 border border-stone-100 p-3">
              <div className="text-stone-500 text-xs uppercase tracking-wide">Nightly base</div>
              <div className="font-semibold text-stone-900 mt-1">${dest.nightlyBaseUsd}</div>
            </li>
            <li className="rounded-xl bg-stone-50 border border-stone-100 p-3">
              <div className="text-stone-500 text-xs uppercase tracking-wide">Rating</div>
              <div className="font-semibold text-stone-900 mt-1">
                {dest.rating ? `${dest.rating.toFixed(1)} / 5` : "—"}
              </div>
            </li>
            <li className="rounded-xl bg-stone-50 border border-stone-100 p-3">
              <div className="text-stone-500 text-xs uppercase tracking-wide">Best for</div>
              <div className="font-semibold text-stone-900 mt-1 capitalize">
                {(dest.vibes || []).slice(0, 2).join(" · ") || "Travel"}
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-stone-900">
            Frequently asked questions
          </h2>
          <dl className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-stone-200 bg-white p-4">
                <dt className="font-semibold text-stone-900">{item.q}</dt>
                <dd className="text-sm text-stone-600 mt-2 leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {nearby.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-stone-900">
              Nearby destinations to compare
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {nearby.map((c) => (
                <li key={c.placeId}>
                  <Link
                    href={`/explore/${toSlug(c)}`}
                    className="block rounded-xl border border-stone-200 bg-white p-4 hover:border-teal-700/40 transition-colors"
                  >
                    <div className="font-semibold text-stone-900">{c.name}</div>
                    <div className="text-sm text-stone-500">{c.country}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl bg-teal-800 text-white p-6 space-y-3">
          <h2 className="font-display text-2xl font-semibold">Ready to plan {dest.name}?</h2>
          <p className="text-teal-50/90 text-sm leading-relaxed">
            Set your dates and budget in the planner. We’ll suggest nearby trip options with cost
            breakdowns, hotels, restaurants, and a day plan.
          </p>
          <Link
            href={planHref}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-teal-900 font-semibold hover:bg-stone-100"
          >
            Start planning
          </Link>
        </section>
      </main>
    </div>
  );
}
