"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import { Link } from "next-view-transitions";

import { ArticleCardFromBlog } from "@/components/cms/ArticleCard";
import type { simpleBlogCard } from "@/lib/interface";
import { getCmsBrowserClient } from "@/lib/cms/browser";
import { filterPublicBlogs } from "@/lib/cms/blockedFromSite";
import { listBlogs } from "@/lib/cms/queries";
import {
  formatStorageUploadError,
  profileAvatarStoragePath,
  resolveProfileImageContentType,
} from "@/lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";

import { GoogleSignInButton } from "../components/AuthButtons";
import { useAppAuth, useSupabaseAuth } from "../components/SupabaseAuthProvider";
import ProfileSpotLists from "./ProfileSpotLists";

const BIO_MAX_LEN = 500;

type TabId = "elements" | "collections";

type GridDensity = 2 | 3 | 4;

function initialsFromName(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts.length === 1 && parts[0]!.length >= 2) return parts[0]!.slice(0, 2).toUpperCase();
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

export default function ProfileView() {
  const { data: session, status } = useAppAuth();
  const { supabase, user } = useSupabaseAuth();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [articles, setArticles] = useState<simpleBlogCard[]>([]);
  const [tab, setTab] = useState<TabId>("elements");
  const [density, setDensity] = useState<GridDensity>(3);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [listsCount, setListsCount] = useState(0);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    void fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then((data: { name?: string; email?: string }) => {
        setUserData({
          name: data.name ?? "",
          email: data.email ?? "",
        });
      })
      .catch(() => {});
  }, [session?.user?.id]);

  useEffect(() => {
    void (async () => {
      try {
        const db = getCmsBrowserClient();
        if (!db) return;
        setArticles(filterPublicBlogs(await listBlogs(db)));
      } catch {
        setArticles([]);
      }
    })();
  }, []);

  const displayName = useMemo(() => {
    if (userData.name.trim()) return userData.name.trim();
    return session?.user?.name?.trim() || "Member";
  }, [session?.user?.name, userData.name]);

  const email = userData.email || session?.user?.email || "";
  const handleSlug = session?.user?.username?.replace(/^@/, "") || email.split("@")[0] || "you";
  const handle = `@${handleSlug}`;

  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "";
  const bio =
    typeof user?.user_metadata?.bio === "string" && user.user_metadata.bio.trim()
      ? user.user_metadata.bio.trim()
      : null;

  const gridClass = useMemo(() => {
    if (density === 2) return "grid grid-cols-2 gap-5 sm:gap-6";
    if (density === 3) return "grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6";
    return "grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4";
  }, [density]);

  const setDensityCb = useCallback((d: GridDensity) => () => setDensity(d), []);

  const onAvatarFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!supabase || !user) {
        setProfileMessage("Connect Supabase in your environment to change your photo.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setProfileMessage("Image must be 5MB or smaller.");
        return;
      }
      const contentType = resolveProfileImageContentType(file);
      if (!contentType) {
        setProfileMessage(
          "Please choose an image (JPEG, PNG, WebP, or GIF). For iPhone HEIC, run migration 007_storage_media_heic.sql in Supabase, then try again.",
        );
        return;
      }
      setAvatarUploading(true);
      setProfileMessage(null);
      const path = profileAvatarStoragePath(user.id, file.name);
      const { error, data } = await supabase.storage
        .from(SUPABASE_PUBLIC_MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType });
      if (error) {
        setAvatarUploading(false);
        setProfileMessage(formatStorageUploadError(error));
        return;
      }
      const storagePath = data?.path ?? path;
      const { data: pub } = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET).getPublicUrl(storagePath);
      const meta = { ...user.user_metadata, avatar_url: pub.publicUrl };
      const { error: updateErr } = await supabase.auth.updateUser({ data: meta });
      if (updateErr) {
        setAvatarUploading(false);
        setProfileMessage(updateErr.message);
        return;
      }
      await supabase.auth.refreshSession();
      setAvatarUploading(false);
      setProfileMessage(null);
    },
    [supabase, user],
  );

  const startBioEdit = useCallback(() => {
    const current = typeof user?.user_metadata?.bio === "string" ? user.user_metadata.bio : "";
    setBioDraft(current.slice(0, BIO_MAX_LEN));
    setEditingBio(true);
    setProfileMessage(null);
  }, [user?.user_metadata?.bio]);

  const cancelBioEdit = useCallback(() => {
    setEditingBio(false);
    setBioDraft("");
  }, []);

  const saveBio = useCallback(async () => {
    if (!supabase || !user) {
      setProfileMessage("Connect Supabase to save your bio.");
      return;
    }
    const trimmed = bioDraft.trim().slice(0, BIO_MAX_LEN);
    setSavingBio(true);
    setProfileMessage(null);
    const meta = { ...user.user_metadata, bio: trimmed || "" };
    const { error } = await supabase.auth.updateUser({ data: meta });
    setSavingBio(false);
    if (error) {
      setProfileMessage(error.message);
      return;
    }
    setEditingBio(false);
  }, [supabase, user, bioDraft]);

  if (status === "loading") {
    return (
      <main className="min-h-dvh min-w-0 overflow-x-clip bg-neutral-50 pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <div className="mx-auto flex max-w-md animate-pulse flex-col items-center gap-4 sm:mx-0 sm:max-w-none sm:flex-row sm:items-start">
            <div className="h-32 w-32 shrink-0 rounded-full bg-neutral-200 dark:bg-white/10" />
            <div className="w-full space-y-3">
              <div className="mx-auto h-8 w-48 rounded-lg bg-neutral-200 dark:bg-white/10 sm:mx-0" />
              <div className="mx-auto h-4 w-32 rounded bg-neutral-200 dark:bg-white/10 sm:mx-0" />
              <div className="mx-auto h-4 w-full max-w-sm rounded bg-neutral-200 dark:bg-white/10 sm:mx-0" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-dvh min-w-0 overflow-x-clip bg-neutral-50 pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-5 pt-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Your Culturin profile</h1>
          <p className="text-sm text-neutral-600 dark:text-white/55">
            Sign in to save guides, curate your library, and show your world on your profile.
          </p>
          <GoogleSignInButton appearance="default" />
          <Link
            href="/"
            className="text-sm font-medium text-amber-800 underline-offset-4 hover:underline dark:text-amber-400/90"
          >
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const initials = initialsFromName(displayName, email);

  return (
    <main className="min-h-dvh min-w-0 overflow-x-clip bg-neutral-50 pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <header className="flex flex-col items-center gap-6 border-b border-neutral-200 pb-10 pt-8 dark:border-white/[0.08] sm:flex-row sm:items-start sm:gap-10">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            {supabase && user ? (
              <>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
                  className="sr-only"
                  id="profile-avatar-upload"
                  onChange={onAvatarFileChange}
                  disabled={avatarUploading}
                  aria-label="Upload profile photo"
                />
                <label
                  htmlFor="profile-avatar-upload"
                  className={
                    avatarUploading
                      ? "pointer-events-none relative h-32 w-32 shrink-0 cursor-wait sm:h-36 sm:w-36"
                      : "group relative h-32 w-32 shrink-0 cursor-pointer sm:h-36 sm:w-36"
                  }
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 p-[2px] shadow-lg shadow-violet-500/25 dark:shadow-violet-900/40 sm:h-36 sm:w-36">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-black">
                      {avatarUrl ? (
                        // OAuth avatars often use hosts outside `next/image` remotePatterns.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={`${displayName} profile photo`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-white/95 sm:text-3xl">
                          {initials}
                        </span>
                      )}
                      {avatarUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        </div>
                      ) : null}
                    </div>
                    <span className="sr-only">Change profile photo</span>
                  </div>
                  <span
                    className="pointer-events-none absolute inset-0 flex items-end justify-center rounded-full bg-gradient-to-t from-neutral-900/55 to-transparent pb-2 opacity-0 transition group-hover:opacity-100 dark:from-black/60"
                    aria-hidden
                  >
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-900 backdrop-blur-sm dark:bg-white/20 dark:text-white/95 sm:text-xs">
                      Change
                    </span>
                  </span>
                </label>
              </>
            ) : (
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 p-[2px] shadow-lg shadow-violet-500/25 dark:shadow-violet-900/40 sm:h-36 sm:w-36">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-black">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={`${displayName} profile photo`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-white/95 sm:text-3xl">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
            )}
            {supabase && user ? (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-white/50 dark:hover:text-white/80"
              >
                {avatarUploading ? "Uploading…" : "Change photo"}
              </button>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 text-center sm:pt-1 sm:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">{displayName}</h1>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-white/45">{handle}</p>
            {editingBio ? (
              <div className="mt-4 w-full max-w-xl sm:mx-0">
                <textarea
                  value={bioDraft}
                  onChange={(ev) => setBioDraft(ev.target.value.slice(0, BIO_MAX_LEN))}
                  placeholder="Add a short bio…"
                  rows={4}
                  className="w-full resize-y rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-white/25 dark:focus:ring-violet-400/40"
                  disabled={savingBio}
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-neutral-400 dark:text-white/35">
                    {bioDraft.length}/{BIO_MAX_LEN}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelBioEdit}
                      disabled={savingBio}
                      className="rounded-full border border-neutral-300 bg-transparent px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:border-white/30 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveBio()}
                      disabled={savingBio}
                      className="rounded-full border border-neutral-900/15 bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
                    >
                      {savingBio ? "Saving…" : "Save bio"}
                    </button>
                  </div>
                </div>
              </div>
            ) : bio ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-white/70 sm:mx-0">{bio}</p>
            ) : (
              <p className="mt-4 max-w-xl text-sm text-neutral-400 dark:text-white/40 sm:mx-0">Add a bio…</p>
            )}
            {!editingBio && supabase && user ? (
              <p className="mt-2 max-w-xl sm:mx-0">
                <button
                  type="button"
                  onClick={startBioEdit}
                  className="text-sm font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
                >
                  {bio ? "Edit bio" : "Add bio"}
                </button>
              </p>
            ) : !editingBio && !supabase ? (
              <p className="mt-2 max-w-xl text-xs text-neutral-500 dark:text-white/35 sm:mx-0">
                Sign in with Supabase configured to edit your bio.
              </p>
            ) : null}
            {profileMessage ? (
              <p className="mt-2 max-w-xl text-sm text-amber-800 dark:text-amber-200/90 sm:mx-0" role="status">
                {profileMessage}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                href="/settings"
                className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.04] dark:text-white dark:shadow-none dark:hover:border-white/35 dark:hover:bg-white/[0.08]"
              >
                Edit profile
              </Link>
              <Link
                href="/search"
                className="inline-flex rounded-full px-5 py-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-white/55 dark:hover:text-white/85"
              >
                Search guides
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex justify-center sm:justify-start"
            role="tablist"
            aria-label="Profile content"
          >
            <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/90 p-1 dark:border-white/[0.1] dark:bg-white/[0.04]">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "elements"}
                className={
                  tab === "elements"
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm ring-1 ring-neutral-200/80 dark:shadow-sm dark:ring-0"
                    : "rounded-full px-4 py-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-800 dark:text-white/45 dark:hover:text-white/70"
                }
                onClick={() => setTab("elements")}
              >
                Elements ({articles.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "collections"}
                className={
                  tab === "collections"
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm ring-1 ring-neutral-200/80 dark:shadow-sm dark:ring-0"
                    : "rounded-full px-4 py-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-800 dark:text-white/45 dark:hover:text-white/70"
                }
                onClick={() => setTab("collections")}
              >
                Trip lists ({listsCount})
              </button>
            </div>
          </div>

          {tab === "elements" ? (
            <div
              className="flex justify-center sm:justify-end"
              role="group"
              aria-label="Grid density"
            >
              <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/90 p-1 dark:border-white/[0.1] dark:bg-white/[0.04]">
                {([2, 3, 4] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={setDensityCb(d)}
                    className={
                      density === d
                        ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm ring-1 ring-neutral-200/80 dark:bg-white/15 dark:text-white dark:shadow-none dark:ring-0"
                        : "rounded-full px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-800 dark:text-white/40 dark:hover:text-white/70"
                    }
                    aria-pressed={density === d}
                    aria-label={`${d} columns`}
                  >
                    {d === 2 ? "I" : d === 3 ? "II" : "III"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {tab === "elements" ? (
          <div className={`${gridClass} mt-8 sm:mt-10`}>
            {articles.map((card) => (
              <ArticleCardFromBlog key={card.currentSlug} card={card} layout="profile" />
            ))}
          </div>
        ) : (
          <ProfileSpotLists onCountChange={setListsCount} />
        )}

        {tab === "elements" && articles.length === 0 ? (
          <p className="mt-8 text-center text-sm text-neutral-600 dark:text-white/45">
            No stories loaded yet. Open{" "}
            <Link href="/travel-guides" className="font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90">
              Travel Guides
            </Link>{" "}
            to explore.
          </p>
        ) : null}
      </div>
    </main>
  );
}
