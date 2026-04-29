"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

export type ProviderFormInitial = {
  slug: string;
  name: string;
  event_name: string;
  description: string;
  location: string;
  avatar_image_url: string;
  languages: string;
  specialties: string;
  contact_email: string;
  contact_phone: string;
  contact_website: string;
  banner_image_url: string;
  published_at: string;
};

export function StudioProviderForm({
  initial,
  onSaved,
}: {
  initial?: ProviderFormInitial | null;
  onSaved?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarImageUrl, setAvatarImageUrl] = useState(initial?.avatar_image_url ?? "");
  const [bannerImageUrl, setBannerImageUrl] = useState(initial?.banner_image_url ?? "");
  const isEditing = Boolean(initial?.slug);

  useEffect(() => {
    setAvatarImageUrl(initial?.avatar_image_url ?? "");
    setBannerImageUrl(initial?.banner_image_url ?? "");
  }, [initial?.slug, initial?.avatar_image_url, initial?.banner_image_url]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries());
    setPending(true);
    setMessage(null);
    const result = await postCmsEntry("provider", entry);
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
    <section id="provider-form">
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">
          {isEditing ? "Edit provider/experience" : "Create provider/experience"}
        </h2>
        {isEditing ? (
          <Link
            href="/studio/providers"
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
        <Field name="name" label="Business name" defaultValue={initial?.name ?? ""} />
        <Field name="event_name" label="Event / experience name" required defaultValue={initial?.event_name ?? ""} />
        <Field name="description" label="Description" defaultValue={initial?.description ?? ""} />
        <Field name="location" label="Location" defaultValue={initial?.location ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Avatar image URL</span>
          <input
            name="avatar_image_url"
            value={avatarImageUrl}
            onChange={(event) => setAvatarImageUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
          />
          <StudioImageUploadButton onUploaded={setAvatarImageUrl} buttonLabel="Upload avatar image" />
        </label>
        <Field name="languages" label="Languages (comma-separated)" defaultValue={initial?.languages ?? ""} />
        <Field name="specialties" label="Specialties (comma-separated)" defaultValue={initial?.specialties ?? ""} />
        <Field name="contact_email" label="Contact email" type="email" defaultValue={initial?.contact_email ?? ""} />
        <Field name="contact_phone" label="Contact phone" defaultValue={initial?.contact_phone ?? ""} />
        <Field name="contact_website" label="Contact website" defaultValue={initial?.contact_website ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700 dark:text-white/80">Banner image URL</span>
          <input
            name="banner_image_url"
            value={bannerImageUrl}
            onChange={(event) => setBannerImageUrl(event.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
          />
          <StudioImageUploadButton onUploaded={setBannerImageUrl} buttonLabel="Upload banner image" />
        </label>
        <Field name="published_at" label="Publish date (optional)" defaultValue={initial?.published_at ?? ""} />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : isEditing ? "Save provider changes" : "Save provider entry"}
        </button>
      </form>
    </section>
  );
}
