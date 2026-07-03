"use client";

import { useMemo, useState } from "react";

import type { StudioEventRsvp } from "@/lib/studio/eventRsvps";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function toCsv(rows: StudioEventRsvp[]): string {
  const header = ["First name", "Last name", "Email", "Company", "Title", "LinkedIn", "RSVP date"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.firstName, r.lastName, r.email, r.company, r.title, r.linkedinUrl, formatDate(r.createdAt)]
      .map((v) => escape(v ?? ""))
      .join(","),
  );
  return [header.map(escape).join(","), ...lines].join("\n");
}

function downloadCsv(filename: string, rows: StudioEventRsvp[]) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StudioEventRsvpsPageClient({
  rsvps,
  eventLabels,
  hasDb,
}: {
  rsvps: StudioEventRsvp[];
  eventLabels: Record<string, string>;
  hasDb: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter((r) =>
      [r.firstName, r.lastName, r.email, r.company, r.title, eventLabels[r.eventSlug] ?? r.eventSlug].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [rsvps, search, eventLabels]);

  const groups = useMemo(() => {
    const byEvent = new Map<string, StudioEventRsvp[]>();
    for (const r of filtered) {
      const list = byEvent.get(r.eventSlug);
      if (list) list.push(r);
      else byEvent.set(r.eventSlug, [r]);
    }
    return Array.from(byEvent.entries());
  }, [filtered]);

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All RSVPs
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300/90">
            {search.trim() ? `${filtered.length} of ${rsvps.length} shown` : `${rsvps.length} RSVP${rsvps.length === 1 ? "" : "s"}`}
          </span>
          {rsvps.length > 0 ? (
            <button
              type="button"
              onClick={() => downloadCsv("culturin-event-rsvps.csv", filtered)}
              className="inline-flex h-8 items-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
            >
              Export CSV
            </button>
          ) : null}
        </div>
      </div>

      {hasDb && rsvps.length > 0 ? (
        <label className="mt-5 flex flex-col gap-2 sm:max-w-sm">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, event…"
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
          />
        </label>
      ) : null}

      <div className="mt-8 space-y-8">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so RSVPs can&apos;t be listed yet.
          </p>
        ) : rsvps.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No RSVPs yet. New submissions from event pages will show up here.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No RSVPs match your search. Try a different term or clear the search box.
          </p>
        ) : (
          groups.map(([slug, rows]) => (
            <div key={slug}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="m-0 font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {eventLabels[slug] ?? slug}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300/90">
                    {rows.length} RSVP{rows.length === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadCsv(`culturin-${slug}-rsvps.csv`, rows)}
                    className="inline-flex h-7 items-center rounded-full border border-neutral-300 px-2.5 text-[0.7rem] font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:bg-white/[0.06] dark:text-white/85 dark:hover:bg-white/10"
                  >
                    Export this event
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-white/12 dark:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">
                          {r.firstName} {r.lastName}
                          {r.company ? (
                            <span className="font-normal text-neutral-500 dark:text-white/58">
                              {" "}
                              · {r.title ? `${r.title}, ` : ""}
                              {r.company}
                            </span>
                          ) : r.title ? (
                            <span className="font-normal text-neutral-500 dark:text-white/58"> · {r.title}</span>
                          ) : null}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                          <a
                            href={`mailto:${r.email}`}
                            className="text-neutral-600 no-underline hover:underline dark:text-white/70"
                          >
                            {r.email}
                          </a>
                          {r.linkedinUrl ? (
                            <a
                              href={r.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-800 no-underline hover:underline dark:text-amber-300/90"
                            >
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-white/58">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
