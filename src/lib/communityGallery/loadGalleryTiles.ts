import "server-only";

import { getCmsDbOrNull } from "@/lib/cms/server";

import type { GalleryTile } from "./types";

function trimUrl(s: string | null | undefined): string | null {
  const t = s?.trim();
  return t || null;
}

function providerHeroUrl(row: {
  banner_image_url?: string | null;
  avatar_image_url?: string | null;
}): string | null {
  return trimUrl(row.banner_image_url) ?? trimUrl(row.avatar_image_url);
}

/**
 * Aggregates image URLs from CMS (blogs, videos, providers) and user travel pins.
 */
export async function loadGalleryTiles(): Promise<GalleryTile[]> {
  const db = getCmsDbOrNull();
  if (!db) return [];

  const tiles: GalleryTile[] = [];

  const [blogsRes, videosRes, providersRes, pinsRes] = await Promise.all([
    db
      .from("cms_blogs")
      .select("slug, title, title_image_url, published_at, created_at")
      .not("title_image_url", "is", null)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(200),
    db
      .from("cms_videos")
      .select("slug, title, thumbnail_url, uploader, published_at, created_at")
      .not("thumbnail_url", "is", null)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(200),
    db
      .from("cms_providers")
      .select("slug, event_name, name, banner_image_url, avatar_image_url, published_at, created_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(200),
    db
      .from("community_travel_pins")
      .select("id, title, image_url, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(400),
  ]);

  const blogRows = (blogsRes.data ?? []) as {
    slug: string;
    title: string;
    title_image_url: string;
    published_at: string | null;
    created_at: string;
  }[];
  for (const row of blogRows) {
    const imageUrl = trimUrl(row.title_image_url);
    if (!imageUrl) continue;
    const sortAt = row.published_at ?? row.created_at;
    tiles.push({
      id: `blog-${row.slug}`,
      kind: "blog",
      imageUrl,
      href: `/articles/${row.slug}`,
      title: row.title || "Article",
      subtitle: "Story",
      sortAt,
    });
  }

  const videoRows = (videosRes.data ?? []) as {
    slug: string;
    title: string;
    thumbnail_url: string;
    uploader: string | null;
    published_at: string | null;
    created_at: string;
  }[];
  for (const row of videoRows) {
    const imageUrl = trimUrl(row.thumbnail_url);
    if (!imageUrl) continue;
    const sortAt = row.published_at ?? row.created_at;
    tiles.push({
      id: `video-${row.slug}`,
      kind: "video",
      imageUrl,
      href: `/stream?play=${encodeURIComponent(row.slug)}`,
      title: row.title || "Video",
      subtitle: row.uploader ? row.uploader : "Video",
      sortAt,
    });
  }

  const providerRows = (providersRes.data ?? []) as {
    slug: string;
    event_name: string | null;
    name: string | null;
    banner_image_url: string | null;
    avatar_image_url: string | null;
    published_at: string | null;
    created_at: string;
  }[];
  for (const row of providerRows) {
    const imageUrl = providerHeroUrl(row);
    if (!imageUrl) continue;
    const sortAt = row.published_at ?? row.created_at;
    const title = row.event_name?.trim() || row.name?.trim() || "Experience";
    tiles.push({
      id: `provider-${row.slug}`,
      kind: "provider",
      imageUrl,
      href: `/providers/${row.slug}`,
      title,
      subtitle: "Experience",
      sortAt,
    });
  }

  type PinRow = {
    id: string;
    title: string | null;
    image_url: string;
    created_at: string;
    user_id: string;
  };

  let pinRows: PinRow[] = [];
  if (!pinsRes.error && pinsRes.data) {
    pinRows = pinsRes.data as PinRow[];
  }

  const pinUserIds = Array.from(new Set(pinRows.map((p) => p.user_id)));
  const nameByUserId = new Map<string, string | null>();
  if (pinUserIds.length > 0) {
    const { data: usersRows } = await db.from("users").select("id, name").in("id", pinUserIds);
    for (const u of (usersRows ?? []) as { id: string; name: string | null }[]) {
      nameByUserId.set(u.id, u.name);
    }
  }

  for (const raw of pinRows) {
    const imageUrl = trimUrl(raw.image_url);
    if (!imageUrl) continue;
    const author = nameByUserId.get(raw.user_id)?.trim() || "Traveler";
    tiles.push({
      id: `travel-${raw.id}`,
      kind: "travel",
      imageUrl,
      href: `/community#travel-${raw.id}`,
      title: raw.title?.trim() || "Travel moment",
      subtitle: author,
      sortAt: raw.created_at,
    });
  }

  const seen = new Set<string>();
  const deduped: GalleryTile[] = [];
  for (const t of tiles) {
    const key = `${t.kind}:${t.imageUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(t);
  }

  deduped.sort((a, b) => (a.sortAt < b.sortAt ? 1 : a.sortAt > b.sortAt ? -1 : 0));
  return deduped;
}
