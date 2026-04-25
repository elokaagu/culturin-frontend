/**
 * Minimal LQIP-style data URL for Next.js `<Image placeholder="blur" />`.
 * Remote `src` URLs require `blurDataURL`; use this until CMS provides per-asset LQIPs.
 */
export const IMAGE_BLUR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23181818'/%3E%3Cstop offset='1' stop-color='%23242424'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='9' fill='url(%23g)'/%3E%3C/svg%3E";

/** Static SVG in `public/` when CMS has no image URL. */
const CONTENT_PLACEHOLDER_IMAGE = "/placeholders/content-cover.svg";

function trimOrEmpty(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Returns a usable image URL, or {@link CONTENT_PLACEHOLDER_IMAGE} when missing or invalid.
 * Accepts `http(s):` URLs and absolute paths under `/`.
 */
export function resolveContentImageSrc(src: string | null | undefined): string {
  const t = trimOrEmpty(src);
  if (!t || t === CONTENT_PLACEHOLDER_IMAGE) return CONTENT_PLACEHOLDER_IMAGE;
  if (t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/")) return t;
  return CONTENT_PLACEHOLDER_IMAGE;
}

/** Same rules as {@link resolveContentImageSrc} — video posters and article covers share one fallback. */
export function resolveVideoThumbnailSrc(src: string | null | undefined): string {
  return resolveContentImageSrc(src);
}

/** Local bundled SVGs should use `unoptimized` with `next/image` (SVG). */
export function isBundledPlaceholderSrc(src: string): boolean {
  return src.startsWith("/placeholders/");
}
