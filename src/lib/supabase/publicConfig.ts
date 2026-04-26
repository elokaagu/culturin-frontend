/**
 * Public Supabase project URL + anon key for auth and CMS in the browser.
 * Server / middleware can also read `SUPABASE_URL` / `SUPABASE_ANON_KEY` if you prefer not to duplicate.
 * The client bundle only inlines `NEXT_PUBLIC_*` unless `next.config.js` mirrors the server names.
 */
export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  ).trim();
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();
  return { url, anonKey };
}
