"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Header from "../../components/Header";
import { useAppAuth } from "../../components/SupabaseAuthProvider";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";
import type { fullBlog } from "@/lib/interface";

type ToastState =
  | { open: false }
  | { open: true; message: string; variant: "success" | "info" | "error" };

export default function ArticleClient({ data }: { data: fullBlog }) {
  const { data: session, status } = useAppAuth();
  const [toast, setToast] = useState<ToastState>({ open: false });

  const coverSrc = useMemo(() => resolveContentImageSrc(data?.titleImageUrl), [data?.titleImageUrl]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      block: {
        h2: ({ children }) => (
          <h2 className="mt-6 text-[22px] font-semibold leading-snug text-neutral-900 dark:text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 text-lg font-semibold leading-snug text-neutral-800 dark:text-white/90">
            {children}
          </h3>
        ),
        normal: ({ children }) => (
          <p className="text-base leading-relaxed text-neutral-700 dark:text-white/85">{children}</p>
        ),
      },
    }),
    []
  );

  const showToast = (next: Omit<Extract<ToastState, { open: true }>, "open">) => {
    setToast({ open: true, ...next });
    window.setTimeout(() => setToast({ open: false }), 3000);
  };

  const handleSaveArticle = async () => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user) {
      showToast({
        variant: "error",
        message: "Sign in to save articles to your profile.",
      });
      return;
    }

    try {
      const res = await fetch("/api/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: data._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to save the article.");
      }

      showToast({ variant: "success", message: "Saved to your profile." });
    } catch (error) {
      console.error("Error saving article:", error);
      showToast({ variant: "error", message: "Could not save this article." });
    }
  };

  const handleShareArticle = async () => {
    const articleUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: "Check out this article on Culturin.",
          url: articleUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(articleUrl);
      showToast({ variant: "info", message: "Link copied to clipboard." });
    } catch (error) {
      console.error("Error sharing article:", error);
      showToast({ variant: "error", message: "Could not share or copy link." });
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-center bg-neutral-50 px-5 pb-12 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="flex w-full max-w-3xl flex-col gap-6">
          <article>
            <header>
              <h1 className="max-w-prose text-3xl font-semibold leading-tight text-neutral-950 dark:text-inherit sm:text-4xl">
                {data.title}
              </h1>
              {data.summary ? (
                <p className="mt-3 max-w-prose text-base text-neutral-700 sm:text-lg dark:text-white/90">
                  {data.summary}
                </p>
              ) : null}
            </header>

            <div className="w-full">
              <Image
                src={coverSrc}
                alt={data.title ? `${data.title} cover image` : "Article cover image"}
                width={980}
                height={560}
                sizes="(max-width: 900px) 100vw, 900px"
                loading="lazy"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                className="h-auto w-full rounded-2xl object-cover"
                unoptimized={isBundledPlaceholderSrc(coverSrc)}
              />
            </div>

            <div className="flex flex-col gap-3.5">
              <PortableText
                value={data.body as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>

            <div
              className="flex flex-wrap gap-3 pt-2"
              aria-label="Article actions"
            >
              <button
                type="button"
                onClick={handleSaveArticle}
                className="rounded-lg bg-white px-3.5 py-2 text-sm font-bold text-black transition-colors hover:bg-neutral-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                Add to profile
              </button>
              <button
                type="button"
                onClick={handleShareArticle}
                className="rounded-lg bg-white px-3.5 py-2 text-sm font-bold text-black transition-colors hover:bg-neutral-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                Share article
              </button>
            </div>
          </article>
        </div>
      </main>

      {toast.open ? (
        <div
          role="status"
          aria-live="polite"
          data-variant={toast.variant}
          className={[
            "fixed bottom-6 left-1/2 z-[2000] w-[min(720px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border px-3.5 py-3 text-sm shadow-2xl",
            "border-neutral-200 bg-white/95 text-neutral-900 shadow-lg dark:border-white/10 dark:bg-neutral-950/90 dark:text-white dark:shadow-2xl",
            toast.variant === "success" ? "border-emerald-400/35" : "",
            toast.variant === "info" ? "border-amber-300/35" : "",
            toast.variant === "error" ? "border-rose-400/35" : "",
          ].join(" ")}
        >
          {toast.message}
        </div>
      ) : null}
    </>
  );
}
