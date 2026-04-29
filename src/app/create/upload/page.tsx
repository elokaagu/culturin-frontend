"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../../components/Header";
import { useSupabaseAuth } from "../../components/SupabaseAuthProvider";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";
import { formatStorageUploadError } from "../../../lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "../../../lib/storageConstants";

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.+-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
}

export default function UploadPage() {
  const { supabase, user } = useSupabaseAuth();
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetOutcome = useCallback(() => {
    setPublicUrl(null);
    setMessage(null);
  }, []);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    setUploading(true);
    setMessage(null);
    const path = `${user.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error, data } = await supabase.storage
      .from(SUPABASE_PUBLIC_MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      setUploading(false);
      setMessage(formatStorageUploadError(error));
      return;
    }
    const { data: pub } = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET).getPublicUrl(data.path);
    setPublicUrl(pub.publicUrl);
    setUploading(false);
  };

  return (
    <>
      <Header />
      <main className="flex min-h-dvh flex-col bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 sm:px-6 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upload</h1>
            <p className="mt-2 text-sm text-neutral-500 sm:text-base">
              Add images to your library. You can share the link or use it across Culturin.
            </p>
          </header>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFileChange}
          />

          <section
            aria-labelledby="upload-panel-title"
            className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 shadow-lg shadow-black/30"
          >
            <h2 id="upload-panel-title" className="sr-only">
              Image upload
            </h2>

            {user && supabase ? (
              <div className="flex flex-col gap-5">
                <p className="text-xs text-neutral-500">
                  Images are saved to your account and can be opened or shared from here.
                </p>
                <button
                  type="button"
                  disabled={uploading}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black shadow transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Choose an image"}
                </button>
              </div>
            ) : !supabase ? (
              <p className="text-sm text-amber-500">
                Uploads aren&apos;t available in this preview. Try again later or contact support if this persists.
              </p>
            ) : (
              <p className="text-sm text-neutral-300">
                Sign in to upload.{" "}
                <Link href="/login" className="font-medium text-amber-400 underline-offset-2 hover:underline">
                  Log in
                </Link>
              </p>
            )}

            {message ? (
              <p className="mt-4 text-sm text-red-400" role="alert">
                {message}
              </p>
            ) : null}

            {publicUrl ? (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-100/80 p-3 dark:border-white/10 dark:bg-black/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-emerald-400">Upload complete</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-white hover:underline"
                    onClick={resetOutcome}
                  >
                    Clear
                  </button>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
                  <Image
                    src={publicUrl}
                    alt="Uploaded image preview"
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 28rem"
                  />
                </div>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-400 underline-offset-2 hover:text-amber-300"
                >
                  View full image
                </a>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
