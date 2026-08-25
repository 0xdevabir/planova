// lib/data/destinations.ts
// Curated catalog of well-known destinations worldwide. This is the bedrock
// the search service uses to guarantee recommendations — if external APIs
// (Google Places, OSM) are slow, rate-limited, or empty, the catalog still
// returns realistic, well-described destinations to the user.

import type { Destination, TripVibe } from "@/lib/types";
import { haversineKm } from "@/lib/utils/geo";

export interface CatalogDestination extends Destination {
  /** ISO-3166 alpha-2 country code */
  countryCode: string;
  /** Country display name */
  country: string;
  /** Region bucket — used for "explore by region" UI and fallback distance heuristics */
  region:
    | "North America"
    | "South America"
    | "Europe"
    | "Africa"
    | "Middle East"
    | "South Asia"
    | "Southeast Asia"
    | "East Asia"
    | "Oceania"
    | "Central America & Caribbean";
  /** Population tier — used as a popularity signal */
  popularity: 1 | 2 | 3 | 4 | 5;
  /** Approximate baseline nightly cost bucket, USD */
  nightlyBaseUsd: number;
  /** Short pitch shown on cards */
  summary: string;
}

export const CATALOG: CatalogDestination[] = [
  // -------- Europe --------
  { placeId: "cat_paris_fr", name: "Paris", countryCode: "FR", country: "France", region: "Europe", latitude: 48.8566, longitude: 2.3522, rating: 4.7, reviews: 1250000, popularity: 5, vibes: ["romance", "culture", "city"], nightlyBaseUsd: 175, description: "Iconic landmarks and effortless style", summary: "Cafés along the Seine, world-class museums, and skyline walks." },
  { placeId: "cat_london_uk", name: "London", countryCode: "GB", country: "United Kingdom", region: "Europe", latitude: 51.5074, longitude: -0.1278, rating: 4.6, reviews: 2100000, popularity: 5, vibes: ["city", "culture", "food"], nightlyBaseUsd: 185, description: "Royal heritage meets modern edge", summary: "West End shows, Borough Market, and Hyde Park evenings." },
  { placeId: "cat_rome_it", name: "Rome", countryCode: "IT", country: "Italy", region: "Europe", latitude: 41.9028, longitude: 12.4964, rating: 4.7, reviews: 1450000, popularity: 5, vibes: ["culture", "food", "romance"], nightlyBaseUsd: 165, description: "Two thousand years of open-air art", summary: "The Colosseum, Trastevere trattorias, and golden-hour ruins." },
  { placeId: "cat_barcelona_es", name: "Barcelona", countryCode: "ES", country: "Spain", region: "Europe", latitude: 41.3851, longitude: 2.1734, rating: 4.7, reviews: 980000, popularity: 5, vibes: ["beach", "culture", "food"], nightlyBaseUsd: 145, description: "Gaudí dreams by the Mediterranean", summary: "Gothic Quarter tapas, Modernist façades, and sunset beaches." },
  { placeId: "cat_madrid_es", name: "Madrid", countryCode: "ES", country: "Spain", region: "Europe", latitude: 40.4168, longitude: -3.7038, rating: 4.6, reviews: 870000, popularity: 5, vibes: ["city", "food", "culture"], nightlyBaseUsd: 140, description: "Spain's cosmopolitan heart", summary: "Gran Vía buzz, Prado masterpieces, and late-night churros." },
  { placeId: "cat_lisbon_pt", name: "Lisbon", countryCode: "PT", country: "Portugal", region: "Europe", latitude: 38.7223, longitude: -9.1393, rating: 4.7, reviews: 540000, popularity: 5, vibes: ["romance", "food", "city"], nightlyBaseUsd: 130, description: "Tiled hills and Atlantic light", summary: "Tram 28, pastéis de nata, and fado in Alfama." },
  { placeId: "cat_porto_pt", name: "Porto", countryCode: "PT", country: "Portugal", region: "Europe", latitude: 41.1579, longitude: -8.6291, rating: 4.7, reviews: 410000, popularity: 4, vibes: ["food", "romance", "culture"], nightlyBaseUsd: 110, description: "Wine cellars and riverside charm", summary: "Ribeira walks, port-wine tastings, and azulejo-covered churches." },
  { placeId: "cat_amsterdam_nl", name: "Amsterdam", countryCode: "NL", country: "Netherlands", region: "Europe", latitude: 52.3676, longitude: 4.9041, rating: 4.6, reviews: 920000, popularity: 5, vibes: ["city", "culture", "romance"], nightlyBaseUsd: 170, description: "Canals, bikes, and bold art", summary: "Museumplein, canal cruises, and Jordaan cafés." },
  { placeId: "cat_berlin_de", name: "Berlin", countryCode: "DE", country: "Germany", region: "Europe", latitude: 52.52, longitude: 13.405, rating: 4.5, reviews: 760000, popularity: 5, vibes: ["city", "culture", "food"], nightlyBaseUsd: 140, description: "Reinvented and unapologetic", summary: "Brandenburg Gate, Mitte galleries, and a legendary food scene." },
  { placeId: "cat_munich_de", name: "Munich", countryCode: "DE", country: "Germany", region: "Europe", latitude: 48.1351, longitude: 11.582, rating: 4.6, reviews: 480000, popularity: 4, vibes: ["culture", "food", "city"], nightlyBaseUsd: 155, description: "Bavarian tradition meets modern design", summary: "Englischer Garten, BMW Welt, and beer-hall evenings." },
  { placeId: "cat_vienna_at", name: "Vienna", countryCode: "AT", country: "Austria", region: "Europe", latitude: 48.2082, longitude: 16.3738, rating: 4.7, reviews: 620000, popularity: 4, vibes: ["culture", "romance", "city"], nightlyBaseUsd: 155, description: "Imperial elegance and coffeehouse culture", summary: "Schönbrunn, Belvedere, and Strauss in the State Opera." },
  { placeId: "cat_prague_cz", name: "Prague", countryCode: "CZ", country: "Czechia", region: "Europe", latitude: 50.0755, longitude: 14.4378, rating: 4.7, reviews: 700000, popularity: 5, vibes: ["romance", "culture", "city"], nightlyBaseUsd: 110, description: "Spires, bridges, and Bohemian soul", summary: "Old Town Square, Charles Bridge at dawn, and castle courtyards." },
  { placeId: "cat_budapest_hu", name: "Budapest", countryCode: "HU", country: "Hungary", region: "Europe", latitude: 47.4979, longitude: 19.0402, rating: 4.7, reviews: 560000, popularity: 4, vibes: ["culture", "romance", "food"], nightlyBaseUsd: 95, description: "Thermal baths and Danube elegance", summary: "Széchenyi baths, ruin bars, and Buda castle at night." },
  { placeId: "cat_krakow_pl", name: "Kraków", countryCode: "PL", country: "Poland", region: "Europe", latitude: 50.0647, longitude: 19.945, rating: 4.7, reviews: 380000, popularity: 4, vibes: ["culture", "food", "city"], nightlyBaseUsd: 85, description: "Storybook old town", summary: "Rynek Główny, Wawel Castle, and pierogi in Kazimierz." },
  { placeId: "cat_athens_gr", name: "Athens", countryCode: "GR", country: "Greece", region: "Europe", latitude: 37.9838, longitude: 23.7275, rating: 4.6, reviews: 590000, popularity: 4, vibes: ["culture", "food", "city"], nightlyBaseUsd: 120, description: "Ancient myths under modern streets", summary: "Acropolis at sunset, Plaka tavernas, and rooftop bars." },
  { placeId: "cat_santorini_gr", name: "Santorini", countryCode: "GR", country: "Greece", region: "Europe", latitude: 36.3932, longitude: 25.4615, rating: 4.8, reviews: 410000, popularity: 5, vibes: ["romance", "beach", "luxury"], nightlyBaseUsd: 240, description: "Caldera sunsets and whitewashed calm", summary: "Oia sunsets, cliffside pools, and volcanic-beach mornings." },
  { placeId: "cat_dublin_ie", name: "Dublin", countryCode: "IE", country: "Ireland", region: "Europe", latitude: 53.3498, longitude: -6.2603, rating: 4.5, reviews: 470000, popularity: 4, vibes: ["city", "culture", "food"], nightlyBaseUsd: 175, description: "Storytelling capital of the world", summary: "Trinity College, temple-bar trad sessions, and coastal cliffs." },
  { placeId: "cat_edinburgh_uk", name: "Edinburgh", countryCode: "GB", country: "United Kingdom", region: "Europe", latitude: 55.9533, longitude: -3.1883, rating: 4.7, reviews: 520000, popularity: 4, vibes: ["culture", "city", "nature"], nightlyBaseUsd: 165, description: "Volcanic skyline and royal mile", summary: "Arthur's Seat hikes, castle views, and whisky by the fire." },
  { placeId: "cat_copenhagen_dk", name: "Copenhagen", countryCode: "DK", country: "Denmark", region: "Europe", latitude: 55.6761, longitude: 12.5683, rating: 4.7, reviews: 360000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 195, description: "Nordic design capital", summary: "Nyhavn, Noma-adjacent dining, and Tivoli evenings." },
  { placeId: "cat_stockholm_se", name: "Stockholm", countryCode: "SE", country: "Sweden", region: "Europe", latitude: 59.3293, longitude: 18.0686, rating: 4.7, reviews: 410000, popularity: 4, vibes: ["city", "culture", "nature"], nightlyBaseUsd: 185, description: "Archipelago city of light", summary: "Gamla Stan alleys, ABBA museum, and waterfront fika." },
  { placeId: "cat_oslo_no", name: "Oslo", countryCode: "NO", country: "Norway", region: "Europe", latitude: 59.9139, longitude: 10.7522, rating: 4.6, reviews: 220000, popularity: 4, vibes: ["nature", "city", "culture"], nightlyBaseUsd: 210, description: "Fjord-side capital", summary: "Vigeland Park, opera house, and fjord ferry rides." },
  { placeId: "cat_reykjavik_is", name: "Reykjavík", countryCode: "IS", country: "Iceland", region: "Europe", latitude: 64.1466, longitude: -21.9426, rating: 4.7, reviews: 180000, popularity: 4, vibes: ["nature", "adventure", "romance"], nightlyBaseUsd: 230, description: "Land of fire and ice", summary: "Northern lights, geothermal lagoons, and black-sand coasts." },
  { placeId: "cat_zurich_ch", name: "Zurich", countryCode: "CH", country: "Switzerland", region: "Europe", latitude: 47.3769, longitude: 8.5417, rating: 4.6, reviews: 290000, popularity: 4, vibes: ["city", "luxury", "nature"], nightlyBaseUsd: 260, description: "Alpine precision", summary: "Old Town, lake cruises, and easy day trips to the Alps." },
  { placeId: "cat_interlaken_ch", name: "Interlaken", countryCode: "CH", country: "Switzerland", region: "Europe", latitude: 46.6863, longitude: 7.8632, rating: 4.8, reviews: 190000, popularity: 4, vibes: ["adventure", "nature", "romance"], nightlyBaseUsd: 240, description: "Adventure between two lakes", summary: "Paragliding, Jungfrau railways, and turquoise lake views." },
  { placeId: "cat_venice_it", name: "Venice", countryCode: "IT", country: "Italy", region: "Europe", latitude: 45.4408, longitude: 12.3155, rating: 4.7, reviews: 880000, popularity: 5, vibes: ["romance", "culture", "food"], nightlyBaseUsd: 220, description: "Floating city of bridges", summary: "Gondola rides, St. Mark's Square, and lagoon sunsets." },
  { placeId: "cat_florence_it", name: "Florence", countryCode: "IT", country: "Italy", region: "Europe", latitude: 43.7696, longitude: 11.2558, rating: 4.8, reviews: 700000, popularity: 5, vibes: ["culture", "romance", "food"], nightlyBaseUsd: 175, description: "Renaissance cradle", summary: "Duomo climb, Uffizi Gallery, and Tuscan tasting menus." },
  { placeId: "cat_milan_it", name: "Milan", countryCode: "IT", country: "Italy", region: "Europe", latitude: 45.4642, longitude: 9.19, rating: 4.6, reviews: 660000, popularity: 4, vibes: ["city", "luxury", "food"], nightlyBaseUsd: 195, description: "Fashion and design capital", summary: "Duomo rooftop, Navigli aperitivo, and Quadrilatero shopping." },
  { placeId: "cat_seville_es", name: "Seville", countryCode: "ES", country: "Spain", region: "Europe", latitude: 37.3891, longitude: -5.9845, rating: 4.7, reviews: 470000, popularity: 4, vibes: ["culture", "food", "romance"], nightlyBaseUsd: 115, description: "Flamenco soul of Andalusia", summary: "Alhambra day trips, Alcázar, and tapas in Triana." },

  // -------- North America --------
  { placeId: "cat_newyork_us", name: "New York", countryCode: "US", country: "United States", region: "North America", latitude: 40.7128, longitude: -74.006, rating: 4.7, reviews: 3200000, popularity: 5, vibes: ["city", "culture", "food"], nightlyBaseUsd: 220, description: "The city that never sleeps", summary: "Central Park, Broadway shows, and late-night lofts." },
  { placeId: "cat_losangeles_us", name: "Los Angeles", countryCode: "US", country: "United States", region: "North America", latitude: 34.0522, longitude: -118.2437, rating: 4.5, reviews: 1500000, popularity: 5, vibes: ["beach", "city", "luxury"], nightlyBaseUsd: 230, description: "Sun, studios, and canyon drives", summary: "Santa Monica, Griffith Park, and Sunset Strip dining." },
  { placeId: "cat_sanfrancisco_us", name: "San Francisco", countryCode: "US", country: "United States", region: "North America", latitude: 37.7749, longitude: -122.4194, rating: 4.6, reviews: 1100000, popularity: 5, vibes: ["city", "food", "nature"], nightlyBaseUsd: 240, description: "Hills, harbor, and tech energy", summary: "Golden Gate views, Mission burritos, and cable-car rides." },
  { placeId: "cat_chicago_us", name: "Chicago", countryCode: "US", country: "United States", region: "North America", latitude: 41.8781, longitude: -87.6298, rating: 4.6, reviews: 980000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 175, description: "Big shoulders and deep-dish pizza", summary: "Millennium Park, riverwalk architecture, and blues clubs." },
  { placeId: "cat_miami_us", name: "Miami", countryCode: "US", country: "United States", region: "North America", latitude: 25.7617, longitude: -80.1918, rating: 4.5, reviews: 980000, popularity: 5, vibes: ["beach", "luxury", "city"], nightlyBaseUsd: 220, description: "Year-round tropical energy", summary: "South Beach, Wynwood murals, and Cuban cafés." },
  { placeId: "cat_lasvegas_us", name: "Las Vegas", countryCode: "US", country: "United States", region: "North America", latitude: 36.1699, longitude: -115.1398, rating: 4.4, reviews: 1900000, popularity: 5, vibes: ["luxury", "city"], nightlyBaseUsd: 175, description: "Neon-lit spectacle in the desert", summary: "Strip shows, world-class dining, and Red Rock canyon days." },
  { placeId: "cat_seattle_us", name: "Seattle", countryCode: "US", country: "United States", region: "North America", latitude: 47.6062, longitude: -122.3321, rating: 4.6, reviews: 580000, popularity: 4, vibes: ["city", "nature", "food"], nightlyBaseUsd: 200, description: "Pacific Northwest gateway", summary: "Pike Place Market, ferry rides, and rainforest hikes." },
  { placeId: "cat_boston_us", name: "Boston", countryCode: "US", country: "United States", region: "North America", latitude: 42.3601, longitude: -71.0589, rating: 4.6, reviews: 580000, popularity: 4, vibes: ["culture", "city", "food"], nightlyBaseUsd: 210, description: "Walkable American history", summary: "Freedom Trail, harbor cruises, and Italian North End." },
  { placeId: "cat_washingtondc_us", name: "Washington, D.C.", countryCode: "US", country: "United States", region: "North America", latitude: 38.9072, longitude: -77.0369, rating: 4.6, reviews: 850000, popularity: 4, vibes: ["culture", "city", "food"], nightlyBaseUsd: 195, description: "Monuments and world-class museums", summary: "National Mall, Smithsonian halls, and Georgetown evenings." },
  { placeId: "cat_neworleans_us", name: "New Orleans", countryCode: "US", country: "United States", region: "North America", latitude: 29.9511, longitude: -90.0715, rating: 4.6, reviews: 620000, popularity: 4, vibes: ["food", "culture", "city"], nightlyBaseUsd: 155, description: "Jazz, jambalaya, and voodoo charm", summary: "French Quarter, Garden District, and bayou sunsets." },
  { placeId: "cat_honolulu_us", name: "Honolulu", countryCode: "US", country: "United States", region: "North America", latitude: 21.3069, longitude: -157.8583, rating: 4.6, reviews: 480000, popularity: 4, vibes: ["beach", "nature", "romance"], nightlyBaseUsd: 260, description: "Waikiki and volcanic horizons", summary: "Diamond Head hikes, surf schools, and beachside luaus." },
  { placeId: "cat_toronto_ca", name: "Toronto", countryCode: "CA", country: "Canada", region: "North America", latitude: 43.6532, longitude: -79.3832, rating: 4.6, reviews: 760000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 175, description: "Multicultural lakefront city", summary: "CN Tower, Kensington Market, and Distillery District." },
  { placeId: "cat_vancouver_ca", name: "Vancouver", countryCode: "CA", country: "Canada", region: "North America", latitude: 49.2827, longitude: -123.1207, rating: 4.7, reviews: 540000, popularity: 4, vibes: ["nature", "city", "food"], nightlyBaseUsd: 185, description: "Mountains meet the Pacific", summary: "Stanley Park seawall, Granville Island, and Whistler day trips." },
  { placeId: "cat_montreal_ca", name: "Montreal", countryCode: "CA", country: "Canada", region: "North America", latitude: 45.5017, longitude: -73.5673, rating: 4.7, reviews: 480000, popularity: 4, vibes: ["food", "culture", "city"], nightlyBaseUsd: 155, description: "French-Canadian joie de vivre", summary: "Old Montreal, Plateau cafés, and bagel shops." },
  { placeId: "cat_mexicocity_mx", name: "Mexico City", countryCode: "MX", country: "Mexico", region: "North America", latitude: 19.4326, longitude: -99.1332, rating: 4.6, reviews: 1100000, popularity: 5, vibes: ["food", "culture", "city"], nightlyBaseUsd: 95, description: "Aztec roots and modern art", summary: "Frida Kahlo's Casa Azul, street tacos, and Coyoacán." },
  { placeId: "cat_cancun_mx", name: "Cancún", countryCode: "MX", country: "Mexico", region: "North America", latitude: 21.1619, longitude: -86.8515, rating: 4.6, reviews: 880000, popularity: 5, vibes: ["beach", "luxury"], nightlyBaseUsd: 165, description: "Caribbean all-inclusive heaven", summary: "Powder-white beaches, cenotes, and Mayan ruins." },
  { placeId: "cat_playadelcarmen_mx", name: "Playa del Carmen", countryCode: "MX", country: "Mexico", region: "North America", latitude: 20.6296, longitude: -87.0739, rating: 4.7, reviews: 410000, popularity: 4, vibes: ["beach", "food", "romance"], nightlyBaseUsd: 140, description: "Riviera Maya beach base", summary: "Quinta Avenida strolls, beach clubs, and cenote dives." },

  // -------- Central America & Caribbean --------
  { placeId: "cat_costarica_cr", name: "San José", countryCode: "CR", country: "Costa Rica", region: "Central America & Caribbean", latitude: 9.9281, longitude: -84.0907, rating: 4.5, reviews: 220000, popularity: 3, vibes: ["nature", "adventure"], nightlyBaseUsd: 105, description: "Gateway to pura vida", summary: "Volcano hikes, cloud forests, and Pacific surf." },
  { placeId: "cat_panama_pa", name: "Panama City", countryCode: "PA", country: "Panama", region: "Central America & Caribbean", latitude: 8.9824, longitude: -79.5199, rating: 4.5, reviews: 240000, popularity: 3, vibes: ["city", "beach", "luxury"], nightlyBaseUsd: 130, description: "Two oceans, one skyline", summary: "Casco Viejo, canal miradors, and Caribbean islands." },
  { placeId: "cat_havana_cu", name: "Havana", countryCode: "CU", country: "Cuba", region: "Central America & Caribbean", latitude: 23.1136, longitude: -82.3666, rating: 4.5, reviews: 280000, popularity: 4, vibes: ["culture", "city", "beach"], nightlyBaseUsd: 85, description: "Time-capsule Caribbean soul", summary: "Classic cars, Malecón at sunset, and salsa clubs." },

  // -------- South America --------
  { placeId: "cat_riodejaneiro_br", name: "Rio de Janeiro", countryCode: "BR", country: "Brazil", region: "South America", latitude: -22.9068, longitude: -43.1729, rating: 4.6, reviews: 880000, popularity: 5, vibes: ["beach", "city", "nature"], nightlyBaseUsd: 95, description: "Carioca rhythm and iconic peaks", summary: "Copacabana, Sugarloaf cable car, and samba nights." },
  { placeId: "cat_saopaulo_br", name: "São Paulo", countryCode: "BR", country: "Brazil", region: "South America", latitude: -23.5505, longitude: -46.6333, rating: 4.5, reviews: 540000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 90, description: "Brazil's megalopolis of culture", summary: "Avenida Paulista, Vila Madalena, and global gastronomy." },
  { placeId: "cat_buenosaires_ar", name: "Buenos Aires", countryCode: "AR", country: "Argentina", region: "South America", latitude: -34.6037, longitude: -58.3816, rating: 4.7, reviews: 660000, popularity: 5, vibes: ["culture", "food", "romance"], nightlyBaseUsd: 85, description: "Tango, steaks, and European elegance", summary: "Recoleta, La Boca murals, and asado dinners." },
  { placeId: "cat_santiagocl", name: "Santiago", countryCode: "CL", country: "Chile", region: "South America", latitude: -33.4489, longitude: -70.6693, rating: 4.5, reviews: 380000, popularity: 4, vibes: ["city", "nature", "food"], nightlyBaseUsd: 110, description: "Andes-backed capital", summary: "Lastarria cafés, vineyard valleys, and ski days." },
  { placeId: "cat_lima_pe", name: "Lima", countryCode: "PE", country: "Peru", region: "South America", latitude: -12.0464, longitude: -77.0428, rating: 4.6, reviews: 470000, popularity: 4, vibes: ["food", "culture", "city"], nightlyBaseUsd: 95, description: "World's next great food capital", summary: "Miraflores ceviche, Barranco street art, and pisco bars." },
  { placeId: "cat_cusco_pe", name: "Cusco", countryCode: "PE", country: "Peru", region: "South America", latitude: -13.5319, longitude: -71.9675, rating: 4.8, reviews: 360000, popularity: 5, vibes: ["culture", "adventure", "nature"], nightlyBaseUsd: 90, description: "Andean gateway to Machu Picchu", summary: "Sacred Valley, rainbow mountain, and colonial plazas." },

  // -------- Africa --------
  { placeId: "cat_capetown_za", name: "Cape Town", countryCode: "ZA", country: "South Africa", region: "Africa", latitude: -33.9249, longitude: 18.4241, rating: 4.8, reviews: 540000, popularity: 5, vibes: ["nature", "adventure", "beach"], nightlyBaseUsd: 110, description: "Mountains, oceans, vineyards", summary: "Table Mountain, Cape Point, and Stellenbosch wine lands." },
  { placeId: "cat_johannesburg_za", name: "Johannesburg", countryCode: "ZA", country: "South Africa", region: "Africa", latitude: -26.2041, longitude: 28.0473, rating: 4.4, reviews: 280000, popularity: 4, vibes: ["city", "culture"], nightlyBaseUsd: 95, description: "Rainbow nation's economic heart", summary: "Maboneng street art, Soweto tours, and craft markets." },
  { placeId: "cat_marrakech_ma", name: "Marrakech", countryCode: "MA", country: "Morocco", region: "Africa", latitude: 31.6295, longitude: -7.9811, rating: 4.6, reviews: 470000, popularity: 5, vibes: ["culture", "food", "adventure"], nightlyBaseUsd: 90, description: "Souks, riads, and spice markets", summary: "Jemaa el-Fnaa, Majorelle Garden, and Atlas day trips." },
  { placeId: "cat_cairo_eg", name: "Cairo", countryCode: "EG", country: "Egypt", region: "Africa", latitude: 30.0444, longitude: 31.2357, rating: 4.4, reviews: 520000, popularity: 4, vibes: ["culture", "adventure"], nightlyBaseUsd: 85, description: "Pyramids on the Nile", summary: "Giza plateau, Khan el-Khalili bazaar, and Nile cruises." },

  // -------- Middle East --------
  { placeId: "cat_dubai_ae", name: "Dubai", countryCode: "AE", country: "United Arab Emirates", region: "Middle East", latitude: 25.2048, longitude: 55.2708, rating: 4.6, reviews: 1700000, popularity: 5, vibes: ["luxury", "city", "beach"], nightlyBaseUsd: 220, description: "Futuristic skyline in the desert", summary: "Burj Khalifa, desert safaris, and Palm Jumeirah." },
  { placeId: "cat_istanbul_tr", name: "Istanbul", countryCode: "TR", country: "Turkey", region: "Middle East", latitude: 41.0082, longitude: 28.9784, rating: 4.7, reviews: 1300000, popularity: 5, vibes: ["culture", "food", "city"], nightlyBaseUsd: 95, description: "Where continents collide", summary: "Hagia Sophia, Grand Bazaar, and Bosphorus cruises." },
  { placeId: "cat_doha_qa", name: "Doha", countryCode: "QA", country: "Qatar", region: "Middle East", latitude: 25.2854, longitude: 51.531, rating: 4.5, reviews: 220000, popularity: 3, vibes: ["luxury", "city", "culture"], nightlyBaseUsd: 195, description: "Glass towers over the Gulf", summary: "Museum of Islamic Art, Souq Waqif, and desert dunes." },
  { placeId: "cat_amman_jo", name: "Amman", countryCode: "JO", country: "Jordan", region: "Middle East", latitude: 31.9454, longitude: 35.9284, rating: 4.5, reviews: 180000, popularity: 3, vibes: ["culture", "adventure"], nightlyBaseUsd: 95, description: "Ancient crossroads city", summary: "Citadel views, Roman theatres, and Petra day trips." },

  // -------- South Asia --------
  { placeId: "cat_dhaka_bd", name: "Dhaka", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 23.8103, longitude: 90.4125, rating: 4.3, reviews: 180000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 50, description: "Bustling capital on the Buriganga", summary: "Old Dhaka lanes, Lalbagh Fort, and riverside food walks." },
  { placeId: "cat_chittagong_bd", name: "Chittagong", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 22.3569, longitude: 91.7832, rating: 4.3, reviews: 62000, popularity: 3, vibes: ["city", "nature", "food"], nightlyBaseUsd: 45, description: "Port city by the Bay of Bengal", summary: "Patenga beach, hills, and spicy coastal cuisine." },
  { placeId: "cat_coxsbazar_bd", name: "Cox's Bazar", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 21.4272, longitude: 92.0058, rating: 4.6, reviews: 95000, popularity: 5, vibes: ["beach", "romance", "nature"], nightlyBaseUsd: 55, description: "World's longest natural sea beach", summary: "Sunrise walks, seafood, and Himchari viewpoints." },
  { placeId: "cat_sylhet_bd", name: "Sylhet", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 24.8949, longitude: 91.8687, rating: 4.5, reviews: 48000, popularity: 4, vibes: ["nature", "adventure", "culture"], nightlyBaseUsd: 45, description: "Tea gardens and waterfall country", summary: "Jaflong, Ratargul swamp forest, and shrine towns." },
  { placeId: "cat_sundarbans_bd", name: "Sundarbans", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 22.0, longitude: 89.5, rating: 4.7, reviews: 41000, popularity: 4, vibes: ["nature", "adventure"], nightlyBaseUsd: 70, description: "Mangrove home of the Bengal tiger", summary: "Boat safaris, wildlife spotting, and river camps." },
  { placeId: "cat_bandarban_bd", name: "Bandarban", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 22.1953, longitude: 92.2183, rating: 4.6, reviews: 28000, popularity: 3, vibes: ["adventure", "nature"], nightlyBaseUsd: 40, description: "Hill tracts and tribal trails", summary: "Nilgiri views, waterfalls, and river boat rides." },
  { placeId: "cat_rangamati_bd", name: "Rangamati", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 22.7324, longitude: 92.2988, rating: 4.5, reviews: 22000, popularity: 3, vibes: ["nature", "romance"], nightlyBaseUsd: 42, description: "Lake district of the hills", summary: "Kaptai Lake cruises and hanging bridge walks." },
  { placeId: "cat_kuakata_bd", name: "Kuakata", countryCode: "BD", country: "Bangladesh", region: "South Asia", latitude: 21.8213, longitude: 90.1218, rating: 4.4, reviews: 18000, popularity: 3, vibes: ["beach", "romance"], nightlyBaseUsd: 40, description: "Where you can see sunrise and sunset over the sea", summary: "Quiet beaches and fishing-village evenings." },
  { placeId: "cat_kolkata_in", name: "Kolkata", countryCode: "IN", country: "India", region: "South Asia", latitude: 22.5726, longitude: 88.3639, rating: 4.5, reviews: 420000, popularity: 4, vibes: ["culture", "food", "city"], nightlyBaseUsd: 55, description: "City of joy on the Hooghly", summary: "Howrah Bridge, tram rides, and legendary sweets." },
  { placeId: "cat_mumbai_in", name: "Mumbai", countryCode: "IN", country: "India", region: "South Asia", latitude: 19.076, longitude: 72.8777, rating: 4.5, reviews: 760000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 75, description: "Bollywood dreams on the Arabian Sea", summary: "Marine Drive, Colaba cafés, and temple street food." },
  { placeId: "cat_delhi_in", name: "Delhi", countryCode: "IN", country: "India", region: "South Asia", latitude: 28.6139, longitude: 77.209, rating: 4.4, reviews: 980000, popularity: 4, vibes: ["culture", "food", "city"], nightlyBaseUsd: 65, description: "Five millennia in layers", summary: "Old Delhi bazaars, Humayun's Tomb, and modernist cafes." },
  { placeId: "cat_jaipur_in", name: "Jaipur", countryCode: "IN", country: "India", region: "South Asia", latitude: 26.9124, longitude: 75.7873, rating: 4.7, reviews: 410000, popularity: 4, vibes: ["culture", "food", "romance"], nightlyBaseUsd: 60, description: "The Pink City of palaces", summary: "Amber Fort, City Palace, and bangle-shop bazaars." },
  { placeId: "cat_goa_in", name: "Goa", countryCode: "IN", country: "India", region: "South Asia", latitude: 15.2993, longitude: 74.124, rating: 4.6, reviews: 380000, popularity: 4, vibes: ["beach", "romance"], nightlyBaseUsd: 80, description: "Beach paradise with Portuguese roots", summary: "Sunset shacks, spice plantations, and night markets." },

  // -------- Southeast Asia --------
  { placeId: "cat_bangkok_th", name: "Bangkok", countryCode: "TH", country: "Thailand", region: "Southeast Asia", latitude: 13.7563, longitude: 100.5018, rating: 4.6, reviews: 1500000, popularity: 5, vibes: ["food", "city", "culture"], nightlyBaseUsd: 75, description: "Temple-studded megacity", summary: "Grand Palace, street food, and Chao Phraya ferries." },
  { placeId: "cat_phuket_th", name: "Phuket", countryCode: "TH", country: "Thailand", region: "Southeast Asia", latitude: 7.8804, longitude: 98.3923, rating: 4.6, reviews: 680000, popularity: 5, vibes: ["beach", "luxury", "romance"], nightlyBaseUsd: 95, description: "Andaman jewel", summary: "Beach clubs, island-hopping, and Phi Phi day trips." },
  { placeId: "cat_chiangmai_th", name: "Chiang Mai", countryCode: "TH", country: "Thailand", region: "Southeast Asia", latitude: 18.7883, longitude: 98.9853, rating: 4.7, reviews: 470000, popularity: 4, vibes: ["culture", "food", "nature"], nightlyBaseUsd: 55, description: "Lanna culture in the mountains", summary: "Night bazaars, temple hikes, and ethical elephant sanctuaries." },
  { placeId: "cat_hanoi_vn", name: "Hanoi", countryCode: "VN", country: "Vietnam", region: "Southeast Asia", latitude: 21.0285, longitude: 105.8542, rating: 4.6, reviews: 540000, popularity: 4, vibes: ["food", "culture", "city"], nightlyBaseUsd: 55, description: "Old Quarter charm", summary: "Pho stalls, Hoan Kiem Lake, and water-puppet shows." },
  { placeId: "cat_hochiminhcity_vn", name: "Ho Chi Minh City", countryCode: "VN", country: "Vietnam", region: "Southeast Asia", latitude: 10.8231, longitude: 106.6297, rating: 4.5, reviews: 410000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 60, description: "Saigon's electric pulse", summary: "War Remnants Museum, rooftop bars, and Mekong day trips." },
  { placeId: "cat_danang_vn", name: "Da Nang", countryCode: "VN", country: "Vietnam", region: "Southeast Asia", latitude: 16.0544, longitude: 108.2022, rating: 4.6, reviews: 280000, popularity: 4, vibes: ["beach", "food", "nature"], nightlyBaseUsd: 70, description: "Coastal gateway to central Vietnam", summary: "Marble Mountains, Hoi An side trips, and beach resorts." },
  { placeId: "cat_bali_id", name: "Bali", countryCode: "ID", country: "Indonesia", region: "Southeast Asia", latitude: -8.4095, longitude: 115.1889, rating: 4.7, reviews: 1100000, popularity: 5, vibes: ["beach", "nature", "romance"], nightlyBaseUsd: 90, description: "Island of the gods", summary: "Ubud rice terraces, Uluwatu cliffs, and Seminyak sunsets." },
  { placeId: "cat_jakarta_id", name: "Jakarta", countryCode: "ID", country: "Indonesia", region: "Southeast Asia", latitude: -6.2088, longitude: 106.8456, rating: 4.3, reviews: 320000, popularity: 3, vibes: ["city", "food"], nightlyBaseUsd: 70, description: "Sprawling Indonesian capital", summary: "Old Town, skyscraper malls, and street food markets." },
  { placeId: "cat_manila_ph", name: "Manila", countryCode: "PH", country: "Philippines", region: "Southeast Asia", latitude: 14.5995, longitude: 120.9842, rating: 4.3, reviews: 280000, popularity: 3, vibes: ["city", "beach", "food"], nightlyBaseUsd: 75, description: "Bay-side capital", summary: "Intramuros, bay sunsets, and island-hopping escapes." },
  { placeId: "cat_kualalumpur_my", name: "Kuala Lumpur", countryCode: "MY", country: "Malaysia", region: "Southeast Asia", latitude: 3.139, longitude: 101.6869, rating: 4.5, reviews: 540000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 85, description: "Twin-towered modernity", summary: "Petronas views, Batu Caves, and Jalan Alor street food." },
  { placeId: "cat_singapore_sg", name: "Singapore", countryCode: "SG", country: "Singapore", region: "Southeast Asia", latitude: 1.3521, longitude: 103.8198, rating: 4.7, reviews: 1300000, popularity: 5, vibes: ["city", "food", "luxury"], nightlyBaseUsd: 220, description: "Garden city of the future", summary: "Hawker centres, Marina Bay, and Supertree light shows." },

  // -------- East Asia --------
  { placeId: "cat_tokyo_jp", name: "Tokyo", countryCode: "JP", country: "Japan", region: "East Asia", latitude: 35.6762, longitude: 139.6503, rating: 4.7, reviews: 2200000, popularity: 5, vibes: ["city", "food", "culture"], nightlyBaseUsd: 185, description: "Hyper-modern meets ancient", summary: "Shibuya crossing, Tsukiji sushi, and Asakusa temples." },
  { placeId: "cat_kyoto_jp", name: "Kyoto", countryCode: "JP", country: "Japan", region: "East Asia", latitude: 35.0116, longitude: 135.7681, rating: 4.8, reviews: 1100000, popularity: 5, vibes: ["culture", "romance", "nature"], nightlyBaseUsd: 175, description: "Temple gardens and geisha lanes", summary: "Fushimi Inari hikes, tea ceremonies, and bamboo groves." },
  { placeId: "cat_osaka_jp", name: "Osaka", countryCode: "JP", country: "Japan", region: "East Asia", latitude: 34.6937, longitude: 135.5023, rating: 4.6, reviews: 880000, popularity: 4, vibes: ["food", "city", "culture"], nightlyBaseUsd: 155, description: "Japan's kitchen", summary: "Dotonbori neon, takoyami stands, and castle evenings." },
  { placeId: "cat_seoul_kr", name: "Seoul", countryCode: "KR", country: "South Korea", region: "East Asia", latitude: 37.5665, longitude: 126.978, rating: 4.6, reviews: 1200000, popularity: 5, vibes: ["city", "food", "culture"], nightlyBaseUsd: 145, description: "K-pop, palaces, and street food", summary: "Gangnam, Gyeongbokgung, and late-night BBQ." },
  { placeId: "cat_jeju_kr", name: "Jeju Island", countryCode: "KR", country: "South Korea", region: "East Asia", latitude: 33.4996, longitude: 126.5312, rating: 4.7, reviews: 360000, popularity: 4, vibes: ["nature", "beach", "romance"], nightlyBaseUsd: 130, description: "Volcanic island escape", summary: "Hallasan hikes, waterfalls, and tangerine orchards." },
  { placeId: "cat_hongkong_hk", name: "Hong Kong", countryCode: "HK", country: "Hong Kong", region: "East Asia", latitude: 22.3193, longitude: 114.1694, rating: 4.6, reviews: 980000, popularity: 5, vibes: ["city", "food", "luxury"], nightlyBaseUsd: 210, description: "Harbour-city crossroads", summary: "Victoria Peak, dim sum halls, and neon harbour cruises." },
  { placeId: "cat_taipei_tw", name: "Taipei", countryCode: "TW", country: "Taiwan", region: "East Asia", latitude: 25.033, longitude: 121.5654, rating: 4.6, reviews: 580000, popularity: 4, vibes: ["food", "city", "culture"], nightlyBaseUsd: 130, description: "Night-market paradise", summary: "Shilin night market, Taipei 101, and hot springs." },
  { placeId: "cat_shanghai_cn", name: "Shanghai", countryCode: "CN", country: "China", region: "East Asia", latitude: 31.2304, longitude: 121.4737, rating: 4.5, reviews: 720000, popularity: 4, vibes: ["city", "food", "luxury"], nightlyBaseUsd: 110, description: "Future-forward skyline", summary: "The Bund, Yu Garden, and French Concession walks." },
  { placeId: "cat_beijing_cn", name: "Beijing", countryCode: "CN", country: "China", region: "East Asia", latitude: 39.9042, longitude: 116.4074, rating: 4.5, reviews: 670000, popularity: 4, vibes: ["culture", "city", "food"], nightlyBaseUsd: 100, description: "Imperial grandeur", summary: "Forbidden City, Great Wall hikes, and hutong alleyways." },

  // -------- Oceania --------
  { placeId: "cat_sydney_au", name: "Sydney", countryCode: "AU", country: "Australia", region: "Oceania", latitude: -33.8688, longitude: 151.2093, rating: 4.7, reviews: 1300000, popularity: 5, vibes: ["city", "beach", "food"], nightlyBaseUsd: 200, description: "Harbour city Down Under", summary: "Opera House, Bondi surf, and harbourside dining." },
  { placeId: "cat_melbourne_au", name: "Melbourne", countryCode: "AU", country: "Australia", region: "Oceania", latitude: -37.8136, longitude: 144.9631, rating: 4.7, reviews: 920000, popularity: 4, vibes: ["city", "food", "culture"], nightlyBaseUsd: 175, description: "Coffee capital of the world", summary: "Laneway cafés, laneways art, and Great Ocean Road trips." },
  { placeId: "cat_goldcoast_au", name: "Gold Coast", countryCode: "AU", country: "Australia", region: "Oceania", latitude: -28.0167, longitude: 153.4, rating: 4.5, reviews: 410000, popularity: 4, vibes: ["beach", "adventure", "luxury"], nightlyBaseUsd: 165, description: "Endless surf and skyline", summary: "Surfers Paradise, theme parks, and rainforest hinterland." },
  { placeId: "cat_auckland_nz", name: "Auckland", countryCode: "NZ", country: "New Zealand", region: "Oceania", latitude: -36.8485, longitude: 174.7633, rating: 4.6, reviews: 360000, popularity: 4, vibes: ["city", "nature", "adventure"], nightlyBaseUsd: 155, description: "City of Sails", summary: "Harbour sails, Waiheke wine, and black-sand beaches." },
  { placeId: "cat_queenstown_nz", name: "Queenstown", countryCode: "NZ", country: "New Zealand", region: "Oceania", latitude: -45.0312, longitude: 168.6626, rating: 4.8, reviews: 320000, popularity: 5, vibes: ["adventure", "nature", "romance"], nightlyBaseUsd: 175, description: "Adventure capital of the world", summary: "Bungee jumps, alpine hikes, and Milford Sound cruises." },
  { placeId: "cat_fiji_fj", name: "Fiji", countryCode: "FJ", country: "Fiji", region: "Oceania", latitude: -17.7134, longitude: 178.065, rating: 4.7, reviews: 220000, popularity: 4, vibes: ["beach", "luxury", "romance"], nightlyBaseUsd: 195, description: "South Pacific paradise", summary: "Overwater bures, reef snorkels, and kava ceremonies." },
];

// --- Lookup helpers ---

const CATALOG_BY_ID: Record<string, CatalogDestination> = CATALOG.reduce(
  (acc, d) => {
    acc[d.placeId] = d;
    return acc;
  },
  {} as Record<string, CatalogDestination>,
);

/** Find catalog destinations whose name contains the query (case-insensitive). */
const ADMIN_NOISE = new Set([
  "division", "district", "province", "region", "state", "city", "metro",
  "area", "county", "municipality", "the", "of", "and",
]);

export function searchCatalog(query: string, limit = 25): CatalogDestination[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !ADMIN_NOISE.has(t));
  if (tokens.length === 0) return [];

  const scored: { dest: CatalogDestination; score: number }[] = [];
  for (const dest of CATALOG) {
    const name = dest.name.toLowerCase();
    const country = dest.country.toLowerCase();
    const region = dest.region.toLowerCase();
    const haystack = `${name} ${country} ${region} ${(dest.vibes || []).join(" ")}`.toLowerCase();
    let score = 0;
    let matched = 0;
    for (const t of tokens) {
      if (!haystack.includes(t)) continue;
      matched += 1;
      if (name === t || name.startsWith(t)) score += 8;
      else if (name.includes(t)) score += 5;
      else if (country.includes(t) || country.startsWith(t)) score += 4;
      else if (region.includes(t)) score += 2;
      else score += 1;
    }
    // Require at least one token match; prefer more tokens matched
    if (matched === 0) continue;
    score += matched * 2;
    scored.push({ dest, score });
  }

  scored.sort((a, b) => b.score - a.score || b.dest.popularity - a.dest.popularity);
  return scored.slice(0, limit).map((s) => s.dest);
}

/** Find the closest catalog destinations to a coordinate. */
export function nearestCatalog(latitude: number, longitude: number, limit = 12): CatalogDestination[] {
  const origin = { latitude, longitude };
  const ranked = CATALOG.map((dest) => ({
    dest,
    km: haversineKm(origin, { latitude: dest.latitude, longitude: dest.longitude }),
  }));
  ranked.sort((a, b) => a.km - b.km);
  return ranked.slice(0, limit).map((r) => r.dest);
}

/** Convert a catalog entry to a plain Destination for the search pipeline. */
export function toDestination(c: CatalogDestination): Destination {
  return {
    placeId: c.placeId,
    name: c.name,
    latitude: c.latitude,
    longitude: c.longitude,
    address: c.country,
    description: c.summary || c.description,
    rating: c.rating,
    reviews: c.reviews,
    image: undefined,
    vibes: c.vibes,
  };
}

/** Resolve a placeId back to its catalog entry, when present. */
export function findById(placeId: string): CatalogDestination | undefined {
  return CATALOG_BY_ID[placeId];
}

/** URL slug for SEO pages, e.g. cat_paris_fr → paris-fr */
export function toSlug(c: CatalogDestination): string {
  return c.placeId.replace(/^cat_/, "").replace(/_/g, "-");
}

export function findBySlug(slug: string): CatalogDestination | undefined {
  const normalized = slug.trim().toLowerCase();
  return CATALOG.find((c) => toSlug(c) === normalized);
}

export function allSlugs(): string[] {
  return CATALOG.map(toSlug);
}