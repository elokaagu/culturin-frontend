/**
 * Placeholder “nearby” spots for the header panel. Wire to a maps/places API later.
 */
type NearbySpot = {
  slug: string;
  title: string;
  city: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  showMore: boolean;
};

export const NEARBY_RADIUS_KM = [2, 5, 10, 25] as const;

export const nearbySpots: NearbySpot[] = [
  {
    slug: "kkini",
    title: "KKINI",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-00551306c1b3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Dining at night, warm light",
    href: "/nearby/kkini",
    showMore: true,
  },
  {
    slug: "sushi-more",
    title: "Sushi & More",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1579027614696-ffceca4a8870?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sushi and Japanese dining",
    href: "/nearby/sushi-more",
    showMore: false,
  },
  {
    slug: "casa-spa",
    title: "Casa Spa",
    city: "London",
    category: "Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6d4deb28f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Spa interior with archway",
    href: "/nearby/casa-spa",
    showMore: false,
  },
  {
    slug: "latin-groove",
    title: "Latin Groove",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Street with colourful facades",
    href: "/nearby/latin-groove",
    showMore: true,
  },
  {
    slug: "finks",
    title: "Fink's",
    city: "London",
    category: "Coffee Shop",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Coffee and café interior",
    href: "/nearby/finks",
    showMore: true,
  },
  {
    slug: "granary-square",
    title: "Granary Square",
    city: "London",
    category: "Landmark",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fountains and public square",
    href: "/nearby/granary-square",
    showMore: false,
  },
];

export type NearbyResultItem = {
  title: string;
  description: string;
  href: string;
  kind: "experience" | "guide" | "video" | "destination";
};

export type NearbySpotResult = {
  intro: string;
  tips: string[];
  results: NearbyResultItem[];
};

export const nearbyResultsBySlug: Record<string, NearbySpotResult> = {
  kkini: {
    intro: "A modern dining pick close to central London, great for evening bookings and local food scenes.",
    tips: ["Best after 6pm", "Reservation recommended", "Pair with nearby cultural walk"],
    results: [
      {
        title: "Street culture photo walk",
        description: "Capture neighborhoods and stories before dinner.",
        href: "/providers/street-culture-photo-walk",
        kind: "experience",
      },
      {
        title: "London destination guide",
        description: "Explore neighborhoods and travel timing for London.",
        href: "/destinations/london",
        kind: "destination",
      },
      {
        title: "Explore travel guides",
        description: "Find editorial guides before choosing where to eat.",
        href: "/articles",
        kind: "guide",
      },
    ],
  },
  "sushi-more": {
    intro: "Sushi-forward dining with quick access to post-dinner walks and nearby experiences.",
    tips: ["Go early for quieter seating", "Great for small groups", "Best paired with sunset plans"],
    results: [
      {
        title: "Hidden neighbourhood stories",
        description: "A local-led storytelling route that starts nearby.",
        href: "/providers/hidden-neighbourhood-stories",
        kind: "experience",
      },
      {
        title: "Top videos",
        description: "Watch short destination edits while planning.",
        href: "/stream",
        kind: "video",
      },
      {
        title: "Trending stories",
        description: "Discover current editor picks and travel ideas.",
        href: "/trending",
        kind: "guide",
      },
    ],
  },
  "casa-spa": {
    intro: "A calm wellness stop for recovery days between city exploration and longer travel itineraries.",
    tips: ["Ideal for midday reset", "Book ahead on weekends", "Bring a light change of clothes"],
    results: [
      {
        title: "Sunrise food trail",
        description: "A gentle follow-up plan after your spa session.",
        href: "/providers/sunrise-food-trail",
        kind: "experience",
      },
      {
        title: "Nearby destination options",
        description: "Compare destination pages for your next short trip.",
        href: "/destinations",
        kind: "destination",
      },
      {
        title: "Travel guides",
        description: "Read practical city guides for low-stress planning.",
        href: "/articles",
        kind: "guide",
      },
    ],
  },
  "latin-groove": {
    intro: "A social, high-energy food pick around live music and culture-forward evening routes.",
    tips: ["Check peak queue windows", "Great for groups", "Stay late for nightlife nearby"],
    results: [
      {
        title: "Street culture photo walk",
        description: "Start with portraits and city stories before dinner.",
        href: "/providers/street-culture-photo-walk",
        kind: "experience",
      },
      {
        title: "Trending feed",
        description: "Open current travel stories, videos, and experiences.",
        href: "/trending",
        kind: "guide",
      },
      {
        title: "Top stream picks",
        description: "Play destination videos directly from the stream page.",
        href: "/stream",
        kind: "video",
      },
    ],
  },
  finks: {
    intro: "A neighborhood coffee stop suited for slow mornings and planning your next nearby activity.",
    tips: ["Best in early morning", "Ideal for solo planning", "Pair with a short cultural route"],
    results: [
      {
        title: "Hidden neighbourhood stories",
        description: "Walk local streets with guides and context.",
        href: "/providers/hidden-neighbourhood-stories",
        kind: "experience",
      },
      {
        title: "Travel guides",
        description: "Read curated articles while you plan your day.",
        href: "/articles",
        kind: "guide",
      },
      {
        title: "London destination guide",
        description: "Open city tips and neighborhood recommendations.",
        href: "/destinations/london",
        kind: "destination",
      },
    ],
  },
  "granary-square": {
    intro: "A popular public landmark with strong access to cultural spaces and easy onward routes.",
    tips: ["Visit during golden hour", "Great for short stopovers", "Combine with nearby food spots"],
    results: [
      {
        title: "Explore all providers",
        description: "Browse curated experiences close to major landmarks.",
        href: "/providers",
        kind: "experience",
      },
      {
        title: "Stream travel edits",
        description: "Watch cinematic clips from places around the world.",
        href: "/stream",
        kind: "video",
      },
      {
        title: "Destinations index",
        description: "Jump into city pages with custom local information.",
        href: "/destinations",
        kind: "destination",
      },
    ],
  },
};

export function getNearbySpotBySlug(slug: string) {
  return nearbySpots.find((spot) => spot.slug === slug) ?? null;
}
