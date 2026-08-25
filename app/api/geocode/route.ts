// app/api/geocode/route.ts
// Resolves a free-form place name to coordinates. Never silently substitutes
// an unrelated popular city — that caused wrong-country recommendations.

import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/data/destinations";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("query") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  // 1) Catalog — covers curated cities instantly.
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

  // 2) Nominatim — prefer settlements
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&addressdetails=1` +
      `&accept-language=en&featureType=settlement` +
      `&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "planova-app/1.0 (contact@planova.app)" },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const p = data[0];
      const name =
        p.name ||
        p.address?.city ||
        p.address?.town ||
        p.display_name?.split(",")[0] ||
        query;
      return NextResponse.json({
        name,
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

  return NextResponse.json(
    {
      error: "not_found",
      message: `We couldn't find "${query}". Pick a suggestion from the list or try a clearer city name.`,
    },
    { status: 404 },
  );
}
