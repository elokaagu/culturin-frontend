"use client";

import { Mail, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { StudioPartnerInquiry } from "@/lib/studio/partnerInquiries";

const INTEREST_LABELS: Record<string, string> = {
  "cultural-marketing": "Cultural marketing",
  "new-territory": "Launching in a new territory",
  "cultural-intelligence": "Cultural intelligence",
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

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function interestLabel(interest: string): string {
  return INTEREST_LABELS[interest] ?? interest;
}

export function StudioPartnerInquiriesPageClient({
  inquiries,
  hasDb,
}: {
  inquiries: StudioPartnerInquiry[];
  hasDb: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StudioPartnerInquiry | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      [i.name, i.email, i.company, i.interest, i.message].some((f) => f.toLowerCase().includes(q)),
    );
  }, [inquiries, search]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="mt-10 rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-5 shadow-sm sm:p-6 dark:bg-[#1c1a17]/90 dark:shadow-[inset_0_1px_0_0_rgba(241,233,220,0.05)]">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All inquiries
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
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
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
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
            <button
              key={inq.id}
              type="button"
              onClick={() => setSelected(inq)}
              className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-left transition hover:border-culturin-400/45 hover:bg-[color:color-mix(in_srgb,var(--c-accent)_6%,white)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-culturin-400/60 dark:border-white/12 dark:bg-white/[0.04] dark:hover:border-culturin-400/35 dark:hover:bg-white/[0.07]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">
                    {inq.name || "—"}
                    {inq.company ? (
                      <span className="font-normal text-neutral-500 dark:text-white/58"> · {inq.company}</span>
                    ) : null}
                  </p>
                  <p className="m-0 mt-0.5 text-xs text-neutral-600 dark:text-white/70">{inq.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full border border-culturin-700/25 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-culturin-800 dark:border-culturin-400/30 dark:text-culturin-300/90">
                    {interestLabel(inq.interest)}
                  </span>
                  <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-white/58">
                    {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
              {inq.message ? (
                <p className="m-0 mt-2.5 line-clamp-2 text-sm text-neutral-700 dark:text-white/80">{inq.message}</p>
              ) : (
                <p className="m-0 mt-2.5 text-sm text-neutral-500 dark:text-white/50">No message — click to view details</p>
              )}
            </button>
          ))
        )}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-detail-title"
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-white/12 dark:bg-[#181818] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  id="inquiry-detail-title"
                  className="m-0 font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-white"
                >
                  {selected.name || "Partner inquiry"}
                </p>
                <p className="m-0 mt-1 text-sm text-neutral-500 dark:text-white/60">
                  {formatDateTime(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="mt-4">
              <span className="inline-flex rounded-full border border-culturin-700/25 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-culturin-800 dark:border-culturin-400/30 dark:text-culturin-300/90">
                {interestLabel(selected.interest)}
              </span>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Name</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{selected.name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Email</dt>
                <dd className="text-right">
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-culturin-800 no-underline hover:underline dark:text-culturin-300"
                  >
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Company</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{selected.company || "—"}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-white/10">
              <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/55">
                Message
              </p>
              {selected.message ? (
                <p className="m-0 mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-white/85">
                  {selected.message}
                </p>
              ) : (
                <p className="m-0 mt-2.5 text-sm text-neutral-500 dark:text-white/55">No message was included.</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-neutral-200 pt-4 dark:border-white/10">
              <a
                href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(
                  `Re: ${interestLabel(selected.interest)} inquiry`,
                )}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-culturin-400/40 bg-[color:var(--c-ink)] px-4 text-sm font-semibold text-[color:var(--c-bg)] no-underline transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Reply by email
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex h-10 items-center rounded-full border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
