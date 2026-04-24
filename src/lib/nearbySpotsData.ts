/**
 * Placeholder “nearby” spots for the header panel. Wire to a maps/places API later.
 */
type NearbySpot = {
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
    title: "KKINI",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-00551306c1b3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Dining at night, warm light",
    href: "/search?query=restaurant+London",
    showMore: true,
  },
  {
    title: "Sushi & More",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1579027614696-ffceca4a8870?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sushi and Japanese dining",
    href: "/search?query=sushi+London",
    showMore: false,
  },
  {
    title: "Casa Spa",
    city: "London",
    category: "Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6d4deb28f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Spa interior with archway",
    href: "/search?query=spa+London",
    showMore: false,
  },
  {
    title: "Latin Groove",
    city: "London",
    category: "Restaurant",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Street with colourful facades",
    href: "/search?query=Latin+restaurant+London",
    showMore: true,
  },
  {
    title: "Fink's",
    city: "London",
    category: "Coffee Shop",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Coffee and café interior",
    href: "/search?query=cafe+London",
    showMore: true,
  },
  {
    title: "Granary Square",
    city: "London",
    category: "Landmark",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fountains and public square",
    href: "/search?query=Granary+Square+London",
    showMore: false,
  },
];
