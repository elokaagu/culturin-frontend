/**
 * Travel Guides hub — large category cards (image + color overlay) linking into search.
 * Swap for CMS counts or tags when your catalogue supports it.
 */
export type TravelGuideCategory = {
  title: string;
  articleCount: number;
  imageUrl: string;
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Hiking among mountains and trees",
    href: "/search?query=conscious+travel",
    overlayClass:
      "bg-emerald-800/75 mix-blend-multiply sm:bg-emerald-800/70",
  },
  {
    title: "Black travel",
    articleCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Travelers in a sunlit city street",
    href: "/search?query=black+travel",
    overlayClass: "bg-blue-950/80 mix-blend-multiply sm:bg-blue-950/75",
  },
  {
    title: "South Asian travel",
    articleCount: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Intricate gateway and path in South Asia",
    href: "/search?query=south+asian+travel",
    overlayClass: "bg-blue-950/80 mix-blend-multiply sm:bg-blue-950/75",
  },
];
