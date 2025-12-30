// app/api/places/details/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  try {
    // Try Google Maps API if key exists and placeId is not from OSM
    if (apiKey && !placeId.startsWith("osm_")) {
      console.log("Fetching details from Google for placeId:", placeId);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${apiKey}`,
        { next: { revalidate: 86400 } }
      );

      const data = await response.json();

      if (data.status === "OK" && data.result) {
        return NextResponse.json({
          name: data.result.name,
          address: data.result.formatted_address,
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        });
      }
      
      console.log("Google Place Details status:", data.status);
    }

    // Fallback: If OSM placeId or Google fails, try to extract coordinates from placeId or return error
    if (placeId.startsWith("osm_")) {
      console.log("OSM place detected, returning basic info");
      // OSM places already have coordinates from search, just return success
      return NextResponse.json({
        name: "Location",
        address: "OSM Location",
        latitude: 0,
        longitude: 0,
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
