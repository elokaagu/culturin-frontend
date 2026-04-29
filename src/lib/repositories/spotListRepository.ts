import type { SupabaseClient } from "@supabase/supabase-js";

import type { SpotListItemRow, SpotListRow, SpotListWithItems } from "@/lib/spotLists/types";
import { getSupabaseAdmin } from "../supabaseServiceRole";

function db(): SupabaseClient {
  return getSupabaseAdmin();
}

export type { SpotListItemRow, SpotListRow, SpotListWithItems } from "@/lib/spotLists/types";

export async function listSpotListsWithItems(userId: string): Promise<SpotListWithItems[]> {
  const { data: lists, error: listsErr } = await db()
    .from("user_spot_lists")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (listsErr) throw listsErr;
  const rows = (lists ?? []) as SpotListRow[];
  if (rows.length === 0) return [];

  const listIds = rows.map((r) => r.id);
  const { data: items, error: itemsErr } = await db()
    .from("user_spot_list_items")
    .select("*")
    .in("list_id", listIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (itemsErr) throw itemsErr;
  const itemRows = (items ?? []) as SpotListItemRow[];
  const byList = new Map<string, SpotListItemRow[]>();
  for (const it of itemRows) {
    const arr = byList.get(it.list_id) ?? [];
    arr.push(it);
    byList.set(it.list_id, arr);
  }

  return rows.map((list) => ({
    ...list,
    items: byList.get(list.id) ?? [],
  }));
}

export async function getSpotListForUser(listId: string, userId: string): Promise<SpotListRow | null> {
  const { data, error } = await db()
    .from("user_spot_lists")
    .select("*")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data as SpotListRow | null) ?? null;
}

export async function createSpotList(input: {
  userId: string;
  title: string;
  placeLabel?: string | null;
  listType?: "itinerary" | "collection" | "highlights";
  description?: string | null;
  isPublished?: boolean;
}): Promise<SpotListRow> {
  const { data, error } = await db()
    .from("user_spot_lists")
    .insert({
      user_id: input.userId,
      title: input.title.trim(),
      place_label: input.placeLabel?.trim() || null,
      list_type: input.listType ?? "itinerary",
      description: input.description?.trim() || null,
      is_published: Boolean(input.isPublished),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as SpotListRow;
}

export async function updateSpotList(input: {
  listId: string;
  userId: string;
  title?: string;
  placeLabel?: string | null;
  listType?: "itinerary" | "collection" | "highlights";
  description?: string | null;
  isPublished?: boolean;
}): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.placeLabel !== undefined) patch.place_label = input.placeLabel?.trim() || null;
  if (input.listType !== undefined) patch.list_type = input.listType;
  if (input.description !== undefined) patch.description = input.description?.trim() || null;
  if (input.isPublished !== undefined) patch.is_published = input.isPublished;

  if (Object.keys(patch).length === 0) return;

  const { error } = await db()
    .from("user_spot_lists")
    .update(patch)
    .eq("id", input.listId)
    .eq("user_id", input.userId);

  if (error) throw error;
}

export async function deleteSpotList(listId: string, userId: string): Promise<void> {
  const { error } = await db().from("user_spot_lists").delete().eq("id", listId).eq("user_id", userId);
  if (error) throw error;
}

async function nextItemSortOrder(listId: string): Promise<number> {
  const { data, error } = await db()
    .from("user_spot_list_items")
    .select("sort_order")
    .eq("list_id", listId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const row = data as { sort_order: number } | null;
  return (row?.sort_order ?? -1) + 1;
}

export async function addSpotListItem(input: {
  listId: string;
  userId: string;
  title: string;
  notes?: string | null;
  url?: string | null;
  imageUrl?: string | null;
}): Promise<SpotListItemRow> {
  const list = await getSpotListForUser(input.listId, input.userId);
  if (!list) throw new Error("List not found");

  const sort_order = await nextItemSortOrder(input.listId);
  const { data, error } = await db()
    .from("user_spot_list_items")
    .insert({
      list_id: input.listId,
      title: input.title.trim(),
      notes: input.notes?.trim() || null,
      url: input.url?.trim() || null,
      image_url: input.imageUrl?.trim() || null,
      sort_order,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as SpotListItemRow;
}

export async function updateSpotListItem(input: {
  itemId: string;
  listId: string;
  userId: string;
  title?: string;
  notes?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
}): Promise<void> {
  const list = await getSpotListForUser(input.listId, input.userId);
  if (!list) throw new Error("List not found");

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.notes !== undefined) patch.notes = input.notes?.trim() || null;
  if (input.url !== undefined) patch.url = input.url?.trim() || null;
  if (input.imageUrl !== undefined) patch.image_url = input.imageUrl?.trim() || null;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  if (Object.keys(patch).length === 0) return;

  const { error } = await db()
    .from("user_spot_list_items")
    .update(patch)
    .eq("id", input.itemId)
    .eq("list_id", input.listId);

  if (error) throw error;
}

export async function deleteSpotListItem(input: {
  itemId: string;
  listId: string;
  userId: string;
}): Promise<void> {
  const list = await getSpotListForUser(input.listId, input.userId);
  if (!list) throw new Error("List not found");

  const { error } = await db()
    .from("user_spot_list_items")
    .delete()
    .eq("id", input.itemId)
    .eq("list_id", input.listId);

  if (error) throw error;
}
