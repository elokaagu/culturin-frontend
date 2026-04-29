import type { Metadata } from "next";
import Link from "next/link";

import { fetchMyCreatorSubmissions } from "@/app/creator/creatorSubmissions.server";

export const metadata: Metadata = {
  title: "Overview",
  description: "Your Culturin creator workspace.",
};

function payloadTitle(payload: Record<string, unknown> | null, fallback: string) {
  const t = payload && typeof payload.title === "string" ? payload.title.trim() : "";
  return t || fallback;
}

export default async function CreatorOverviewPage() {
  const rows = await fetchMyCreatorSubmissions();
  const recent = rows.slice(0, 12);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Creator</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
        Your creator workspace
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/65">
        Submit drafts from the sidebar — they are stored for review and do not appear on the public site until the Culturin
        team publishes them from Studio.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/creator/articles/new"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Articles
          </p>
          <p className="m-0 mt-2 text-sm font-medium text-neutral-900 dark:text-white">New article draft</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Rich text, hero image, summary</p>
        </Link>
        <Link
          href="/creator/videos/new"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Videos
          </p>
          <p className="m-0 mt-2 text-sm font-medium text-neutral-900 dark:text-white">New video draft</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Player ID, thumbnail, description</p>
        </Link>
        <Link
          href="/creator/providers"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Experiences
          </p>
          <p className="m-0 mt-2 text-sm font-medium text-neutral-900 dark:text-white">New experience draft</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Partner / host listings</p>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/55">
          Recent submissions
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No submissions yet. Start with an article, video, or experience from the cards above or the sidebar.
          </p>
        ) : (
          <ul className="mt-4 space-y-2 p-0">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-neutral-950/80"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {payloadTitle(row.payload, row.content_type)}
                </span>
                <span className="text-xs text-neutral-500 dark:text-white/45">
                  {row.content_type} · {row.status} ·{" "}
                  {new Date(row.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
