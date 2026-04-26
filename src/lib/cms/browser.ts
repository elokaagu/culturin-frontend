import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "@/lib/supabase/publicConfig";
import type { CmsDb } from "./types";

/**
 * Browser Supabase client using the anon key + RLS (public read on cms_*).
 */
export function getCmsBrowserClient(): CmsDb | null {
  const { url, anonKey: key } = getSupabasePublicConfig();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as CmsDb;
}
