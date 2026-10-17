"use client";

import { ImageUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { studioFieldInputClass, studioGhostButtonClass, studioMutedClass } from "@/app/admin/_lib/studioTheme";
import type { GalleryUploadSlots } from "@/app/api/admin/gallery/upload-urls/route";
import { decodePhoto, resizeToJpeg } from "@/lib/media/resizeImage";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";
import { cn } from "@/lib/utils";

/** Grid thumbnails: sharp on retina at a third of the page width. */
const GRID = { longEdge: 1600, quality: 0.82 };
/** Lightbox: full-screen viewing without loading the original. */
const LARGE = { longEdge: 2560, quality: 0.86 };
const MAX_ORIGINAL_BYTES = 50 * 1024 * 1024;
const CONCURRENCY = 3;
const SLOTS_PER_REQUEST = 50;
const CACHE_ONE_YEAR = "31536000";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;
const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", heic: "image/heic", heif: "image/heif",
};

type Status = "queued" | "uploading" | "done" | "failed";
type Job = { file: File; status: Status; error?: string };
export type GalleryEventOption = { label: string; location: string };

const naturalByName = (a: File, b: File) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
const mimeOf = (file: File) => file.type || MIME_BY_EXT[file.name.split(".").pop()?.toLowerCase() ?? ""] || "image/jpeg";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
  return data;
}

/**
 * Uploads a whole night's photos at once. Each photo is stored three ways: a grid copy and a
 * lightbox copy (resized in the browser) for the site, and the untouched original for downloads.
 */
export function StudioGalleryBulkUpload({ events, onFinished }: { events: GalleryEventOption[]; onFinished: () => void }) {
  const { supabase } = useSupabaseAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [eventLabel, setEventLabel] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { queued: 0, uploading: 0, done: 0, failed: 0 };
    for (const j of jobs) c[j.status]++;
    return c;
  }, [jobs]);
  const pending = jobs.filter((j) => j.status === "queued" || j.status === "failed");

  useEffect(() => {
    if (!running) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [running]);

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((f) => IMAGE_EXT.test(f.name) || f.type.startsWith("image/"));
    setJobs((prev) => {
      const seen = new Set(prev.map((j) => `${j.file.name}:${j.file.size}`));
      const fresh = incoming.filter((f) => !seen.has(`${f.name}:${f.size}`)).map((file) => ({ file, status: "queued" as const }));
      return [...prev, ...fresh].sort((a, b) => naturalByName(a.file, b.file));
    });
    setMessage(null);
  }

  function chooseEvent(value: string) {
    setEventLabel(value);
    const match = events.find((e) => e.label.toLowerCase() === value.trim().toLowerCase());
    if (match && !location) setLocation(match.location);
  }

  const setStatus = (file: File, status: Status, error?: string) =>
    setJobs((prev) => prev.map((j) => (j.file === file ? { ...j, status, error } : j)));

  async function uploadOne(file: File, slots: GalleryUploadSlots, sortOrder: number) {
    if (!supabase) throw new Error("You're signed out. Refresh and sign in again.");
    if (file.size > MAX_ORIGINAL_BYTES) throw new Error("Over 50 MB, so it can't be stored as an original.");

    let bitmap: ImageBitmap;
    try {
      bitmap = await decodePhoto(file);
    } catch {
      throw new Error("This browser can't read this photo. Export it as a JPEG and try again.");
    }
    const orientation = bitmap.height > bitmap.width ? "portrait" : "landscape";
    const [grid, large] = await Promise.all([resizeToJpeg(bitmap, GRID.longEdge, GRID.quality), resizeToJpeg(bitmap, LARGE.longEdge, LARGE.quality)]);
    bitmap.close();

    const bucket = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET);
    const put = async (slot: { path: string; token: string }, body: Blob, contentType: string) => {
      const { error } = await bucket.uploadToSignedUrl(slot.path, slot.token, body, { contentType, cacheControl: CACHE_ONE_YEAR });
      if (error) throw new Error(error.message);
    };
    await Promise.all([
      put(slots.original, file, mimeOf(file)),
      put(slots.large, large, "image/jpeg"),
      put(slots.grid, grid, "image/jpeg"),
    ]);

    const label = eventLabel.trim();
    await postJson("/api/admin/gallery", {
      event_label: label,
      caption: caption.trim(),
      location: location.trim(),
      src: slots.grid.publicUrl,
      large_src: slots.large.publicUrl,
      original_src: slots.original.publicUrl,
      alt: `Guests at Culturin’s ${label}${caption.trim() ? ` (${caption.trim()})` : ""}`,
      orientation,
      sort_order: sortOrder,
    });
  }

  async function start() {
    const label = eventLabel.trim();
    if (!label) {
      setMessage("Add the event name first.");
      return;
    }
    const todo = pending.map((j) => j.file);
    if (todo.length === 0) return;
    setRunning(true);
    setMessage(null);

    try {
      const slotsByFile = new Map<File, GalleryUploadSlots>();
      let baseSort: number | null = null;
      for (let i = 0; i < todo.length; i += SLOTS_PER_REQUEST) {
        const chunk = todo.slice(i, i + SLOTS_PER_REQUEST);
        const res = await postJson<{ nextSortOrder: number; slots: GalleryUploadSlots[] }>("/api/admin/gallery/upload-urls", {
          eventKey: label,
          files: chunk.map((f) => f.name),
        });
        baseSort ??= res.nextSortOrder;
        res.slots.forEach((slot, k) => slotsByFile.set(chunk[k], slot));
      }

      let next = 0;
      const worker = async () => {
        while (next < todo.length) {
          const index = next++;
          const file = todo[index];
          setStatus(file, "uploading");
          try {
            await uploadOne(file, slotsByFile.get(file)!, (baseSort ?? 0) + index);
            setStatus(file, "done");
          } catch (err) {
            setStatus(file, "failed", err instanceof Error ? err.message : "Upload failed.");
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Couldn't start the upload.");
    } finally {
      setRunning(false);
      onFinished();
    }
  }

  const total = jobs.length;
  const progress = total > 0 ? Math.round(((counts.done + counts.failed) / total) * 100) : 0;
  const failed = jobs.filter((j) => j.status === "failed");

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="m-0 text-base font-semibold text-[color:var(--c-ink)]">Upload photos from an event</h2>
        <p className={cn("m-0 mt-1 max-w-2xl text-sm", studioMutedClass)}>
          Drop in a whole night&apos;s photos. The site shows fast, resized copies, and anyone who downloads a photo gets the photographer&apos;s
          original at full quality.
        </p>
      </div>

      <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className={cn("font-medium", studioMutedClass)}>Event</span>
          <input
            list="gallery-event-options"
            value={eventLabel}
            onChange={(e) => chooseEvent(e.target.value)}
            placeholder="MIPCOM 2026"
            disabled={running}
            className={studioFieldInputClass}
          />
          <datalist id="gallery-event-options">
            {events.map((e) => (
              <option key={e.label} value={e.label} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className={cn("font-medium", studioMutedClass)}>Night or caption (optional)</span>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Day One" disabled={running} className={studioFieldInputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className={cn("font-medium", studioMutedClass)}>Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cannes" disabled={running} className={studioFieldInputClass} />
        </label>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!running) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex max-w-3xl flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
          dragging ? "border-[color:var(--c-accent)] bg-[color:color-mix(in_srgb,var(--c-accent)_8%,transparent)]" : "border-[color:var(--c-rule)]",
        )}
      >
        <ImageUp className="h-7 w-7 text-[color:var(--c-accent)]" aria-hidden />
        <p className="m-0 text-sm text-[color:var(--c-ink)]">
          {total > 0 ? `${total} photo${total === 1 ? "" : "s"} selected` : "Drag photos here, or choose them from your computer"}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button type="button" disabled={running} onClick={() => inputRef.current?.click()} className={cn(studioGhostButtonClass, "h-9 px-4 text-sm font-medium")}>
          {total > 0 ? "Add more photos" : "Choose photos"}
        </button>
      </div>

      {total > 0 ? (
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--c-rule)" }} aria-hidden>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--c-accent)" }} />
          </div>
          <p className={cn("m-0 text-sm", studioMutedClass)} aria-live="polite">
            {running
              ? `Uploading… ${counts.done} of ${total} done${counts.failed ? `, ${counts.failed} failed` : ""}. Keep this tab open.`
              : counts.done === total
                ? `All ${total} photos are in the gallery.`
                : `${counts.done} uploaded, ${pending.length} to go${counts.failed ? ` (${counts.failed} failed)` : ""}.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void start()}
              disabled={running || pending.length === 0}
              className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--c-accent)", color: "#1c1a17" }}
            >
              {running ? "Uploading…" : counts.failed > 0 && counts.queued === 0 ? `Retry ${counts.failed} failed` : `Upload ${pending.length} photo${pending.length === 1 ? "" : "s"}`}
            </button>
            {!running ? (
              <button type="button" onClick={() => setJobs([])} className={cn(studioGhostButtonClass, "h-10 px-4 text-sm font-medium")}>
                Clear list
              </button>
            ) : null}
          </div>
          {failed.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-xs text-rose-500">
              {failed.slice(0, 20).map((j) => (
                <li key={j.file.name}>
                  {j.file.name}: {j.error}
                </li>
              ))}
              {failed.length > 20 ? <li>…and {failed.length - 20} more.</li> : null}
            </ul>
          ) : null}
        </div>
      ) : null}

      {message ? <p className="m-0 text-sm text-rose-500">{message}</p> : null}
    </section>
  );
}
