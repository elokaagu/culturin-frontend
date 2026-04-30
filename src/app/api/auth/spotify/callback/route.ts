import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { syncSpotifyPlaylists, upsertSpotifyConnectionFromCode } from "@/lib/repositories/spotifyRepository";

function getSiteOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  return new URL(request.url).origin;
}

function getSpotifyRedirectUri(request: Request): string {
  const configured = process.env.SPOTIFY_REDIRECT_URI?.trim();
  if (configured) return configured;
  return `${getSiteOrigin(request)}/api/auth/spotify/callback`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = getSiteOrigin(request);
  const redirectToProfile = `${origin}/profile#playlists`;
  const redirectToError = `${origin}/profile?error=spotify_connect#playlists`;
  const store = cookies();

  const stateCookie = store.get("spotify_oauth_state")?.value ?? "";
  const userIdCookie = store.get("spotify_oauth_user_id")?.value ?? "";
  const secure = origin.startsWith("https://");
  store.set("spotify_oauth_state", "", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 });
  store.set("spotify_oauth_user_id", "", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 });

  if (!code || !state || state !== stateCookie || !userIdCookie) {
    return NextResponse.redirect(`${origin}/profile?error=spotify_state#playlists`);
  }

  try {
    await upsertSpotifyConnectionFromCode({
      userId: userIdCookie,
      code,
      redirectUri: getSpotifyRedirectUri(request),
    });
    await syncSpotifyPlaylists(userIdCookie);
    return NextResponse.redirect(redirectToProfile);
  } catch {
    return NextResponse.redirect(redirectToError);
  }
}
