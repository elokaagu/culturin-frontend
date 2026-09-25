import type { curatorCard, fullCurator, fullVideo, videoCard } from "@/lib/interface";
import { REMOTE_DEMO_IMAGES } from "../remoteImageUrls";

/** Demo hosted-player ID shared across seeded showcase videos (see `/stream`). */
const SHOWCASE_DEMO_PLAYBACK_ID = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";

const IMAGES = REMOTE_DEMO_IMAGES;

type ShowcaseCurator = {
  card: curatorCard;
  full: fullCurator;
};

const SHOWCASE_CURATORS: Record<string, ShowcaseCurator> = {
  pontoon: {
    card: {
      slug: "pontoon",
      name: "Pontoon",
      tagline: "Stories for women in motion",
      avatarUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      websiteUrl: "https://pontooncommunity.com",
      instagramUrl: "https://www.instagram.com/pontoon_co/",
      shopUrl: "https://pontooncommunity.com/shop",
      specialties: ["Travel", "Women's voices", "Culture", "Identity", "Photography"],
    },
    full: {
      slug: "pontoon",
      name: "Pontoon",
      tagline: "Stories for women in motion",
      description:
        "Pontoon is an editorial community built around women who move through the world on their own terms — photographers, writers, explorers, and makers who find meaning in motion. Through long-form interviews, travel stories, and cultural dispatches, Pontoon documents the lives of women whose sense of home is always evolving. Culturin is proud to feature Pontoon's work as part of our curated editorial program.",
      avatarUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      bannerUrl:
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      websiteUrl: "https://pontooncommunity.com",
      instagramUrl: "https://www.instagram.com/pontoon_co/",
      shopUrl: "https://pontooncommunity.com/shop",
      specialties: ["Travel", "Women's voices", "Culture", "Identity", "Photography"],
    },
  },
};

type ShowcaseVideo = {
  card: videoCard;
  full: fullVideo;
};

const SHOWCASE_VIDEOS: Record<string, ShowcaseVideo> = {
  "golden-hour-in-the-valley": {
    card: {
      title: "Golden hour in the valley",
      currentSlug: "golden-hour-in-the-valley",
      uploader: "Culturin Studios",
      description: "Long shadows, slow music, and a route that only works at this time of day.",
      videoThumbnailUrl: IMAGES.fitness,
    },
    full: {
      _id: "showcase-golden-hour-in-the-valley",
      title: "Golden hour in the valley",
      currentSlug: "golden-hour-in-the-valley",
      uploader: "Culturin Studios",
      description: "Long shadows, slow music, and a route that only works at this time of day.",
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
      videoThumbnailUrl: IMAGES.fitness,
    },
  },
  "market-mornings": {
    card: {
      title: "Market mornings: sound, steam, and the first coffee",
      currentSlug: "market-mornings",
      uploader: "Culturin Studios",
      description: "A tight edit from opening hour — vendors, light, and the ritual of the first pour.",
      videoThumbnailUrl: IMAGES.texture,
    },
    full: {
      _id: "showcase-market-mornings",
      title: "Market mornings: sound, steam, and the first coffee",
      currentSlug: "market-mornings",
      uploader: "Culturin Studios",
      description: "A tight edit from opening hour — vendors, light, and the ritual of the first pour.",
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
      videoThumbnailUrl: IMAGES.texture,
    },
  },
  "coast-by-rail": {
    card: {
      title: "Coast by rail: one window, a hundred small harbors",
      currentSlug: "coast-by-rail",
      uploader: "Culturin Studios",
      description: "No narration — just pace, glass, and the line where land meets water.",
      videoThumbnailUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-coast-by-rail",
      title: "Coast by rail: one window, a hundred small harbors",
      currentSlug: "coast-by-rail",
      uploader: "Culturin Studios",
      description: "No narration — just pace, glass, and the line where land meets water.",
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
      videoThumbnailUrl: IMAGES.portrait,
    },
  },
};

/** Shown on the home page when the CMS returns no video rows. */
export function getShowcaseVideoCards(): videoCard[] {
  return Object.values(SHOWCASE_VIDEOS).map((v) => ({
    ...v.card,
    playbackId: v.full.playbackId,
  }));
}

export function getShowcaseFullVideo(slug: string): fullVideo | null {
  return SHOWCASE_VIDEOS[slug]?.full ?? null;
}

export function getShowcaseFullVideos(): fullVideo[] {
  return Object.values(SHOWCASE_VIDEOS).map((v) => v.full);
}

export function getShowcaseCuratorCards(): curatorCard[] {
  return Object.values(SHOWCASE_CURATORS).map((c) => c.card);
}

export function getShowcaseFullCurator(slug: string): fullCurator | null {
  return SHOWCASE_CURATORS[slug]?.full ?? null;
}