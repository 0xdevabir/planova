// app/api/geocode/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Try Google Geocoding first if API key exists
  try {
    if (apiKey) {
      const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${apiKey}`;
      const gRes = await fetch(gUrl, { next: { revalidate: 3600 } });
      const gData = await gRes.json();
      if (gData.status === "OK" && gData.results?.length) {
        const r = gData.results[0];
        return NextResponse.json({
          name: r.formatted_address,
          latitude: r.geometry.location.lat,
          longitude: r.geometry.location.lng,
        });
      }
    }
  } catch (e) {
    console.warn("Google geocoding failed, falling back to OSM");
  }

  // Fallback to Nominatim (OSM)
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
