import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";
import { CATALOG, toSlug } from "@/lib/data/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/guides",
    "/guides/how-to-plan-a-trip",
    "/guides/budget-trip-planner",
    "/guides/weekend-getaway-ideas",
    "/features",
    "/how-it-works",
    "/testimonials",
    "/support",
    "/app-info",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/explore" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/guides") || path === "/explore" ? 0.9 : 0.6,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = CATALOG.map((c) => ({
    url: `${base}/explore/${toSlug(c)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
