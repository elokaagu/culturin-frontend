"use client";

import { useState, type FormEvent } from "react";

import { Field } from "@/app/studio/_components/Field";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";

export function StudioGalleryForm({ onSaved }: { onSaved?: () => void }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageUrl) {
      setMessage("Upload an image first.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries()) as Record<string, unknown>;
    entry.src = imageUrl;
    entry.large_src = imageUrl;

    setPending(true);
    setMessage(null);

    const response = await fetch("/api/studio/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setPending(false);

    if (!response.ok) {
      setMessage(data.message ?? "Could not add image.");
      return;
    }

    setMessage("Image added.");
    setImageUrl("");
    event.currentTarget.reset();
    onSaved?.();
  }

  return (
    <section id="gallery-form">
      <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">Add a photo</h2>
      {message ? (
        <p className="mt-4 max-w-3xl rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
          {message}
        </p>
      ) : null}
      <form className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-neutral-700 dark:text-white/80">Photo</span>
          <StudioImageUploadButton onUploaded={setImageUrl} buttonLabel={imageUrl ? "Replace photo" : "Upload photo"} />
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="mt-2 h-32 w-auto rounded-lg border border-neutral-200 object-cover dark:border-white/10" />
          ) : null}
        </label>
        <Field name="event_label" label="Event name" required defaultValue="" />
        <Field name="location" label="Location" defaultValue="" />
        <Field name="caption" label="Caption (optional)" defaultValue="" />
        <Field name="alt" label="Alt text" required defaultValue="" />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Orientation</span>
          <select
            name="orientation"
            defaultValue="landscape"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-[#121212] dark:text-white"
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
          {pending ? "Saving…" : "Add to gallery"}
        </button>
      </form>
    </section>
  );
}
