import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — Help with Planova",
  description: "Get help using Planova’s trip planner, destination search, and itinerary tools.",
  alternates: { canonical: "/support" },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
