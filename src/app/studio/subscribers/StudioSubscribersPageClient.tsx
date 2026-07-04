"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { StudioSubscriber } from "@/lib/studio/subscribers";
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
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      body: JSON.stringify({ rows }),
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) =>
      [s.firstName, s.lastName, s.email, s.company].some((f) => f.toLowerCase().includes(q)),
    );
  }, [subscribers, search]);

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All subscribers
        </h2>
        <div className="flex items-center gap-3">
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
              ? `${filtered.length} of ${subscribers.length} shown`
              : `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

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

      {hasDb && subscribers.length > 0 ? (
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
        ) : subscribers.length === 0 ? (
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
                  <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-white/65">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={
                      i % 2 === 1
                        ? "bg-neutral-50/60 dark:bg-white/[0.015]"
                        : undefined
                    }
                  >
                    <td className="px-4 py-2.5 text-neutral-900 dark:text-white">{s.firstName || "—"}</td>
                    <td className="px-4 py-2.5 text-neutral-900 dark:text-white">{s.lastName || "—"}</td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-white/80">{s.email}</td>
                    <td className="px-4 py-2.5 text-neutral-700 dark:text-white/80">{s.company || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500 dark:text-white/58">
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
