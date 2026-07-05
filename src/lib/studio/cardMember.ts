import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

type CardMemberState = {
  userId: string | null;
  email: string | null;
  isCardMember: boolean;
};

/**
 * Mirrors getCurrentAdminState() in src/lib/studio/admin.ts, but checks
 * users.card_status instead of users.role. Not wired into any gated page
 * yet — this is the primitive future member-only pages (curated provider
 * directory, exec content) will call.
 */
export async function getCardMemberState(): Promise<CardMemberState> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { userId: null, email: null, isCardMember: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, email: null, isCardMember: false };
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return { userId: user.id, email: user.email ?? null, isCardMember: false };
  }

  const { data } = await admin.from("users").select("card_status").eq("id", user.id).maybeSingle();
  const cardStatus = typeof data?.card_status === "string" ? data.card_status : "none";

  return {
    userId: user.id,
    email: user.email ?? null,
    isCardMember: cardStatus === "active",
  };
}
