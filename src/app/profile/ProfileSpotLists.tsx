"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ChangeEventHandler } from "react";

import { useSupabaseAuth } from "../components/SupabaseAuthProvider";
import type { SpotListItemRow, SpotListWithItems } from "@/lib/spotLists/types";
import {
  cmsImageUnoptimized,
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "@/lib/imagePlaceholder";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.+-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
}

type Props = {
  onCountChange?: (count: number) => void;
};

export default function ProfileSpotLists({ onCountChange }: Props) {
  const [lists, setLists] = useState<SpotListWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"itinerary" | "collection" | "highlights">("itinerary");
  const [newPublished, setNewPublished] = useState(false);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/me/spot-lists");
    if (res.status === 401) {
      setLists([]);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      setError(j.message ?? "Could not load your lists.");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { lists: SpotListWithItems[] };
    setLists(data.lists ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    onCountChange?.(lists.length);
  }, [lists.length, onCountChange]);

  const createList = async () => {
    const title = newTitle.trim();
    if (!title || creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/me/spot-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          placeLabel: newPlace.trim() || null,
          description: newDescription.trim() || null,
          listType: newType,
          isPublished: newPublished,
        }),
      });
      const data = (await res.json()) as { list?: { id: string }; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? "Could not create list.");
      }
      setNewTitle("");
      setNewPlace("");
      setNewDescription("");
      setNewType("itinerary");
      setNewPublished(false);
      if (data.list?.id) setExpandedId(data.list.id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create list.");
    } finally {
      setCreating(false);
    }
  };

  const deleteList = async (listId: string) => {
    if (!confirm("Delete this list and all its spots?")) return;
    setError(null);
    const res = await fetch(`/api/me/spot-lists/${listId}`, { method: "DELETE" });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      setError(j.message ?? "Could not delete list.");
      return;
    }
    if (expandedId === listId) setExpandedId(null);
    await refresh();
  };

  if (loading) {
    return (
      <div className="mt-10 flex min-h-[12rem] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 dark:border-white/20 dark:border-t-white/70" />
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/[0.1] dark:bg-white/[0.03] sm:p-6">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Trip lists</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-white/45">
          Create itineraries, collections, and highlights, then publish what you want others to discover.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="new-list-title" className="sr-only">
              List name
            </label>
            <input
              id="new-list-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="List name (e.g. Lisbon long weekend)"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/35"
            />
          </div>
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label htmlFor="new-list-place" className="sr-only">
              Place
            </label>
            <input
              id="new-list-place"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              placeholder="Place (optional)"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/35"
            />
          </div>
          <button
            type="button"
            onClick={() => void createList()}
            disabled={!newTitle.trim() || creating}
            className="shrink-0 rounded-full border border-neutral-900/15 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
          >
            {creating ? "Adding…" : "New list"}
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-white/50">Type</p>
            <div
              className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/90 p-1 dark:border-white/[0.1] dark:bg-white/[0.04]"
              role="group"
              aria-label="List type"
            >
              {(["itinerary", "collection", "highlights"] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setNewType(kind)}
                  className={
                    newType === kind
                      ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-950 shadow-sm ring-1 ring-neutral-200/80 dark:bg-white/15 dark:text-white dark:shadow-none dark:ring-0"
                      : "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-neutral-800 dark:text-white/45 dark:hover:text-white/75"
                  }
                  aria-pressed={newType === kind}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="new-list-description" className="mb-1 block text-xs font-medium text-neutral-500 dark:text-white/50">
              Description
            </label>
            <input
              id="new-list-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/35"
            />
          </div>
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-white/75">
          <input
            type="checkbox"
            checked={newPublished}
            onChange={(e) => setNewPublished(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500 dark:border-white/20 dark:bg-white/10"
          />
          Publish this list to my public profile
        </label>

        {error ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200/90" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {lists.length === 0 ? (
        <p className="mt-8 text-center text-sm text-neutral-500 dark:text-white/40">
          No lists yet. Name a trip or city above and add spots as you go.
        </p>
      ) : (
        <ul className="mt-8 space-y-4 p-0">
          {lists.map((list) => (
            <SpotListCard
              key={list.id}
              list={list}
              expanded={expandedId === list.id}
              onToggle={() => setExpandedId((id) => (id === list.id ? null : list.id))}
              onDeleted={() => void deleteList(list.id)}
              onChanged={() => void refresh()}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SpotListCard({
  list,
  expanded,
  onToggle,
  onDeleted,
  onChanged,
}: {
  list: SpotListWithItems;
  expanded: boolean;
  onToggle: () => void;
  onDeleted: () => void;
  onChanged: () => void;
}) {
  const { supabase, user } = useSupabaseAuth();
  const spotImageInputRef = useRef<HTMLInputElement>(null);
  const [spotTitle, setSpotTitle] = useState("");
  const [spotNotes, setSpotNotes] = useState("");
  const [spotUrl, setSpotUrl] = useState("");
  const [spotImageUrl, setSpotImageUrl] = useState("");
  const [spotImageUploading, setSpotImageUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updatingList, setUpdatingList] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const updateListMeta = async (patch: {
    listType?: "itinerary" | "collection" | "highlights";
    description?: string | null;
    isPublished?: boolean;
  }) => {
    setUpdatingList(true);
    setLocalError(null);
    const res = await fetch(`/api/me/spot-lists/${list.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setUpdatingList(false);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      setLocalError(j.message ?? "Could not update list.");
      return;
    }
    onChanged();
  };

  const onSpotImageFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !supabase || !user) {
      setLocalError(!supabase || !user ? "Sign in to upload images." : null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose an image (JPEG, PNG, WebP, or GIF).");
      return;
    }
    setSpotImageUploading(true);
    setLocalError(null);
    const path = `${user.id}/itineraries/${list.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error, data } = await supabase.storage
      .from(SUPABASE_PUBLIC_MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      setLocalError(error.message);
      setSpotImageUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET).getPublicUrl(data.path);
    setSpotImageUrl(pub.publicUrl);
    setSpotImageUploading(false);
  };

  const addSpot = async () => {
    const title = spotTitle.trim();
    if (!title || adding) return;
    setAdding(true);
    setLocalError(null);
    try {
      const res = await fetch(`/api/me/spot-lists/${list.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          notes: spotNotes.trim() || null,
          url: spotUrl.trim() || null,
          imageUrl: spotImageUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j.message ?? "Could not add spot.");
      }
      setSpotTitle("");
      setSpotNotes("");
      setSpotUrl("");
      setSpotImageUrl("");
      onChanged();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Could not add spot.");
    } finally {
      setAdding(false);
    }
  };

  const removeItem = async (item: SpotListItemRow) => {
    const res = await fetch(`/api/me/spot-lists/${list.id}/items/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      setLocalError(j.message ?? "Could not remove spot.");
      return;
    }
    onChanged();
  };

  return (
    <li className="list-none">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-white/[0.1] dark:bg-white/[0.02]">
        <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={onToggle}
            className="min-w-0 flex-1 text-left"
            aria-expanded={expanded}
          >
            <span className="block text-sm font-semibold text-neutral-900 dark:text-white">{list.title}</span>
            {list.place_label ? (
              <span className="mt-0.5 block text-xs text-neutral-500 dark:text-white/45">{list.place_label}</span>
            ) : null}
            <span className="mt-1 inline-flex rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-white/20 dark:text-white/60">
              {list.list_type}
            </span>
            {list.description ? (
              <span className="mt-1 block text-xs text-neutral-500 dark:text-white/55">{list.description}</span>
            ) : null}
            <span className="mt-1 block text-xs text-neutral-400 dark:text-white/35">
              {list.items.length} spot{list.items.length === 1 ? "" : "s"}
            </span>
          </button>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 dark:border-white/15 dark:text-white/70 dark:hover:border-white/25"
            >
              {expanded ? "Close" : "Open"}
            </button>
            <button
              type="button"
              onClick={onDeleted}
              className="rounded-full border border-red-200/80 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="border-t border-neutral-100 px-4 py-4 dark:border-white/[0.06] sm:px-5">
            {list.items.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-white/40">No spots yet. Add one below.</p>
            ) : (
              <ul className="m-0 space-y-3 p-0">
                {list.items.map((item) => {
                  const coverSrc = item.image_url ? resolveContentImageSrc(item.image_url) : null;
                  return (
                  <li key={item.id} className="list-none rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-white/[0.04]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {coverSrc ? (
                          <div className="relative mb-2 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-lg bg-neutral-200 dark:bg-white/5">
                            <Image
                              src={coverSrc}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="240px"
                              placeholder="blur"
                              blurDataURL={IMAGE_BLUR_DATA_URL}
                              unoptimized={
                                isBundledPlaceholderSrc(coverSrc) || cmsImageUnoptimized(coverSrc)
                              }
                            />
                          </div>
                        ) : null}
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.title}</span>
                        {item.notes ? (
                          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-white/55">{item.notes}</p>
                        ) : null}
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
                          >
                            Link
                          </a>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeItem(item)}
                        className="shrink-0 text-xs text-neutral-400 underline-offset-2 hover:text-red-600 hover:underline dark:text-white/35 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-white/[0.06]">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {(["itinerary", "collection", "highlights"] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    disabled={updatingList}
                    onClick={() => void updateListMeta({ listType: kind })}
                    className={
                      list.list_type === kind
                        ? "rounded-full border border-amber-300/60 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-300/20 dark:text-amber-100"
                        : "rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-white/20 dark:text-white/65"
                    }
                  >
                    {kind}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={updatingList}
                  onClick={() => void updateListMeta({ isPublished: !list.is_published })}
                  className={
                    list.is_published
                      ? "rounded-full border border-emerald-300/60 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 dark:bg-emerald-300/20 dark:text-emerald-100"
                      : "rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:text-white/65"
                  }
                >
                  {updatingList ? "Saving…" : list.is_published ? "Published" : "Private"}
                </button>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-white/35">
                Add a spot
              </p>
              <p className="text-xs text-neutral-500 dark:text-white/45">
                Spots save when you click <span className="font-medium text-neutral-700 dark:text-white/70">Add spot</span> (or press Enter in the name field). Type, collection, and publish toggles above save as soon as you tap them.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                  value={spotTitle}
                  onChange={(e) => setSpotTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void addSpot();
                    }
                  }}
                  placeholder="Name (required)"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => void addSpot()}
                  disabled={!spotTitle.trim() || adding}
                  className="shrink-0 rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-amber-400/90 dark:text-neutral-950 dark:disabled:opacity-40"
                >
                  {adding ? "Adding…" : "Add spot"}
                </button>
              </div>
              <input
                value={spotNotes}
                onChange={(e) => setSpotNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
              />
              <input
                value={spotUrl}
                onChange={(e) => setSpotUrl(e.target.value)}
                placeholder="URL (optional)"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
              />
              <input
                value={spotImageUrl}
                onChange={(e) => setSpotImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
              />
              <input
                ref={spotImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={onSpotImageFile}
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!supabase || !user || spotImageUploading}
                  onClick={() => spotImageInputRef.current?.click()}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-white/85 dark:hover:bg-white/10"
                >
                  {spotImageUploading ? "Uploading…" : "Upload image"}
                </button>
                {spotImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setSpotImageUrl("")}
                    className="text-xs text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline dark:text-white/45 dark:hover:text-white/75"
                  >
                    Clear image
                  </button>
                ) : null}
              </div>
              {spotImageUrl ? (
                <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/5">
                  <Image
                    src={resolveContentImageSrc(spotImageUrl)}
                    alt="Spot preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    unoptimized={
                      isBundledPlaceholderSrc(resolveContentImageSrc(spotImageUrl)) ||
                      cmsImageUnoptimized(resolveContentImageSrc(spotImageUrl))
                    }
                  />
                </div>
              ) : null}
              {localError ? (
                <p className="text-sm text-amber-800 dark:text-amber-200/90">{localError}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
}
