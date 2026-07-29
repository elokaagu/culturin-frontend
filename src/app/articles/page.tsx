import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "../components/SafeContentImage";
import { getShowcaseBlogCards } from "../../lib/cms/showcaseContent";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listBlogs } from "../../lib/cms/queries";
import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import { filterPublicBlogs } from "@/lib/cms/blockedFromSite";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

function hasValidArticleSlug(article: simpleBlogCard): boolean {
  return typeof article.currentSlug === "string" && article.currentSlug.trim().length > 0;
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Articles | Culturin",
    description:
      "Editorial travel stories, city guides, and cultural perspectives from Culturin — read every article in one place.",
  };
}

function ArticleCard({
  article,
  variant,
}: {
  article: simpleBlogCard;
  variant: "compact" | "standard";
}) {
  const src = resolveContentImageSrc(article.titleImageUrl);
  const summary = (article.summary || "").trim();
  const frameClass =
    variant === "compact"
      ? "min-h-[17rem] aspect-[3/4] sm:min-h-[19rem] sm:aspect-[2/3]"
      : "min-h-[19rem] aspect-[3/4] sm:min-h-[21rem] sm:aspect-[2/3] lg:aspect-[3/4]";

  return (
    <Link
      href={`/articles/${article.currentSlug}`}
      className="group relative isolate block overflow-hidden rounded-2xl border no-underline transition"
      style={{ borderColor: "var(--c-rule)" }}
    >
      <div className={["relative w-full overflow-hidden bg-neutral-900", frameClass].join(" ")}>
        <SafeContentImage
          src={src}
          alt={article.title}
          className="z-0 object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          unoptimized={cmsImageUnoptimized(src)}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/95 via-black/70 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 sm:p-5 sm:pt-14 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#f0ab85" }}>
            Story
          </span>
          <h3 className="mt-2 line-clamp-3 text-lg font-medium leading-snug tracking-tight text-white sm:text-xl" style={displayFont}>
            {article.title}
          </h3>
          {summary ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/95">
              {summary}
            </p>
          ) : null}
          <span className="mt-3 text-xs font-semibold text-white underline decoration-white/50 underline-offset-2 transition group-hover:decoration-white/90">
            Read article →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  const db = getCmsDbOrNull();
  const cmsArticles = db ? await listBlogs(db) : [];
  const rawArticles: simpleBlogCard[] = cmsArticles.length > 0 ? cmsArticles : getShowcaseBlogCards();
  const articles = filterPublicBlogs(rawArticles.filter(hasValidArticleSlug));

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh antialiased">
        {/* Masthead */}
        <div className="border-b" style={{ borderColor: "var(--c-rule)" }}>
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-32 sm:px-6 sm:pb-12">
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="font-medium no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
                Home
              </Link>
              <span className="px-1.5" style={{ color: "var(--c-muted)" }} aria-hidden>
                /
              </span>
              <span style={{ color: "var(--c-muted)" }}>Articles</span>
            </nav>

            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-muted)" }}>
              Editorial
            </p>
            <h1 className="m-0 mt-3 max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Articles
            </h1>
            <p className="m-0 mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
              Long-form stories, place-based guides, and cultural reporting — updated as we publish.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/trending"
                className="inline-flex min-h-[40px] items-center rounded-full border px-5 text-sm font-semibold no-underline transition hover:opacity-80"
                style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
              >
                Trending
              </Link>
              <Link
                href="/travel-guides"
                className="inline-flex min-h-[40px] items-center rounded-full px-5 text-sm font-semibold text-white no-underline transition hover:opacity-90"
                style={{ background: "var(--c-accent)" }}
              >
                Travel guides
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          {articles.length === 0 ? (
            <div className="rounded-2xl border px-6 py-16 text-center" style={{ borderColor: "var(--c-rule)" }} role="status">
              <p className="m-0 text-lg" style={{ color: "var(--c-ink)" }}>No articles yet.</p>
              <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
                Check back soon or browse trending for other content.
              </p>
              <Link
                href="/trending"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-semibold text-white no-underline"
                style={{ background: "var(--c-accent)" }}
              >
                Go to trending
              </Link>
            </div>
          ) : (
            <section aria-labelledby="articles-all-heading">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--c-rule)" }}>
                <h2 id="articles-all-heading" className="m-0 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
                  All stories
                </h2>
                <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>
                  {articles.length} {articles.length === 1 ? "article" : "articles"}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.currentSlug}
                    article={article}
                    variant={index % 3 === 0 ? "standard" : "compact"}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
