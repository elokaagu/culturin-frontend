"use client";

import { useState, type FormEvent } from "react";

import { Field } from "@/app/studio/_components/Field";
import { postCmsEntry } from "@/app/studio/_lib/postCmsEntry";

export function StudioProviderForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    event.currentTarget.reset();
  }

  return (
    <>
      {message ? (
        <p className="mt-4 max-w-3xl rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
          {message}
        </p>
      ) : null}
      <form className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <Field name="slug" label="Slug (optional)" />
        <Field name="name" label="Business name" />
        <Field name="event_name" label="Event / experience name" required />
        <Field name="description" label="Description" />
        <Field name="location" label="Location" />
        <Field name="contact_email" label="Contact email" type="email" />
        <Field name="contact_phone" label="Contact phone" />
        <Field name="contact_website" label="Contact website" />
        <Field name="banner_image_url" label="Banner image URL" />
        <Field name="published_at" label="Published at (ISO, optional)" />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : "Save provider entry"}
        </button>
      </form>
    </>
  );
}
