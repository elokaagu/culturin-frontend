"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type ChangeEventHandler } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import type { GalleryTile } from "@/lib/communityGallery/types";
import {
  cmsImageUnoptimized,
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "@/lib/imagePlaceholder";
import { formatStorageUploadError } from "@/lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";
import { cn } from "@/lib/utils";

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.+-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
}

const MASONRY_ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[5/6]",
  "aspect-[2/3]",
  "aspect-[3/5]",
];

const kindLabel: Record<GalleryTile["kind"], string> = {
  blog: "Story",
  video: "Video",
  provider: "Experience",
  travel: "Community",
};

export default function CommunityGalleryClient({ initialTiles }: { initialTiles: GalleryTile[] }) {
  const router = useRouter();
  const { supabase, user } = useSupabaseAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setMessage(null);
    if (!file || !supabase || !user) {
      setMessage(!supabase || !user ? "Sign in to share a photo." : null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image (JPEG, PNG, WebP, or GIF).");
      return;
    }
    setUploading(true);
    const path = `${user.id}/community/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error, data } = await supabase.storage
      .from(SUPABASE_PUBLIC_MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      setMessage(formatStorageUploadError(error));
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET).getPublicUrl(data.path);
    setUploading(false);
    setPinning(true);
    try {
      const res = await fetch("/api/community/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: pub.publicUrl, title: title.trim() || null }),
      });
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setMessage(j.message ?? "Could not add your photo.");
        setPinning(false);
        return;
      }
      setTitle("");
      setMessage("Added to the gallery.");
      router.refresh();
    } catch {
      setMessage("Could not add your photo.");
    } finally {
      setPinning(false);
    }
  };

  const busy = uploading || pinning;

  const scrollToUpload = useCallback(() => {
    document.getElementById("community-share")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="w-full min-w-0">
      <section
        id="community-share"
        className="mb-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
      >
        <h2 className="m-0 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Share your travels
        </h2>
        <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/60">
          Upload a photo from your trip. It appears in this gallery for everyone alongside Culturin stories and videos.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-500 dark:text-white/45">Caption (optional)</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset in Lisbon"
              disabled={busy}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black dark:text-white"
            />
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFile}
          />
          <button
            type="button"
            disabled={busy || !user}
            onClick={() => fileRef.current?.click()}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            {busy ? (uploading ? "Uploading…" : "Publishing…") : "Add photo"}
          </button>
        </div>
        {!user ? (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-200/90">
            <Link href="/login?next=/community" className="font-medium underline-offset-2 hover:underline">
              Sign in
            </Link>{" "}
            to add images.
          </p>
        ) : null}
        {message ? (
          <p className="mt-3 text-sm text-neutral-600 dark:text-white/65" role="status">
            {message}
          </p>
        ) : null}
      </section>

      {initialTiles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
          No images yet. Check back soon for new stories and videos, or{" "}
          <button type="button" onClick={scrollToUpload} className="font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-300/90">
            share a travel photo
          </button>
          .
        </p>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5 [&>*]:break-inside-avoid">
          {initialTiles.map((tile, i) => {
            const src = resolveContentImageSrc(tile.imageUrl);
            const aspect = MASONRY_ASPECTS[i % MASONRY_ASPECTS.length];
            return (
              <article
                key={tile.id}
                id={tile.kind === "travel" ? tile.id : undefined}
                className="group mb-3 sm:mb-4"
              >
                <Link
                  href={tile.href}
                  className="block overflow-hidden rounded-2xl bg-neutral-200 ring-1 ring-black/5 transition hover:ring-amber-400/40 dark:bg-neutral-900 dark:ring-white/10"
                >
                  <div className={cn("relative w-full overflow-hidden", aspect)}>
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      unoptimized={
                        isBundledPlaceholderSrc(src) || cmsImageUnoptimized(src)
                      }
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
                        {kindLabel[tile.kind]}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-white">{tile.title}</p>
                      {tile.subtitle ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-white/75">{tile.subtitle}</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
