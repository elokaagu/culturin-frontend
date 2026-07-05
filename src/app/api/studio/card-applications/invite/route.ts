import crypto from "crypto";

import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getPublicSiteUrl } from "@/lib/siteUrl";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const { isAdmin, userId } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { id?: unknown };
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ message: "An application id is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Inviting isn’t available—your workspace isn’t fully connected. Try again later." },
      { status: 503 },
    );
  }

  const { data: application, error: fetchError } = await admin
    .from("card_applications")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 500 });
  }
  if (!application) {
    return NextResponse.json({ message: "Application not found." }, { status: 404 });
  }
  if (application.status === "active") {
    return NextResponse.json({ message: "This person is already an active Card member." }, { status: 409 });
  }

  const inviteToken = crypto.randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + INVITE_TTL_MS);

  const { error: updateError } = await admin
    .from("card_applications")
    .update({
      status: "invited",
      invite_token: inviteToken,
      invite_token_expires_at: expiresAt.toISOString(),
      invited_at: now.toISOString(),
      reviewed_by: userId,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  const origin = getPublicSiteUrl() || new URL(request.url).origin;
  const claimUrl = `${origin}/culturin-card/claim?token=${inviteToken}`;

  return NextResponse.json({ claimUrl, expiresAt: expiresAt.toISOString() });
}
