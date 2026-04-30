import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }
  const appUser = await ensureAppUser(user);
  if (!appUser) {
    return NextResponse.redirect(new URL("/profile?error=spotify_user", request.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL("/profile?error=spotify_env", request.url));
  }

  const origin = getSiteOrigin(request);
  const secure = origin.startsWith("https://");
  const state = crypto.randomUUID();
  const store = cookies();
  store.set("spotify_oauth_state", state, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 600 });
  store.set("spotify_oauth_user_id", appUser.id, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 600 });

  const redirectUri = getSpotifyRedirectUri(request);
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", "playlist-read-private playlist-read-collaborative");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("show_dialog", "true");

  return NextResponse.redirect(authUrl);
}
