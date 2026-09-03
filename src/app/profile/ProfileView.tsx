"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

import { ArticleCardFromBlog } from "@/components/cms/ArticleCard";
import type { simpleBlogCard } from "@/lib/interface";
import { getCmsBrowserClient } from "@/lib/cms/browser";
import { listBlogs } from "@/lib/cms/queries";
import {
  formatStorageUploadError,
  profileAvatarStoragePath,
  resolveProfileImageContentType,
} from "@/lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";

import { GoogleSignInButton } from "../components/AuthButtons";
import { useAppAuth, useSupabaseAuth } from "../components/SupabaseAuthProvider";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import LanguageToolsPanel from "./LanguageToolsPanel";
import ProfileSpotLists from "./ProfileSpotLists";
import SpotifyPlaylistsPanel from "./SpotifyPlaylistsPanel";

const BIO_MAX_LEN = 500;
const pageWrapStyle = { background: EDITORIAL_BG, color: EDITORIAL_INK };
const tabActiveStyle = { background: "var(--c-bg)", color: "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-rule)" };
const tabInactiveStyle = { color: "var(--c-muted)" };

type TabId = "elements" | "collections" | "language" | "playlists";

type GridDensity = 2 | 3 | 4;

function initialsFromName(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts.length === 1 && parts[0]!.length >= 2) return parts[0]!.slice(0, 2).toUpperCase();
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

export default function ProfileView() {
  const pathname = usePathname();
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
  const [spotifyCount, setSpotifyCount] = useState(0);
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
        setArticles(await listBlogs(db));
      } catch {
        setArticles([]);
      }
    })();
  }, []);

  useEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#spot-lists") setTab("collections");
      if (window.location.hash === "#playlists") setTab("playlists");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [pathname]);

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
      if (!user) {
        setProfileMessage("Sign in to change your photo.");
        return;
      }
      if (!supabase) {
        setProfileMessage("Photo uploads aren’t available right now. Try again later.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setProfileMessage("Image must be 5MB or smaller.");
        return;
      }
      const contentType = resolveProfileImageContentType(file);
      if (!contentType) {
        setProfileMessage(
          "Please choose a JPEG, PNG, WebP, or GIF. HEIC from iPhone is supported when your workspace allows it—try converting to JPEG if upload fails.",
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
      setProfileMessage("Saving your bio isn’t available right now. Try again later.");
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
      <div className={editorialScopeClass} style={pageWrapStyle}>
        <IslandNav />
        <main className="min-h-dvh min-w-0 overflow-x-clip pb-[max(5rem,env(safe-area-inset-bottom,0px))]" style={{ paddingTop: "8rem" }}>
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
        <HomeFooter />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={editorialScopeClass} style={pageWrapStyle}>
        <IslandNav />
        <main className="min-h-dvh min-w-0 overflow-x-clip pb-[max(5rem,env(safe-area-inset-bottom,0px))]" style={{ paddingTop: "8rem" }}>
          <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-5 pt-16 text-center">
            <h1 className="text-2xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}>Your Culturin profile</h1>
            <p className="text-sm" style={{ color: "var(--c-muted)" }}>
              Sign in to save guides, curate your library, and show your world on your profile.
            </p>
            <GoogleSignInButton appearance="default" />
            <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline" style={{ color: "var(--c-accent)" }}>
              Back home
            </Link>
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  const initials = initialsFromName(displayName, email);

  return (
    <div className={editorialScopeClass} style={pageWrapStyle}>
    <IslandNav />
    <main className="min-h-dvh min-w-0 overflow-x-clip pb-[max(6rem,env(safe-area-inset-bottom,0px))]" style={{ paddingTop: "8rem" }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <header className="flex flex-col items-center gap-6 border-b pb-10 pt-8 sm:flex-row sm:items-start sm:gap-10" style={{ borderColor: "var(--c-rule)" }}>
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
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-[#121212]">
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
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-[#121212]">
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
                className="text-xs font-medium underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                style={{ color: "var(--c-muted)" }}
              >
                {avatarUploading ? "Uploading…" : "Change photo"}
              </button>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 text-center sm:pt-1 sm:text-left">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}>{displayName}</h1>
            <p className="mt-1.5 text-sm" style={{ color: "var(--c-muted)" }}>{handle}</p>
            {editingBio ? (
              <div className="mt-4 w-full max-w-xl sm:mx-0">
                <textarea
                  value={bioDraft}
                  onChange={(ev) => setBioDraft(ev.target.value.slice(0, BIO_MAX_LEN))}
                  placeholder="Add a short bio…"
                  rows={4}
                  className="w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:ring-2"
                  style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)", color: "var(--c-ink)" }}
                  disabled={savingBio}
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                    {bioDraft.length}/{BIO_MAX_LEN}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelBioEdit}
                      disabled={savingBio}
                      className="rounded-full border bg-transparent px-4 py-1.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-50"
                      style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveBio()}
                      disabled={savingBio}
                      className="rounded-full px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ background: "var(--c-accent)" }}
                    >
                      {savingBio ? "Saving…" : "Save bio"}
                    </button>
                  </div>
                </div>
              </div>
            ) : bio ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed sm:mx-0" style={{ color: "var(--c-muted)" }}>{bio}</p>
            ) : (
              <p className="mt-4 max-w-xl text-sm sm:mx-0" style={{ color: "var(--c-muted)" }}>Add a bio…</p>
            )}
            {!editingBio && supabase && user ? (
              <p className="mt-2 max-w-xl sm:mx-0">
                <button
                  type="button"
                  onClick={startBioEdit}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                  style={{ color: "var(--c-accent)" }}
                >
                  {bio ? "Edit bio" : "Add bio"}
                </button>
              </p>
            ) : !editingBio && !supabase ? (
              <p className="mt-2 max-w-xl text-xs sm:mx-0" style={{ color: "var(--c-muted)" }}>
                Profile editing isn’t available in this preview. Try again later.
              </p>
            ) : null}
            {profileMessage ? (
              <p className="mt-2 max-w-xl text-sm sm:mx-0" style={{ color: "var(--c-accent)" }} role="status">
                {profileMessage}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                href="/settings"
                className="inline-flex rounded-full border px-5 py-2 text-sm font-medium transition hover:opacity-80"
                style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
              >
                Edit profile
              </Link>
              <Link
                href="/search"
                className="inline-flex rounded-full px-5 py-2 text-sm font-medium transition hover:opacity-80"
                style={{ color: "var(--c-muted)" }}
              >
                Search guides
              </Link>
            </div>
          </div>
        </header>

        <div
          id="spot-lists"
          className="mt-8 flex scroll-mt-28 flex-col gap-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div
            className="flex justify-center sm:justify-start"
            role="tablist"
            aria-label="Profile content"
          >
            <div className="inline-flex rounded-full border p-1" style={{ borderColor: "var(--c-rule)" }}>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "elements"}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={tab === "elements" ? tabActiveStyle : tabInactiveStyle}
                onClick={() => setTab("elements")}
              >
                Elements ({articles.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "collections"}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={tab === "collections" ? tabActiveStyle : tabInactiveStyle}
                onClick={() => setTab("collections")}
              >
                Lists ({listsCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "language"}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={tab === "language" ? tabActiveStyle : tabInactiveStyle}
                onClick={() => setTab("language")}
              >
                Language tools
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "playlists"}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={tab === "playlists" ? tabActiveStyle : tabInactiveStyle}
                onClick={() => setTab("playlists")}
              >
                Playlists ({spotifyCount})
              </button>
            </div>
          </div>

          {tab === "elements" ? (
            <div
              className="flex justify-center sm:justify-end"
              role="group"
              aria-label="Grid density"
            >
              <div className="inline-flex rounded-full border p-1" style={{ borderColor: "var(--c-rule)" }}>
                {([2, 3, 4] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={setDensityCb(d)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold transition"
                    style={density === d ? tabActiveStyle : tabInactiveStyle}
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
        ) : tab === "collections" ? (
          <ProfileSpotLists onCountChange={setListsCount} />
        ) : tab === "language" ? (
          <LanguageToolsPanel />
        ) : (
          <SpotifyPlaylistsPanel onCountChange={setSpotifyCount} />
        )}

        {tab === "elements" && articles.length === 0 ? (
          <p className="mt-8 text-center text-sm" style={{ color: "var(--c-muted)" }}>
            No stories loaded yet. Open{" "}
            <Link href="/articles" className="font-medium underline-offset-2 hover:underline" style={{ color: "var(--c-accent)" }}>
              Articles
            </Link>{" "}
            to read the house.
          </p>
        ) : null}
      </div>
    </main>
    <HomeFooter />
    </div>
  );
}
