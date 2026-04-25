/**
 * Travel Guides hub — large category cards (image + color overlay) linking into search.
 * Swap for CMS counts or tags when your catalogue supports it.
 */
export type TravelGuideCategory = {
  slug: string;
  title: string;
  articleCount: number;
  imageUrl?: string;
  imageAlt: string;
  href: string;
  /** Tailwind: overlay + blend on top of the image */
  overlayClass: string;
};

export const travelGuideCategories: TravelGuideCategory[] = [
  {
    slug: "conscious-travel",
    title: "Conscious travel: places, people and planet",
    articleCount: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Hiking among mountains and trees",
    href: "/articles/guides/conscious-travel",
    overlayClass:
      "bg-emerald-800/75 mix-blend-multiply sm:bg-emerald-800/70",
  },
  {
    slug: "black-travel",
    title: "Black travel",
    articleCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Road through rocky landscape at dusk",
    href: "/articles/guides/black-travel",
    overlayClass: "bg-indigo-950/80 mix-blend-multiply sm:bg-indigo-950/75",
  },
  {
    slug: "south-asian-travel",
    title: "South Asian travel",
    articleCount: 5,
    imageAlt: "Deep blue abstract gradient background",
    href: "/articles/guides/south-asian-travel",
    overlayClass: "bg-gradient-to-br from-[#11266a] via-[#0d1e57] to-[#081131]",
  },
  {
    slug: "solo-women-travel",
    title: "Solo women travel",
    articleCount: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Woman traveler walking through a city street",
    href: "/articles/guides/solo-women-travel",
    overlayClass: "bg-fuchsia-900/65 mix-blend-multiply",
  },
  {
    slug: "food-and-night-markets",
    title: "Food and night markets",
    articleCount: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Colorful food market at night",
    href: "/articles/guides/food-and-night-markets",
    overlayClass: "bg-amber-900/70 mix-blend-multiply",
  },
  {
    slug: "art-design-city-breaks",
    title: "Art and design city breaks",
    articleCount: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1504198266285-165a7f0f4f6f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Museum interior and modern architecture",
    href: "/articles/guides/art-design-city-breaks",
    overlayClass: "bg-cyan-900/65 mix-blend-multiply",
  },
  {
    slug: "music-festival-routes",
    title: "Music and festival routes",
    articleCount: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Crowd enjoying a music festival at night",
    href: "/articles/guides/music-festival-routes",
    overlayClass: "bg-violet-900/70 mix-blend-multiply",
  },
  {
    slug: "wellness-and-slow-living",
    title: "Wellness and slow living",
    articleCount: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Peaceful nature trail and lake",
    href: "/articles/guides/wellness-and-slow-living",
    overlayClass: "bg-emerald-950/65 mix-blend-multiply",
  },
];
