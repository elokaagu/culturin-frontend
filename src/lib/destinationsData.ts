/**
 * Curated list for the destinations index. Images are from Unsplash (credited in UI via alt text).
 * Replace with CMS data when available.
 */
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
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed7be5c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Palm trees and city skyline in West Africa",
    country: "Côte d'Ivoire",
  },
  {
    name: "Addis Ababa",
    slug: "addis-ababa",
    imageUrl:
      "https://images.unsplash.com/photo-1605149859407-5fc7a34fd16c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Hills and urban landscape in Ethiopia",
    country: "Ethiopia",
  },
  {
    name: "Abuja",
    slug: "abuja",
    imageUrl:
      "https://images.unsplash.com/photo-1590069261209-11e0f0f9d7a5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern architecture and sky",
    country: "Nigeria",
  },
  {
    name: "Accra",
    slug: "accra",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Tropical leaves and light",
    country: "Ghana",
  },
  {
    name: "Amman",
    slug: "amman",
    imageUrl:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Desert and ancient buildings",
    country: "Jordan",
  },
  {
    name: "Amsterdam",
    slug: "amsterdam",
    imageUrl:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Canal houses in Amsterdam",
    country: "Netherlands",
  },
  {
    name: "Athens",
    slug: "athens",
    imageUrl:
      "https://images.unsplash.com/photo-1603561586033-0eb50b7f3a1d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Acropolis at sunset",
    country: "Greece",
  },
  {
    name: "Atlanta",
    slug: "atlanta",
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52befd6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "City skyline with trees",
    country: "United States",
  },
  {
    name: "Auckland",
    slug: "auckland",
    imageUrl:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Harbour and city in New Zealand",
    country: "New Zealand",
  },
  {
    name: "Bali",
    slug: "bali",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Balinese gate and path",
    country: "Indonesia",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    imageUrl:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Park and architecture in Barcelona",
    country: "Spain",
  },
  {
    name: "Beirut",
    slug: "beirut",
    imageUrl:
      "https://images.unsplash.com/photo-1544984243-ec57b16a88ae?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Coastline and city at dusk",
    country: "Lebanon",
  },
  {
    name: "Berlin",
    slug: "berlin",
    imageUrl:
      "https://images.unsplash.com/photo-1528728329032-2972fdb51c41?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Berlin TV tower and sunset",
    country: "Germany",
  },
  {
    name: "Bogotá",
    slug: "bogota",
    imageUrl:
      "https://images.unsplash.com/photo-1564056146413-0d7d0d2d1e5d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mountain view over a city in Colombia",
    country: "Colombia",
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    imageUrl:
      "https://images.unsplash.com/photo-1587330979470-3595ac45ab0e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Hassan II mosque by the sea",
    country: "Morocco",
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    imageUrl:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Table Mountain and bay",
    country: "South Africa",
  },
  {
    name: "Dakar",
    slug: "dakar",
    imageUrl:
      "https://images.unsplash.com/photo-1509030450997-ddc1da1d0e0d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Ocean and coastline",
    country: "Senegal",
  },
  {
    name: "Dublin",
    slug: "dublin",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Georgian street and color doors",
    country: "Ireland",
  },
  {
    name: "Lagos",
    slug: "lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-4627384b0d0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Busy city streets and light",
    country: "Nigeria",
  },
  {
    name: "Lisbon",
    slug: "lisbon",
    imageUrl:
      "https://images.unsplash.com/photo-1444837886038-49a1f7f29a6d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Tram in Lisbon",
    country: "Portugal",
  },
  {
    name: "London",
    slug: "london",
    imageUrl:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77283?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Thames and London buildings",
    country: "United Kingdom",
  },
  {
    name: "Mexico City",
    slug: "mexico-city",
    imageUrl:
      "https://images.unsplash.com/photo-1528728329032-2972fdb51c41?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Urban skyline and evening light in a major city",
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
