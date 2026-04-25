import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabaseServiceRole";

type AdminCheckResult = {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export async function getCurrentAdminState(): Promise<AdminCheckResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, email: null, isAdmin: false };
  }

  const admin = getSupabaseAdmin();
  const { data } = await admin.from("users").select("role").eq("id", user.id).maybeSingle();
  const role = typeof data?.role === "string" ? data.role.toUpperCase() : "";

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin: role === "ADMIN",
  };
}
