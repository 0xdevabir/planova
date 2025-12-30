// app/api/places/autocomplete/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API key not configured");
    return NextResponse.json({ predictions: [] });
  }

  // Generate a simple session token per request. Ideally, pass a stable token from client per session.
  const sessiontoken = Math.random().toString(36).slice(2);

  // Build URL (avoid restrictive types to allow broader matches)
  const params = new URLSearchParams({
    input,
    key: apiKey,
    sessiontoken,
    language: "en",
  });

  if (lat && lng) {
    params.set("locationbias", `circle:50000@${lat},${lng}`);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
    const response = await fetch(url, { next: { revalidate: 120 } });
    const data = await response.json();

    if (data.status === "OK" && Array.isArray(data.predictions)) {
      return NextResponse.json({ predictions: data.predictions });
    }

    // Fallback to Nominatim (OpenStreetMap) if Google returns no results or is not enabled
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
