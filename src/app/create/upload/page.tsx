"use client";

import { useCallback, useState } from "react";
import type { CldUploadWidgetInfo } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

import Header from "../../components/Header";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";

function pickInfo(results: { info?: string | CldUploadWidgetInfo } | undefined): CldUploadWidgetInfo | null {
  const raw = results?.info;
  if (raw && typeof raw === "object" && "secure_url" in raw) {
    return raw;
  }
  return null;
}

function formatWidgetError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "statusText" in err) {
    const st = (err as { statusText?: string }).statusText;
    if (st) return st;
  }
  return "Upload failed. Please try again.";
}

export default function UploadPage() {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetOutcome = useCallback(() => {
    setSecureUrl(null);
    setPublicId(null);
    setMessage(null);
  }, []);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 sm:px-6 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upload</h1>
            <p className="mt-2 text-sm text-neutral-400 sm:text-base">Add an image to your collection.</p>
          </header>

          <section
            aria-labelledby="upload-panel-title"
            className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 shadow-lg shadow-black/30"
          >
            <h2 id="upload-panel-title" className="sr-only">
              Cloudinary image upload
            </h2>

            <CldUploadWidget
              uploadPreset="culturin"
              onSuccess={(results) => {
                setMessage(null);
                const info = pickInfo(results);
                if (info?.secure_url) {
                  setSecureUrl(info.secure_url);
                  setPublicId(info.public_id ?? null);
                }
              }}
              onError={(err) => {
                resetOutcome();
                setMessage(formatWidgetError(err));
              }}
            >
              {({ open, isLoading, error: widgetError }) => {
                const alertText = message ?? (widgetError ? formatWidgetError(widgetError) : null);

                return (
                  <div className="flex flex-col gap-5">
                    <button
                      type="button"
                      disabled={Boolean(isLoading)}
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black shadow transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => {
                        setMessage(null);
                        open();
                      }}
                    >
                      {isLoading ? "Opening upload…" : "Upload an image"}
                    </button>

                    {alertText ? (
                      <p className="text-sm text-red-400" role="alert">
                        {alertText}
                      </p>
                    ) : null}

                    {secureUrl ? (
                      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-100/80 p-3 dark:border-white/10 dark:bg-black/40">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-emerald-400">Upload complete</p>
                          <button
                            type="button"
                            className="text-xs font-medium text-neutral-400 underline-offset-2 hover:text-white hover:underline"
                            onClick={resetOutcome}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
                          <Image
                            src={secureUrl}
                            alt={publicId ? `Preview of ${publicId}` : "Uploaded image preview"}
                            fill
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, 28rem"
                          />
                        </div>
                        <a
                          href={secureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-amber-400 underline-offset-2 hover:text-amber-300"
                        >
                          Open full-size asset
                        </a>
                      </div>
                    ) : null}
                  </div>
                );
              }}
            </CldUploadWidget>
          </section>
        </div>
      </main>
    </>
  );
}
