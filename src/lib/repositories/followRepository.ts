import type { SupabaseClient } from "@supabase/supabase-js";

import type { SpotListItemRow, SpotListRow, SpotListWithItems } from "@/lib/spotLists/types";
import type { SuggestedTraveler, TravelerCard, TravelerProfile } from "@/lib/social/types";
import { getPublicLanguageSummary } from "./languageLearningRepository";
import { listPublicSpotifyPlaylistsForProfile } from "./spotifyRepository";
import { getSupabaseAdmin } from "../supabaseServiceRole";

type AppUserRow = {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
};

function db(): SupabaseClient {
  return getSupabaseAdmin();
}

function displayNameFromUser(user: AppUserRow): string {
  return user.name?.trim() || user.username?.trim() || user.email.split("@")[0] || "Traveler";
}

function handleFromUser(user: AppUserRow): string {
  const raw = user.username?.trim() || user.email.split("@")[0] || "traveler";
  return `@${raw.replace(/^@/, "")}`;
}

function toItineraryText(list: SpotListRow): string {
  const place = list.place_label?.trim();
  return place ? `${list.title} (${place})` : list.title;
}

function toRecommendationText(items: SpotListItemRow[]): string {
  const noted = items.find((item) => item.notes?.trim());
  if (noted?.notes?.trim()) return noted.notes.trim();
  if (items[0]?.title?.trim()) return `Try ${items[0].title.trim()}.`;
  return "Follow for trip ideas and saved recommendations.";
}

async function fetchUsersByIds(userIds: string[]): Promise<Map<string, AppUserRow>> {
  if (userIds.length === 0) return new Map();
  const { data, error } = await db().from("users").select("id,email,name,username").in("id", userIds);
  if (error) throw error;
  const rows = (data ?? []) as AppUserRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

async function fetchItemsByListIds(listIds: string[]): Promise<Map<string, SpotListItemRow[]>> {
  if (listIds.length === 0) return new Map();
  const { data, error } = await db()
    .from("user_spot_list_items")
    .select("*")
    .in("list_id", listIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  const byList = new Map<string, SpotListItemRow[]>();
  for (const row of (data ?? []) as SpotListItemRow[]) {
    const list = byList.get(row.list_id) ?? [];
    list.push(row);
    byList.set(row.list_id, list);
  }
  return byList;
}

export async function listFollowedUserIds(followerUserId: string): Promise<string[]> {
  const { data, error } = await db()
    .from("user_follows")
    .select("following_user_id")
    .eq("follower_user_id", followerUserId);
  if (error) throw error;
  return ((data ?? []) as Array<{ following_user_id: string }>).map((row) => row.following_user_id);
}

export async function followUser(input: { followerUserId: string; followingUserId: string }): Promise<void> {
  if (input.followerUserId === input.followingUserId) {
    throw new Error("You cannot follow yourself.");
  }
  const { error } = await db().from("user_follows").upsert(
    {
      follower_user_id: input.followerUserId,
      following_user_id: input.followingUserId,
    },
    { onConflict: "follower_user_id,following_user_id" },
  );
  if (error) throw error;
}

export async function unfollowUser(input: { followerUserId: string; followingUserId: string }): Promise<void> {
  const { error } = await db()
    .from("user_follows")
    .delete()
    .eq("follower_user_id", input.followerUserId)
    .eq("following_user_id", input.followingUserId);
  if (error) throw error;
}

export async function listTravelerCardsForDestination(input: {
  destinationName: string;
  viewerUserId?: string | null;
  limit?: number;
}): Promise<TravelerCard[]> {
  const limit = input.limit ?? 6;
  const escapedDestination = input.destinationName.replace(/[%_]/g, "\\$&");
  const { data: listsData, error: listsErr } = await db()
    .from("user_spot_lists")
    .select("*")
    .ilike("place_label", `%${escapedDestination}%`)
    .order("updated_at", { ascending: false })
    .limit(80);
  if (listsErr) throw listsErr;

  let lists = (listsData ?? []) as SpotListRow[];
  if (lists.length === 0) {
    const { data: fallbackLists, error: fallbackErr } = await db()
      .from("user_spot_lists")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(80);
    if (fallbackErr) throw fallbackErr;
    lists = (fallbackLists ?? []) as SpotListRow[];
  }

  const userOrder = Array.from(new Set(lists.map((list) => list.user_id))).slice(0, limit);
  if (userOrder.length === 0) return [];

  const filteredLists = lists.filter((list) => userOrder.includes(list.user_id));
  const usersById = await fetchUsersByIds(userOrder);
  const itemsByListId = await fetchItemsByListIds(filteredLists.map((list) => list.id));
  const followedSet = new Set(
    input.viewerUserId ? await listFollowedUserIds(input.viewerUserId).catch(() => []) : [],
  );

  return userOrder
    .map((userId) => {
      const user = usersById.get(userId);
      if (!user) return null;
      const userLists = filteredLists.filter((list) => list.user_id === userId);
      const leadList = userLists[0];
      const leadItems = leadList ? itemsByListId.get(leadList.id) ?? [] : [];
      return {
        id: user.id,
        name: displayNameFromUser(user),
        handle: handleFromUser(user),
        itinerary: leadList ? toItineraryText(leadList) : "Saved destination picks",
        recommendation: toRecommendationText(leadItems),
        listsCount: userLists.length,
        isFollowing: followedSet.has(user.id),
      } satisfies TravelerCard;
    })
    .filter((row): row is TravelerCard => Boolean(row));
}

export async function getTravelerProfile(input: {
  travelerUserId: string;
  viewerUserId?: string | null;
}): Promise<TravelerProfile | null> {
  const { data: userData, error: userErr } = await db()
    .from("users")
    .select("id,email,name,username")
    .eq("id", input.travelerUserId)
    .maybeSingle();
  if (userErr) throw userErr;
  const user = (userData as AppUserRow | null) ?? null;
  if (!user) return null;

  let listsQuery = db().from("user_spot_lists").select("*").eq("user_id", user.id);
  if (input.viewerUserId !== user.id) {
    listsQuery = listsQuery.eq("is_published", true);
  }
  const { data: listsData, error: listsErr } = await listsQuery.order("updated_at", { ascending: false });
  if (listsErr) throw listsErr;
  const lists = (listsData ?? []) as SpotListRow[];

  const itemsByListId = await fetchItemsByListIds(lists.map((list) => list.id));
  const listWithItems: SpotListWithItems[] = lists.map((list) => ({
    ...list,
    items: itemsByListId.get(list.id) ?? [],
  }));

  const [{ count: followersCount, error: followersErr }, { count: followingCount, error: followingErr }] = await Promise.all(
    [
      db().from("user_follows").select("*", { count: "exact", head: true }).eq("following_user_id", user.id),
      db().from("user_follows").select("*", { count: "exact", head: true }).eq("follower_user_id", user.id),
    ],
  );
  if (followersErr) throw followersErr;
  if (followingErr) throw followingErr;

  let isFollowing = false;
  if (input.viewerUserId && input.viewerUserId !== user.id) {
    const { data: existing, error: followErr } = await db()
      .from("user_follows")
      .select("following_user_id")
      .eq("follower_user_id", input.viewerUserId)
      .eq("following_user_id", user.id)
      .maybeSingle();
    if (followErr) throw followErr;
    isFollowing = Boolean(existing);
  }

  const languageSummary = await getPublicLanguageSummary(user.id).catch(() => null);
  const spotifyPlaylists = await listPublicSpotifyPlaylistsForProfile({
    userId: user.id,
    viewerUserId: input.viewerUserId ?? null,
  }).catch(() => []);

  return {
    id: user.id,
    name: displayNameFromUser(user),
    handle: handleFromUser(user),
    lists: listWithItems,
    spotifyPlaylists: spotifyPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks_total: playlist.tracks_total,
      image_url: playlist.image_url,
      spotify_url: playlist.spotify_url,
    })),
    languageSummary,
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
    isFollowing,
  };
}

export async function listSuggestedTravelers(input: {
  viewerUserId?: string | null;
  excludeUserIds?: string[];
  limit?: number;
}): Promise<SuggestedTraveler[]> {
  const limit = input.limit ?? 5;
  const excluded = new Set((input.excludeUserIds ?? []).filter(Boolean));
  if (input.viewerUserId) excluded.add(input.viewerUserId);

  const { data: usersData, error: usersErr } = await db()
    .from("users")
    .select("id,email,name,username")
    .order("created_at", { ascending: false })
    .limit(40);
  if (usersErr) throw usersErr;

  const followedSet = new Set(
    input.viewerUserId ? await listFollowedUserIds(input.viewerUserId).catch(() => []) : [],
  );

  return ((usersData ?? []) as AppUserRow[])
    .filter((user) => !excluded.has(user.id))
    .filter((user) => !followedSet.has(user.id))
    .slice(0, limit)
    .map((user) => ({
      id: user.id,
      name: displayNameFromUser(user),
      handle: handleFromUser(user),
      isFollowing: false,
    }));
}

/**
 * Suggested profiles for the Community page: prioritizes travelers with published lists,
 * then fills from recently joined users. Excludes self and people the viewer already follows.
 */
export async function listCommunitySuggestedTravelers(input: {
  viewerUserId?: string | null;
  limit?: number;
}): Promise<SuggestedTraveler[]> {
  const limit = input.limit ?? 10;
  const excluded = new Set<string>();
  if (input.viewerUserId) excluded.add(input.viewerUserId);

  const followedSet = new Set(
    input.viewerUserId ? await listFollowedUserIds(input.viewerUserId).catch(() => []) : [],
  );

  const { data: listsData, error: listsErr } = await db()
    .from("user_spot_lists")
    .select("user_id")
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(160);
  if (listsErr) throw listsErr;

  const orderedUnique: string[] = [];
  const seenListOwner = new Set<string>();
  for (const row of (listsData ?? []) as { user_id: string }[]) {
    const id = row.user_id;
    if (seenListOwner.has(id) || excluded.has(id) || followedSet.has(id)) continue;
    seenListOwner.add(id);
    orderedUnique.push(id);
    if (orderedUnique.length >= limit * 3) break;
  }

  let candidateIds = orderedUnique.slice(0, limit);

  if (candidateIds.length < limit) {
    const { data: fallbackUsers, error: fuErr } = await db()
      .from("users")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(60);
    if (fuErr) throw fuErr;
    for (const row of (fallbackUsers ?? []) as { id: string }[]) {
      const id = row.id;
      if (excluded.has(id) || followedSet.has(id) || candidateIds.includes(id)) continue;
      candidateIds.push(id);
      if (candidateIds.length >= limit) break;
    }
  }

  candidateIds = candidateIds.slice(0, limit);
  if (candidateIds.length === 0) return [];

  const usersById = await fetchUsersByIds(candidateIds);
  const out: SuggestedTraveler[] = [];
  for (const id of candidateIds) {
    const user = usersById.get(id);
    if (!user) continue;
    out.push({
      id: user.id,
      name: displayNameFromUser(user),
      handle: handleFromUser(user),
      isFollowing: false,
    });
  }
  return out;
}
