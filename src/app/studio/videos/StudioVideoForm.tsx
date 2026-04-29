"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

export type VideoFormInitial = {
  slug: string;
  title: string;
  uploader: string;
  description: string;
  thumbnail_url: string;
  playback_id: string;
  published_at: string;
};

export function StudioVideoForm({
  initial,
  onSaved,
}: {
  initial?: VideoFormInitial | null;
  onSaved?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnail_url ?? "");
  const isEditing = Boolean(initial?.slug);

  useEffect(() => {
    setThumbnailUrl(initial?.thumbnail_url ?? "");
  }, [initial?.slug, initial?.thumbnail_url]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries());
    setPending(true);
    setMessage(null);
    const result = await postCmsEntry("video", entry);
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage(`${result.data.message ?? "Saved"} (${result.data.slug ?? "no-slug"})`);
    if (!isEditing) event.currentTarget.reset();
    onSaved?.();
  }

  return (
    <section id="video-form">
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">
          {isEditing ? "Edit video" : "Create video"}
        </h2>
        {isEditing ? (
          <Link
            href="/studio/videos"
            className="inline-flex h-7 items-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-700 no-underline transition hover:bg-neutral-100 dark:border-white/20 dark:text-white/75 dark:hover:bg-white/10"
          >
            Cancel edit
          </Link>
        ) : null}
      </div>
      {message ? (
        <p className="mt-4 max-w-3xl rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
          {message}
        </p>
      ) : null}
      <form className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {isEditing ? <input type="hidden" name="original_slug" value={initial?.slug ?? ""} /> : null}
        <Field name="slug" label="Slug (optional)" defaultValue={initial?.slug ?? ""} />
        <Field name="title" label="Title" required defaultValue={initial?.title ?? ""} />
        <Field name="uploader" label="Uploader" defaultValue={initial?.uploader ?? ""} />
        <Field name="description" label="Description" defaultValue={initial?.description ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Thumbnail URL</span>
          <input
            name="thumbnail_url"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
          />
          <StudioImageUploadButton onUploaded={setThumbnailUrl} buttonLabel="Upload thumbnail" />
        </label>
        <Field name="playback_id" label="Video player ID" defaultValue={initial?.playback_id ?? ""} />
        <Field name="published_at" label="Publish date (optional)" defaultValue={initial?.published_at ?? ""} />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : isEditing ? "Save video changes" : "Save video entry"}
        </button>
      </form>
    </section>
  );
}
