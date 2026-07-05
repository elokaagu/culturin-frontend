import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type CardInvite = { email: string };

/**
 * Looks up a pending Culturin Card invite by its claim token. Only ever
 * called server-side with the service-role client — invite_token has no
 * select policy for anon/authenticated, by design (see migration 035).
 * Returns null for every failure mode (not found, wrong status, expired) so
 * callers can show one generic message without distinguishing why.
 */
export async function getCardInviteByToken(token: string): Promise<CardInvite | null> {
  if (!token) return null;

  const admin = getSupabaseAdminOrNull();
  if (!admin) return null;

  const { data, error } = await admin
    .from("card_applications")
    .select("email, status, invite_token_expires_at")
    .eq("invite_token", token)
    .maybeSingle();

  if (error || !data) return null;
  if (data.status !== "invited") return null;
  if (!data.invite_token_expires_at || new Date(data.invite_token_expires_at).getTime() <= Date.now()) return null;

  return { email: String(data.email ?? "") };
}

/**
 * Activates a claimed invite via the activate_card_membership() Postgres
 * function (security definer, service_role-only execute grant). Re-checks
 * token/status/expiry/email match atomically in the database, so a retried
 * or racing call is a safe no-op rather than a double-activation.
 */
export async function activateCardMembership(params: {
  token: string;
  userId: string;
  email: string;
}): Promise<boolean> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return false;

  const { data, error } = await admin.rpc("activate_card_membership", {
    p_token: params.token,
    p_user_id: params.userId,
    p_email: params.email,
  });

  if (error) return false;
  return data === true;
}
