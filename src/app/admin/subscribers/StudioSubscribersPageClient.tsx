"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { StudioCulturinListSection, studioCancelButtonClass } from "@/app/admin/_components/StudioCulturinListKit";
import { loadAudience, removeAudience, useAdminCollection } from "@/app/admin/_lib/useAdminCollection";
import { parseSubscriberCsv } from "@/lib/studio/parseCsv";
import { formatSubscriberSource, type StudioSubscriber } from "@/lib/studio/subscribers";

type ImportTotals = { inserted: number; skippedExisting: number; duplicateInFile: number; invalid: number; notSubscribed: number };

const IMPORT_BATCH_SIZE = 500;

const fullName = (s: StudioSubscriber) => [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email;

export function StudioSubscribersPageClient({
  subscribers,
  hasDb,
}: {
  subscribers: StudioSubscriber[];
  hasDb: boolean;
}) {
  const confirm = useStudioConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => loadAudience<StudioSubscriber>("subscribers"), []);
  const remove = useCallback((ids: string[]) => removeAudience("subscribers", ids), []);
  const list = useAdminCollection<StudioSubscriber>({
    initial: subscribers,
    getId: (s) => s.id,
    load,
    remove,
  });

  const [search, setSearch] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [importing, setImporting] = useState<string | null>(null);
  const [importTotals, setImportTotals] = useState<ImportTotals | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [detail, setDetail] = useState<StudioSubscriber | null>(null);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detail]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list.items;
    return list.items.filter((s) =>
      [s.firstName, s.lastName, s.email, s.company, s.profile.role, s.profile.channel, formatSubscriberSource(s.source), ...s.profile.events].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [list.items, search]);

  const visibleIds = useMemo(() => filtered.map((s) => s.id), [filtered]);

  async function deleteSubscribers(subs: StudioSubscriber[]) {
    if (subs.length === 0) return;
    const one = subs.length === 1;
    const ok = await confirm({
      title: one ? `Remove ${fullName(subs[0])}?` : `Remove ${subs.length} subscribers?`,
      description: one
        ? "This permanently deletes them from the mailing list. They can sign up again from the site footer."
        : "This permanently deletes them from the mailing list. They can sign up again from the site footer.",
      confirmLabel: one ? "Delete subscriber" : `Delete ${subs.length} subscribers`,
      destructive: true,
    });
    if (!ok) return;
    const done = await list.deleteIds(subs.map((s) => s.id));
    if (done && detail && subs.some((s) => s.id === detail.id)) setDetail(null);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportError(null);
    setImportTotals(null);
    setImporting("Reading file…");

    const { rows, skippedNotSubscribed } = parseSubscriberCsv(await file.text());
    if (rows.length === 0) {
      setImporting(null);
      setImportError("Couldn't find any rows in that file. Make sure it has an Email column.");
      return;
    }

    const totals: ImportTotals = { inserted: 0, skippedExisting: 0, duplicateInFile: 0, invalid: 0, notSubscribed: skippedNotSubscribed };
    for (let i = 0; i < rows.length; i += IMPORT_BATCH_SIZE) {
      setImporting(`Importing ${Math.min(i + IMPORT_BATCH_SIZE, rows.length)} of ${rows.length}…`);
      const res = await fetch("/api/admin/subscribers-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: rows.slice(i, i + IMPORT_BATCH_SIZE), source: sourceLabel.trim() }),
      }).catch(() => null);
      const data = (await res?.json().catch(() => ({}))) as (Partial<ImportTotals> & { message?: string }) | undefined;
      if (!res || !res.ok) {
        setImporting(null);
        setImportTotals(totals);
        setImportError(
          `${data?.message ?? "Could not import that file."}${totals.inserted > 0 ? ` ${totals.inserted} were added before it stopped.` : ""}`,
        );
        await list.reload();
        return;
      }
      totals.inserted += data?.inserted ?? 0;
      totals.skippedExisting += data?.skippedExisting ?? 0;
      totals.duplicateInFile += data?.duplicateInFile ?? 0;
      totals.invalid += data?.invalid ?? 0;
    }

    setImporting(null);
    setImportTotals(totals);
    setSearch("");
    await list.reload();
  }

  const total = list.items.length;
  const countLabel = search.trim() ? `${filtered.length} of ${total} shown` : `${total} subscriber${total === 1 ? "" : "s"}`;

  const toolbar = hasDb ? (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">
            Import source label
          </span>
          <input
            type="text"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder="e.g. NYFW 2025"
            maxLength={120}
            className="h-10 w-56 rounded-full border border-[color:var(--c-rule)] bg-transparent px-4 text-sm text-[color:var(--c-ink)] outline-none transition placeholder:text-[color:var(--c-muted)] focus-visible:border-[color:var(--c-accent)]"
          />
        </label>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={Boolean(importing)}
          className="inline-flex h-10 items-center rounded-full bg-[color:var(--c-ink)] px-5 text-sm font-semibold text-[color:var(--c-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {importing ?? "Import CSV"}
        </button>
      </div>
      <p className="m-0 text-xs text-[color:var(--c-muted)]">
        Upload a CSV with an Email column (first name, last name, and company are picked up when present). The label tags where
        this batch came from; leave it blank to tag it &quot;CSV import&quot;. Anyone already on the list is skipped.
      </p>
      <SearchField value={search} onChange={setSearch} placeholder="Search name, email, company…" />
      <SelectionBar
        visibleIds={visibleIds}
        selectedIds={list.selectedIds}
        onSetAll={list.setAll}
        onClear={list.clearSelection}
        onDelete={() => void deleteSubscribers(list.items.filter((s) => list.selectedIds.has(s.id)))}
        deleting={list.deleting}
        noun="subscribers"
      />
    </div>
  ) : null;

  return (
    <>
      {importError ? <Notice tone="error">{importError}</Notice> : null}
      {importTotals ? (
        <Notice tone="info">
          Imported {importTotals.inserted}
          {importTotals.skippedExisting > 0 ? `, skipped ${importTotals.skippedExisting} already subscribed` : ""}
          {importTotals.duplicateInFile > 0 ? `, ${importTotals.duplicateInFile} duplicate rows in the file` : ""}
          {importTotals.notSubscribed > 0 ? `, left out ${importTotals.notSubscribed} who are unsubscribed, cleaned or pending` : ""}
          {importTotals.invalid > 0 ? `, ${importTotals.invalid} rows had no valid email` : ""}.
        </Notice>
      ) : null}
      {list.error ? <Notice tone="error">{list.error}</Notice> : null}

      <StudioCulturinListSection title="All subscribers" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <EmptyNote>The database isn&apos;t connected in this preview, so subscribers can&apos;t be listed yet.</EmptyNote>
        ) : total === 0 ? (
          <EmptyNote>No subscribers yet. Import a CSV above, or wait for new footer sign-ups.</EmptyNote>
        ) : filtered.length === 0 ? (
          <EmptyNote>No subscribers match your search.</EmptyNote>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[color:var(--c-rule)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-accent)_6%,transparent)] text-[color:var(--c-muted)]">
                  <th className="w-10 px-4 py-2.5" />
                  <th className="px-3 py-2.5 font-medium">Name</th>
                  <th className="px-3 py-2.5 font-medium">Email</th>
                  <th className="px-3 py-2.5 font-medium">Company</th>
                  <th className="px-3 py-2.5 font-medium">Source</th>
                  <th className="px-3 py-2.5 font-medium">Joined</th>
                  <th className="w-12 px-2 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setDetail(s)}
                    className="cursor-pointer border-b border-[color:var(--c-rule)] transition last:border-b-0 hover:bg-[color:color-mix(in_srgb,var(--c-accent)_7%,transparent)]"
                  >
                    <td className="px-4 py-2.5">
                      <SelectBox
                        checked={list.selectedIds.has(s.id)}
                        onChange={() => list.toggle(s.id)}
                        label={`Select ${s.email}`}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-[color:var(--c-ink)]">{fullName(s) === s.email ? "-" : fullName(s)}</td>
                    <td className="px-3 py-2.5 text-[color:var(--c-ink)]">{s.email}</td>
                    <td className="px-3 py-2.5 text-[color:var(--c-muted)]">{s.company || "-"}</td>
                    <td className="px-3 py-2.5 text-[color:var(--c-muted)]">{s.profile.channel || formatSubscriberSource(s.source)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-[color:var(--c-muted)]">{formatAdminDate(s.joinedAt)}</td>
                    <td className="px-2 py-2.5">
                      <DeleteIconButton
                        label={`Delete ${s.email}`}
                        disabled={list.deleting}
                        onClick={() => void deleteSubscribers([s])}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </StudioCulturinListSection>

      {detail ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDetail(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscriber-detail-title"
            className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[color:var(--c-rule)] bg-[color:var(--c-bg)] p-5 text-[color:var(--c-ink)] shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <p id="subscriber-detail-title" className="m-0 font-display text-lg font-semibold tracking-tight">
                {fullName(detail)}
              </p>
              <button
                type="button"
                onClick={() => setDetail(null)}
                aria-label="Close"
                className="shrink-0 rounded-full p-1 text-[color:var(--c-muted)] transition hover:text-[color:var(--c-ink)]"
              >
                ✕
              </button>
            </div>
            {detail.profile.role || detail.company ? (
              <p className="m-0 mt-1 text-sm text-[color:var(--c-muted)]">
                {[detail.profile.role, detail.company].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            <dl className="mt-5 space-y-2.5 text-sm">
              {(
                [
                  ["Email", detail.email, "email"],
                  ["Name", [detail.firstName, detail.lastName].filter(Boolean).join(" "), "name"],
                  ["Company", detail.company, "company"],
                  ["Role", detail.profile.role, ""],
                  ["Location", detail.profile.location, ""],
                  ["Came from", detail.profile.channel || formatSubscriberSource(detail.source), ""],
                  ["Joined", formatAdminDate(detail.joinedAt), ""],
                  ["Phone", detail.profile.phone, ""],
                  ["Social", detail.profile.social, ""],
                  ["Notes", detail.profile.notes, ""],
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v, field]) => {
                  const guessed =
                    (field === "name" && detail.inferred.some((f) => f === "first_name" || f === "last_name")) ||
                    (field === "company" && detail.inferred.includes("company"));
                  return (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="shrink-0 text-[color:var(--c-muted)]">{k}</dt>
                      <dd className="m-0 min-w-0 break-words text-right">
                        {v}
                        {guessed ? (
                          <span
                            className="ml-1.5 rounded-full border border-[color:var(--c-rule)] px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-[color:var(--c-muted)]"
                            title="Filled in from their email address or full name, not typed by them"
                          >
                            inferred
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  );
                })}
            </dl>
            {detail.profile.events.length > 0 ? (
              <div className="mt-5 border-t border-[color:var(--c-rule)] pt-4">
                <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Events</p>
                <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
                  {detail.profile.events.map((e) => (
                    <li
                      key={e}
                      className="rounded-full border border-[color:var(--c-rule)] px-2.5 py-1 text-xs text-[color:var(--c-ink)]"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--c-rule)] pt-4">
              <button
                type="button"
                onClick={() => void deleteSubscribers([detail])}
                disabled={list.deleting}
                className="inline-flex h-9 items-center rounded-full border border-rose-400/50 bg-rose-500/10 px-4 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-200"
              >
                {list.deleting ? "Deleting…" : "Delete subscriber"}
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
