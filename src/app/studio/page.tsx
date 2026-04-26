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
    <div className="p-4 sm:p-6 md:max-w-3xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Overview</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Culturin Studio</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Use the sidebar to create articles, videos, and provider listings, upload images, and open public pages. Everything is
        connected to the same site experience.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/studio/articles"
          className="block rounded-xl border border-neutral-200 p-4 no-underline transition hover:border-amber-400/40 dark:border-white/10 dark:hover:border-amber-400/30"
        >
          <p className="m-0 text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Articles</p>
          <p className="m-0 mt-1 text-2xl font-semibold text-neutral-900 tabular-nums dark:text-white">{counts.blogs}</p>
        </Link>
        <Link
          href="/studio/videos"
          className="block rounded-xl border border-neutral-200 p-4 no-underline transition hover:border-amber-400/40 dark:border-white/10 dark:hover:border-amber-400/30"
        >
          <p className="m-0 text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Videos</p>
          <p className="m-0 mt-1 text-2xl font-semibold text-neutral-900 tabular-nums dark:text-white">{counts.videos}</p>
        </Link>
        <Link
          href="/studio/providers"
          className="block rounded-xl border border-neutral-200 p-4 no-underline transition hover:border-amber-400/40 dark:border-white/10 dark:hover:border-amber-400/30"
        >
          <p className="m-0 text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Providers</p>
          <p className="m-0 mt-1 text-2xl font-semibold text-neutral-900 tabular-nums dark:text-white">{counts.providers}</p>
        </Link>
      </div>

      <ul className="m-0 mt-8 list-none space-y-2.5 p-0 text-sm text-neutral-600 dark:text-white/65">
        <li>
          <Link
            className="font-medium text-amber-700 no-underline hover:underline dark:text-amber-300/95"
            href="/studio/articles"
          >
            Create an article
          </Link>{" "}
          — add guides and editorial pieces that show on the Articles and home rails.
        </li>
        <li>
          <Link className="font-medium text-amber-700 no-underline hover:underline dark:text-amber-300/95" href="/studio/videos">
            Add a video
          </Link>{" "}
          — Mux playback ID and metadata for the video library and streams.
        </li>
        <li>
          <Link
            className="font-medium text-amber-700 no-underline hover:underline dark:text-amber-300/95"
            href="/studio/providers"
          >
            Add a provider
          </Link>{" "}
          — experiences, bookings, and curated pages across the app.
        </li>
        <li>
          <Link className="font-medium text-amber-700 no-underline hover:underline dark:text-amber-300/95" href="/create/upload">
            Upload images
          </Link>{" "}
          — get public URLs to paste into CMS fields and cards site-wide.
        </li>
      </ul>
    </div>
  );
}
