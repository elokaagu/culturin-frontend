"use client";

import { useCallback, useMemo, useState } from "react";

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
import { studioListRowClass } from "@/app/admin/_components/StudioCulturinListKit";
import { StudioCulturinListSection } from "@/app/admin/_components/StudioCulturinListKit";
import { loadAudience, removeAudience, useAdminCollection } from "@/app/admin/_lib/useAdminCollection";
import type { StudioEventRsvp } from "@/lib/studio/eventRsvps";

function toCsv(rows: StudioEventRsvp[]): string {
  const header = ["First name", "Last name", "Email", "Company", "Title", "LinkedIn", "RSVP date"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.firstName, r.lastName, r.email, r.company, r.title, r.linkedinUrl, formatAdminDate(r.createdAt)]
      .map((v) => escape(v ?? ""))
      .join(","),
  );
  return [header.map(escape).join(","), ...lines].join("\n");
}

function downloadCsv(filename: string, rows: StudioEventRsvp[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const exportButtonClass =
  "inline-flex h-8 items-center rounded-full border border-[color:var(--c-rule)] px-3 text-xs font-medium text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)]";

export function StudioEventRsvpsPageClient({
  rsvps,
  eventLabels,
  hasDb,
}: {
  rsvps: StudioEventRsvp[];
  eventLabels: Record<string, string>;
  hasDb: boolean;
}) {
  const confirm = useStudioConfirm();
  const load = useCallback(() => loadAudience<StudioEventRsvp>("event-rsvps"), []);
  const remove = useCallback((ids: string[]) => removeAudience("event-rsvps", ids), []);
  const list = useAdminCollection<StudioEventRsvp>({ initial: rsvps, getId: (r) => r.id, load, remove });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list.items;
    return list.items.filter((r) =>
      [r.firstName, r.lastName, r.email, r.company, r.title, eventLabels[r.eventSlug] ?? r.eventSlug].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [list.items, search, eventLabels]);

  const groups = useMemo(() => {
    const byEvent = new Map<string, StudioEventRsvp[]>();
    for (const r of filtered) {
      const existing = byEvent.get(r.eventSlug);
      if (existing) existing.push(r);
      else byEvent.set(r.eventSlug, [r]);
    }
    return Array.from(byEvent.entries());
  }, [filtered]);

  async function deleteRsvps(rows: StudioEventRsvp[]) {
    if (rows.length === 0) return;
    const one = rows.length === 1;
    const ok = await confirm({
      title: one ? `Delete ${rows[0].firstName} ${rows[0].lastName}'s RSVP?` : `Delete ${rows.length} RSVPs?`,
      description: "This permanently removes the RSVP. They can RSVP again from the event page.",
      confirmLabel: one ? "Delete RSVP" : `Delete ${rows.length} RSVPs`,
      destructive: true,
    });
    if (ok) await list.deleteIds(rows.map((r) => r.id));
  }

  const total = list.items.length;
  const countLabel = search.trim() ? `${filtered.length} of ${total} shown` : `${total} RSVP${total === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && total > 0 ? (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SearchField value={search} onChange={setSearch} placeholder="Search name, email, company, event…" />
          <button type="button" onClick={() => downloadCsv("culturin-event-rsvps.csv", filtered)} className={exportButtonClass}>
            Export CSV
          </button>
        </div>
        <SelectionBar
          visibleIds={filtered.map((r) => r.id)}
          selectedIds={list.selectedIds}
          onSetAll={list.setAll}
          onClear={list.clearSelection}
          onDelete={() => void deleteRsvps(list.items.filter((r) => list.selectedIds.has(r.id)))}
          deleting={list.deleting}
          noun="RSVPs"
        />
      </div>
    ) : null;

  return (
    <>
      {list.error ? <Notice tone="error">{list.error}</Notice> : null}
      <StudioCulturinListSection title="All RSVPs" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <EmptyNote>The database isn&apos;t connected in this preview, so RSVPs can&apos;t be listed yet.</EmptyNote>
        ) : total === 0 ? (
          <EmptyNote>No RSVPs yet. New submissions from event pages will show up here.</EmptyNote>
        ) : filtered.length === 0 ? (
          <EmptyNote>No RSVPs match your search.</EmptyNote>
        ) : (
          <div className="space-y-8">
            {groups.map(([slug, rows]) => (
              <div key={slug}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">
                    {eventLabels[slug] ?? slug}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-accent)]">
                      {rows.length} RSVP{rows.length === 1 ? "" : "s"}
                    </span>
                    <button type="button" onClick={() => downloadCsv(`culturin-${slug}-rsvps.csv`, rows)} className={exportButtonClass}>
                      Export this event
                    </button>
                  </div>
                </div>
                <ul className="m-0 mt-4 list-none space-y-3 p-0">
                  {rows.map((r) => (
                    <li key={r.id} className={`${studioListRowClass} flex items-start gap-3`}>
                      <div className="pt-1">
                        <SelectBox
                          checked={list.selectedIds.has(r.id)}
                          onChange={() => list.toggle(r.id)}
                          label={`Select RSVP from ${r.email}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">
                          {r.firstName} {r.lastName}
                          {r.company || r.title ? (
                            <span className="font-normal text-[color:var(--c-muted)]">
                              {" "}
                              · {r.title ? `${r.title}${r.company ? ", " : ""}` : ""}
                              {r.company}
                            </span>
                          ) : null}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                          <a href={`mailto:${r.email}`} className="text-[color:var(--c-muted)] no-underline hover:underline">
                            {r.email}
                          </a>
                          {r.linkedinUrl ? (
                            <a
                              href={r.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[color:var(--c-accent)] no-underline hover:underline"
                            >
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <span className="whitespace-nowrap text-xs text-[color:var(--c-muted)]">{formatAdminDate(r.createdAt)}</span>
                      <DeleteIconButton
                        label={`Delete RSVP from ${r.email}`}
                        disabled={list.deleting}
                        onClick={() => void deleteRsvps([r])}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </StudioCulturinListSection>
    </>
  );
}
