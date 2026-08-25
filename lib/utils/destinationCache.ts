// lib/utils/destinationCache.ts
// Carry a DestinationResult from recommendations → detail without a second search.

import type { DestinationResult } from "@/lib/types";

const PREFIX = "planova:dest:";

export function storeDestination(dest: DestinationResult): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      PREFIX + dest.placeId,
      JSON.stringify({ savedAt: Date.now(), data: dest }),
    );
  } catch {
    // ignore quota errors
  }
}

export function loadDestination(placeId: string): DestinationResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + placeId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; data: DestinationResult };
    if (Date.now() - parsed.savedAt > 60 * 60 * 1000) {
      sessionStorage.removeItem(PREFIX + placeId);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}
