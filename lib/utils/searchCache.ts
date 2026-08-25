// lib/utils/searchCache.ts
// Pass search results from home → recommendations without a second POST.
// sessionStorage key is derived from the URL query so refresh still works
// (miss → re-fetch) and stale results from a different search are ignored.

import type { SearchResponse } from "@/lib/types";

const PREFIX = "planova:search:";

export function searchCacheKey(params: URLSearchParams | Record<string, string>): string {
  const get = (k: string) =>
    params instanceof URLSearchParams ? params.get(k) || "" : params[k] || "";
  return [
    get("destination"),
    get("latitude"),
    get("longitude"),
    get("startDate"),
    get("endDate"),
    get("budgetMin"),
    get("budgetMax"),
    get("travelers"),
    get("currency"),
    get("vibes"),
  ].join("|");
}

export function storeSearchResults(key: string, data: SearchResponse): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // quota / private mode — ignore; recommendations will re-fetch
  }
}

export function loadSearchResults(key: string): SearchResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; data: SearchResponse };
    // Expire after 30 minutes
    if (Date.now() - parsed.savedAt > 30 * 60 * 1000) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}
