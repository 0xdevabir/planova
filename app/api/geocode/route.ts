// app/api/geocode/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  // Use Nominatim (OpenStreetMap)
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "planova-app/1.0" },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const p = data[0];
      return NextResponse.json({
        name: p.display_name,
        latitude: parseFloat(p.lat),
        longitude: parseFloat(p.lon),
      });
    }
  } catch (error) {
    console.error("OSM geocoding error", error);
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
