"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { StudioImageUploadButton } from "@/app/studio/_components/StudioImageUploadButton";

export type StudioSiteImageSlot = {
  key: string;
  label: string;
  src: string;
  alt: string;
  isCustomized: boolean;
};

function SlotCard({ slot, onSaved }: { slot: StudioSiteImageSlot; onSaved: () => void }) {
  const [src, setSrc] = useState(slot.src);
  const [alt, setAlt] = useState(slot.alt);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const dirty = src !== slot.src || alt !== slot.alt;

  async function handleSave() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/studio/site-images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_key: slot.key, src, alt }),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setPending(false);
    if (!response.ok) {
      setMessage(data.message ?? "Could not save this image.");
      return;
    }
    setMessage("Saved.");
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">{slot.label}</h3>
        {slot.isCustomized ? (
          <span className="rounded-full bg-culturin-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-culturin-800 dark:bg-culturin-400/15 dark:text-culturin-300">
            Customized
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || undefined}
          alt=""
          className="h-32 w-full shrink-0 rounded-xl border border-neutral-200 object-cover dark:border-white/10 sm:w-48"
        />
        <div className="flex flex-1 flex-col gap-3">
          <StudioImageUploadButton onUploaded={setSrc} buttonLabel="Replace photo" />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-neutral-700 dark:text-white/80">Alt text</span>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-culturin-400 dark:border-white/15 dark:bg-[#121212] dark:text-white"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || pending}
              className="inline-flex h-9 items-center rounded-full bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            {message ? <span className="text-xs text-neutral-500 dark:text-white/60">{message}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudioSiteImagesPageClient({
  slots,
  hasDb,
}: {
  slots: StudioSiteImageSlot[];
  hasDb: boolean;
}) {
  const router = useRouter();

  if (!hasDb) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
        Your content library isn&apos;t connected in this preview, so site images can&apos;t be edited yet.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {slots.map((slot) => (
        <SlotCard key={slot.key} slot={slot} onSaved={() => router.refresh()} />
      ))}
    </div>
  );
}
