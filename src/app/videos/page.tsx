import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { appPageContainerClass } from "@/lib/appLayout";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
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
    <>
      <Header />
      <main
        className="min-h-dvh w-full bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
        id="main-content"
      >
        <div className={`${container} pt-6 sm:pt-10`}>
          <header className="mb-2 max-w-3xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Top videos
            </h1>
            <p className="mt-2 text-lg text-neutral-600 sm:text-xl dark:text-white/60">Only on Culturin</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-[0.95rem] dark:text-white/55">
              A single horizontal row of everything in the library—swipe or scroll, then play in full view.{" "}
              {videos.length > 0 ? (
                <span className="whitespace-nowrap text-neutral-500 dark:text-white/40">
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
              className="mt-4 rounded-2xl border border-neutral-200 bg-white/90 px-5 py-12 text-center text-sm leading-relaxed text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65"
              role="status"
            >
              No videos are in the library yet. Please check back soon.
            </p>
          </div>
        )}

        <div className={`${container} mt-12 sm:mt-16`}>
          <div className="flex flex-col items-stretch justify-between gap-5 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="min-w-0 text-sm leading-relaxed text-neutral-600 dark:text-white/60">
              For playlists, full playback controls, and keyboard shortcuts, open the full stream experience.
            </p>
            <Link
              href="/stream"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]"
            >
              Open stream
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
