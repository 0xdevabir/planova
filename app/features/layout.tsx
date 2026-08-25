import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Destinations, Budgets & Itineraries",
  description:
    "See how Planova helps you discover destinations, estimate trip costs, and build day-by-day itineraries with stays and restaurants.",
  alternates: { canonical: "/features" },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
