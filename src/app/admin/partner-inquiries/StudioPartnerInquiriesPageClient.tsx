"use client";

import { Mail, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DeleteIconButton,
  EmptyNote,
  Notice,
  SearchField,
  SelectBox,
  SelectionBar,
  formatAdminDate,
} from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import { StudioCulturinListSection, studioCancelButtonClass, studioListRowClass } from "@/app/admin/_components/StudioCulturinListKit";
import { loadAudience, removeAudience, useAdminCollection } from "@/app/admin/_lib/useAdminCollection";
import type { StudioPartnerInquiry } from "@/lib/studio/partnerInquiries";

const INTEREST_LABELS: Record<string, string> = {
  intelligence: "Intelligence",
  programming: "Programming",
  moments: "Moments",
  "cultural-marketing": "Cultural marketing",
  "new-territory": "Launching in a new territory",
  "cultural-intelligence": "Cultural intelligence",
  sponsorship: "Event sponsorship",
  activation: "Brand activation",
  attend: "Attending an event",
  other: "Something else",
};

const interestLabel = (interest: string) => INTEREST_LABELS[interest] ?? interest;

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function StudioPartnerInquiriesPageClient({
  inquiries,
  hasDb,
}: {
  inquiries: StudioPartnerInquiry[];
  hasDb: boolean;
}) {
  const confirm = useStudioConfirm();
  const load = useCallback(() => loadAudience<StudioPartnerInquiry>("partner-inquiries"), []);
  const remove = useCallback((ids: string[]) => removeAudience("partner-inquiries", ids), []);
  const list = useAdminCollection<StudioPartnerInquiry>({ initial: inquiries, getId: (i) => i.id, load, remove });
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<StudioPartnerInquiry | null>(null);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list.items;
    return list.items.filter((i) =>
      [i.name, i.email, i.company, interestLabel(i.interest), i.message].some((f) => f.toLowerCase().includes(q)),
    );
  }, [list.items, search]);

  async function deleteInquiries(rows: StudioPartnerInquiry[]) {
    if (rows.length === 0) return;
    const one = rows.length === 1;
    const ok = await confirm({
      title: one ? `Delete the inquiry from ${rows[0].name || rows[0].email}?` : `Delete ${rows.length} inquiries?`,
      description: "This permanently removes the inquiry and its message.",
      confirmLabel: one ? "Delete inquiry" : `Delete ${rows.length} inquiries`,
      destructive: true,
    });
    if (!ok) return;
    const done = await list.deleteIds(rows.map((r) => r.id));
    if (done && detail && rows.some((r) => r.id === detail.id)) setDetail(null);
  }

  const total = list.items.length;
  const countLabel = search.trim() ? `${filtered.length} of ${total} shown` : `${total} inquir${total === 1 ? "y" : "ies"}`;

  const toolbar =
    hasDb && total > 0 ? (
      <div className="flex flex-col gap-4">
        <SearchField value={search} onChange={setSearch} placeholder="Search name, email, company, message…" />
        <SelectionBar
          visibleIds={filtered.map((i) => i.id)}
          selectedIds={list.selectedIds}
          onSetAll={list.setAll}
          onClear={list.clearSelection}
          onDelete={() => void deleteInquiries(list.items.filter((i) => list.selectedIds.has(i.id)))}
          deleting={list.deleting}
          noun="inquiries"
        />
      </div>
    ) : null;

  return (
    <>
      {list.error ? <Notice tone="error">{list.error}</Notice> : null}
      <StudioCulturinListSection title="All inquiries" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <EmptyNote>The database isn&apos;t connected in this preview, so inquiries can&apos;t be listed yet.</EmptyNote>
        ) : total === 0 ? (
          <EmptyNote>No inquiries yet. Submissions from the /partner form will show up here.</EmptyNote>
        ) : filtered.length === 0 ? (
          <EmptyNote>No inquiries match your search.</EmptyNote>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filtered.map((inq) => (
              <li key={inq.id} className={`${studioListRowClass} flex items-start gap-3`}>
                <div className="pt-1">
                  <SelectBox
                    checked={list.selectedIds.has(inq.id)}
                    onChange={() => list.toggle(inq.id)}
                    label={`Select inquiry from ${inq.name || inq.email}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDetail(inq)}
                  className="min-w-0 flex-1 cursor-pointer bg-transparent p-0 text-left"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">
                      {inq.name || "Unnamed"}
                      {inq.company ? <span className="font-normal text-[color:var(--c-muted)]"> · {inq.company}</span> : null}
                    </p>
                    <span className="flex items-center gap-2 text-xs text-[color:var(--c-muted)]">
                      <span className="rounded-full border border-[color:var(--c-rule)] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--c-accent)]">
                        {interestLabel(inq.interest)}
                      </span>
                      {formatAdminDate(inq.createdAt)}
                    </span>
                  </div>
                  <p className="m-0 mt-0.5 text-xs text-[color:var(--c-muted)]">{inq.email}</p>
                  <p className="m-0 mt-2 line-clamp-2 text-sm text-[color:var(--c-ink)]">
                    {inq.message || <span className="text-[color:var(--c-muted)]">No message. Click to view details.</span>}
                  </p>
                </button>
                <DeleteIconButton
                  label={`Delete inquiry from ${inq.name || inq.email}`}
                  disabled={list.deleting}
                  onClick={() => void deleteInquiries([inq])}
                />
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>

      {detail ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDetail(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-detail-title"
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[color:var(--c-rule)] bg-[color:var(--c-bg)] p-5 text-[color:var(--c-ink)] shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p id="inquiry-detail-title" className="m-0 font-display text-lg font-semibold tracking-tight">
                  {detail.name || "Partner inquiry"}
                </p>
                <p className="m-0 mt-1 text-sm text-[color:var(--c-muted)]">{formatDateTime(detail.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--c-rule)] text-[color:var(--c-muted)] transition hover:text-[color:var(--c-ink)]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <span className="mt-4 inline-flex rounded-full border border-[color:var(--c-rule)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--c-accent)]">
              {interestLabel(detail.interest)}
            </span>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[color:var(--c-muted)]">Email</dt>
                <dd className="m-0 text-right">
                  <a href={`mailto:${detail.email}`} className="text-[color:var(--c-accent)] no-underline hover:underline">
                    {detail.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[color:var(--c-muted)]">Company</dt>
                <dd className="m-0 text-right">{detail.company || "-"}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-[color:var(--c-rule)] pt-4">
              <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Message</p>
              <p className="m-0 mt-2.5 whitespace-pre-wrap text-sm leading-relaxed">
                {detail.message || <span className="text-[color:var(--c-muted)]">No message was included.</span>}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[color:var(--c-rule)] pt-4">
              <a
                href={`mailto:${encodeURIComponent(detail.email)}?subject=${encodeURIComponent(`Re: ${interestLabel(detail.interest)} inquiry`)}`}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--c-ink)] px-4 text-sm font-semibold text-[color:var(--c-bg)] no-underline transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Reply by email
              </a>
              <button
                type="button"
                onClick={() => void deleteInquiries([detail])}
                disabled={list.deleting}
                className="inline-flex h-10 items-center rounded-full border border-rose-400/50 bg-rose-500/10 px-4 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-200"
              >
                {list.deleting ? "Deleting…" : "Delete"}
              </button>
              <button type="button" onClick={() => setDetail(null)} className={studioCancelButtonClass}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
