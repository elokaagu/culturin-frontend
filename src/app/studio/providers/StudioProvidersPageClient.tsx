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
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

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

  const visibleProviders = useMemo(
    () => providers.filter((p) => !removed.has(p.slug)),
    [providers, removed],
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(visibleProviders, search, (p) => [
      p.eventName,
      p.name,
      p.slug,
      p.location,
      p.description,
    ]);
    return sortStudioList(filtered, sort, displayTitle, (p) => p.slug);
  }, [visibleProviders, search, sort]);

  function handleSaved() {
    router.refresh();
    if (!isEditing) setCreateOpen(false);
  }

  async function handleDelete(provider: StudioProviderListItem) {
    const label = displayTitle(provider);
    const confirmed = window.confirm(
      `Delete “${label}”? This permanently removes the listing from the public site.`,
    );
    if (!confirmed) return;

    setDeletingSlug(provider.slug);
    setErrorMessage(null);

    const result = await deleteCmsEntry("provider", provider.slug);

    setDeletingSlug(null);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(provider.slug);
      return next;
    });

    if (isEditing && editEntry?.slug === provider.slug) {
      router.replace("/studio/providers");
    } else {
      startTransition(() => router.refresh());
    }
  }

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${visibleProviders.length} shown`
      : `${visibleProviders.length} item${visibleProviders.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && visibleProviders.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search experience name, business, slug, location…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  return (
    <>
      {isEditing ? (
        <div className="mt-6">
          <StudioProviderForm initial={editEntry} onSaved={handleSaved} />
        </div>
      ) : (
        <div className="mt-6">
          {!createOpen ? (
            <button type="button" onClick={() => setCreateOpen(true)} className={studioCreateButtonClass}>
              Create provider
            </button>
          ) : (
            <div className={studioCreateFormShellClass}>
              <div className="mb-2 flex justify-end">
                <button type="button" onClick={() => setCreateOpen(false)} className={studioCancelButtonClass}>
                  Cancel
                </button>
              </div>
              <StudioProviderForm initial={null} onSaved={handleSaved} />
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

      <StudioCulturinListSection title="All providers" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so providers can&apos;t be listed yet.
          </p>
        ) : visibleProviders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No providers found. Use <span className="font-medium text-amber-800 dark:text-amber-300/90">Create provider</span> to add one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No providers match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((provider) => {
              const label = provider.eventName || provider.name || "Untitled provider";
              const isDeleting = deletingSlug === provider.slug;
              return (
                <li key={provider.slug} className={studioListRowClass}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <a
                      href={`/providers/${encodeURIComponent(provider.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open “${label}” in a new tab`}
                      className="group min-w-0 flex-1 rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                    >
                      <p className="m-0 truncate text-sm font-semibold text-neutral-900 transition group-hover:text-amber-800 dark:text-white dark:group-hover:text-amber-300">
                        {label}
                      </p>
                      <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{provider.slug}</p>
                      {provider.name ? (
                        <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/60">Business: {provider.name}</p>
                      ) : null}
                      {provider.location ? (
                        <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/50">Location: {provider.location}</p>
                      ) : null}
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/studio/providers?edit=${encodeURIComponent(provider.slug)}#provider-form`}
                        className={studioListEditLinkClass}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(provider)}
                        disabled={isDeleting}
                        aria-label={`Delete ${label}`}
                        title="Delete provider"
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
