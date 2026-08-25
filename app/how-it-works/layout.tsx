import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Plan a Trip in Minutes",
  description:
    "Search from your city, set a budget and dates, compare destinations, then open a plan with hotels and restaurants.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
