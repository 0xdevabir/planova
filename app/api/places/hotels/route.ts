import { NextRequest, NextResponse } from "next/server";
import { fetchHotels } from "@/lib/services/overpassService";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = parseFloat(params.get("lat") || params.get("latitude") || "");
  const lng = parseFloat(params.get("lng") || params.get("longitude") || "");
  const radius = params.get("radius") ? parseInt(params.get("radius")!, 10) : 3500;
  const limit = params.get("limit") ? parseInt(params.get("limit")!, 10) : 20;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 },
    );
  }

  try {
    const hotels = await fetchHotels({
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
      limit,
    });
    return NextResponse.json({ hotels, source: "overpass", count: hotels.length });
  } catch (err) {
    console.error("[api/places/hotels]", err);
    return NextResponse.json({ hotels: [], source: "error", count: 0 });
  }
}
