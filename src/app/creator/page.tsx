import type { Metadata } from "next";
import Link from "next/link";

import { fetchMyCreatorSubmissions } from "@/app/creator/creatorSubmissions.server";

export const metadata: Metadata = {
  title: "Overview",
  description: "Your Culturin creator workspace.",
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

function payloadTitle(payload: Record<string, unknown> | null, fallback: string) {
  const t = payload && typeof payload.title === "string" ? payload.title.trim() : "";
  return t || fallback;
}

export default async function CreatorOverviewPage() {
  const rows = await fetchMyCreatorSubmissions();
  const recent = rows.slice(0, 12);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-accent)" }}>Creator</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
        Your creator workspace
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
        Submit drafts from the sidebar — they are stored for review and do not appear on the public site until the Culturin
        team publishes them from Studio.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/creator/articles/new"
          className="group block rounded-2xl border p-5 no-underline transition hover:opacity-90"
          style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)" }}
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-muted)" }}>
            Articles
          </p>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "var(--c-ink)" }}>New article draft</p>
          <p className="m-0 mt-2 text-xs" style={{ color: "var(--c-muted)" }}>Rich text, hero image, summary</p>
        </Link>
        <Link
          href="/creator/videos/new"
          className="group block rounded-2xl border p-5 no-underline transition hover:opacity-90"
          style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)" }}
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-muted)" }}>
            Videos
          </p>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "var(--c-ink)" }}>New video draft</p>
          <p className="m-0 mt-2 text-xs" style={{ color: "var(--c-muted)" }}>Player ID, thumbnail, description</p>
        </Link>
        <Link
          href="/creator/providers"
          className="group block rounded-2xl border p-5 no-underline transition hover:opacity-90"
          style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)" }}
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-muted)" }}>
            Experiences
          </p>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "var(--c-ink)" }}>New experience draft</p>
          <p className="m-0 mt-2 text-xs" style={{ color: "var(--c-muted)" }}>Partner / host listings</p>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
          Recent submissions
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-sm" style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}>
            No submissions yet. Start with an article, video, or experience from the cards above or the sidebar.
          </p>
        ) : (
          <ul className="mt-4 space-y-2 p-0">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)" }}
              >
                <span className="font-medium" style={{ color: "var(--c-ink)" }}>
                  {payloadTitle(row.payload, row.content_type)}
                </span>
                <span className="text-xs" style={{ color: "var(--c-muted)" }}>
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
