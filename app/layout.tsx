import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { getSiteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import { JsonLd } from "@/lib/seo/jsonld";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Trip Planner for Budget Itineraries`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Plan trips with real destination ideas, budget estimates, day-by-day itineraries, hotels, and restaurants. Free trip planner for weekends and longer getaways.",
  keywords: [
    "trip planner",
    "travel planner",
    "budget trip planner",
    "itinerary planner",
    "weekend getaway planner",
    "vacation budget calculator",
    "places to visit",
    "travel itinerary",
    "Planova",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Discover destinations that fit your budget. Build itineraries with stays, eats, and day plans.",
    images: [
      {
        url: "/heroBg.jpg",
        width: 1920,
        height: 1080,
        alt: "Planova trip planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Trip Planner`,
    description: "Budget-aware destinations, itineraries, hotels, and restaurants.",
    images: ["/heroBg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/heroBg.jpg`,
    description: SITE_TAGLINE,
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_TAGLINE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/explore?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <JsonLd data={[orgLd, siteLd]} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
