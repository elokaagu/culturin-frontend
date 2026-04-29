"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import { postCreatorSubmission } from "@/app/creator/_lib/postCreatorSubmission";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";
import { emptyPortableTextBlocks } from "@/lib/portableText/tiptapHtmlBridge";

import { ArticleRichEditor, type ArticleRichEditorHandle } from "./ArticleRichEditor";

export type StudioArticleEditorInitial = {
  slug: string;
  title: string;
  summary: string;
  title_image_url: string;
  published_at: string;
  body: unknown;
};

type StudioArticleEditorPageProps = {
  mode: "create" | "edit";
  initial: StudioArticleEditorInitial | null;
  /** Creators submit for review; admins publish via CMS. */
  workspace?: "studio" | "creator";
};

export function StudioArticleEditorPage({ mode, initial, workspace = "studio" }: StudioArticleEditorPageProps) {
  const router = useRouter();
  const editorRef = useRef<ArticleRichEditorHandle>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [titleImageUrl, setTitleImageUrl] = useState(initial?.title_image_url ?? "");
  const [creatorDraftKey, setCreatorDraftKey] = useState(0);
  const isEdit = mode === "edit";
  const isCreator = workspace === "creator";

  const stableEmptyBody = useMemo(() => emptyPortableTextBlocks(), []);
  const editorBody = initial?.body ?? stableEmptyBody;
  const editorKey = isEdit ? `edit-${initial?.slug ?? ""}` : isCreator ? `create-${creatorDraftKey}` : "create";

  useEffect(() => {
    setTitleImageUrl(initial?.title_image_url ?? "");
  }, [initial?.slug, initial?.title_image_url]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry: Record<string, unknown> = Object.fromEntries(formData.entries());
    entry.body = editorRef.current?.getPortableBody() ?? emptyPortableTextBlocks();

    setPending(true);
    setMessage(null);

    if (isCreator) {
      const result = await postCreatorSubmission("blog", entry);
      setPending(false);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage(
        result.data.message ??
          "Thanks — your article was submitted for review. Nothing goes live until the team approves it.",
      );
      if (!isEdit) {
        event.currentTarget.reset();
        setTitleImageUrl("");
        setCreatorDraftKey((k) => k + 1);
      }
      router.refresh();
      return;
    }

    const result = await postCmsEntry("blog", entry);
    setPending(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    const slug = result.data.slug;
    setMessage(`${result.data.message ?? "Saved"}${slug ? ` (${slug})` : ""}`);

    if (!isEdit && slug) {
      router.push(`/studio/articles/edit/${encodeURIComponent(slug)}`);
    }
    router.refresh();
  }

  return (
    <section className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={isCreator ? "/creator/articles" : "/studio/articles"}
          className="text-sm font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
        >
          ← All articles
        </Link>
        <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">
          {isEdit ? "Edit article" : "New article"}
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
        <Field name="summary" label="Summary" defaultValue={initial?.summary ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-neutral-700 dark:text-white/80">Title image</span>
          <input
            name="title_image_url"
            value={titleImageUrl}
            onChange={(event) => setTitleImageUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
            placeholder="Image URL for the hero card and article header"
          />
          <StudioImageUploadButton onUploaded={setTitleImageUrl} buttonLabel="Upload title image" />
        </label>
        <Field name="published_at" label="Publish date (optional)" defaultValue={initial?.published_at ?? ""} />
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-white/80">Article body</p>
          <ArticleRichEditor key={editorKey} ref={editorRef} initialBody={editorBody} />
        </div>
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
                : "Create article"}
        </button>
      </form>
    </section>
  );
}
