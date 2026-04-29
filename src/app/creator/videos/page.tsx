import type { Metadata } from "next";
import Link from "next/link";

import { fetchMyCreatorSubmissions } from "@/app/creator/creatorSubmissions.server";
import { studioCreateButtonClass, studioListRowClass } from "@/app/studio/_components/StudioCulturinListKit";

export const metadata: Metadata = {
  title: "Videos",
  description: "Submit video drafts for review.",
};

function payloadTitle(payload: Record<string, unknown> | null) {
  const t = payload && typeof payload.title === "string" ? payload.title.trim() : "";
  return t || "Untitled draft";
}

export default async function CreatorVideosPage() {
  const rows = await fetchMyCreatorSubmissions("video");

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Creator</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Videos</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Drafts are reviewed before they can appear in the video library or featured rails.
      </p>

      <div className="mt-6">
        <Link href="/creator/videos/new" className={studioCreateButtonClass}>
          New video draft
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/55">
          Your submissions
        </h2>
        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No video submissions yet.
          </p>
        ) : (
          <ul className="mt-4 list-none space-y-3 p-0">
            {rows.map((row) => (
              <li key={row.id} className={studioListRowClass}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">{payloadTitle(row.payload)}</p>
                  <p className="m-0 text-xs text-neutral-500 dark:text-white/45">
                    {row.status} · {new Date(row.created_at).toLocaleString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
