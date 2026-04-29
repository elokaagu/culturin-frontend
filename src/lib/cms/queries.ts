import type { fullBlog, fullProvider, fullVideo, providerCard, providerHeroCard, simpleBlogCard, videoCard } from "@/lib/interface";
import {
  mapBlogRowToCard,
  mapBlogRowToFull,
  mapProviderRowToCard,
  mapProviderRowToFull,
  mapProviderRowToHero,
  mapVideoRowToCard,
  mapVideoRowToFull,
} from "./mappers";
import { tokenizeSearchQuery } from "@/lib/searchTokenize";

import type { CmsDb } from "./types";
import type { CmsBlogRow, CmsProviderRow, CmsVideoRow } from "./types";

const blogSelect =
  "id, slug, title, summary, title_image_url, title_image, body, published_at, created_at, updated_at";
const videoSelect =
  "id, slug, title, uploader, description, thumbnail_url, thumbnail, playback_id, published_at, created_at, updated_at";
const providerSelect =
  "id, slug, name, event_name, description, location, avatar_image_url, languages, specialties, contact_email, contact_phone, contact_website, banner_image_url, banner_image_alt, banner_image, images, prices, published_at, created_at, updated_at";

function ilikePattern(term: string) {
  const safe = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
  return `%${safe}%`;
}

function mergeBlogRows(rows: CmsBlogRow[]): simpleBlogCard[] {
  const byId = new Map<string, CmsBlogRow>();
  for (const r of rows) byId.set(r.id, r);
  return Array.from(byId.values()).map(mapBlogRowToCard);
}

function mergeVideoRows(rows: CmsVideoRow[]): videoCard[] {
  const byId = new Map<string, CmsVideoRow>();
  for (const r of rows) byId.set(r.id, r);
  return Array.from(byId.values()).map(mapVideoRowToCard);
}

function mergeProviderRows(rows: CmsProviderRow[]): providerHeroCard[] {
  const byId = new Map<string, CmsProviderRow>();
  for (const r of rows) byId.set(r.id, r);
  return Array.from(byId.values()).map(mapProviderRowToHero);
}

/** All rows for one token: title or summary/fields ilike. */
function mergeBlogRowsToMap(rows: CmsBlogRow[]): Map<string, CmsBlogRow> {
  const m = new Map<string, CmsBlogRow>();
  for (const r of rows) m.set(r.id, r);
  return m;
}

async function blogIdRowsForToken(db: CmsDb, token: string): Promise<Map<string, CmsBlogRow>> {
  const p = ilikePattern(token);
  const [byTitle, bySummary] = await Promise.all([
    db.from("cms_blogs").select(blogSelect).ilike("title", p),
    db.from("cms_blogs").select(blogSelect).ilike("summary", p),
  ]);
  const rows: CmsBlogRow[] = [
    ...((byTitle.data as CmsBlogRow[] | null | undefined) ?? []),
    ...((bySummary.data as CmsBlogRow[] | null | undefined) ?? []),
  ];
  return mergeBlogRowsToMap(rows);
}

async function videoIdRowsForToken(db: CmsDb, token: string): Promise<Map<string, CmsVideoRow>> {
  const p = ilikePattern(token);
  const [byTitle, byUploader, byDescription] = await Promise.all([
    db.from("cms_videos").select(videoSelect).ilike("title", p),
    db.from("cms_videos").select(videoSelect).ilike("uploader", p),
    db.from("cms_videos").select(videoSelect).ilike("description", p),
  ]);
  const rows: CmsVideoRow[] = [
    ...((byTitle.data as CmsVideoRow[] | null | undefined) ?? []),
    ...((byUploader.data as CmsVideoRow[] | null | undefined) ?? []),
    ...((byDescription.data as CmsVideoRow[] | null | undefined) ?? []),
  ];
  const m = new Map<string, CmsVideoRow>();
  for (const r of rows) m.set(r.id, r);
  return m;
}

async function providerIdRowsForToken(db: CmsDb, token: string): Promise<Map<string, CmsProviderRow>> {
  const p = ilikePattern(token);
  const [byEventName, byName, byLocation, byDescription] = await Promise.all([
    db.from("cms_providers").select(providerSelect).ilike("event_name", p),
    db.from("cms_providers").select(providerSelect).ilike("name", p),
    db.from("cms_providers").select(providerSelect).ilike("location", p),
    db.from("cms_providers").select(providerSelect).ilike("description", p),
  ]);
  const rows: CmsProviderRow[] = [
    ...((byEventName.data as CmsProviderRow[] | null | undefined) ?? []),
    ...((byName.data as CmsProviderRow[] | null | undefined) ?? []),
    ...((byLocation.data as CmsProviderRow[] | null | undefined) ?? []),
    ...((byDescription.data as CmsProviderRow[] | null | undefined) ?? []),
  ];
  const m = new Map<string, CmsProviderRow>();
  for (const r of rows) m.set(r.id, r);
  return m;
}

export async function listBlogs(db: CmsDb): Promise<simpleBlogCard[]> {
  const { data, error } = await db
    .from("cms_blogs")
    .select(blogSelect)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as CmsBlogRow[]).map(mapBlogRowToCard);
}

/** Studio list row: title, slug, summary, and dates for search/sort. */
export type StudioBlogListItem = {
  title: string;
  summary: string;
  currentSlug: string;
  publishedAt: string | null;
  createdAt: string;
};

export async function listBlogsForStudio(db: CmsDb): Promise<StudioBlogListItem[]> {
  const { data, error } = await db
    .from("cms_blogs")
    .select("slug,title,summary,published_at,created_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Pick<CmsBlogRow, "slug" | "title" | "summary" | "published_at" | "created_at">[]).map(
    (row) => ({
      currentSlug: row.slug,
      title: row.title,
      summary: row.summary ?? "",
      publishedAt: row.published_at,
      createdAt: row.created_at,
    }),
  );
}

export async function getBlogBySlug(db: CmsDb, slug: string): Promise<fullBlog | null> {
  const { data, error } = await db.from("cms_blogs").select(blogSelect).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapBlogRowToFull(data as CmsBlogRow);
}

export async function listVideos(db: CmsDb): Promise<videoCard[]> {
  const { data, error } = await db
    .from("cms_videos")
    .select(videoSelect)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as CmsVideoRow[]).map(mapVideoRowToCard);
}

export async function listFullVideos(db: CmsDb): Promise<fullVideo[]> {
  const { data, error } = await db
    .from("cms_videos")
    .select(videoSelect)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as CmsVideoRow[]).map(mapVideoRowToFull);
}

export async function getVideoBySlug(db: CmsDb, slug: string): Promise<fullVideo | null> {
  const { data, error } = await db.from("cms_videos").select(videoSelect).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapVideoRowToFull(data as CmsVideoRow);
}

export async function listProviders(db: CmsDb): Promise<providerHeroCard[]> {
  const { data, error } = await db
    .from("cms_providers")
    .select(providerSelect)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as CmsProviderRow[]).map(mapProviderRowToHero);
}

export async function listProvidersAsCards(db: CmsDb): Promise<providerCard[]> {
  const { data, error } = await db
    .from("cms_providers")
    .select(providerSelect)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as CmsProviderRow[]).map(mapProviderRowToCard);
}

/** Studio videos list: fields for search/sort. */
export type StudioVideoListItem = {
  currentSlug: string;
  title: string;
  uploader: string;
  description: string;
  playbackId: string;
  publishedAt: string | null;
  createdAt: string;
};

export async function listVideosForStudio(db: CmsDb): Promise<StudioVideoListItem[]> {
  const { data, error } = await db
    .from("cms_videos")
    .select("slug,title,uploader,description,playback_id,published_at,created_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (
    data as Pick<
      CmsVideoRow,
      "slug" | "title" | "uploader" | "description" | "playback_id" | "published_at" | "created_at"
    >[]
  ).map((row) => ({
    currentSlug: row.slug,
    title: row.title,
    uploader: row.uploader ?? "",
    description: row.description ?? "",
    playbackId: row.playback_id?.trim() ?? "",
    publishedAt: row.published_at,
    createdAt: row.created_at,
  }));
}

/** Studio providers list: fields for search/sort. */
export type StudioProviderListItem = {
  slug: string;
  eventName: string;
  name: string;
  location: string;
  description: string;
  publishedAt: string | null;
  createdAt: string;
};

export async function listProvidersForStudio(db: CmsDb): Promise<StudioProviderListItem[]> {
  const { data, error } = await db
    .from("cms_providers")
    .select("slug,name,event_name,description,location,published_at,created_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (
    data as Pick<
      CmsProviderRow,
      "slug" | "name" | "event_name" | "description" | "location" | "published_at" | "created_at"
    >[]
  ).map((row) => ({
    slug: row.slug,
    eventName: row.event_name ?? "",
    name: row.name ?? "",
    location: row.location ?? "",
    description: row.description ?? "",
    publishedAt: row.published_at,
    createdAt: row.created_at,
  }));
}

export async function getProviderBySlug(db: CmsDb, slug: string): Promise<fullProvider | null> {
  const { data, error } = await db.from("cms_providers").select(providerSelect).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapProviderRowToFull(data as CmsProviderRow);
}

export async function searchBlogs(db: CmsDb, term: string): Promise<simpleBlogCard[]> {
  const t = term.trim();
  if (!t) return listBlogs(db);
  const tokens = tokenizeSearchQuery(t);
  if (tokens.length === 0) return [];
  if (tokens.length === 1) {
    const p = ilikePattern(tokens[0]!);
    const [byTitle, bySummary] = await Promise.all([
      db.from("cms_blogs").select(blogSelect).ilike("title", p),
      db.from("cms_blogs").select(blogSelect).ilike("summary", p),
    ]);
    const rows = [
      ...((byTitle.data as CmsBlogRow[] | null | undefined) ?? []),
      ...((bySummary.data as CmsBlogRow[] | null | undefined) ?? []),
    ];
    return mergeBlogRows(rows);
  }
  const perToken = await Promise.all(tokens.map((tok) => blogIdRowsForToken(db, tok)));
  const [first, ...rest] = perToken;
  if (!first) return [];
  const ids = Array.from(first.keys()).filter((id) => rest.every((m) => m.has(id)));
  return ids.map((id) => mapBlogRowToCard(first.get(id)!));
}

export async function searchVideos(db: CmsDb, term: string): Promise<videoCard[]> {
  const t = term.trim();
  if (!t) return listVideos(db);
  const tokens = tokenizeSearchQuery(t);
  if (tokens.length === 0) return [];
  if (tokens.length === 1) {
    const p = ilikePattern(tokens[0]!);
    const [byTitle, byUploader, byDescription] = await Promise.all([
      db.from("cms_videos").select(videoSelect).ilike("title", p),
      db.from("cms_videos").select(videoSelect).ilike("uploader", p),
      db.from("cms_videos").select(videoSelect).ilike("description", p),
    ]);
    const rows = [
      ...((byTitle.data as CmsVideoRow[] | null | undefined) ?? []),
      ...((byUploader.data as CmsVideoRow[] | null | undefined) ?? []),
      ...((byDescription.data as CmsVideoRow[] | null | undefined) ?? []),
    ];
    return mergeVideoRows(rows);
  }
  const perToken = await Promise.all(tokens.map((tok) => videoIdRowsForToken(db, tok)));
  const [first, ...rest] = perToken;
  if (!first) return [];
  const ids = Array.from(first.keys()).filter((id) => rest.every((m) => m.has(id)));
  return ids.map((id) => mapVideoRowToCard(first.get(id)!));
}

export async function searchProviders(db: CmsDb, term: string): Promise<providerHeroCard[]> {
  const t = term.trim();
  if (!t) return listProviders(db);
  const tokens = tokenizeSearchQuery(t);
  if (tokens.length === 0) return [];
  if (tokens.length === 1) {
    const p = ilikePattern(tokens[0]!);
    const [byEventName, byName, byLocation, byDescription] = await Promise.all([
      db.from("cms_providers").select(providerSelect).ilike("event_name", p),
      db.from("cms_providers").select(providerSelect).ilike("name", p),
      db.from("cms_providers").select(providerSelect).ilike("location", p),
      db.from("cms_providers").select(providerSelect).ilike("description", p),
    ]);
    const rows = [
      ...((byEventName.data as CmsProviderRow[] | null | undefined) ?? []),
      ...((byName.data as CmsProviderRow[] | null | undefined) ?? []),
      ...((byLocation.data as CmsProviderRow[] | null | undefined) ?? []),
      ...((byDescription.data as CmsProviderRow[] | null | undefined) ?? []),
    ];
    return mergeProviderRows(rows);
  }
  const perToken = await Promise.all(tokens.map((tok) => providerIdRowsForToken(db, tok)));
  const [first, ...rest] = perToken;
  if (!first) return [];
  const ids = Array.from(first.keys()).filter((id) => rest.every((m) => m.has(id)));
  return ids.map((id) => mapProviderRowToHero(first.get(id)!));
}
