"use client";

import { useState } from "react";

type StudioManagerProps = {
  blogCount: number;
  videoCount: number;
  providerCount: number;
  email: string | null;
};

type EntryType = "blog" | "video" | "provider";

const tabClass =
  "rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10";
const tabActiveClass = "bg-neutral-900 text-white dark:bg-white dark:text-black";

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700 dark:text-white/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/15 dark:bg-black dark:text-white"
      />
    </label>
  );
}

export default function StudioManager({ blogCount, videoCount, providerCount, email }: StudioManagerProps) {
  const [active, setActive] = useState<EntryType>("blog");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(type: EntryType, event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = Object.fromEntries(formData.entries());

    setPending(true);
    setMessage(null);

    const response = await fetch("/api/studio/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, entry }),
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string; slug?: string };
    setPending(false);

    if (!response.ok) {
      setMessage(data.message ?? "Could not save entry.");
      return;
    }

    setMessage(`${data.message ?? "Saved"} (${data.slug ?? "no-slug"})`);
    event.currentTarget.reset();
  }

  return (
    <main className="min-h-dvh bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_24px_64px_-30px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-neutral-950/90 dark:shadow-[0_24px_64px_-30px_rgba(0,0,0,0.8)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Culturin Studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">CMS Management</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
            Signed in as {email ?? "unknown"}. Create or update CMS content from this admin panel.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Articles</p>
              <p className="mt-1 text-2xl font-semibold">{blogCount}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Videos</p>
              <p className="mt-1 text-2xl font-semibold">{videoCount}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-white/50">Providers</p>
              <p className="mt-1 text-2xl font-semibold">{providerCount}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => setActive("blog")} className={`${tabClass} ${active === "blog" ? tabActiveClass : ""}`}>
              Blog
            </button>
            <button type="button" onClick={() => setActive("video")} className={`${tabClass} ${active === "video" ? tabActiveClass : ""}`}>
              Video
            </button>
            <button type="button" onClick={() => setActive("provider")} className={`${tabClass} ${active === "provider" ? tabActiveClass : ""}`}>
              Provider
            </button>
          </div>

          {message ? (
            <p className="mt-4 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5">
              {message}
            </p>
          ) : null}

          {active === "blog" ? (
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => handleSubmit("blog", e)}>
              <Field name="slug" label="Slug (optional)" />
              <Field name="title" label="Title" required />
              <Field name="summary" label="Summary" />
              <Field name="title_image_url" label="Title Image URL" />
              <Field name="published_at" label="Published At (ISO, optional)" />
              <button
                type="submit"
                disabled={pending}
                className="sm:col-span-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {pending ? "Saving..." : "Save Blog Entry"}
              </button>
            </form>
          ) : null}

          {active === "video" ? (
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => handleSubmit("video", e)}>
              <Field name="slug" label="Slug (optional)" />
              <Field name="title" label="Title" required />
              <Field name="uploader" label="Uploader" />
              <Field name="description" label="Description" />
              <Field name="thumbnail_url" label="Thumbnail URL" />
              <Field name="playback_id" label="Playback ID" />
              <Field name="published_at" label="Published At (ISO, optional)" />
              <button
                type="submit"
                disabled={pending}
                className="sm:col-span-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {pending ? "Saving..." : "Save Video Entry"}
              </button>
            </form>
          ) : null}

          {active === "provider" ? (
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => handleSubmit("provider", e)}>
              <Field name="slug" label="Slug (optional)" />
              <Field name="name" label="Business Name" />
              <Field name="event_name" label="Event/Experience Name" required />
              <Field name="description" label="Description" />
              <Field name="location" label="Location" />
              <Field name="contact_email" label="Contact Email" type="email" />
              <Field name="contact_phone" label="Contact Phone" />
              <Field name="contact_website" label="Contact Website" />
              <Field name="banner_image_url" label="Banner Image URL" />
              <Field name="published_at" label="Published At (ISO, optional)" />
              <button
                type="submit"
                disabled={pending}
                className="sm:col-span-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {pending ? "Saving..." : "Save Provider Entry"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </main>
  );
}
