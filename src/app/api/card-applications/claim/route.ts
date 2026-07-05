import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { activateCardMembership, getCardInviteByToken } from "@/lib/cardMembership";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GENERIC_INVALID_MESSAGE = "This invite link is invalid or has expired.";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { token?: unknown };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ message: GENERIC_INVALID_MESSAGE }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ message: "Sign in to claim this invite." }, { status: 401 });
  }

  // Re-verify server-side — never trust that the client-rendered page state
  // (which token/email it showed) still matches what's true right now.
  const invite = await getCardInviteByToken(token);
  if (!invite) {
    return NextResponse.json({ message: GENERIC_INVALID_MESSAGE }, { status: 400 });
  }

  if (invite.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
    return NextResponse.json(
      { message: "This invite was sent to a different email address than the account you're signed in with." },
      { status: 403 },
    );
  }

  const ensured = await ensureAppUser(user);
  if (!ensured) {
    return NextResponse.json({ message: "Could not set up your account. Try again." }, { status: 500 });
  }

  const activated = await activateCardMembership({ token, userId: ensured.id, email: user.email });
  if (!activated) {
    return NextResponse.json({ message: GENERIC_INVALID_MESSAGE }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
