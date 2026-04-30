import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { deleteSpotifyConnection, getSpotifyConnectionStatus } from "@/lib/repositories/spotifyRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getSessionAppUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const appUser = await ensureAppUser(user);
  return appUser?.id ?? null;
}

export async function GET() {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const connection = await getSpotifyConnectionStatus(appUserId);
    return NextResponse.json({ connection });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load Spotify connection");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await deleteSpotifyConnection(appUserId);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to disconnect Spotify");
    return NextResponse.json({ message }, { status: 500 });
  }
}
