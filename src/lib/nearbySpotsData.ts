import { NEARBY_CARD_IMAGES } from "./remoteImageUrls";

/**
 * Placeholder “nearby” spots for the header panel. Wire to a maps/places API later.
 */
type NearbySpot = {
  slug: string;
  title: string;
  city: string;
  category: string;
  distanceKm: number;
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
    distanceKm: 1.4,
    imageUrl: NEARBY_CARD_IMAGES.dining,
    imageAlt: "Dining at night, warm light",
    href: "/nearby/kkini",
    showMore: true,
  },
  {
    slug: "sushi-more",
    title: "Sushi & More",
    city: "London",
    category: "Restaurant",
    distanceKm: 3.2,
    imageUrl: NEARBY_CARD_IMAGES.sushi,
    imageAlt: "Sushi and Japanese dining",
    href: "/nearby/sushi-more",
    showMore: false,
  },
  {
    slug: "casa-spa",
    title: "Casa Spa",
    city: "London",
    category: "Spa",
    distanceKm: 6.8,
    imageUrl: NEARBY_CARD_IMAGES.spa,
    imageAlt: "Spa interior with archway",
    href: "/nearby/casa-spa",
    showMore: false,
  },
  {
    slug: "latin-groove",
    title: "Latin Groove",
    city: "London",
    category: "Restaurant",
    distanceKm: 9.7,
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
    distanceKm: 18.4,
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
    distanceKm: 24.2,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fountains and public square",
    href: "/nearby/granary-square",
    showMore: false,
  },
  {
    slug: "cours-saleya",
    title: "Cours Saleya Market",
    city: "Nice",
    category: "Market",
    distanceKm: 0.5,
    imageUrl: NEARBY_CARD_IMAGES.dining,
    imageAlt: "Vibrant morning market with fresh produce and flowers",
    href: "/nearby/cours-saleya",
    showMore: true,
  },
  {
    slug: "vieux-nice-galleries",
    title: "Vieux Nice Street Art",
    city: "Nice",
    category: "Art & Culture",
    distanceKm: 0.8,
    imageUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Colorful narrow streets with local artists",
    href: "/nearby/vieux-nice-galleries",
    showMore: false,
  },
  {
    slug: "promenade-des-anglais",
    title: "Promenade des Anglais",
    city: "Nice",
    category: "Waterfront",
    distanceKm: 1.2,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-33da04aaba2b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Seaside promenade with Mediterranean views",
    href: "/nearby/promenade-des-anglais",
    showMore: true,
  },
  {
    slug: "port-lympia",
    title: "Port Lympia",
    city: "Nice",
    category: "Waterfront",
    distanceKm: 2.1,
    imageUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Colorful boats and harbor cafés",
    href: "/nearby/port-lympia",
    showMore: false,
  },
  {
    slug: "nice-castle-hill",
    title: "Castle Hill Views",
    city: "Nice",
    category: "Landmark",
    distanceKm: 0.6,
    imageUrl:
      "https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Hilltop ruins with panoramic city and sea views",
    href: "/nearby/nice-castle-hill",
    showMore: true,
  },
  {
    slug: "socca-vendors",
    title: "Socca & Local Street Food",
    city: "Nice",
    category: "Food & Drink",
    distanceKm: 0.3,
    imageUrl:
      "https://images.unsplash.com/photo-1585521537190-6ca8e1691a4b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Traditional Nice chickpea pancakes and local delicacies",
    href: "/nearby/socca-vendors",
    showMore: false,
  },
  {
    slug: "cannes-film-festival-palace",
    title: "Film Festival Palace",
    city: "Cannes",
    category: "Landmark",
    distanceKm: 1.0,
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Iconic waterfront palace with red carpet history",
    href: "/nearby/cannes-film-festival-palace",
    showMore: true,
  },
  {
    slug: "marche-forville",
    title: "Marché Forville",
    city: "Cannes",
    category: "Market",
    distanceKm: 1.2,
    imageUrl: NEARBY_CARD_IMAGES.dining,
    imageAlt: "Daily farmers market with local produce and spices",
    href: "/nearby/marche-forville",
    showMore: true,
  },
  {
    slug: "iles-de-lerins",
    title: "Îles de Lérins",
    city: "Cannes",
    category: "Island Escape",
    distanceKm: 2.5,
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Quiet island beaches and peaceful monastery ruins",
    href: "/nearby/iles-de-lerins",
    showMore: true,
  },
  {
    slug: "boulevard-croisette",
    title: "Boulevard de la Croisette",
    city: "Cannes",
    category: "Waterfront",
    distanceKm: 0.5,
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Luxury waterfront boulevard with yacht views",
    href: "/nearby/boulevard-croisette",
    showMore: false,
  },
  {
    slug: "le-cannet-village",
    title: "Le Cannet Village",
    city: "Cannes",
    category: "Neighborhood",
    distanceKm: 2.8,
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Hillside village with quiet streets and local charm",
    href: "/nearby/le-cannet-village",
    showMore: false,
  },
  {
    slug: "bouillabaisse-restaurants",
    title: "Bouillabaisse Dining",
    city: "Cannes",
    category: "Food & Drink",
    distanceKm: 1.5,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Traditional Provençal fish stew dining",
    href: "/nearby/bouillabaisse-restaurants",
    showMore: true,
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
  "cours-saleya": {
    intro: "Nice's liveliest morning market—fresh flowers, local produce, and authentic Niçoise culture start here.",
    tips: ["Arrive before 11am for best selection", "Tuesday–Sunday open, closed Mondays", "Bring a tote bag for purchases", "Best photo light: early morning"],
    results: [
      {
        title: "Nice destination guide",
        description: "Explore Vieux Nice, neighborhoods, and cultural context.",
        href: "/destinations/nice",
        kind: "destination",
      },
      {
        title: "Food and market travel guide",
        description: "Learn how to navigate markets like a local.",
        href: "/travel-guides/food-and-night-markets",
        kind: "guide",
      },
      {
        title: "Artisan food experiences",
        description: "Find local cooking classes and market tours.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
  "vieux-nice-galleries": {
    intro: "Narrow lanes packed with independent galleries, street art, and local artists—the soul of Nice.",
    tips: ["Explore during daylight hours", "Many galleries close 1–3pm for lunch", "Get lost and follow narrow passageways", "Talk to artists in open studios"],
    results: [
      {
        title: "Art and design city breaks",
        description: "Curated guide for gallery-focused travel.",
        href: "/travel-guides/art-design-city-breaks",
        kind: "guide",
      },
      {
        title: "Nice cultural experiences",
        description: "Book local art walks and studio visits.",
        href: "/providers",
        kind: "experience",
      },
      {
        title: "Stream art and culture",
        description: "Watch visual edits from Nice and French Riviera.",
        href: "/stream",
        kind: "video",
      },
    ],
  },
  "promenade-des-anglais": {
    intro: "A legendary waterfront boulevard—perfect for long walks, sunset moments, and Mediterranean views.",
    tips: ["Best at dawn or after 5pm", "Pebble beach—bring water shoes", "Cafés with sea views line the route", "Pair with evening aperitif"],
    results: [
      {
        title: "Nice destination page",
        description: "Learn about neighborhoods, food, and best times.",
        href: "/destinations/nice",
        kind: "destination",
      },
      {
        title: "Solo women travel guide",
        description: "Safe, walkable routes and confidence-building tips.",
        href: "/travel-guides/solo-women-travel",
        kind: "guide",
      },
      {
        title: "Wellness and slow travel",
        description: "Calm itineraries and restorative walks.",
        href: "/travel-guides/wellness-and-slow-living",
        kind: "guide",
      },
    ],
  },
  "port-lympia": {
    intro: "A picturesque harbor full of pastel boats, waterfront cafés, and local charm—highly photogenic.",
    tips: ["Best light: late afternoon", "Arrive by 6pm for dinner reservations", "Stroll and people-watch from cafés", "Fresh seafood all day"],
    results: [
      {
        title: "Nice destination guide",
        description: "Explore Port Lympia and surrounding neighborhoods.",
        href: "/destinations/nice",
        kind: "destination",
      },
      {
        title: "Seafood dining experiences",
        description: "Book local chef dinners and fishing tours.",
        href: "/providers",
        kind: "experience",
      },
      {
        title: "Trending stories",
        description: "See current travel picks and editor highlights.",
        href: "/trending",
        kind: "guide",
      },
    ],
  },
  "nice-castle-hill": {
    intro: "Hilltop ruins with sweeping panoramas of Nice, the sea, and surrounding hills—sunrise or sunset magic.",
    tips: ["Start early or arrive before sunset", "Wear good walking shoes—steep paths", "Bring water and sun protection", "Allow 1–2 hours total"],
    results: [
      {
        title: "Nice destination",
        description: "Get local context and neighborhood insights.",
        href: "/destinations/nice",
        kind: "destination",
      },
      {
        title: "Hiking and nature experiences",
        description: "Find guided trail walks in the region.",
        href: "/providers",
        kind: "experience",
      },
      {
        title: "Conscious travel guide",
        description: "Travel respectfully and reduce impact.",
        href: "/travel-guides/conscious-travel",
        kind: "guide",
      },
    ],
  },
  "socca-vendors": {
    intro: "Street vendors selling Nice's signature chickpea pancake—cheap, delicious, and impossibly local.",
    tips: ["Find vendors in Vieux Nice morning and evening", "Expect to pay 3–5 euros", "Eat standing or sitting nearby", "Ask for extra black pepper (poivre)"],
    results: [
      {
        title: "Nice travel guide",
        description: "Discover food to try and local tips.",
        href: "/destinations/nice",
        kind: "destination",
      },
      {
        title: "Food and night markets guide",
        description: "Learn how to find and navigate street food.",
        href: "/travel-guides/food-and-night-markets",
        kind: "guide",
      },
      {
        title: "Artisan food tours",
        description: "Book street food and cooking experiences.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
  "cannes-film-festival-palace": {
    intro: "The iconic red-carpet palace—a must-see for anyone interested in cinema, design, and Riviera glamour.",
    tips: ["Best photographed from the beach at dawn", "Check event calendar for public access", "Dress smart-casual in surrounding area", "Pair with Croisette walk"],
    results: [
      {
        title: "Cannes destination guide",
        description: "Learn neighborhoods, timing, and local context.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Film and culture experiences",
        description: "Book cinema tours and cultural walks.",
        href: "/providers",
        kind: "experience",
      },
      {
        title: "Art and design travel guide",
        description: "Explore architecture and contemporary spaces.",
        href: "/travel-guides/art-design-city-breaks",
        kind: "guide",
      },
    ],
  },
  "marche-forville": {
    intro: "Cannes' daily farmers market—the real heart of the city, filled with Provençal produce, spices, and local energy.",
    tips: ["Open early morning every day except Mondays", "Most vendors gone by noon", "Bring cash for smaller vendors", "Sample fresh fruits and pastries"],
    results: [
      {
        title: "Cannes destination",
        description: "Explore neighborhoods and local culture.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Food and night markets",
        description: "Master the art of market navigation.",
        href: "/travel-guides/food-and-night-markets",
        kind: "guide",
      },
      {
        title: "Local food experiences",
        description: "Book market tours and cooking classes.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
  "iles-de-lerins": {
    intro: "Two peaceful islands 15 minutes from Cannes—quiet beaches, monastery ruins, and an escape from the scene.",
    tips: ["Ferry runs hourly from Vieux Port", "Visit one or both islands in a day", "Bring snacks—few restaurant options", "Explore Sainte-Marguerite's monastery"],
    results: [
      {
        title: "Cannes destination guide",
        description: "Learn escape routes and island options.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Wellness and slow living",
        description: "Plan restorative day trips and quieter itineraries.",
        href: "/travel-guides/wellness-and-slow-living",
        kind: "guide",
      },
      {
        title: "Nature and beach experiences",
        description: "Book guided island walks and snorkeling.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
  "boulevard-croisette": {
    intro: "Cannes' most glamorous waterfront—yachts, luxury boutiques, and people-watching from seaside cafés.",
    tips: ["Best walked at sunset", "Dress smart-casual for evening aperitif", "Window shop and observe", "Seafood restaurants line the boulevard"],
    results: [
      {
        title: "Cannes destination",
        description: "Navigate neighborhoods and understand the vibe.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Solo women travel",
        description: "Safe, walkable routes in Cannes.",
        href: "/travel-guides/solo-women-travel",
        kind: "guide",
      },
      {
        title: "Trending stories",
        description: "See current editor picks and travel ideas.",
        href: "/trending",
        kind: "guide",
      },
    ],
  },
  "le-cannet-village": {
    intro: "A quieter hilltop village above Cannes—narrow streets, local shops, and escape from festival crowds.",
    tips: ["Quiet mornings, can feel empty by evening", "Local artisans and independent shops", "Great for a slower afternoon", "Combine with Croisette evening"],
    results: [
      {
        title: "Cannes destination guide",
        description: "Explore quieter neighborhoods beyond the scene.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Wellness and slow travel",
        description: "Design calmer, more intentional itineraries.",
        href: "/travel-guides/wellness-and-slow-living",
        kind: "guide",
      },
      {
        title: "Local neighborhood experiences",
        description: "Book walks with local guides.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
  "bouillabaisse-restaurants": {
    intro: "Cannes' signature dish—a rich, aromatic fish stew rooted in Provençal tradition and Mediterranean waters.",
    tips: ["Order a day ahead at top restaurants", "Pair with Provençal rosé", "Expect 30–40 euro range", "Lunch vs. dinner differs little"],
    results: [
      {
        title: "Cannes destination",
        description: "Learn food to try and local dining culture.",
        href: "/destinations/cannes",
        kind: "destination",
      },
      {
        title: "Food and night markets",
        description: "Understand Provençal food traditions.",
        href: "/travel-guides/food-and-night-markets",
        kind: "guide",
      },
      {
        title: "Chef-led dining experiences",
        description: "Book private dinners and chef collaborations.",
        href: "/providers",
        kind: "experience",
      },
    ],
  },
};

export function getNearbySpotBySlug(slug: string) {
  return nearbySpots.find((spot) => spot.slug === slug) ?? null;
}
