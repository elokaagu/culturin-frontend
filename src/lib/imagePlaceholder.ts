/**
 * Minimal LQIP-style data URL for Next.js `<Image placeholder="blur" />`.
 * Remote `src` URLs require `blurDataURL`; use this until CMS provides per-asset LQIPs.
 */
export const IMAGE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

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
