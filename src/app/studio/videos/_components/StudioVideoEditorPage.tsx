"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { StudioPublishDateField } from "@/app/studio/_components/StudioPublishDateField";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import { postCreatorSubmission } from "@/app/creator/_lib/postCreatorSubmission";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

export type StudioVideoEditorInitial = {
  slug: string;
  title: string;
  uploader: string;
  description: string;
  thumbnail_url: string;
  playback_id: string;
  published_at: string;
};

type StudioVideoEditorPageProps = {
  mode: "create" | "edit";
  initial: StudioVideoEditorInitial | null;
  workspace?: "studio" | "creator";
};

export function StudioVideoEditorPage({ mode, initial, workspace = "studio" }: StudioVideoEditorPageProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnail_url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const isEdit = mode === "edit";
  const isCreator = workspace === "creator";

  useEffect(() => {
    setThumbnailUrl(initial?.thumbnail_url ?? "");
    setDescription(initial?.description ?? "");
  }, [initial?.slug, initial?.thumbnail_url, initial?.description]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries());

    setPending(true);
    setMessage(null);

    if (isCreator) {
      const result = await postCreatorSubmission("video", entry as Record<string, unknown>);
      setPending(false);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage(
        result.data.message ??
          "Thanks — your video details were submitted for review. Nothing goes live until the team approves them.",
      );
      if (!isEdit) {
        event.currentTarget.reset();
        setThumbnailUrl("");
        setDescription("");
      }
      router.refresh();
      return;
    }

    const result = await postCmsEntry("video", entry);
    setPending(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    const slug = result.data.slug;
    setMessage(`${result.data.message ?? "Saved"}${slug ? ` (${slug})` : ""}`);

    if (!isEdit && slug) {
      router.push(`/studio/videos/edit/${encodeURIComponent(slug)}`);
    }
    router.refresh();
  }

  return (
    <section className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={isCreator ? "/creator/videos" : "/studio/videos"}
          className="text-sm font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
        >
          ← All videos
        </Link>
        <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">
          {isEdit ? "Edit video" : "New video"}
        </h2>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
          {message}
        </p>
      ) : null}

      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {isEdit ? <input type="hidden" name="original_slug" value={initial?.slug ?? ""} /> : null}
        <Field name="slug" label="Slug (optional)" defaultValue={initial?.slug ?? ""} />
        <Field name="title" label="Title" required defaultValue={initial?.title ?? ""} />
        <Field name="uploader" label="Uploader" defaultValue={initial?.uploader ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-neutral-700 dark:text-white/80">Description</span>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
            placeholder="Short summary shown in listings and cards"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-neutral-700 dark:text-white/80">Thumbnail</span>
          <input
            name="thumbnail_url"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
            placeholder="Image URL for cards and rails"
          />
          <StudioImageUploadButton onUploaded={setThumbnailUrl} buttonLabel="Upload thumbnail" />
        </label>
        <Field name="playback_id" label="Video player ID" defaultValue={initial?.playback_id ?? ""} />
        <StudioPublishDateField name="published_at" label="Publish date (optional)" defaultValue={initial?.published_at ?? ""} />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : isCreator
                ? "Submit for review"
                : "Create video"}
        </button>
      </form>
    </section>
  );
}
