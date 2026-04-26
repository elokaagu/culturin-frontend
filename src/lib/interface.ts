export interface simpleBlogCard {
  title: string;
  summary: string;
  currentSlug: string;
  /** Resolved hero image URL (Supabase CMS). */
  titleImageUrl?: string | null;
  /** @deprecated Legacy Sanity image object; prefer titleImageUrl. */
  titleImage?: unknown;
}

export interface fullBlog {
  title: string;
  currentSlug: string;
  summary?: string | null;
  titleImageUrl?: string | null;
  titleImage?: unknown;
  body: unknown;
  _id: string;
}

export interface videoCard {
  title: string;
  currentSlug: string;
  uploader: string;
  description: string;
  /** Mux asset id; when set, the top videos rail can play in a hero dialog. */
  playbackId?: string;
  videoThumbnailUrl?: string | null;
  /** @deprecated Legacy Sanity asset; prefer videoThumbnailUrl. */
  videoThumbnail?: unknown;
}

export interface fullVideo {
  title: string;
  currentSlug: string;
  uploader: string;
  description: string;
  playbackId: string;
  _id: string;
  videoThumbnailUrl?: string | null;
  videoThumbnail?: unknown;
}

export interface providerCard {
  name: string;
  eventName: string;
  slug: { current: string };
  bannerImage?: {
    image?: { url?: string; alt?: string };
  };
}

/** Home curated-experiences rail card (server list from CMS). */
export interface providerHeroCard {
  name: string;
  eventName: string;
  slug: string;
  bannerImage?: {
    image?: { url?: string; alt?: string };
  };
}

export interface fullProvider {
  name: string;
  eventName: string;
  slug: string;
  bannerImage: BannerImage;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
  prices: number[];
  images: imageAsset[];
}

interface BannerImage {
  image: {
    url: string;
    alt: string;
  };
}

export interface imageAsset {
  _id: string;
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
}
