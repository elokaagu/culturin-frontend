"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Bookmark, Share2, Clock } from "lucide-react";

import { SaveFavoriteModal } from "../../components/detail/SaveFavoriteModal";
import { ShareLinkModal } from "../../components/detail/ShareLinkModal";
import { useAppAuth } from "../../components/SupabaseAuthProvider";
import IslandNav from "../../components/IslandNav";
import HomeFooter from "../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "../../components/SafeContentImage";
import { appPageContainerClass } from "@/lib/appLayout";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";
import type { curatorCard, fullBlog } from "@/lib/interface";

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

const proseLinkClass = "font-medium underline underline-offset-[3px] transition hover:opacity-80";
const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default function ArticleClient({ data, curator }: { data: fullBlog; curator?: curatorCard | null }) {
  const pathname = usePathname();
  const { data: session, status } = useAppAuth();
  const [toast, setToast] = useState<ToastState>({ open: false });
  const [activeModal, setActiveModal] = useState<"share" | "save" | null>(null);
  const [pageUrl, setPageUrl] = useState("");
  const [savePending, setSavePending] = useState(false);

  const coverSrc = useMemo(() => resolveContentImageSrc(data?.titleImageUrl), [data?.titleImageUrl]);
  const readMinutes = useMemo(() => estimateReadMinutesFromBody(data.body), [data.body]);
  const isSignedIn = status === "authenticated" && Boolean(session?.user);

  useEffect(() => {
    if (!isSignedIn) setActiveModal(null);
  }, [isSignedIn]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      block: {
        h2: ({ children }) => (
          <h2 className="mt-10 scroll-mt-24 text-3xl font-medium leading-tight tracking-tight sm:text-[2.2rem]" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 scroll-mt-24 text-2xl font-medium leading-snug" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-6 text-lg font-semibold" style={{ color: "var(--c-ink)" }}>{children}</h4>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-[3px] pl-5 text-lg leading-relaxed" style={{ borderColor: "var(--c-accent)", color: "var(--c-muted)" }}>
            {children}
          </blockquote>
        ),
        normal: ({ children }) => (
          <p className="text-[1.05rem] leading-[1.75] [&+p]:mt-4" style={{ color: "var(--c-ink)" }}>
            {children}
          </p>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="my-4 list-outside list-disc space-y-2.5 pl-5 text-[1.05rem] leading-relaxed" style={{ color: "var(--c-ink)" }}>
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="my-4 list-outside list-decimal space-y-2.5 pl-5 text-[1.05rem] leading-relaxed" style={{ color: "var(--c-ink)" }}>
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
          <strong className="font-semibold" style={{ color: "var(--c-ink)" }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic" style={{ color: "var(--c-ink)" }}>{children}</em>
        ),
        link: ({ value, children }) => {
          const href = value && typeof (value as { href?: string }).href === "string" ? (value as { href: string }).href : "#";
          const isExternal = /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              className={proseLinkClass}
              style={{ color: "var(--c-accent)" }}
              rel={isExternal ? "noopener noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {children}
            </a>
          );
        },
        underline: ({ children }) => (
          <span className="underline underline-offset-2" style={{ color: "var(--c-ink)" }}>{children}</span>
        ),
        code: ({ children }) => (
          <code className="rounded-md px-1.5 py-0.5 font-mono text-[0.9em]" style={{ background: "rgba(28,26,23,0.08)", color: "var(--c-accent)" }}>
            {children}
          </code>
        ),
        "strike-through": ({ children }) => (
          <s className="line-through" style={{ color: "var(--c-muted)" }}>
            {children}
          </s>
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
    if (status === "loading" || status !== "authenticated" || !session?.user) return;
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    setActiveModal("share");
  };

  const openSaveModal = () => {
    if (status === "loading" || status !== "authenticated" || !session?.user) return;
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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh antialiased">
        <article itemScope itemType="https://schema.org/Article">
          <div className={appPageContainerClass}>
            <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8 pb-10 sm:gap-10 sm:pb-12" style={{ paddingTop: "8rem" }}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-white/10">
                <SafeContentImage
                  src={coverSrc}
                  alt={data.title ? `${data.title} — cover` : "Article cover"}
                  className="object-cover"
                  sizes="(max-width: 736px) 100vw, 736px"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(coverSrc) || cmsImageUnoptimized(coverSrc)}
                />
              </div>

              <header className="flex flex-col gap-4">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-accent)" }}>
                  Story
                </p>
                <h1
                  className="m-0 text-[2rem] font-medium leading-[1.04] tracking-tight sm:text-[2.7rem]"
                  style={{ ...displayFont, color: "var(--c-ink)" }}
                  itemProp="headline"
                >
                  {data.title}
                </h1>
                {data.summary ? (
                  <p
                    className="m-0 max-w-3xl text-lg font-normal leading-relaxed"
                    style={{ color: "var(--c-muted)" }}
                    itemProp="description"
                  >
                    {data.summary}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: "var(--c-muted)" }}>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" style={{ color: "var(--c-accent)" }} aria-hidden />
                    <span>{readMinutes} min read</span>
                  </span>
                  <span className="hidden h-1 w-1 rounded-full sm:inline" style={{ background: "var(--c-rule)" }} aria-hidden />
                  {curator ? (
                    <a
                      href={`/curators/${curator.slug}`}
                      className="transition hover:opacity-80"
                      style={{ color: "var(--c-accent)" }}
                      itemProp="publisher"
                    >
                      {curator.name}
                    </a>
                  ) : (
                    <span
                      style={{ color: "var(--c-muted)" }}
                      itemProp="publisher"
                      itemScope
                      itemType="https://schema.org/Organization"
                    >
                      <span itemProp="name">Culturin</span>
                    </span>
                  )}
                </div>
              </header>

              <div className="border-t pt-8" style={{ borderColor: "var(--c-rule)" }} itemProp="articleBody">
                <PortableText value={data.body as PortableTextBlock[]} components={portableTextComponents} />
              </div>

              {curator ? (
                <div className="mt-2 rounded-2xl border p-5" style={{ borderColor: "var(--c-rule)" }}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-muted)" }}>
                    Featured in
                  </p>
                  <div className="flex items-start gap-4">
                    {curator.avatarUrl ? (
                      <img
                        src={curator.avatarUrl}
                        alt={curator.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                        style={{ boxShadow: "0 0 0 1px var(--c-rule)" }}
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <a
                        href={`/curators/${curator.slug}`}
                        className="font-semibold no-underline transition hover:opacity-80"
                        style={{ color: "var(--c-ink)" }}
                      >
                        {curator.name}
                      </a>
                      {curator.tagline ? (
                        <p className="mt-0.5 text-sm" style={{ color: "var(--c-muted)" }}>{curator.tagline}</p>
                      ) : null}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <a
                          href={`/curators/${curator.slug}`}
                          className="inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-medium no-underline transition hover:opacity-80"
                          style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                        >
                          See all from {curator.name}
                        </a>
                        {curator.websiteUrl ? (
                          <a
                            href={curator.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-medium no-underline transition hover:opacity-80"
                            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                          >
                            Visit website ↗
                          </a>
                        ) : null}
                        {curator.instagramUrl ? (
                          <a
                            href={curator.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-medium no-underline transition hover:opacity-80"
                            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                          >
                            Instagram ↗
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {isSignedIn ? (
                <div className="mt-8 flex flex-col gap-4 border-t pt-7 sm:mt-10" style={{ borderColor: "var(--c-rule)" }} aria-label="Article actions">
                  <p className="m-0 text-sm font-medium" style={{ color: "var(--c-muted)" }}>
                    Save or share this guide
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={openSaveModal}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-80 active:translate-y-px"
                      style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                    >
                      <Bookmark className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                      Add to profile
                    </button>
                    <button
                      type="button"
                      onClick={openShareModal}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-80 active:translate-y-px"
                      style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                    >
                      <Share2 className="h-4 w-4 opacity-80" strokeWidth={2.25} aria-hidden />
                      Share
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </main>
      <HomeFooter />

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
              Add{" "}
              <span className="font-medium text-neutral-900 dark:text-white/90">&ldquo;{data.title}&rdquo;</span> to your saved
              articles so you can return to it from your profile.
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
            "fixed bottom-6 left-1/2 z-[2000] w-[min(720px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border px-3.5 py-3 text-sm shadow-2xl backdrop-blur-sm",
            toast.variant === "success" ? "border-emerald-500/30" : "",
            toast.variant === "info" ? "border-amber-500/40" : "",
            toast.variant === "error" ? "border-rose-500/30" : "",
          ].join(" ")}
          style={{ background: "var(--c-bg)", color: "var(--c-ink)" }}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
