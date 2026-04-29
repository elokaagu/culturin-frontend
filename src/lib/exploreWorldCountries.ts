/**
 * Home “Explore the World” — cards link to `/countries/[id]` (see `app/countries/[slug]/page.tsx`).
 * `searchLabel` is kept for deep links and search fallbacks; align with article copy when possible.
 * Unsplash `photo-…-…` slugs are validated with HEAD requests; many older ids return 404 from Imgix.
 */
const q = "auto=format&fit=crop&w=1200&q=80";
const u = (id: string) => `https://images.unsplash.com/photo-${id}?${q}`;

export type ExploreWorldCountry = {
  /** Stable id for keys */
  id: string;
  /** Display name */
  name: string;
  /** Passed to `/search?country=` — should match words in article titles/summaries */
  searchLabel: string;
  imageUrl: string;
  imageAlt: string;
};

export const exploreWorldCountries: ExploreWorldCountry[] = [
  {
    id: "japan",
    name: "Japan",
    searchLabel: "Japan",
    imageUrl: u("1464822759023-fed622ff2c3b"),
    imageAlt: "High forested mountains in misty light",
  },
  {
    id: "portugal",
    name: "Portugal",
    searchLabel: "Portugal",
    imageUrl: u("1585208798174-6cedd86e019a"),
    imageAlt: "Sun-warmed buildings along a city street",
  },
  {
    id: "morocco",
    name: "Morocco",
    searchLabel: "Morocco",
    imageUrl: u("1489749798305-4fea3ae63d43"),
    imageAlt: "Domed rooftops and sea in Mediterranean light",
  },
  {
    id: "argentina",
    name: "Argentina",
    searchLabel: "Argentina",
    imageUrl: u("1506905925346-21bda4d32df4"),
    imageAlt: "Hiker above a wide mountain valley and peaks",
  },
  {
    id: "iceland",
    name: "Iceland",
    searchLabel: "Iceland",
    imageUrl: u("1531366936337-7c912a4589a7"),
    imageAlt: "Aurora over a snowy, rocky landscape",
  },
  {
    id: "italy",
    name: "Italy",
    searchLabel: "Italy",
    imageUrl: u("1459749411175-04bf5292ceea"),
    imageAlt: "Layered ridgelines and golden mountain light",
  },
  {
    id: "mexico",
    name: "Mexico",
    searchLabel: "Mexico",
    imageUrl: u("1470246973918-29a93221c455"),
    imageAlt: "Cobblestone street and old buildings in warm evening light",
  },
  {
    id: "south-africa",
    name: "South Africa",
    searchLabel: "South Africa",
    imageUrl: u("1506929562872-bb421503ef21"),
    imageAlt: "Rocky coast and headland on a clear day",
  },
  {
    id: "vietnam",
    name: "Vietnam",
    searchLabel: "Vietnam",
    imageUrl: u("1521572267360-ee0c2909d518"),
    imageAlt: "Lush green terraces on steep hills",
  },
];

export function getExploreWorldCountryBySlug(slug: string): ExploreWorldCountry | undefined {
  return exploreWorldCountries.find((c) => c.id === slug);
}
