"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Bookmark, Share2, Clock, ChevronRight } from "lucide-react";

import { useAppAuth } from "../../components/SupabaseAuthProvider";
import { DetailPageShell } from "../../components/detail/DetailPageShell";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";
import type { fullBlog } from "@/lib/interface";

type ToastState =
  | { open: false }
  | { open: true; message: string; variant: "success" | "info" | "error" };

function textFromPortableBody(body: unknown): string {
  if (!Array.isArray(body)) return "";
  let out = "";
  for (const block of body) {
    const b = block as { _type?: string; children?: Array<{ text?: string }> };
    if (b?._type === "block" && Array.isArray(b.children)) {
      for (const c of b.children) {
        if (typeof c.text === "string") out += `${c.text} `;
      }
    }
  }
  return out;
}

function estimateReadMinutesFromBody(body: unknown): number {
  const t = textFromPortableBody(body).trim();
  if (!t) return 1;
  const words = t.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.min(60, Math.round(words / 200) || 1));
}

const breadcrumbLinkClass =
  "inline-flex items-center text-sm font-medium text-amber-400/90 no-underline transition hover:text-amber-300/95 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-amber-500/50";

const proseLinkClass =
  "font-medium text-amber-400/90 underline decoration-amber-400/35 underline-offset-[3px] transition hover:text-amber-200 hover:decoration-amber-200/50";

export default function ArticleClient({ data }: { data: fullBlog }) {
  const { data: session, status } = useAppAuth();
  const [toast, setToast] = useState<ToastState>({ open: false });

  const coverSrc = useMemo(() => resolveContentImageSrc(data?.titleImageUrl), [data?.titleImageUrl]);
  const readMinutes = useMemo(() => estimateReadMinutesFromBody(data.body), [data.body]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      block: {
        h2: ({ children }) => (
          <h2 className="mt-10 scroll-mt-24 text-2xl font-semibold leading-snug tracking-tight text-white sm:text-[1.65rem]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 scroll-mt-24 text-xl font-semibold leading-snug text-white/95">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-6 text-lg font-semibold text-white/90">{children}</h4>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-[3px] border-amber-500/50 pl-5 text-lg leading-relaxed text-white/78">
            {children}
          </blockquote>
        ),
        normal: ({ children }) => (
          <p className="text-[1.05rem] leading-[1.75] text-white/[0.86] [&+p]:mt-4">{children}</p>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="my-4 list-outside list-disc space-y-2.5 pl-5 text-[1.05rem] leading-relaxed text-white/[0.86] marker:text-amber-400/80">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="my-4 list-outside list-decimal space-y-2.5 pl-5 text-[1.05rem] leading-relaxed text-white/[0.86] marker:font-medium marker:text-amber-400/90">
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="pl-1 [&>p]:m-0">{children}</li>,
        number: ({ children }) => <li className="pl-1 [&>p]:m-0">{children}</li>,
      },
      marks: {
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-white/90">{children}</em>,
        link: ({ value, children }) => {
          const href = value && typeof (value as { href?: string }).href === "string" ? (value as { href: string }).href : "#";
          const isExternal = /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              className={proseLinkClass}
              rel={isExternal ? "noopener noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {children}
            </a>
          );
        },
        underline: ({ children }) => <span className="underline decoration-white/30 underline-offset-2">{children}</span>,
        code: ({ children }) => (
          <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-amber-100/95">
            {children}
          </code>
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
      if (!res.ok) throw new Error("Failed to save the article.");
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
          text: "Check out this story on Culturin.",
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
      <DetailPageShell contentMaxClassName="max-w-2xl sm:max-w-2xl">
        <nav
          className="flex min-w-0 items-center gap-0.5 text-sm text-white/40"
          aria-label="Breadcrumb"
        >
          <Link href="/" className={breadcrumbLinkClass}>
            Home
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/25" aria-hidden />
          <Link href="/articles" className={breadcrumbLinkClass}>
            Travel guides
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/25" aria-hidden />
          <span className="line-clamp-1 pl-0.5 text-sm font-medium text-white/50">{data.title}</span>
        </nav>

        <article
          className="flex flex-col gap-8 sm:gap-10"
          itemScope
          itemType="https://schema.org/Article"
        >
          <header className="flex flex-col gap-4 sm:gap-5">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/75">
              Travel guide
            </p>
            <h1
              className="m-0 text-[1.6rem] font-medium leading-tight tracking-tight text-white sm:text-[1.9rem] md:text-[2.1rem]"
              itemProp="headline"
            >
              {data.title}
            </h1>
            {data.summary ? (
              <p
                className="m-0 max-w-2xl text-base font-normal leading-relaxed text-[#9a9a9a] sm:text-lg"
                itemProp="description"
              >
                {data.summary}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400/75" aria-hidden />
                <span>{readMinutes} min read</span>
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline" aria-hidden />
              <span
                className="text-white/40"
                itemProp="publisher"
                itemScope
                itemType="https://schema.org/Organization"
              >
                <span itemProp="name">Culturin</span>
              </span>
            </div>
          </header>

          <div className="overflow-hidden rounded-3xl bg-neutral-950/80 ring-1 ring-white/[0.08]">
            <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
              <Image
                src={coverSrc}
                alt={data.title ? `${data.title} — cover` : "Article cover"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 42rem"
                priority
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                unoptimized={isBundledPlaceholderSrc(coverSrc)}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>

          <div
            className="mx-auto w-full max-w-[min(100%,38rem)] pt-2 [&>blockquote:first-child]:!mt-0 [&>h2:first-child]:!mt-0 [&>h3:first-child]:!mt-0 [&>h4:first-child]:!mt-0 [&>p:first-child]:!mt-0 [&>p+p]:mt-4 [&>ul:first-child]:!mt-0"
            itemProp="articleBody"
          >
            <PortableText value={data.body as PortableTextBlock[]} components={portableTextComponents} />
          </div>

          <div
            className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:mt-12"
            aria-label="Article actions"
          >
            <p className="m-0 text-sm font-medium text-white/40">Save or share this guide</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveArticle}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/35 hover:bg-white/12 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-px"
              >
                <Bookmark className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                Add to profile
              </button>
              <button
                type="button"
                onClick={handleShareArticle}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/35 hover:bg-white/12 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-px"
              >
                <Share2 className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                Share
              </button>
            </div>
          </div>
        </article>
      </DetailPageShell>

      {toast.open ? (
        <div
          role="status"
          aria-live="polite"
          data-variant={toast.variant}
          className={[
            "fixed bottom-6 left-1/2 z-[2000] w-[min(720px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border px-3.5 py-3 text-sm shadow-2xl",
            "border-white/12 bg-neutral-950/90 text-white backdrop-blur-sm",
            toast.variant === "success" ? "border-emerald-500/30" : "",
            toast.variant === "info" ? "border-amber-400/35" : "",
            toast.variant === "error" ? "border-rose-500/30" : "",
          ].join(" ")}
        >
          {toast.message}
        </div>
      ) : null}
    </>
  );
}
