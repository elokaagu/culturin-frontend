"use client";

import { useState, type FormEvent } from "react";

import { Field } from "@/app/studio/_components/Field";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import type { StudioGalleryListItem } from "@/lib/cms/queries";

export type GalleryFormInitial = Pick<
  StudioGalleryListItem,
  "id" | "eventKey" | "eventLabel" | "caption" | "location" | "src" | "alt" | "orientation"
>;

export function StudioGalleryForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: GalleryFormInitial | null;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const isEditing = Boolean(initial?.id);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(initial?.src ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageUrl) {
      setMessage("Upload an image first.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries()) as Record<string, unknown>;

    setPending(true);
    setMessage(null);

    let response: Response;
    if (isEditing) {
      entry.id = initial!.id;
      response = await fetch("/api/studio/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } else {
      entry.src = imageUrl;
      entry.large_src = imageUrl;
      response = await fetch("/api/studio/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    }

    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setPending(false);

    if (!response.ok) {
      setMessage(data.message ?? (isEditing ? "Could not update photo." : "Could not add image."));
      return;
    }

    setMessage(isEditing ? "Photo updated." : "Image added.");
    if (!isEditing) {
      setImageUrl("");
      event.currentTarget.reset();
    }
    onSaved?.();
  }

  return (
    <section id="gallery-form">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">
          {isEditing ? "Edit photo" : "Add a photo"}
        </h2>
        {isEditing && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-7 items-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:text-white/75 dark:hover:bg-white/10"
          >
            Cancel edit
          </button>
        ) : null}
      </div>
      {message ? (
        <p className="mt-4 max-w-3xl rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
          {message}
        </p>
      ) : null}
      <form className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-neutral-700 dark:text-white/80">Photo</span>
          {!isEditing ? (
            <StudioImageUploadButton onUploaded={setImageUrl} buttonLabel={imageUrl ? "Replace photo" : "Upload photo"} />
          ) : null}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="mt-2 h-32 w-auto rounded-lg border border-neutral-200 object-cover dark:border-white/10" />
          ) : null}
        </label>
        <Field name="event_label" label="Event name" required defaultValue={initial?.eventLabel ?? ""} />
        <Field name="location" label="Location" defaultValue={initial?.location ?? ""} />
        <Field name="caption" label="Caption (optional)" defaultValue={initial?.caption ?? ""} />
        <Field name="alt" label="Alt text" required defaultValue={initial?.alt ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Orientation</span>
          <select
            name="orientation"
            defaultValue={initial?.orientation ?? "landscape"}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-culturin-400 dark:border-white/15 dark:bg-[#121212] dark:text-white"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : isEditing ? "Save changes" : "Add to gallery"}
        </button>
      </form>
    </section>
  );
}
