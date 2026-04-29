/**
 * Canonical site origin for Supabase auth redirects (signup confirmation, OAuth).
 *
 * Set **NEXT_PUBLIC_SITE_URL** in production (e.g. on Vercel) to your deployed URL
 * **without** a trailing slash, e.g. `https://culturin-frontend.vercel.app`
 *
 * When unset, the browser falls back to `window.location.origin` (fine for local dev).
 */
export function getPublicSiteUrl(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? String(process.env.NEXT_PUBLIC_SITE_URL).trim().replace(/\/$/, "")
      : "";
  if (raw) return raw;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
