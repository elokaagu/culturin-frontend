"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Link } from "next-view-transitions";

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

  const toolbar =
    hasDb && providers.length > 0 ? (
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

      <StudioCulturinListSection title="All providers" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so providers can&apos;t be listed yet.
          </p>
        ) : providers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No providers found. Use <span className="font-medium text-amber-800 dark:text-amber-300/90">Create provider</span> to add one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No providers match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((provider) => (
              <li key={provider.slug} className={studioListRowClass}>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      {provider.eventName || provider.name || "Untitled provider"}
                    </p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{provider.slug}</p>
                    {provider.name ? (
                      <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/60">Business: {provider.name}</p>
                    ) : null}
                    {provider.location ? (
                      <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/50">Location: {provider.location}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/studio/providers?edit=${encodeURIComponent(provider.slug)}#provider-form`}
                    className={studioListEditLinkClass}
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
