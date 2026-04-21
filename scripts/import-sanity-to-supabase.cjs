/**
 * One-off import: Sanity (public dataset) → Supabase cms_* tables.
 *
 * Requires env:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run from repo root:
 *   node scripts/import-sanity-to-supabase.cjs
 */

const { createClient } = require("@supabase/supabase-js");

const SANITY_PROJECT = "8rwgyjc1";
const SANITY_DATASET = "production";
const SANITY_API = `https://${SANITY_PROJECT}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}`;

async function sanityQuery(query) {
  const url = `${SANITY_API}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity HTTP ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.result;
}

function withWidth(url, w) {
  if (!url || typeof url !== "string") return null;
  if (url.includes("?")) return `${url}&w=${w}`;
  return `${url}?w=${w}`;
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const blogs = await sanityQuery(`*[_type == "blog"]{
    "sanity_id": _id,
    "slug": slug.current,
    title,
    summary,
    "raw_image": titleImage.asset->url,
    body,
    "published_at": _createdAt
  }`);

  const blogRows = (blogs || []).map((b) => ({
    sanity_id: b.sanity_id,
    slug: b.slug,
    title: b.title || "",
    summary: b.summary ?? null,
    title_image_url: withWidth(b.raw_image, 1600),
    title_image: null,
    body: b.body ?? null,
    published_at: b.published_at ?? null,
  }));

  if (blogRows.length) {
    const { error } = await supabase.from("cms_blogs").upsert(blogRows, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Upserted ${blogRows.length} blogs.`);
  }

  const videos = await sanityQuery(`*[_type == "video"]{
    "sanity_id": _id,
    "slug": slug.current,
    title,
    uploader,
    description,
    "raw_thumb": videoThumbnail.asset->url,
    "playback_id": video.asset->playbackId,
    "published_at": _createdAt
  }`);

  const videoRows = (videos || []).map((v) => ({
    sanity_id: v.sanity_id,
    slug: v.slug,
    title: v.title || "",
    uploader: v.uploader ?? null,
    description: v.description ?? null,
    thumbnail_url: withWidth(v.raw_thumb, 1200),
    thumbnail: null,
    playback_id: v.playback_id ?? null,
    published_at: v.published_at ?? null,
  }));

  if (videoRows.length) {
    const { error } = await supabase.from("cms_videos").upsert(videoRows, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Upserted ${videoRows.length} videos.`);
  }

  const providers = await sanityQuery(`*[_type == "providers"]{
    "sanity_id": _id,
    "slug": slug.current,
    name,
    eventName,
    description,
    location,
    "contact_email": contact.email,
    "contact_phone": contact.phone,
    "contact_website": contact.website,
    prices,
    "banner_image_url": bannerImage.image.asset->url,
    "banner_image_alt": bannerImage.caption,
    "images": images[].asset->{
      _id,
      url,
      "dimensions": metadata.dimensions
    },
    "published_at": _createdAt
  }`);

  const providerRows = (providers || []).map((p) => ({
    sanity_id: p.sanity_id,
    slug: p.slug,
    name: p.name ?? null,
    event_name: p.eventName ?? null,
    description: p.description ?? null,
    location: p.location ?? null,
    contact_email: p.contact_email ?? null,
    contact_phone: p.contact_phone ?? null,
    contact_website: p.contact_website ?? null,
    banner_image_url: p.banner_image_url ? withWidth(p.banner_image_url, 1600) : null,
    banner_image_alt: p.banner_image_alt ?? null,
    banner_image: null,
    images: Array.isArray(p.images) ? p.images : [],
    prices: Array.isArray(p.prices) ? p.prices : [],
    published_at: p.published_at ?? null,
  }));

  if (providerRows.length) {
    const { error } = await supabase.from("cms_providers").upsert(providerRows, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Upserted ${providerRows.length} providers.`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
