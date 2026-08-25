import { NextRequest, NextResponse } from "next/server";
import { fetchAttractions } from "@/lib/services/overpassService";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = parseFloat(params.get("lat") || params.get("latitude") || "");
  const lng = parseFloat(params.get("lng") || params.get("longitude") || "");
  const radius = params.get("radius") ? parseInt(params.get("radius")!, 10) : 4000;
  const limit = params.get("limit") ? parseInt(params.get("limit")!, 10) : 30;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 },
    );
  }

  try {
    const attractions = await fetchAttractions({
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
      limit,
    });
    return NextResponse.json({
      attractions,
      source: "overpass",
      count: attractions.length,
    });
  } catch (err) {
    console.error("[api/places/attractions]", err);
    return NextResponse.json({ attractions: [], source: "error", count: 0 });
  }
}
