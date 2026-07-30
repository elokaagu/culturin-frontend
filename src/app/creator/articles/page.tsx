import type { Metadata } from "next";
import Link from "next/link";

import { fetchMyCreatorSubmissions } from "@/app/creator/creatorSubmissions.server";
import { studioCreateButtonClass, studioListRowClass } from "@/app/studio/_components/StudioCulturinListKit";

export const metadata: Metadata = {
  title: "Articles",
  description: "Submit article drafts for review.",
};

function payloadTitle(payload: Record<string, unknown> | null) {
  const t = payload && typeof payload.title === "string" ? payload.title.trim() : "";
  return t || "Untitled draft";
}

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default async function CreatorArticlesPage() {
  const rows = await fetchMyCreatorSubmissions("blog");

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--c-accent)" }}>Creator</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>Articles</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
        Drafts you submit here are queued for review — they do not publish to Articles automatically.
      </p>

      <div className="mt-6">
        <Link href="/creator/articles/new" className={studioCreateButtonClass}>
          New article draft
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
          Your submissions
        </h2>
        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-sm" style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}>
            No article submissions yet.
          </p>
        ) : (
          <ul className="mt-4 list-none space-y-3 p-0">
            {rows.map((row) => (
              <li key={row.id} className={studioListRowClass}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 text-sm font-semibold" style={{ color: "var(--c-ink)" }}>{payloadTitle(row.payload)}</p>
                  <p className="m-0 text-xs" style={{ color: "var(--c-muted)" }}>
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
