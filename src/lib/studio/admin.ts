import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

type AdminCheckResult = {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

/**
 * People who always have admin access once they've signed in with a confirmed email, even if
 * their `users.role` row is missing. Override with ADMIN_EMAILS (comma-separated).
 */
const DEFAULT_ADMIN_EMAILS = ["eloka.agu@icloud.com", "eloka@culturin.com", "unik@culturin.com"];

function adminEmailAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS?.trim();
  const list = raw ? raw.split(",") : DEFAULT_ADMIN_EMAILS;
  return new Set(list.map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export async function getCurrentAdminState(): Promise<AdminCheckResult> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { userId: null, email: null, isAdmin: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, email: null, isAdmin: false };
  }

  const admin = getSupabaseAdminFreshOrNull();
  if (!admin) {
    return { userId: user.id, email: user.email ?? null, isAdmin: false };
  }

  const { data } = await admin.from("users").select("role").eq("id", user.id).maybeSingle();
  const role = typeof data?.role === "string" ? data.role.toUpperCase() : "";

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin:
      role === "ADMIN" ||
      (Boolean(user.email_confirmed_at) && adminEmailAllowlist().has((user.email ?? "").toLowerCase())),
  };
}
