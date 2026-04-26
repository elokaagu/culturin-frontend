import type { fullBlog, fullProvider, fullVideo, providerCard, providerHeroCard, simpleBlogCard, videoCard } from "@/lib/interface";
import type { CmsBlogRow, CmsProviderRow, CmsVideoRow } from "./types";

export function mapBlogRowToCard(row: CmsBlogRow): simpleBlogCard {
  return {
    title: row.title,
    summary: row.summary ?? "",
    currentSlug: row.slug,
    titleImageUrl: row.title_image_url,
  };
}

export function mapBlogRowToFull(row: CmsBlogRow): fullBlog {
  return {
    _id: row.id,
    title: row.title,
    currentSlug: row.slug,
    summary: row.summary,
    titleImageUrl: row.title_image_url,
    titleImage: row.title_image,
    body: row.body,
  };
}

export function mapVideoRowToCard(row: CmsVideoRow): videoCard {
  const pid = row.playback_id?.trim();
  return {
    title: row.title,
    currentSlug: row.slug,
    uploader: row.uploader ?? "",
    description: row.description ?? "",
    playbackId: pid || undefined,
    videoThumbnailUrl: row.thumbnail_url,
    videoThumbnail: row.thumbnail,
  };
}

export function mapVideoRowToFull(row: CmsVideoRow): fullVideo {
  return {
    _id: row.id,
    title: row.title,
    currentSlug: row.slug,
    uploader: row.uploader ?? "",
    description: row.description ?? "",
    playbackId: row.playback_id ?? "",
    videoThumbnailUrl: row.thumbnail_url,
    videoThumbnail: row.thumbnail,
  };
}

export function mapProviderRowToHero(row: CmsProviderRow): providerHeroCard {
  const url = row.banner_image_url ?? undefined;
  const alt = row.banner_image_alt ?? row.event_name ?? row.name ?? "Provider";
  return {
    name: row.name ?? "",
    eventName: row.event_name ?? "",
    slug: row.slug,
    bannerImage: url
      ? { image: { url, alt } }
      : undefined,
  };
}

export function mapProviderRowToCard(row: CmsProviderRow): providerCard {
  const url = row.banner_image_url ?? "";
  const alt = row.banner_image_alt ?? row.event_name ?? "";
  return {
    name: row.name ?? "",
    eventName: row.event_name ?? "",
    slug: { current: row.slug },
    location: row.location ?? "",
    bannerImage: {
      image: { url, alt },
    },
  };
}

export function mapProviderRowToFull(row: CmsProviderRow): fullProvider {
  const images = Array.isArray(row.images) ? row.images : [];
  const prices = Array.isArray(row.prices)
    ? (row.prices as unknown[]).filter((p): p is number => typeof p === "number")
    : [];

  return {
    name: row.name ?? "",
    eventName: row.event_name ?? "",
    slug: row.slug,
    description: row.description ?? "",
    location: row.location ?? "",
    contactEmail: row.contact_email ?? "",
    contactPhone: row.contact_phone ?? "",
    contactWebsite: row.contact_website ?? "",
    prices,
    images: images as fullProvider["images"],
    bannerImage: {
      image: {
        url: row.banner_image_url ?? "",
        alt: row.banner_image_alt ?? row.event_name ?? "",
      },
    },
  };
}
