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
import type { CmsDb } from "./types";
import type { CmsBlogRow, CmsProviderRow, CmsVideoRow } from "./types";

const blogSelect =
  "id, slug, title, summary, title_image_url, title_image, body, published_at, created_at, updated_at";
const videoSelect =
  "id, slug, title, uploader, description, thumbnail_url, thumbnail, playback_id, published_at, created_at, updated_at";
const providerSelect =
  "id, slug, name, event_name, description, location, contact_email, contact_phone, contact_website, banner_image_url, banner_image_alt, banner_image, images, prices, published_at, created_at, updated_at";

function ilikePattern(term: string) {
  const safe = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
  return `%${safe}%`;
}

function mergeBlogRows(rows: CmsBlogRow[]): simpleBlogCard[] {
  const byId = new Map<string, CmsBlogRow>();
  for (const r of rows) byId.set(r.id, r);
  return Array.from(byId.values()).map(mapBlogRowToCard);
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

export async function getProviderBySlug(db: CmsDb, slug: string): Promise<fullProvider | null> {
  const { data, error } = await db.from("cms_providers").select(providerSelect).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapProviderRowToFull(data as CmsProviderRow);
}

export async function searchBlogs(db: CmsDb, term: string): Promise<simpleBlogCard[]> {
  const t = term.trim();
  if (!t) return listBlogs(db);
  const p = ilikePattern(t);
  const [byTitle, bySummary] = await Promise.all([
    db.from("cms_blogs").select(blogSelect).ilike("title", p),
    db.from("cms_blogs").select(blogSelect).ilike("summary", p),
  ]);
  const rows = [...(byTitle.data as CmsBlogRow[] | null | undefined) ?? [], ...(bySummary.data as CmsBlogRow[] | null | undefined) ?? []];
  return mergeBlogRows(rows);
}
