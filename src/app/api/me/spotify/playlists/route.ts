import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import {
  getSpotifyConnectionStatus,
  listMySpotifyPlaylists,
  setSpotifyPlaylistVisibility,
  syncSpotifyPlaylists,
} from "@/lib/repositories/spotifyRepository";
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
    const [connection, playlists] = await Promise.all([
      getSpotifyConnectionStatus(appUserId),
      listMySpotifyPlaylists(appUserId),
    ]);
    return NextResponse.json({ connection, playlists });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load Spotify playlists");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const playlists = await syncSpotifyPlaylists(appUserId);
    return NextResponse.json({ playlists });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to sync Spotify playlists");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as {
      playlistId?: string;
      isPublic?: boolean;
    };
    const playlistId = typeof body.playlistId === "string" ? body.playlistId.trim() : "";
    if (!playlistId || typeof body.isPublic !== "boolean") {
      return NextResponse.json({ message: "playlistId and isPublic are required" }, { status: 400 });
    }
    await setSpotifyPlaylistVisibility({ userId: appUserId, playlistId, isPublic: body.isPublic });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update playlist visibility");
    return NextResponse.json({ message }, { status: 500 });
  }
}
