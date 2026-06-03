"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Link } from "next-view-transitions";
import { Trash2 } from "lucide-react";

import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCancelButtonClass,
  studioCreateButtonClass,
  studioCreateFormShellClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/studio/_lib/studioListShared";
import { deleteCmsEntry } from "@/app/studio/_lib/postCmsEntry";
import type { StudioCuratorListItem } from "@/lib/cms/queries";

import { CuratorFormInitial, StudioCuratorForm } from "./StudioCuratorForm";

type StudioCuratorsPageClientProps = {
  curators: StudioCuratorListItem[];
  hasDb: boolean;
  editEntry: CuratorFormInitial | null;
};

export function StudioCuratorsPageClient({ curators, hasDb, editEntry }: StudioCuratorsPageClientProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isEditing = Boolean(editEntry);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isEditing || createOpen) {
      requestAnimationFrame(() => {
        document.getElementById("curator-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [isEditing, createOpen]);

  useEffect(() => {
    if (isEditing) setCreateOpen(false);
  }, [isEditing]);

  const visibleCurators = useMemo(
    () => curators.filter((c) => !removed.has(c.slug)),
    [curators, removed],
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(visibleCurators, search, (c) => [c.name, c.slug, c.tagline]);
    return sortStudioList(filtered, sort, (c) => c.name || c.slug, (c) => c.slug);
  }, [visibleCurators, search, sort]);

  function handleSaved() {
    router.refresh();
    if (!isEditing) setCreateOpen(false);
  }

  async function handleDelete(curator: StudioCuratorListItem) {
    const label = curator.name || curator.slug;
    const confirmed = window.confirm(
      `Delete "${label}"? This permanently removes the curator profile from the public site.`,
    );
    if (!confirmed) return;

    setDeletingSlug(curator.slug);
    setErrorMessage(null);

    const result = await deleteCmsEntry("curator", curator.slug);
    setDeletingSlug(null);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(curator.slug);
      return next;
    });

    if (isEditing && editEntry?.slug === curator.slug) {
      router.replace("/studio/curators");
    } else {
      startTransition(() => router.refresh());
    }
  }

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${visibleCurators.length} shown`
      : `${visibleCurators.length} item${visibleCurators.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && visibleCurators.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search curator name, slug, tagline…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  return (
    <>
      {isEditing ? (
        <div className="mt-6">
          <StudioCuratorForm initial={editEntry} onSaved={handleSaved} />
        </div>
      ) : (
        <div className="mt-6">
          {!createOpen ? (
            <button type="button" onClick={() => setCreateOpen(true)} className={studioCreateButtonClass}>
              Create curator
            </button>
          ) : (
            <div className={studioCreateFormShellClass}>
              <div className="mb-2 flex justify-end">
                <button type="button" onClick={() => setCreateOpen(false)} className={studioCancelButtonClass}>
                  Cancel
                </button>
              </div>
              <StudioCuratorForm initial={null} onSaved={handleSaved} />
            </div>
          )}
        </div>
      )}

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <StudioCulturinListSection title="All curators" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so curators can&apos;t be listed yet.
          </p>
        ) : visibleCurators.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No curators found. Use <span className="font-medium text-amber-800 dark:text-amber-300/90">Create curator</span> to add one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No curators match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((curator) => {
              const label = curator.name || "Untitled curator";
              const isDeleting = deletingSlug === curator.slug;
              return (
                <li key={curator.slug} className={studioListRowClass}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <a
                      href={`/curators/${encodeURIComponent(curator.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open "${label}" in a new tab`}
                      className="group min-w-0 flex-1 rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                    >
                      <p className="m-0 truncate text-sm font-semibold text-neutral-900 transition group-hover:text-amber-800 dark:text-white dark:group-hover:text-amber-300">
                        {label}
                      </p>
                      <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{curator.slug}</p>
                      {curator.tagline ? (
                        <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/60">{curator.tagline}</p>
                      ) : null}
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/studio/curators?edit=${encodeURIComponent(curator.slug)}#curator-form`}
                        className={studioListEditLinkClass}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(curator)}
                        disabled={isDeleting}
                        aria-label={`Delete ${label}`}
                        title="Delete curator"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{isDeleting ? "Deleting…" : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
