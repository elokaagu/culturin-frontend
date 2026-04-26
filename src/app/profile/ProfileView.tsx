"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "next-view-transitions";

import { ArticleCardFromBlog } from "@/components/cms/ArticleCard";
import type { simpleBlogCard } from "@/lib/interface";
import { getCmsBrowserClient } from "@/lib/cms/browser";
import { listBlogs } from "@/lib/cms/queries";

import { GoogleSignInButton } from "../components/AuthButtons";
import { useAppAuth, useSupabaseAuth } from "../components/SupabaseAuthProvider";

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
  const { user } = useSupabaseAuth();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [articles, setArticles] = useState<simpleBlogCard[]>([]);
  const [tab, setTab] = useState<TabId>("elements");
  const [density, setDensity] = useState<GridDensity>(3);

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
      const db = getCmsBrowserClient();
      if (!db) return;
      setArticles(await listBlogs(db));
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

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black pb-20 pt-[var(--header-offset)] text-white">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <div className="mx-auto flex max-w-md animate-pulse flex-col items-center gap-4 sm:mx-0 sm:max-w-none sm:flex-row sm:items-start">
            <div className="h-32 w-32 shrink-0 rounded-full bg-white/10" />
            <div className="w-full space-y-3">
              <div className="mx-auto h-8 w-48 rounded-lg bg-white/10 sm:mx-0" />
              <div className="mx-auto h-4 w-32 rounded bg-white/10 sm:mx-0" />
              <div className="mx-auto h-4 w-full max-w-sm rounded bg-white/10 sm:mx-0" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black pb-20 pt-[var(--header-offset)] text-white">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-5 pt-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Your Culturin profile</h1>
          <p className="text-sm text-white/55">
            Sign in to save guides, curate your library, and show your world on your profile.
          </p>
          <GoogleSignInButton appearance="default" />
          <Link
            href="/"
            className="text-sm font-medium text-amber-400/90 underline-offset-4 hover:underline"
          >
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const initials = initialsFromName(displayName, email);

  return (
    <main className="min-h-screen bg-black pb-24 pt-[var(--header-offset)] text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <header className="flex flex-col items-center gap-6 border-b border-white/[0.08] pb-10 pt-8 sm:flex-row sm:items-start sm:gap-10">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 p-[2px] shadow-lg shadow-violet-900/40 sm:h-36 sm:w-36">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black">
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
                <span className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
                  {initials}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:pt-1 sm:text-left">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{displayName}</h1>
            <p className="mt-1.5 text-sm text-white/45">{handle}</p>
            {bio ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:mx-0">{bio}</p>
            ) : (
              <p className="mt-4 max-w-xl text-sm text-white/40 sm:mx-0">Add a bio…</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                href="/settings"
                className="inline-flex rounded-full border border-white/20 bg-white/[0.04] px-5 py-2 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/[0.08]"
              >
                Edit profile
              </Link>
              <Link
                href="/search"
                className="inline-flex rounded-full px-5 py-2 text-sm font-medium text-white/55 transition hover:text-white/85"
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
            <div className="inline-flex rounded-full border border-white/[0.1] bg-white/[0.04] p-1">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "elements"}
                className={
                  tab === "elements"
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm"
                    : "rounded-full px-4 py-2 text-sm font-medium text-white/45 transition hover:text-white/70"
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
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm"
                    : "rounded-full px-4 py-2 text-sm font-medium text-white/45 transition hover:text-white/70"
                }
                onClick={() => setTab("collections")}
              >
                Collections (0)
              </button>
            </div>
          </div>

          <div
            className="flex justify-center sm:justify-end"
            role="group"
            aria-label="Grid density"
          >
            <div className="inline-flex rounded-full border border-white/[0.1] bg-white/[0.04] p-1">
              {([2, 3, 4] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={setDensityCb(d)}
                  className={
                    density === d
                      ? "rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-full px-3 py-1.5 text-xs font-medium text-white/40 transition hover:text-white/70"
                  }
                  aria-pressed={density === d}
                  aria-label={`${d} columns`}
                >
                  {d === 2 ? "I" : d === 3 ? "II" : "III"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tab === "elements" ? (
          <div className={`${gridClass} mt-8 sm:mt-10`}>
            {articles.map((card) => (
              <ArticleCardFromBlog key={card.currentSlug} card={card} layout="profile" />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-sm font-medium text-white/55">Collections</p>
            <p className="mt-2 max-w-sm text-sm text-white/40">
              Group saved guides into moodboards and trips — this space is coming soon.
            </p>
          </div>
        )}

        {tab === "elements" && articles.length === 0 ? (
          <p className="mt-8 text-center text-sm text-white/45">
            No stories loaded yet. Open{" "}
            <Link href="/articles" className="font-medium text-amber-400/90 underline-offset-2 hover:underline">
              Travel Guides
            </Link>{" "}
            to explore.
          </p>
        ) : null}
      </div>
    </main>
  );
}
