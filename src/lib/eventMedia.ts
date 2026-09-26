import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";
import { getSupabasePublicConfig } from "@/lib/supabase/publicConfig";

/**
 * Public event photography lives in Supabase Storage under `media/events/...`.
 * Legacy on-disk paths were `/events/{folder}/{file}` in `public/events`.
 */
export function eventMediaUrl(path: string): string {
  const relative = path.replace(/^\/?events\//, "").replace(/^\//, "");
  const base = getSupabasePublicConfig().url.replace(/\/$/, "");
  if (!base) return `/events/${relative}`;
  return `${base}/storage/v1/object/public/${SUPABASE_PUBLIC_MEDIA_BUCKET}/events/${relative}`;
}

/** Leave absolute URLs alone; rewrite legacy `/events/...` paths to Storage. */
export function resolveEventMediaSrc(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/events/")) return eventMediaUrl(src);
  return src;
}

/** Full-resolution copy of an event photo (`events/{folder}/large/{file}`), for full-bleed use. */
export function largeEventMediaSrc(src: string): string {
  const marker = `/storage/v1/object/public/${SUPABASE_PUBLIC_MEDIA_BUCKET}/events/`;
  const idx = src.indexOf(marker);
  if (idx < 0) return src;
  const rest = src.slice(idx + marker.length);
  const slash = rest.lastIndexOf("/");
  if (slash < 0 || rest.includes("/large/")) return src;
  return `${src.slice(0, idx + marker.length)}${rest.slice(0, slash)}/large/${rest.slice(slash + 1)}`;
}

/** Map a Storage public URL back to the legacy `/events/...` path for blur lookups. */
export function toLegacyEventPath(src: string): string {
  const marker = `/storage/v1/object/public/${SUPABASE_PUBLIC_MEDIA_BUCKET}/events/`;
  const idx = src.indexOf(marker);
  if (idx >= 0) return `/events/${src.slice(idx + marker.length)}`;
  return src;
}
