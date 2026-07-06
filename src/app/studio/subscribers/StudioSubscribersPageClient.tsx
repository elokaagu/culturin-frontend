"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { useStudioConfirm } from "@/app/studio/_components/StudioConfirmDialog";
import { formatSubscriberSource, type StudioSubscriber } from "@/lib/studio/subscribers";
import { parseSubscriberCsv } from "@/lib/studio/parseCsv";

type ImportResult = { inserted: number; skippedExisting: number; duplicateInFile: number; invalid: number };

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function StudioSubscribersPageClient({
  subscribers,
  hasDb,
}: {
  subscribers: StudioSubscriber[];
  hasDb: boolean;
}) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selected, setSelected] = useState<StudioSubscriber | null>(null);
  const [importSourceLabel, setImportSourceLabel] = useState("");
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportResult(null);

    const text = await file.text();
    const { rows } = parseSubscriberCsv(text);

    if (rows.length === 0) {
      setImporting(false);
      setImportError("Couldn't find any rows in that file. Make sure it has an Email column.");
      return;
    }

    const response = await fetch("/api/studio/subscribers-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows, source: importSourceLabel.trim() }),
    });
    const data = (await response.json().catch(() => ({}))) as Partial<ImportResult> & { message?: string };
    setImporting(false);

    if (!response.ok) {
      setImportError(data.message ?? "Could not import that file.");
      return;
    }

    setImportResult({
      inserted: data.inserted ?? 0,
      skippedExisting: data.skippedExisting ?? 0,
      duplicateInFile: data.duplicateInFile ?? 0,
      invalid: data.invalid ?? 0,
    });
    router.refresh();
  }

  async function handleDelete(subscriber: StudioSubscriber) {
    const label = [subscriber.firstName, subscriber.lastName].filter(Boolean).join(" ") || subscriber.email;
    const confirmed = await confirm({
      title: `Remove ${label}?`,
      description: "This permanently deletes them from the mailing list. They can sign up again from the site footer.",
      confirmLabel: "Delete subscriber",
    });
    if (!confirmed) return;

    setDeletingId(subscriber.id);
    setDeleteError(null);

    const response = await fetch(`/api/studio/subscribers?id=${encodeURIComponent(subscriber.id)}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setDeletingId(null);

    if (!response.ok) {
      setDeleteError(data.message ?? "Could not delete subscriber.");
      return;
    }

    setRemoved((prev) => new Set(prev).add(subscriber.id));
    if (selected?.id === subscriber.id) setSelected(null);
    router.refresh();
  }

  const visible = useMemo(() => subscribers.filter((s) => !removed.has(s.id)), [subscribers, removed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visible;
    return visible.filter((s) =>
      [s.firstName, s.lastName, s.email, s.company, formatSubscriberSource(s.source)].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [visible, search]);

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All subscribers
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={importSourceLabel}
            onChange={(e) => setImportSourceLabel(e.target.value)}
            placeholder="Source (e.g. NYFW 2025)"
            maxLength={120}
            className="h-8 w-44 rounded-full border border-neutral-300 bg-white px-3 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/15 dark:bg-black/60 dark:text-white dark:placeholder:text-white/35"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="inline-flex h-8 items-center rounded-full border border-culturin-700/25 bg-white px-3.5 text-xs font-semibold text-neutral-900 transition hover:border-culturin-600/40 hover:bg-culturin-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-culturin-400/40 dark:bg-white dark:text-black dark:hover:bg-culturin-100"
          >
            {importing ? "Importing…" : "Import CSV"}
          </button>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
            {search.trim()
              ? `${filtered.length} of ${visible.length} shown`
              : `${visible.length} subscriber${visible.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-neutral-500 dark:text-white/50">
        Give this batch a source label (e.g. an event name) before importing, so you can tell where each subscriber came from later. Leave it blank and it&apos;ll just be tagged &quot;CSV import&quot;.
      </p>

      {importError ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {importError}
        </p>
      ) : null}
      {importResult ? (
        <p className="mt-4 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-700 dark:border-white/15 dark:bg-white/5 dark:text-white/80">
          Imported {importResult.inserted}
          {importResult.skippedExisting > 0 ? `, skipped ${importResult.skippedExisting} already subscribed` : ""}
          {importResult.duplicateInFile > 0 ? `, ${importResult.duplicateInFile} duplicate rows in file` : ""}
          {importResult.invalid > 0 ? `, ${importResult.invalid} rows had no valid email` : ""}.
        </p>
      ) : null}

      {deleteError ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {deleteError}
        </p>
      ) : null}

      {hasDb && visible.length > 0 ? (
        <label className="mt-5 flex flex-col gap-2 sm:max-w-sm">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company…"
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
          />
        </label>
      ) : null}

      <div className="mt-6">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so subscribers can&apos;t be listed yet.
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No subscribers yet. New footer sign-ups will show up here.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No subscribers match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/12">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/[0.03]">
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">First name</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Last name</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Email</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Company</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Source</th>
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Joined</th>
                  <th className="w-12 px-2 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const isDeleting = deletingId === s.id;
                  return (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={[
                      "cursor-pointer transition hover:bg-culturin-50 dark:hover:bg-white/[0.05]",
                      i % 2 === 1 ? "bg-neutral-50/60 dark:bg-white/[0.015]" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-2.5 text-neutral-900 dark:text-white">{s.firstName || "—"}</td>
                    <td className="px-4 py-2.5 text-neutral-900 dark:text-white">{s.lastName || "—"}</td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-white/80">{s.email}</td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-white/80">{s.company || "—"}</td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-white/80">{formatSubscriberSource(s.source)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500 dark:text-white/58">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDelete(s);
                        }}
                        disabled={isDeleting}
                        aria-label={`Delete ${s.email}`}
                        title="Delete subscriber"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{isDeleting ? "Deleting…" : "Delete"}</span>
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            aria-labelledby="subscriber-detail-title"
            className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-white/12 dark:bg-[#181818] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p
                id="subscriber-detail-title"
                className="m-0 font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-white"
              >
                {[selected.firstName, selected.lastName].filter(Boolean).join(" ") || selected.email}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="shrink-0 rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Email</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{selected.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Company</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{selected.company || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Source</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{formatSubscriberSource(selected.source)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-white/55">Joined</dt>
                <dd className="text-right text-neutral-900 dark:text-white">{formatDate(selected.createdAt)}</dd>
              </div>
            </dl>

            {Object.keys(selected.rawData).length > 0 ? (
              <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-white/10">
                <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/55">
                  From the imported file
                </p>
                <dl className="mt-2.5 space-y-2.5 text-sm">
                  {Object.entries(selected.rawData).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                      <dt className="text-neutral-500 dark:text-white/55">{key}</dt>
                      <dd className="text-right text-neutral-900 dark:text-white">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="mt-5 border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-white/10 dark:text-white/55">
                This subscriber joined from the site footer, so there&apos;s no imported file data to show.
              </p>
            )}

            <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => void handleDelete(selected)}
                disabled={deletingId === selected.id}
                className="inline-flex h-9 items-center rounded-full border border-rose-300/70 bg-rose-50 px-4 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-400/35 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
              >
                {deletingId === selected.id ? "Deleting…" : "Delete subscriber"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
