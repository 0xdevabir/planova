// app/api/geocode/route.ts
// Resolves a free-form place name to coordinates. Catalog first (instant),
// Nominatim second (broader coverage, slower).

import { NextRequest, NextResponse } from "next/server";
import { searchCatalog, CATALOG } from "@/lib/data/destinations";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("query") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  // 1) Catalog — covers all major cities instantly.
  const catalogMatch = searchCatalog(query, 1)[0];
  if (catalogMatch) {
    return NextResponse.json({
      name: catalogMatch.name,
      address: `${catalogMatch.name}, ${catalogMatch.country}`,
      latitude: catalogMatch.latitude,
      longitude: catalogMatch.longitude,
      placeId: catalogMatch.placeId,
      source: "catalog",
    });
  }

  // 2) Nominatim — for smaller towns not in the catalog.
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const p = data[0];
      return NextResponse.json({
        name: p.display_name,
        address: p.display_name,
        latitude: parseFloat(p.lat),
        longitude: parseFloat(p.lon),
        placeId: `osm_${p.place_id}`,
        source: "osm",
      });
    }
  } catch (err) {
    console.error("[geocode] OSM error:", err);
  }

  // 3) Last-resort fallback so the user never sees a dead end — return the
  //    most popular catalog entry. Better than a 404.
  const fallback = CATALOG.slice().sort((a, b) => b.popularity - a.popularity)[0];
  if (fallback) {
    return NextResponse.json({
      name: fallback.name,
      address: `${fallback.name}, ${fallback.country}`,
      latitude: fallback.latitude,
      longitude: fallback.longitude,
      placeId: fallback.placeId,
      source: "catalog-fallback",
      warning: `We couldn't find "${query}". Showing ${fallback.name} instead — try a more specific city name.`,
    });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}