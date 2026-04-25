/**
 * Travel Guides hub — large category cards (image + color overlay) linking into search.
 * Swap for CMS counts or tags when your catalogue supports it.
 */
type TravelGuideCategory = {
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
    title: "Conscious travel: places, people and planet",
    articleCount: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Hiking among mountains and trees",
    href: "/search?query=conscious+travel",
    overlayClass:
      "bg-emerald-800/75 mix-blend-multiply sm:bg-emerald-800/70",
  },
  {
    title: "Black travel",
    articleCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Road through rocky landscape at dusk",
    href: "/search?query=black+travel",
    overlayClass: "bg-indigo-950/80 mix-blend-multiply sm:bg-indigo-950/75",
  },
  {
    title: "South Asian travel",
    articleCount: 5,
    imageAlt: "Deep blue abstract gradient background",
    href: "/search?query=south+asian+travel",
    overlayClass: "bg-gradient-to-br from-[#11266a] via-[#0d1e57] to-[#081131]",
  },
];
