import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { followUser, listFollowedUserIds, unfollowUser } from "@/lib/repositories/followRepository";
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
    const followingUserIds = await listFollowedUserIds(appUserId);
    return NextResponse.json({ followingUserIds });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load follows");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as { targetUserId?: string };
    const targetUserId = body.targetUserId?.trim();
    if (!targetUserId) {
      return NextResponse.json({ message: "targetUserId is required" }, { status: 400 });
    }
    await followUser({ followerUserId: appUserId, followingUserId: targetUserId });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to follow traveler");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as { targetUserId?: string };
    const targetUserId = body.targetUserId?.trim();
    if (!targetUserId) {
      return NextResponse.json({ message: "targetUserId is required" }, { status: 400 });
    }
    await unfollowUser({ followerUserId: appUserId, followingUserId: targetUserId });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to unfollow traveler");
    return NextResponse.json({ message }, { status: 500 });
  }
}
