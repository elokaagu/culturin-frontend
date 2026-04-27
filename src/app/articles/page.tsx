import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import SafeContentImage from "../components/SafeContentImage";
import SiteFooter from "../components/SiteFooter";
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
      className={[
        "group relative isolate block overflow-hidden rounded-2xl border no-underline transition",
        "border-neutral-200 bg-neutral-900 shadow-sm hover:border-neutral-300 hover:shadow-md",
        "dark:border-white/10 dark:shadow-none dark:hover:border-white/25",
      ].join(" ")}
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/95">
            Story
          </span>
          <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
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
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased dark:bg-black dark:text-white">
        {/* Masthead */}
        <div className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950/40">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-[calc(var(--header-offset)+1.5rem)] sm:px-6 sm:pb-12 sm:pt-[calc(var(--header-offset)+2rem)]">
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <Link
                href="/"
                className="font-medium text-amber-800 no-underline transition hover:underline dark:text-amber-300/95"
              >
                Home
              </Link>
              <span className="px-1.5 text-neutral-400 dark:text-white/35" aria-hidden>
                /
              </span>
              <span className="text-neutral-600 dark:text-white/65">Articles</span>
            </nav>

            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/45">
              Editorial
            </p>
            <h1 className="m-0 mt-3 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Articles
            </h1>
            <p className="m-0 mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-white/70 sm:text-lg">
              Long-form stories, place-based guides, and cultural reporting — updated as we publish.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/trending"
                className="inline-flex min-h-[40px] items-center rounded-full border border-neutral-300 bg-neutral-50 px-5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Trending
              </Link>
              <Link
                href="/travel-guides"
                className="inline-flex min-h-[40px] items-center rounded-full border border-transparent bg-neutral-900 px-5 text-sm font-semibold text-white no-underline transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Travel guides
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          {articles.length === 0 ? (
            <div
              className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-neutral-950/60"
              role="status"
            >
              <p className="m-0 text-lg text-neutral-700 dark:text-white/80">No articles yet.</p>
              <p className="m-0 mt-2 text-sm text-neutral-500 dark:text-white/55">
                Check back soon or browse trending for other content.
              </p>
              <Link
                href="/trending"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white no-underline dark:bg-white dark:text-neutral-950"
              >
                Go to trending
              </Link>
            </div>
          ) : (
            <section aria-labelledby="articles-all-heading">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-white/10">
                <h2 id="articles-all-heading" className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  All stories
                </h2>
                <p className="m-0 text-sm text-neutral-500 dark:text-white/55">
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
      <SiteFooter />
    </>
  );
}
