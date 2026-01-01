# Planova – Smart Travel Planner

Planova turns a simple location input into curated, budget-aware destination ideas. It mixes map data, flight/hotel cost estimation, and weather to surface the best-value trips with a clean Next.js experience.

## How it works
- User enters a place/date/budget in the UI; the app calls the server route at `app/api/search/route.ts`.
- `searchService` aggregates nearby places from `app/api/places/search` (Google Places when a key exists; falls back to OpenStreetMap/Nominatim).
- For each destination, mock flight and hotel estimators plus weather are combined into a `valueScore`, then filtered by the user’s budget.
- Results are cached server-side to keep responses fast and reduce external calls.

## Features
- Destination search by coordinates, radius, and budget guardrails
- Google Places with OSM fallback for global coverage
- Estimated flights, hotels, and daily costs with value scoring
- Weather snapshot per destination
- Server-side caching for results and supporting lookups
- Next.js App Router, TypeScript, and Tailwind/PostCSS setup

## Project structure
- `app/` – routes, API handlers, and pages (App Router)
- `components/` – UI elements (maps, search, cards, nav)
- `lib/services/` – search, destination lookup, budget, flights, hotels, weather
- `lib/utils/cache.ts` – simple in-memory cache helper
- `prisma/` – schema placeholder for future persistence

## Prerequisites
- Node.js 18+
- npm (or pnpm/yarn/bun)

## Running locally
```bash
npm install
npm run dev
# visit http://localhost:3000
```

## Environment variables
Create `.env.local` with:

```
# Required for production to resolve internal API calls
NEXT_PUBLIC_BASE_URL=https://your-deployed-domain.com

# Search providers
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-key
GOOGLE_MAPS_API_KEY=your-google-key

# Auth (if enabling NextAuth)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-deployed-domain.com

# Optional integrations (currently mocked)
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
SKYSCANNER_API_KEY=...
KIWI_API_KEY=...
BOOKING_API_KEY=...
EXPEDIA_API_KEY=...
TICKETMASTER_API_KEY=...
EVENTBRITE_API_KEY=...
EXCHANGE_RATE_API_KEY=...
```

Notes:
- `NEXT_PUBLIC_BASE_URL` is critical in production; without it the server fetches default to `http://localhost:3000` and destinations will be empty after deploy.
- If you omit the Google key, searches fall back to OSM/Nominatim with reduced detail.

## Deployment checklist
- Set all env vars in your hosting provider (at least `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
- Build: `npm run build`.
- Deploy static output and serverless functions (Vercel recommended).

## Troubleshooting
- **No destinations in production:** ensure `NEXT_PUBLIC_BASE_URL` points to the live domain and the Google Maps key is present; redeploy after updating env vars.
- **Rate limits on OSM:** supply a Google key to reduce reliance on Nominatim.

## Scripts
- `npm run dev` – start local dev
- `npm run build` – production build
- `npm run start` – run built app

## License
MITThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
