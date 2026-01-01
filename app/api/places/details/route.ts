// app/api/places/details/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const name = searchParams.get("name");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId is required" },
      { status: 400 }
    );
  }

  try {
    // All places from OSM (Nominatim)
    if (placeId.startsWith("osm_")) {
      return NextResponse.json({
        name: name || "Location",
        address: name || "OSM Location",
        latitude: lat ? parseFloat(lat) : 0,
        longitude: lng ? parseFloat(lng) : 0,
      });
    }

    return NextResponse.json(
      { error: "Place not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Place details API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
