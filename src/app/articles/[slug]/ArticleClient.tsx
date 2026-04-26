"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Bookmark, Share2, Clock } from "lucide-react";

import { SaveFavoriteModal } from "../../components/detail/SaveFavoriteModal";
import { ShareLinkModal } from "../../components/detail/ShareLinkModal";
import { useAppAuth } from "../../components/SupabaseAuthProvider";
import Header from "../../components/Header";
import { appPageContainerClass } from "@/lib/appLayout";
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

const proseLinkClass =
  "font-medium text-amber-400/90 underline decoration-amber-400/35 underline-offset-[3px] transition hover:text-amber-200 hover:decoration-amber-200/50";

export default function ArticleClient({ data }: { data: fullBlog }) {
  const pathname = usePathname();
  const { data: session, status } = useAppAuth();
  const [toast, setToast] = useState<ToastState>({ open: false });
  const [activeModal, setActiveModal] = useState<"share" | "save" | null>(null);
  const [pageUrl, setPageUrl] = useState("");
  const [savePending, setSavePending] = useState(false);

  const coverSrc = useMemo(() => resolveContentImageSrc(data?.titleImageUrl), [data?.titleImageUrl]);
  const readMinutes = useMemo(() => estimateReadMinutesFromBody(data.body), [data.body]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      block: {
        h2: ({ children }) => (
          <h2 className="mt-10 scroll-mt-24 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[2.2rem]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 scroll-mt-24 text-2xl font-semibold leading-snug text-white/95">
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

  const openShareModal = () => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    setActiveModal("share");
  };

  const openSaveModal = () => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    setActiveModal("save");
  };

  const performSaveArticle = async () => {
    if (status === "loading") return;
    if (status !== "authenticated" || !session?.user) {
      showToast({
        variant: "error",
        message: "Sign in to save articles to your profile.",
      });
      return;
    }
    setSavePending(true);
    try {
      const res = await fetch("/api/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: data._id }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        const errMsg =
          (typeof body.error === "string" && body.error) ||
          (typeof body.message === "string" && body.message) ||
          "Failed to save the article.";
        throw new Error(errMsg);
      }
      setActiveModal(null);
      showToast({ variant: "success", message: "Saved to your profile." });
    } catch (error) {
      console.error("Error saving article:", error);
      const message =
        error instanceof Error && error.message.trim()
          ? error.message.trim()
          : "Could not save this article.";
      showToast({ variant: "error", message });
    } finally {
      setSavePending(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-black text-white antialiased selection:bg-amber-500/30">
        <article itemScope itemType="https://schema.org/Article">
          <div className={appPageContainerClass}>
            <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8 pt-[calc(var(--header-offset)+1.5rem)] pb-10 sm:gap-10 sm:pt-[calc(var(--header-offset)+2rem)] sm:pb-12">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
                <Image
                  src={coverSrc}
                  alt={data.title ? `${data.title} — cover` : "Article cover"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 736px) 100vw, 736px"
                  priority
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(coverSrc)}
                />
              </div>

              <header className="flex flex-col gap-4">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/75">
                  Travel guide
                </p>
                <h1
                  className="m-0 text-[2rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-[2.7rem]"
                  itemProp="headline"
                >
                  {data.title}
                </h1>
                {data.summary ? (
                  <p
                    className="m-0 max-w-3xl text-lg font-normal leading-relaxed text-white/72"
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

              <div className="border-t border-white/10 pt-8" itemProp="articleBody">
                <PortableText value={data.body as PortableTextBlock[]} components={portableTextComponents} />
              </div>

              <div
                className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:mt-10"
                aria-label="Article actions"
              >
                <p className="m-0 text-sm font-medium text-white/40">Save or share this guide</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openSaveModal}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/35 hover:bg-white/12 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-px"
                  >
                    <Bookmark className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                    Add to profile
                  </button>
                  <button
                    type="button"
                    onClick={openShareModal}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/35 hover:bg-white/12 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-px"
                  >
                    <Share2 className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <ShareLinkModal
        open={activeModal === "share"}
        onClose={() => setActiveModal(null)}
        url={pageUrl}
        title={data.title}
      />
      <SaveFavoriteModal
        open={activeModal === "save"}
        onClose={() => setActiveModal(null)}
        title="Save guide"
        description={
          status === "authenticated" && session?.user ? (
            <>
              Add <span className="font-medium text-white/90">&ldquo;{data.title}&rdquo;</span> to your saved articles so you can
              return to it from your profile.
            </>
          ) : (
            <>Sign in to save Culturin guides to your profile and pick them up on any device.</>
          )
        }
        primaryAction={
          status === "authenticated" && session?.user
            ? { label: "Save to profile", onClick: performSaveArticle, pending: savePending }
            : undefined
        }
        loginHref={pathname ? `/login?next=${encodeURIComponent(pathname)}` : "/login"}
        onCopyLink={async () => {
          const u = pageUrl || (typeof window !== "undefined" ? window.location.href : "");
          if (u) await navigator.clipboard.writeText(u);
        }}
      />

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
