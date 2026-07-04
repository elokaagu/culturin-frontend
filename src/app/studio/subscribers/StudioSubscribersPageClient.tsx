"use client";

import { useMemo, useState } from "react";

import type { StudioSubscriber } from "@/lib/studio/subscribers";

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
  const [search, setSearch] = useState("");

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
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
          {search.trim()
            ? `${filtered.length} of ${subscribers.length} shown`
            : `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}`}
        </span>
      </div>

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
