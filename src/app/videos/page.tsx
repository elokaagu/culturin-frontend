import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { appPageContainerClass } from "@/lib/appLayout";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import TopVideosRail from "../components/TopVideosRail";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listVideos } from "../../lib/cms/queries";
import { filterPublicVideos } from "../../lib/cms/blockedFromSite";
import { getShowcaseVideoCards } from "../../lib/cms/showcaseContent";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Top videos | Culturin",
  description:
    "Watch travel highlights, culture stories, and creator-led journeys from the Culturin video library.",
};

const container = appPageContainerClass;

export default async function VideosPage() {
  const db = getCmsDbOrNull();
  const fromCms = db ? await listVideos(db) : [];
  const videos = filterPublicVideos(fromCms.length > 0 ? fromCms : getShowcaseVideoCards());

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh w-full pb-20 antialiased" style={{ paddingTop: "8rem" }} id="main-content">
        <div className={`${container} pt-6 sm:pt-10`}>
          <header className="mb-2 max-w-3xl">
            <h1
              className="text-3xl font-medium tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
            >
              Top videos
            </h1>
            <p className="mt-2 text-lg sm:text-xl" style={{ color: "var(--c-muted)" }}>Only on Culturin</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-[0.95rem]" style={{ color: "var(--c-muted)" }}>
              A single horizontal row of everything in the library—swipe or scroll, then play in full view.{" "}
              {videos.length > 0 ? (
                <span className="whitespace-nowrap" style={{ color: "var(--c-muted)" }}>
                  {videos.length} {videos.length === 1 ? "title" : "titles"} right now.
                </span>
              ) : null}
            </p>
          </header>
        </div>

        {videos.length > 0 ? (
          <div className="mt-4 sm:mt-6">
            <TopVideosRail videos={videos} fullBleed showDescription />
          </div>
        ) : (
          <div className={container}>
            <p
              className="mt-4 rounded-2xl border px-5 py-12 text-center text-sm leading-relaxed"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}
              role="status"
            >
              No videos are in the library yet. Please check back soon.
            </p>
          </div>
        )}

        <div className={`${container} mt-12 sm:mt-16`}>
          <div className="flex flex-col items-stretch justify-between gap-5 rounded-2xl border p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8" style={{ borderColor: "var(--c-rule)" }}>
            <p className="min-w-0 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              For playlists, full playback controls, and keyboard shortcuts, open the full stream experience.
            </p>
            <Link
              href="/stream"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Open stream
            </Link>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
