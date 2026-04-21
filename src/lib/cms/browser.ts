import { createClient } from "@supabase/supabase-js";

import type { CmsDb } from "./types";

/**
 * Browser Supabase client using the anon key + RLS (public read on cms_*).
 */
export function getCmsBrowserClient(): CmsDb | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as CmsDb;
}
