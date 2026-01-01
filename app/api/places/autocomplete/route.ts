// app/api/places/autocomplete/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");

  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  try {
    // Use Nominatim (OpenStreetMap)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&accept-language=en&q=${encodeURIComponent(
      input
    )}`;
    const osmRes = await fetch(nominatimUrl, {
      headers: { "User-Agent": "planova-app/1.0" },
      next: { revalidate: 60 },
    });
    const osm = await osmRes.json();
    const predictions = (Array.isArray(osm) ? osm : []).map((p: any) => ({
      place_id: `osm_${p.place_id}`,
      description: p.display_name,
      lat: p.lat,
      lng: p.lon,
    }));

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Autocomplete API error:", error);
    return NextResponse.json({ predictions: [] });
  }
}
