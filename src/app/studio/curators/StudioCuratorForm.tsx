"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { StudioPublishDateField } from "@/app/studio/_components/StudioPublishDateField";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

export type CuratorFormInitial = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  instagram_url: string;
  shop_url: string;
  avatar_url: string;
  banner_url: string;
  specialties: string;
  published_at: string;
};

export function StudioCuratorForm({
  initial,
  onSaved,
}: {
  initial?: CuratorFormInitial | null;
  onSaved?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(initial?.banner_url ?? "");
  const isEditing = Boolean(initial?.slug);

  useEffect(() => {
    setAvatarUrl(initial?.avatar_url ?? "");
    setBannerUrl(initial?.banner_url ?? "");
  }, [initial?.slug, initial?.avatar_url, initial?.banner_url]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries()) as Record<string, unknown>;
    setPending(true);
    setMessage(null);

    const result = await postCmsEntry("curator", entry);
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
    <section id="curator-form">
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">
          {isEditing ? "Edit curator" : "Create curator"}
        </h2>
        {isEditing ? (
          <Link
            href="/studio/curators"
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
        <Field name="name" label="Name" required defaultValue={initial?.name ?? ""} />
        <Field name="tagline" label="Tagline" defaultValue={initial?.tagline ?? ""} />
        <Field name="description" label="Description" defaultValue={initial?.description ?? ""} />
        <Field name="website_url" label="Website URL" defaultValue={initial?.website_url ?? ""} />
        <Field name="instagram_url" label="Instagram URL" defaultValue={initial?.instagram_url ?? ""} />
        <Field name="shop_url" label="Shop URL" defaultValue={initial?.shop_url ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Avatar image URL</span>
          <input
            name="avatar_url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
          />
          <StudioImageUploadButton onUploaded={setAvatarUrl} buttonLabel="Upload avatar image" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Banner image URL</span>
          <input
            name="banner_url"
            value={bannerUrl}
            onChange={(event) => setBannerUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
          />
          <StudioImageUploadButton onUploaded={setBannerUrl} buttonLabel="Upload banner image" />
        </label>
        <Field name="specialties" label="Specialties (comma-separated)" defaultValue={initial?.specialties ?? ""} />
        <StudioPublishDateField name="published_at" label="Publish date (optional)" defaultValue={initial?.published_at ?? ""} />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : isEditing ? "Save changes" : "Save entry"}
        </button>
      </form>
    </section>
  );
}
