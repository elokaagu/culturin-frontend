"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  studioCancelButtonClass,
  studioCreateButtonClass,
  studioCreateFormShellClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { useStudioConfirm } from "@/app/studio/_components/StudioConfirmDialog";
import type { StudioGalleryListItem } from "@/lib/cms/queries";

import { StudioGalleryForm } from "./StudioGalleryForm";

export function StudioGalleryPageClient({
  images,
  hasDb,
}: {
  images: StudioGalleryListItem[];
  hasDb: boolean;
}) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const [createOpen, setCreateOpen] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const visible = useMemo(() => images.filter((img) => !removed.has(img.id)), [images, removed]);

  const groups = useMemo(() => {
    const byEvent = new Map<string, { label: string; items: StudioGalleryListItem[] }>();
    for (const img of visible) {
      const existing = byEvent.get(img.eventKey);
      if (existing) {
        existing.items.push(img);
      } else {
        byEvent.set(img.eventKey, { label: img.eventLabel || img.eventKey, items: [img] });
      }
    }
    return Array.from(byEvent.values());
  }, [visible]);

  async function handleDelete(image: StudioGalleryListItem) {
    const confirmed = await confirm({
      title: "Delete this photo?",
      description: "This removes it from the public gallery.",
      confirmLabel: "Delete photo",
    });
    if (!confirmed) return;

    setDeletingId(image.id);
    setErrorMessage(null);

    const response = await fetch(`/api/studio/gallery?id=${encodeURIComponent(image.id)}`, { method: "DELETE" });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setDeletingId(null);

    if (!response.ok) {
      setErrorMessage(data.message ?? "Could not delete photo.");
      return;
    }

    setRemoved((prev) => new Set(prev).add(image.id));
    router.refresh();
  }

  function handleSaved() {
    setCreateOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="mt-6">
        {!createOpen ? (
          <button type="button" onClick={() => setCreateOpen(true)} className={studioCreateButtonClass}>
            Add photo
          </button>
        ) : (
          <div className={studioCreateFormShellClass}>
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={() => setCreateOpen(false)} className={studioCancelButtonClass}>
                Cancel
              </button>
            </div>
            <StudioGalleryForm onSaved={handleSaved} />
          </div>
        )}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-10 space-y-8">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so gallery photos can&apos;t be listed yet.
          </p>
        ) : groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No photos yet. Use <span className="font-medium text-culturin-800 dark:text-culturin-300/90">Add photo</span> to upload one.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.label}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {group.label}
                </h2>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
                  {group.items.length} photo{group.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {group.items.map((image) => {
                  const isDeleting = deletingId === image.id;
                  return (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-white/12 dark:bg-white/[0.04]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDelete(image)}
                        disabled={isDeleting}
                        aria-label={`Delete photo: ${image.alt || image.eventLabel}`}
                        title="Delete photo"
                        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition hover:bg-rose-600 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-60 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
