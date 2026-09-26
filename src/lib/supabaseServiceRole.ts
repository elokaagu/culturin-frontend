import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured.");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

/** Same as {@link getSupabaseAdmin} but returns null when env is missing (avoid server 500s on admin routes). */
export function getSupabaseAdminOrNull(): SupabaseClient | null {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}

let cachedFreshClient: SupabaseClient | null = null;

/**
 * Service-role client whose requests bypass Next's fetch Data Cache. Admin screens must
 * always read live rows (a cached list resurrects deleted items), while the shared
 * client above stays cacheable for public ISR pages.
 */
export function getSupabaseAdminFresh(): SupabaseClient {
  if (cachedFreshClient) return cachedFreshClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured.");
  if (!supabaseServiceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

  cachedFreshClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return cachedFreshClient;
}

export function getSupabaseAdminFreshOrNull(): SupabaseClient | null {
  try {
    return getSupabaseAdminFresh();
  } catch {
    return null;
  }
}
