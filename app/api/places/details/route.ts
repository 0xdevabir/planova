// app/api/places/details/route.ts

import { NextRequest, NextResponse } from "next/server";
import { findById, toDestination } from "@/lib/data/destinations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const name = searchParams.get("name");

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  // Curated catalog
  if (placeId.startsWith("cat_")) {
    const cat = findById(placeId);
    if (!cat) {
      return NextResponse.json({ error: "Unknown catalog place" }, { status: 404 });
    }
    return NextResponse.json({ place: toDestination(cat), source: "catalog" });
  }

  // OSM ids — echo known coordinates when provided
  if (placeId.startsWith("osm_")) {
    const latitude = lat ? parseFloat(lat) : NaN;
    const longitude = lng ? parseFloat(lng) : NaN;
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        { error: "lat and lng are required for OSM place details" },
        { status: 400 },
      );
    }
    return NextResponse.json({
      place: {
        placeId,
        name: name || "OpenStreetMap place",
        latitude,
        longitude,
      },
      source: "osm",
    });
  }

  // Google / unknown — soft fail with whatever we were given
  if (lat && lng) {
    return NextResponse.json({
      place: {
        placeId,
        name: name || "Place",
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      },
      source: "fallback",
    });
  }

  return NextResponse.json({ error: "Place not found" }, { status: 404 });
}
