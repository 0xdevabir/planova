export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "https://planova.app";
}

export const SITE_NAME = "Planova";
export const SITE_TAGLINE = "Smart trip planner for budget-aware itineraries";
