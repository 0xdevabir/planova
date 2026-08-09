// app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { searchDestinations } from "@/lib/services/searchService";
import { SearchParams, TripVibe, TRIP_VIBES } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (
      !body.latitude ||
      !body.longitude ||
      !body.budgetMin ||
      !body.budgetMax ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          details: "destination, latitude, longitude, budgetMin, budgetMax, startDate, endDate are required",
        },
        { status: 400 }
      );
    }

    const rawVibes: string[] = Array.isArray(body.vibes)
      ? body.vibes
      : typeof body.vibes === "string"
      ? body.vibes.split(",").map((v: string) => v.trim()).filter(Boolean)
      : [];
    const vibes: TripVibe[] = rawVibes.filter((v): v is TripVibe => TRIP_VIBES.includes(v as TripVibe));

    const searchParams: SearchParams = {
      destination: body.destination || "Selected Location",
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      radius: body.radius ? parseFloat(body.radius) : 25,
      budgetMin: parseFloat(body.budgetMin),
      budgetMax: parseFloat(body.budgetMax),
      currency: body.currency || "USD",
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      travelers: body.travelers ? parseInt(body.travelers) : 1,
      tripType: body.tripType,
      vibes,
    };

    const results = await searchDestinations(searchParams);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use POST request." },
    { status: 405 }
  );
}
