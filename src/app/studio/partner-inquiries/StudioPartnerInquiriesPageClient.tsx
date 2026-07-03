"use client";

import { useMemo, useState } from "react";

import type { StudioPartnerInquiry } from "@/lib/studio/partnerInquiries";

const INTEREST_LABELS: Record<string, string> = {
  sponsorship: "Event sponsorship",
  activation: "Brand activation",
  attend: "Attending an event",
  other: "Something else",
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function StudioPartnerInquiriesPageClient({
  inquiries,
  hasDb,
}: {
  inquiries: StudioPartnerInquiry[];
  hasDb: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      [i.name, i.email, i.company, i.interest, i.message].some((f) => f.toLowerCase().includes(q)),
    );
  }, [inquiries, search]);

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All inquiries
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300/90">
          {search.trim()
            ? `${filtered.length} of ${inquiries.length} shown`
            : `${inquiries.length} inquir${inquiries.length === 1 ? "y" : "ies"}`}
        </span>
      </div>

      {hasDb && inquiries.length > 0 ? (
        <label className="mt-5 flex flex-col gap-2 sm:max-w-sm">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, message…"
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
          />
        </label>
      ) : null}

      <div className="mt-6 space-y-3">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so inquiries can&apos;t be listed yet.
          </p>
        ) : inquiries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No inquiries yet. New submissions from /partner will show up here.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No inquiries match your search. Try a different term or clear the search box.
          </p>
        ) : (
          filtered.map((inq) => (
            <div
              key={inq.id}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-white/12 dark:bg-white/[0.04]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">
                    {inq.name || "—"}
                    {inq.company ? <span className="font-normal text-neutral-500 dark:text-white/58"> · {inq.company}</span> : null}
                  </p>
                  <a
                    href={`mailto:${inq.email}`}
                    className="text-xs text-neutral-600 no-underline hover:underline dark:text-white/70"
                  >
                    {inq.email}
                  </a>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full border border-amber-700/25 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-amber-800 dark:border-amber-400/30 dark:text-amber-300/90">
                    {INTEREST_LABELS[inq.interest] ?? inq.interest}
                  </span>
                  <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-white/58">
                    {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
              {inq.message ? (
                <p className="m-0 mt-2.5 text-sm text-neutral-700 dark:text-white/80">{inq.message}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
