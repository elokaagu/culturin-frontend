"use client";

import { useState, type FormEvent } from "react";
import { Link } from "next-view-transitions";

import { Field } from "@/app/studio/_components/Field";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

type ProviderFormInitial = {
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

export function StudioProviderForm({ initial }: { initial?: ProviderFormInitial | null }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isEditing = Boolean(initial?.slug);

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
        <Field name="avatar_image_url" label="Avatar image URL" defaultValue={initial?.avatar_image_url ?? ""} />
        <Field name="languages" label="Languages (comma-separated)" defaultValue={initial?.languages ?? ""} />
        <Field name="specialties" label="Specialties (comma-separated)" defaultValue={initial?.specialties ?? ""} />
        <Field name="contact_email" label="Contact email" type="email" defaultValue={initial?.contact_email ?? ""} />
        <Field name="contact_phone" label="Contact phone" defaultValue={initial?.contact_phone ?? ""} />
        <Field name="contact_website" label="Contact website" defaultValue={initial?.contact_website ?? ""} />
        <Field name="banner_image_url" label="Banner image URL" defaultValue={initial?.banner_image_url ?? ""} />
        <Field name="published_at" label="Published at (ISO, optional)" defaultValue={initial?.published_at ?? ""} />
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
