import { getSupabaseAdmin, getSupabaseAdminFresh } from "../supabaseServiceRole";
import type { CmsDb } from "./types";

/**
 * Server-only Supabase client with service role (bypasses RLS).
 * Returns null when env is not configured so pages can still render empty shells.
 */
export function getCmsDbOrNull(): CmsDb | null {
  try {
    return getSupabaseAdmin() as CmsDb;
  } catch {
    return null;
  }
}

/** Same as {@link getCmsDbOrNull} but never served from Next's fetch cache. Use in admin code only. */
export function getCmsDbFreshOrNull(): CmsDb | null {
  try {
    return getSupabaseAdminFresh() as CmsDb;
  } catch {
    return null;
  }
}
