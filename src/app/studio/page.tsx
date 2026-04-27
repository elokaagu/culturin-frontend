import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { getStudioCounts } from "@/lib/studio/getStudioCounts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overview",
  description: "Studio home — create content and jump to public pages from one place.",
};

export default async function StudioOverviewPage() {
  const counts = await getStudioCounts();

  return (
    <div className="p-4 sm:p-6 md:max-w-4xl md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Overview</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Culturin Studio</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/65">
        Create and publish from this workspace. Counts sync with your Supabase CMS tables; use the sidebar to jump between
        editors and the live site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/studio/articles"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Articles
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">{counts.blogs}</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Guides & editorial</p>
        </Link>
        <Link
          href="/studio/videos"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Videos
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">{counts.videos}</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Mux-backed library</p>
        </Link>
        <Link
          href="/studio/providers"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Providers
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {counts.providers}
          </p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Experiences & bookings</p>
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-200 bg-white/80 p-5 dark:border-white/10 dark:bg-neutral-950/60 sm:p-6">
        <h2 className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">Quick actions</h2>
        <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm text-neutral-600 dark:text-white/65">
          <li>
            <Link
              className="font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
              href="/studio/articles"
            >
              Create an article
            </Link>{" "}
            — guides and stories for Articles and home rails.
          </li>
          <li>
            <Link className="font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95" href="/studio/videos">
              Add a video
            </Link>{" "}
            — playback ID and metadata for /videos and streams.
          </li>
          <li>
            <Link
              className="font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
              href="/studio/providers"
            >
              Add a provider
            </Link>{" "}
            — curated experiences across the app.
          </li>
          <li>
            <Link className="font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95" href="/create/upload">
              Upload images
            </Link>{" "}
            — public URLs for CMS fields and cards.
          </li>
        </ul>
      </div>
    </div>
  );
}
