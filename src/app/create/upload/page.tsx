"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

import IslandNav from "../../components/IslandNav";
import HomeFooter from "../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { useSupabaseAuth } from "../../components/SupabaseAuthProvider";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";
import { formatStorageUploadError } from "../../../lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "../../../lib/storageConstants";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="flex min-h-dvh flex-col px-4 pb-16 sm:px-6" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>Upload</h1>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--c-muted)" }}>
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
            className="rounded-2xl p-6"
            style={{ background: "#1c1a17", color: "#f1e9dc" }}
          >
            <h2 id="upload-panel-title" className="sr-only">
              Image upload
            </h2>

            {user && supabase ? (
              <div className="flex flex-col gap-5">
                <p className="text-xs text-white/60">
                  Images are saved to your account and can be opened or shared from here.
                </p>
                <button
                  type="button"
                  disabled={uploading}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "#e08a5b", color: "#1c1a17" }}
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Choose an image"}
                </button>
              </div>
            ) : !supabase ? (
              <p className="text-sm" style={{ color: "#e08a5b" }}>
                Uploads aren&apos;t available in this preview. Try again later or contact support if this persists.
              </p>
            ) : (
              <p className="text-sm text-white/75">
                Sign in to upload.{" "}
                <Link href="/login" className="font-medium underline-offset-2 hover:underline" style={{ color: "#e08a5b" }}>
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
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-emerald-400">Upload complete</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-white/60 underline-offset-2 hover:text-white hover:underline"
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
                  className="text-sm font-medium underline-offset-2 hover:opacity-80"
                  style={{ color: "#e08a5b" }}
                >
                  View full image
                </a>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
