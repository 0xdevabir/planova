// app/api/places/search/route.ts

import { NextRequest, NextResponse } from "next/server";

// Format OSM address object into a readable string
function formatOsmAddress(place: any): string {
  const addr = place.address || {};
  const parts = [
    addr.road,
    addr.city || addr.town || addr.village || addr.hamlet,
    addr.state || addr.state_district,
    addr.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : place.display_name || "";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!query || !latitude || !longitude) {
    return NextResponse.json(
      { error: "query, latitude, and longitude are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  try {
    let collected: any[] = [];
    const seenPlaceIds = new Set<string>();

    // 1) Try Google Maps API if key exists
    if (apiKey) {
      console.log("Searching Google Places for:", query);
      const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        `${query} tourist attractions`
      )}&key=${apiKey}`;
      
      const textRes = await fetch(textUrl, { next: { revalidate: 1800 } });
      const textData = await textRes.json();
      
      if (textData.status === "OK" && Array.isArray(textData.results)) {
        console.log("Google Places returned", textData.results.length, "results");
        collected = textData.results;
        textData.results.forEach((p: any) => seenPlaceIds.add(p.place_id));
      } else {
        console.log("Google Places status:", textData.status);
      }

      // 2) Supplement with nearby search if needed
      if (collected.length < 5) {
        const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=tourist_attraction&key=${apiKey}`;
        const nearbyRes = await fetch(nearbyUrl, { next: { revalidate: 1800 } });
        const nearby = await nearbyRes.json();

        if (Array.isArray(nearby.results)) {
          console.log("Google Nearby search returned", nearby.results.length, "results");
          const uniqueNearbyResults = nearby.results.filter(
            (place: any) => !seenPlaceIds.has(place.place_id)
          );
          collected = [...collected, ...uniqueNearbyResults];
        }
      }
    }

    // 3) Fallback to OpenStreetMap/Nominatim if Google returns no results or API key missing
    if (collected.length === 0) {
      console.log("Falling back to Nominatim/OSM for:", query);
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=20&countrycodes=&addressdetails=1&q=${encodeURIComponent(
        `${query} tourist attractions`
      )}`;
      
      const osmRes = await fetch(osmUrl, {
        headers: { "User-Agent": "planova-app/1.0" },
        next: { revalidate: 1800 },
      });
      const osmData = await osmRes.json();
      
      if (Array.isArray(osmData) && osmData.length > 0) {
        console.log("OSM returned", osmData.length, "results");
        collected = osmData.map((place: any) => {
          const formattedAddress = formatOsmAddress(place);
          const name = place.name || place.display_name || "Point of Interest";
          return {
            place_id: `osm_${place.place_id}`,
            name,
            geometry: {
              location: {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
              },
            },
            vicinity: formattedAddress,
            formatted_address: formattedAddress,
            rating: 4.0,
            user_ratings_total: 0,
            types: place.type ? [place.type] : ["tourist_attraction"],
          };
        });
      } else {
        console.log("OSM returned no results");
      }
    }

    if (collected.length > 0) {
      const places = collected.slice(0, 10).map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: typeof place.vicinity === "string"
          ? place.vicinity
          : typeof place.formatted_address === "string"
          ? place.formatted_address
          : "",
        description: place.types?.join(", ") || "Tourist attraction",
        rating: place.rating || 4.0,
        reviews: place.user_ratings_total || 0,
        photoReference: place.photos?.[0]?.photo_reference,
      }));

      console.log("Returning", places.length, "places to client");
      return NextResponse.json({ places });
    }

    console.log("No places found from any source");
    return NextResponse.json({ places: [] });
  } catch (error) {
    console.error("Places search API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
