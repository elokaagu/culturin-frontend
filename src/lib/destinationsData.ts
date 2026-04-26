/**
 * Curated list for the destinations index. Images are from Unsplash (credited in UI via alt text).
 * URL ids are spot-checked: Unsplash occasionally retires old photo slugs, which break next/image.
 * Replace with CMS data when available.
 */
const q = "auto=format&fit=crop&w=1200&q=80";
const u = (id: string) => `https://images.unsplash.com/photo-${id}?${q}`;

type Destination = {
  name: string;
  /** URL segment: /destinations/[slug] */
  slug: string;
  imageUrl: string;
  imageAlt: string;
  country?: string;
};

function letterOf(name: string): string {
  const c = name.charAt(0);
  if (/[A-Z]/i.test(c)) return c.toUpperCase();
  return "#";
}

export const destinations: Destination[] = [
  {
    name: "Abidjan",
    slug: "abidjan",
    imageUrl: u("1531366936337-7c912a4589a7"),
    imageAlt: "Aerial view of a coastal city and water",
    country: "Côte d'Ivoire",
  },
  {
    name: "Addis Ababa",
    slug: "addis-ababa",
    imageUrl: u("1459749411175-04bf5292ceea"),
    imageAlt: "Ridges of high mountains in soft light",
    country: "Ethiopia",
  },
  {
    name: "Abuja",
    slug: "abuja",
    imageUrl: u("1518709268805-4e9042af9f23"),
    imageAlt: "Evening light over a modern skyline",
    country: "Nigeria",
  },
  {
    name: "Accra",
    slug: "accra",
    imageUrl: u("1500530855697-b586d89ba3ee"),
    imageAlt: "Tropical leaves in bright sunlight",
    country: "Ghana",
  },
  {
    name: "Amman",
    slug: "amman",
    imageUrl: u("1509316785289-025f5b846b35"),
    imageAlt: "Desert hills and historic stone",
    country: "Jordan",
  },
  {
    name: "Amsterdam",
    slug: "amsterdam",
    imageUrl: u("1534351590666-13e3e96b5017"),
    imageAlt: "Canal houses and boats in Amsterdam",
    country: "Netherlands",
  },
  {
    name: "Athens",
    slug: "athens",
    imageUrl: u("1489749798305-4fea3ae63d43"),
    imageAlt: "Sunset light over a Mediterranean coastal town",
    country: "Greece",
  },
  {
    name: "Atlanta",
    slug: "atlanta",
    imageUrl: u("1514565131-fce0801e5785"),
    imageAlt: "Downtown at night, lights and freeways",
    country: "United States",
  },
  {
    name: "Auckland",
    slug: "auckland",
    imageUrl: u("1507699622108-4be3abd695ad"),
    imageAlt: "Harbour, hills, and city in New Zealand",
    country: "New Zealand",
  },
  {
    name: "Bali",
    slug: "bali",
    imageUrl: u("1521572267360-ee0c2909d518"),
    imageAlt: "Lush green terraces in tropical hills",
    country: "Indonesia",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    imageUrl: u("1558642452-9d2a7deb7f62"),
    imageAlt: "Park, sculpture, and architecture in Barcelona",
    country: "Spain",
  },
  {
    name: "Beirut",
    slug: "beirut",
    imageUrl: u("1555396273-367ea4eb4db5"),
    imageAlt: "Outdoor evening dining in a city street",
    country: "Lebanon",
  },
  {
    name: "Berlin",
    slug: "berlin",
    imageUrl: u("1506126613408-eca07ce68773"),
    imageAlt: "Open hills, trees, and soft light at dusk",
    country: "Germany",
  },
  {
    name: "Bogotá",
    slug: "bogota",
    imageUrl: u("1509042239860-f550ce710b93"),
    imageAlt: "Warm light on a drink and a small table",
    country: "Colombia",
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    imageUrl: u("1585208798174-6cedd86e019a"),
    imageAlt: "Sunlit facades in a city street",
    country: "Morocco",
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    imageUrl: u("1506929562872-bb421503ef21"),
    imageAlt: "Mountain and blue bay in South Africa",
    country: "South Africa",
  },
  {
    name: "Dakar",
    slug: "dakar",
    imageUrl: u("1513104890138-7c749659a591"),
    imageAlt: "A narrow street and buildings in dappled light",
    country: "Senegal",
  },
  {
    name: "Dublin",
    slug: "dublin",
    imageUrl: u("1506905925346-21bda4d32df4"),
    imageAlt: "Person on a trail above a wide mountain valley",
    country: "Ireland",
  },
  {
    name: "Lagos",
    slug: "lagos",
    imageUrl: u("1476514525535-07fb3b4ae5f1"),
    imageAlt: "A dense modern skyline from above",
    country: "Nigeria",
  },
  {
    name: "Lisbon",
    slug: "lisbon",
    imageUrl: u("1470246973918-29a93221c455"),
    imageAlt: "A cobbled street in evening light",
    country: "Portugal",
  },
  {
    name: "London",
    slug: "london",
    imageUrl: u("1449824913935-59a10b8d2000"),
    imageAlt: "Urban streets in the evening glow",
    country: "United Kingdom",
  },
  {
    name: "Mexico City",
    slug: "mexico-city",
    imageUrl: u("1469854523086-cc02fe5d8800"),
    imageAlt: "Road, river, and wide mountain country",
    country: "Mexico",
  },
];

export function groupDestinationsByLetter(
  list: readonly Destination[] = destinations,
): Map<string, Destination[]> {
  const m = new Map<string, Destination[]>();
  for (const d of list) {
    const L = letterOf(d.name);
    const arr = m.get(L) ?? [];
    arr.push(d);
    m.set(L, arr);
  }
  return m;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export const destinationLetters: string[] = (() => {
  const s = new Set<string>();
  for (const d of destinations) s.add(letterOf(d.name));
  return Array.from(s).sort();
})();
