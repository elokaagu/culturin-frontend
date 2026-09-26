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
import { StudioCulturinListSection, studioListRowClass } from "@/app/admin/_components/StudioCulturinListKit";
import { loadAudience, removeAudience, useAdminCollection } from "@/app/admin/_lib/useAdminCollection";
import type { StudioGalleryDownload } from "@/lib/studio/galleryDownloads";
import LazyImg from "@/app/components/LazyImg";

export function StudioGalleryDownloadsPageClient({
  downloads,
  hasDb,
}: {
  downloads: StudioGalleryDownload[];
  hasDb: boolean;
}) {
  const confirm = useStudioConfirm();
  const load = useCallback(() => loadAudience<StudioGalleryDownload>("gallery-downloads"), []);
  const remove = useCallback((ids: string[]) => removeAudience("gallery-downloads", ids), []);
  const list = useAdminCollection<StudioGalleryDownload>({ initial: downloads, getId: (d) => d.id, load, remove });
  const [search, setSearch] = useState("");
  const [brokenImages, setBrokenImages] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list.items;
    return list.items.filter((d) =>
      [d.firstName, d.lastName, d.email, d.imageSrc].some((f) => f.toLowerCase().includes(q)),
    );
  }, [list.items, search]);

  async function deleteDownloads(rows: StudioGalleryDownload[]) {
    if (rows.length === 0) return;
    const ok = await confirm({
      title: rows.length === 1 ? "Delete this download record?" : `Delete ${rows.length} download records?`,
      description: "This removes the record from this list. It doesn't affect the photos themselves.",
      confirmLabel: rows.length === 1 ? "Delete" : `Delete ${rows.length}`,
      destructive: true,
    });
    if (ok) await list.deleteIds(rows.map((r) => r.id));
  }

  const total = list.items.length;
  const countLabel = search.trim() ? `${filtered.length} of ${total} shown` : `${total} download${total === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && total > 0 ? (
      <div className="flex flex-col gap-4">
        <SearchField value={search} onChange={setSearch} placeholder="Search name, email, photo…" />
        <SelectionBar
          visibleIds={filtered.map((d) => d.id)}
          selectedIds={list.selectedIds}
          onSetAll={list.setAll}
          onClear={list.clearSelection}
          onDelete={() => void deleteDownloads(list.items.filter((d) => list.selectedIds.has(d.id)))}
          deleting={list.deleting}
          noun="downloads"
        />
      </div>
    ) : null;

  return (
    <>
      {list.error ? <Notice tone="error">{list.error}</Notice> : null}
      <StudioCulturinListSection title="All downloads" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <EmptyNote>The database isn&apos;t connected in this preview, so downloads can&apos;t be listed yet.</EmptyNote>
        ) : total === 0 ? (
          <EmptyNote>No downloads yet. When someone downloads a full-quality photo from /gallery, it&apos;ll show up here.</EmptyNote>
        ) : filtered.length === 0 ? (
          <EmptyNote>No downloads match your search.</EmptyNote>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filtered.map((d) => (
              <li key={d.id} className={`${studioListRowClass} flex flex-wrap items-center gap-3`}>
                <SelectBox
                  checked={list.selectedIds.has(d.id)}
                  onChange={() => list.toggle(d.id)}
                  label={`Select download by ${d.email}`}
                />
                {d.imageSrc && !brokenImages.has(d.id) ? (
                  <LazyImg
                    src={d.imageSrc}
                    alt={d.imageAlt || ""}
                    onError={() => setBrokenImages((prev) => new Set(prev).add(d.id))}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[color:var(--c-rule)] text-[0.6rem] uppercase tracking-wide text-[color:var(--c-muted)]"
                  >
                    No img
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">
                    {d.firstName} {d.lastName}
                  </p>
                  <a href={`mailto:${d.email}`} className="text-xs text-[color:var(--c-muted)] no-underline hover:underline">
                    {d.email}
                  </a>
                </div>
                <span className="whitespace-nowrap text-xs text-[color:var(--c-muted)]">{formatAdminDate(d.createdAt)}</span>
                <DeleteIconButton
                  label={`Delete download by ${d.email}`}
                  disabled={list.deleting}
                  onClick={() => void deleteDownloads([d])}
                />
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
