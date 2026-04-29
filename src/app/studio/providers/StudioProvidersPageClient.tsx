"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Link } from "next-view-transitions";

import {
  STUDIO_SORT_OPTIONS,
  filterStudioList,
  sortStudioList,
  type StudioSortKey,
} from "@/app/studio/_lib/studioListShared";
import type { StudioProviderListItem } from "@/lib/cms/queries";

import { ProviderFormInitial, StudioProviderForm } from "./StudioProviderForm";

function displayTitle(p: StudioProviderListItem): string {
  return (p.eventName || p.name || p.slug || "Untitled").trim();
}

type StudioProvidersPageClientProps = {
  providers: StudioProviderListItem[];
  hasDb: boolean;
  editEntry: ProviderFormInitial | null;
};

export function StudioProvidersPageClient({ providers, hasDb, editEntry }: StudioProvidersPageClientProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");

  const isEditing = Boolean(editEntry);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isEditing || createOpen) {
      requestAnimationFrame(() => {
        document.getElementById("provider-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [isEditing, createOpen]);

  useEffect(() => {
    if (isEditing) setCreateOpen(false);
  }, [isEditing]);

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(providers, search, (p) => [
      p.eventName,
      p.name,
      p.slug,
      p.location,
      p.description,
    ]);
    return sortStudioList(filtered, sort, displayTitle, (p) => p.slug);
  }, [providers, search, sort]);

  function handleSaved() {
    router.refresh();
    if (!isEditing) setCreateOpen(false);
  }

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${providers.length} shown`
      : `${providers.length} item${providers.length === 1 ? "" : "s"}`;

  return (
    <>
      {isEditing ? (
        <div className="mt-6">
          <StudioProviderForm initial={editEntry} onSaved={handleSaved} />
        </div>
      ) : (
        <div className="mt-6">
          {!createOpen ? (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.12]"
            >
              Create provider
            </button>
          ) : (
            <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 pt-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="inline-flex h-8 items-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
              <StudioProviderForm initial={null} onSaved={handleSaved} />
            </div>
          )}
        </div>
      )}

      <section className="mt-10">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">All providers</h2>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/50">
                {countLabel}
              </span>
            </div>
            {hasDb && providers.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm sm:max-w-md">
                  <span className="font-medium text-neutral-700 dark:text-white/75">Search</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search experience name, business, slug, location…"
                    autoComplete="off"
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white dark:placeholder:text-white/35"
                  />
                </label>
                <label className="flex w-full flex-col gap-1.5 text-sm sm:w-48">
                  <span className="font-medium text-neutral-700 dark:text-white/75">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as StudioSortKey)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
                  >
                    {STUDIO_SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </div>
        </header>

        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so providers can&apos;t be listed yet.
          </p>
        ) : providers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            No providers found. Use <span className="text-neutral-700 dark:text-white/70">Create provider</span> to add one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            No providers match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((provider) => (
              <li
                key={provider.slug}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      {provider.eventName || provider.name || "Untitled provider"}
                    </p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/55">/{provider.slug}</p>
                    {provider.name ? (
                      <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/65">Business: {provider.name}</p>
                    ) : null}
                    {provider.location ? (
                      <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">Location: {provider.location}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/studio/providers?edit=${encodeURIComponent(provider.slug)}#provider-form`}
                    className="inline-flex h-8 shrink-0 items-center rounded-full border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
