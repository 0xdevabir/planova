// lib/store/favorites.ts
// Versioned localStorage-backed favorites store. SSR-safe: every helper
// gracefully no-ops when window/localStorage are unavailable.

import type { FavoriteTrip } from "@/lib/types";

const STORAGE_KEY = "planova:favorites:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(): FavoriteTrip[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.placeId === "string");
  } catch (error) {
    console.warn("favorites: failed to read", error);
    return [];
  }
}

function writeRaw(favorites: FavoriteTrip[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent("planova:favorites:change", { detail: favorites }));
  } catch (error) {
    console.warn("favorites: failed to write", error);
  }
}

export function getFavorites(): FavoriteTrip[] {
  return readRaw();
}

export function addFavorite(trip: Omit<FavoriteTrip, "savedAt">): FavoriteTrip {
  const entry: FavoriteTrip = { ...trip, savedAt: Date.now() };
  const all = readRaw();
  const filtered = all.filter((t) => t.placeId !== trip.placeId);
  filtered.unshift(entry);
  writeRaw(filtered);
  return entry;
}

export function removeFavorite(placeId: string): void {
  const filtered = readRaw().filter((t) => t.placeId !== placeId);
  writeRaw(filtered);
}

export function hasFavorite(placeId: string): boolean {
  return readRaw().some((t) => t.placeId === placeId);
}

export function clearFavorites(): void {
  writeRaw([]);
}

export function subscribeToFavorites(callback: (favorites: FavoriteTrip[]) => void): () => void {
  if (!isBrowser()) return () => undefined;
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<FavoriteTrip[]>).detail;
    callback(detail || readRaw());
  };
  window.addEventListener("planova:favorites:change", handler as EventListener);
  return () => window.removeEventListener("planova:favorites:change", handler as EventListener);
}