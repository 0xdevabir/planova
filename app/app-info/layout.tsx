import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Planova",
  description: "Learn about Planova — a free trip planner for budget-aware itineraries.",
  alternates: { canonical: "/app-info" },
};

export default function AppInfoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
