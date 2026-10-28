import type { Metadata } from "next";

import { listRequests } from "@/lib/briefings/store";

import { BriefingsClient, type BriefingRow } from "./BriefingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guides & Briefings",
  description: "Research a place's culture with AI, check it with Culturin's curators, and deliver it as a guide or a briefing.",
};

export default async function StudioBriefingsPage() {
  let rows: BriefingRow[] = [];
  let connected = true;
  try {
    rows = (await listRequests()).map((r) => ({
      id: r.id,
      kind: r.kind,
      place: r.place,
      country: r.country,
      audience: r.audience,
      status: r.status,
      error: r.error,
      costUsd: r.cost.total ?? 0,
      createdAt: r.createdAt,
      confidence: r.latest?.confidence ?? null,
      reviewedAt: r.latest?.reviewedAt ?? null,
      publishedAt: r.latest?.publishedAt ?? null,
    }));
  } catch {
    connected = false;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Intelligence</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Guides &amp; Briefings</h1>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--c-muted)]">
        Research the culture of a place, have a curator check and sign it, then publish it as a free guide or send it as a professional
        briefing. Nothing goes out until it&apos;s approved.
      </p>
      {connected ? (
        <BriefingsClient rows={rows} />
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-[color:var(--c-rule)] px-4 py-4 text-sm text-[color:var(--c-muted)]">
          The database isn&apos;t connected in this environment.
        </p>
      )}
    </div>
  );
}
