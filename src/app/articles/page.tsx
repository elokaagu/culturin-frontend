import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
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
import { travelGuideCategories } from "../../lib/travelGuidesCategories";

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

  return (
    <Link
      href={`/articles/${article.currentSlug}`}
      className={[
        "group flex flex-col overflow-hidden rounded-2xl border no-underline transition",
        "border-neutral-200 bg-white shadow-sm hover:border-neutral-300 hover:shadow-md",
        "dark:border-white/10 dark:bg-neutral-950/80 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-neutral-950",
      ].join(" ")}
    >
      <div
        className={[
          "relative w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900",
          variant === "compact" ? "aspect-[16/10]" : "aspect-[4/3] sm:aspect-[16/10]",
        ].join(" ")}
      >
        <Image
          src={src}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          unoptimized={cmsImageUnoptimized(src)}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 dark:from-black/60"
          aria-hidden
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400/90">
          Story
        </span>
        <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-snug tracking-tight text-neutral-900 dark:text-white sm:text-xl">
          {article.title}
        </h3>
        {summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-white/70">{summary}</p>
        ) : null}
        <span className="mt-auto pt-4 text-xs font-medium text-neutral-500 group-hover:text-neutral-800 dark:text-white/50 dark:group-hover:text-white/80">
          Read article →
        </span>
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  const db = getCmsDbOrNull();
  const cmsArticles = db ? await listBlogs(db) : [];
  const rawArticles: simpleBlogCard[] = cmsArticles.length > 0 ? cmsArticles : getShowcaseBlogCards();
  const articles = rawArticles.filter(hasValidArticleSlug);
  const [featured, ...rest] = articles;
  const featuredHeroSrc = featured ? resolveContentImageSrc(featured.titleImageUrl) : "";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-black dark:text-white">
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
                href={travelGuideCategories[0]?.href ?? "/trending"}
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
            <>
              {featured ? (
                <section className="mb-14 sm:mb-16" aria-labelledby="articles-featured-heading">
                  <h2 id="articles-featured-heading" className="sr-only">
                    Featured article
                  </h2>
                  <Link
                    href={`/articles/${featured.currentSlug}`}
                    className="group grid overflow-hidden rounded-3xl border border-neutral-200 bg-white no-underline shadow-[0_20px_60px_-24px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-neutral-950 dark:shadow-[0_24px_80px_-28px_rgba(0,0,0,0.65)] lg:grid-cols-[1.15fr_1fr]"
                  >
                    <div className="relative min-h-[14rem] overflow-hidden sm:min-h-[18rem] lg:min-h-[22rem]">
                      <Image
                        src={featuredHeroSrc}
                        alt={featured.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        priority
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={cmsImageUnoptimized(featuredHeroSrc)}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/55"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400/90">
                        Lead story
                      </p>
                      <h3 className="m-0 mt-3 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-3xl lg:text-[2.1rem] lg:leading-[1.12]">
                        {featured.title}
                      </h3>
                      {(featured.summary || "").trim() ? (
                        <p className="m-0 mt-4 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-white/75">
                          {featured.summary}
                        </p>
                      ) : null}
                      <span className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 transition group-hover:decoration-neutral-900 dark:text-white dark:decoration-white/40 dark:group-hover:decoration-white">
                        Continue reading
                      </span>
                    </div>
                  </Link>
                </section>
              ) : null}

              {rest.length > 0 ? (
                <section aria-labelledby="articles-all-heading">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-white/10">
                    <h2 id="articles-all-heading" className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                      All stories
                    </h2>
                    <p className="m-0 text-sm text-neutral-500 dark:text-white/55">{rest.length} more</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {rest.map((article, index) => (
                      <ArticleCard key={article.currentSlug} article={article} variant={index % 3 === 0 ? "standard" : "compact"} />
                    ))}
                  </div>
                </section>
              ) : featured ? (
                <p className="m-0 text-center text-sm text-neutral-500 dark:text-white/55">More articles coming soon.</p>
              ) : null}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
