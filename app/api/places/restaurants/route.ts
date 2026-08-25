import { NextRequest, NextResponse } from "next/server";
import { fetchRestaurants } from "@/lib/services/overpassService";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = parseFloat(params.get("lat") || params.get("latitude") || "");
  const lng = parseFloat(params.get("lng") || params.get("longitude") || "");
  const radius = params.get("radius") ? parseInt(params.get("radius")!, 10) : 2500;
  const limit = params.get("limit") ? parseInt(params.get("limit")!, 10) : 24;
  const cuisine = (params.get("cuisine") || "").trim().toLowerCase();

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 },
    );
  }

  try {
    let restaurants = await fetchRestaurants({
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
      limit: cuisine ? 40 : limit,
    });
    if (cuisine) {
      restaurants = restaurants
        .filter((r) => (r.cuisine || "").toLowerCase().includes(cuisine))
        .slice(0, limit);
    }
    return NextResponse.json({
      restaurants,
      source: "overpass",
      count: restaurants.length,
    });
  } catch (err) {
    console.error("[api/places/restaurants]", err);
    return NextResponse.json({ restaurants: [], source: "error", count: 0 });
  }
}
