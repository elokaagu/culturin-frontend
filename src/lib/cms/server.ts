import { getSupabaseAdmin } from "../../libs/supabase";
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
