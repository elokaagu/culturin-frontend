import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import type { ReactNode } from "react";

import { appPageContainerClass } from "@/lib/appLayout";
import { textMatchesAllTokens, tokenizeSearchQuery } from "@/lib/searchTokenize";
import type { providerHeroCard, simpleBlogCard, videoCard } from "@/lib/interface";
import { destinationContentBySlug } from "@/lib/destinationContent";
import { destinations } from "@/lib/destinationsData";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { searchBlogs, searchProviders, searchVideos } from "../../lib/cms/queries";
import { filterPublicBlogs, filterPublicVideos } from "@/lib/cms/blockedFromSite";
import {
  getShowcaseBlogCards,
  getShowcaseProviderCards,
  getShowcaseVideoCards,
} from "../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  resolveContentImageSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";
import Header from "../components/Header";
import SafeContentImage from "../components/SafeContentImage";
import SiteFooter from "../components/SiteFooter";

export const revalidate = 120;

function normalizeQuery(query: string | undefined): string {
  return (query || "").trim().toLowerCase();
}

function filterFallbackBlogs(items: simpleBlogCard[], term: string) {
  if (!term) return items;
  const tokens = tokenizeSearchQuery(term);
  if (tokens.length === 0) return [];
  return items.filter((item) => {
    const blob = [item.title, item.summary, item.currentSlug].filter(Boolean).join(" ");
    return textMatchesAllTokens(blob, tokens);
  });
}

function filterFallbackVideos(items: videoCard[], term: string) {
  if (!term) return items;
  const tokens = tokenizeSearchQuery(term);
  if (tokens.length === 0) return [];
  return items.filter((item) => {
    const blob = [item.title, item.uploader, item.description, item.currentSlug].filter(Boolean).join(" ");
    return textMatchesAllTokens(blob, tokens);
  });
}

function filterFallbackProviders(items: providerHeroCard[], term: string) {
  if (!term) return items;
  const tokens = tokenizeSearchQuery(term);
  if (tokens.length === 0) return [];
  return items.filter((item) => {
    const blob = [item.name, item.eventName, item.slug].filter(Boolean).join(" ");
    return textMatchesAllTokens(blob, tokens);
  });
}

type DestinationHit = {
  name: string;
  slug: string;
  country?: string;
  imageUrl: string;
  imageAlt: string;
};

function searchDestinations(term: string): DestinationHit[] {
  if (!term) return [];
  const tokens = tokenizeSearchQuery(term);
  if (tokens.length === 0) return [];

  const score = (d: DestinationHit): number => {
    const base = [d.name, d.slug, d.country ?? ""].join(" ").toLowerCase();
    const content = destinationContentBySlug[d.slug];
    const rich = content
      ? [
          content.intro,
          content.vibe,
          content.bestTime,
          content.highlights.join(" "),
          content.neighborhoods.join(" "),
          content.foodToTry.join(" "),
          content.localTips.join(" "),
        ]
          .join(" ")
          .toLowerCase()
      : "";

    let s = 0;
    for (const tok of tokens) {
      if (d.name.toLowerCase() === tok) s += 10;
      else if (d.name.toLowerCase().startsWith(tok)) s += 8;
      else if (base.includes(tok)) s += 5;
      else if (rich.includes(tok)) s += 2;
    }
    return s;
  };

  return destinations
    .map((d) => ({ name: d.name, slug: d.slug, country: d.country, imageUrl: d.imageUrl, imageAlt: d.imageAlt }))
    .map((d) => ({ d, s: score(d) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.d.name.localeCompare(b.d.name))
    .map((x) => x.d)
    .slice(0, 12);
}

/**
 * If the CMS has no matches, still offer curated + demo content from the showcase
 * (same as when Supabase is not linked) so e.g. `?country=Italy` never looks “broken” in production.
 */
function withShowcaseIfEmpty(
  fromDb: simpleBlogCard[],
  term: string,
  getFallback: (items: simpleBlogCard[], t: string) => simpleBlogCard[],
): simpleBlogCard[] {
  if (fromDb.length > 0) return fromDb;
  if (!term) return fromDb;
  return getFallback(getShowcaseBlogCards(), term);
}

function withShowcaseVideosIfEmpty(fromDb: videoCard[], term: string): videoCard[] {
  if (fromDb.length > 0) return fromDb;
  if (!term) return fromDb;
  return filterFallbackVideos(getShowcaseVideoCards(), term);
}

function withShowcaseProvidersIfEmpty(fromDb: providerHeroCard[], term: string): providerHeroCard[] {
  if (fromDb.length > 0) return fromDb;
  if (!term) return fromDb;
  return filterFallbackProviders(getShowcaseProviderCards(), term);
}

function SearchSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          {title}
        </h2>
        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45">
          {count} result{count === 1 ? "" : "s"}
        </span>
      </header>
      {children}
    </section>
  );
}

function resultCardClassName() {
  return "group block overflow-hidden rounded-2xl border border-neutral-200/90 bg-white no-underline shadow-sm transition hover:border-amber-300/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-amber-400/25";
}

const resultTextTitle = "line-clamp-2 text-lg font-semibold leading-tight text-neutral-900 dark:text-white";
const resultTextBody = "mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70";
const resultMeta = "mt-1 text-sm text-neutral-500 dark:text-white/60";

type SearchPageProps = {
  searchParams?: { query?: string; country?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const raw = (searchParams?.country || searchParams?.query || "").trim();
  if (!raw) {
    return {
      title: "Search | Culturin",
      description: "Search travel stories, videos, and experiences on Culturin.",
    };
  }
  return {
    title: `Search: ${raw} | Culturin`,
    description: `Stories, videos, and experiences related to “${raw}” on Culturin.`,
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const rawQuery = (searchParams?.country || searchParams?.query || "").trim();
  const query = normalizeQuery(rawQuery);
  const db = getCmsDbOrNull();

  let fromDbBlogs: simpleBlogCard[] = [];
  let fromDbVideos: videoCard[] = [];
  let fromDbProviders: providerHeroCard[] = [];

  if (db) {
    fromDbBlogs = await searchBlogs(db, query);
    fromDbVideos = await searchVideos(db, query);
    fromDbProviders = await searchProviders(db, query);
  } else {
    fromDbBlogs = filterFallbackBlogs(getShowcaseBlogCards(), query);
    fromDbVideos = filterFallbackVideos(getShowcaseVideoCards(), query);
    fromDbProviders = filterFallbackProviders(getShowcaseProviderCards(), query);
  }

  const articles = filterPublicBlogs(withShowcaseIfEmpty(fromDbBlogs, query, filterFallbackBlogs));
  const videos = filterPublicVideos(withShowcaseVideosIfEmpty(fromDbVideos, query));
  const providers = withShowcaseProvidersIfEmpty(fromDbProviders, query);
  const destinationHits = searchDestinations(query);

  const allCmsSearchesEmpty =
    !!db &&
    !!query &&
    fromDbBlogs.length === 0 &&
    fromDbVideos.length === 0 &&
    fromDbProviders.length === 0;
  const hasResults =
    articles.length > 0 || videos.length > 0 || providers.length > 0 || destinationHits.length > 0;
  const showSupplementNote =
    allCmsSearchesEmpty && hasResults
      ? "Nothing in your live catalogue matched this term, so we’re also showing picks from the editorial demo catalogue. Add articles or guides with similar wording in Studio, or try different keywords."
      : null;

  return (
    <>
      <Header />
      <main
        className="min-h-dvh bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 antialiased selection:bg-amber-500/25 dark:bg-black dark:text-white"
        id="main-content"
      >
        <div className={appPageContainerClass}>
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="font-medium text-amber-800 no-underline transition hover:underline dark:text-amber-300/90"
            >
              Home
            </Link>
            <span className="px-1.5 text-neutral-400 dark:text-white/35" aria-hidden>
              /
            </span>
            <span className="text-neutral-600 dark:text-white/65">Search</span>
          </nav>

          <h1 className="font-display m-0 text-3xl font-semibold tracking-tight sm:text-4xl">Search</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/60">
            {searchParams?.country && rawQuery
              ? `Places, stories, and media related to ${rawQuery}.`
              : query
                ? `Results for “${rawQuery}”.`
                : "Search articles, videos, and experiences — or pick a place from the home page."}
          </p>

          {showSupplementNote ? (
            <p className="mt-4 max-w-2xl text-xs text-neutral-500 dark:text-white/50">{showSupplementNote}</p>
          ) : null}

          {!hasResults && query ? (
            <div className="mt-8 rounded-2xl border border-neutral-200/90 bg-white px-6 py-12 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:px-8">
              <p className="m-0 text-base font-medium text-neutral-800 dark:text-white/90">
                No index matches for &ldquo;{rawQuery}&rdquo;.
              </p>
              <p className="m-0 mt-2 text-sm text-neutral-600 dark:text-white/60">
                Try a city, a region, a topic like food or art, or browse the library first.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/travel-guides"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.1] dark:text-white dark:hover:bg-white/[0.16]"
                >
                  Browse travel guides
                </Link>
                <Link
                  href="/destinations"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-5 text-sm font-semibold text-neutral-800 no-underline transition hover:bg-neutral-200/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Destinations
                </Link>
                <Link
                  href="/videos"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-5 text-sm font-semibold text-neutral-800 no-underline transition hover:bg-neutral-200/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Videos
                </Link>
              </div>
            </div>
          ) : null}

          {!query ? (
            <p className="mt-6 max-w-2xl text-sm text-neutral-500 dark:text-white/55">
              Add a <span className="font-mono text-xs text-amber-800/90 dark:text-amber-300/90">?query=</span> or use the
              search bar in the header.
            </p>
          ) : null}

          {articles.length > 0 ? (
            <SearchSection title="Articles" count={articles.length}>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {articles.map((article) => {
                  const imageSrc = resolveContentImageSrc(article.titleImageUrl);
                  return (
                    <li key={article.currentSlug} className="min-w-0">
                      <Link href={`/articles/${article.currentSlug}`} className={resultCardClassName()}>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                          <SafeContentImage
                            src={imageSrc}
                            alt={article.title}
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            unoptimized={cmsImageUnoptimized(imageSrc)}
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className={resultTextTitle}>{article.title}</h3>
                          {article.summary ? <p className={resultTextBody}>{article.summary}</p> : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SearchSection>
          ) : null}

          {videos.length > 0 ? (
            <SearchSection title="Videos" count={videos.length}>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {videos.map((video) => {
                  const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
                  return (
                    <li key={video.currentSlug} className="min-w-0">
                      <Link href={`/stream?play=${encodeURIComponent(video.currentSlug)}`} className={resultCardClassName()}>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                          <SafeContentImage
                            src={thumbSrc}
                            alt={video.title}
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            unoptimized={cmsImageUnoptimized(thumbSrc)}
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className={resultTextTitle}>{video.title}</h3>
                          {video.uploader ? <p className={resultMeta}>{video.uploader}</p> : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SearchSection>
          ) : null}

          {providers.length > 0 ? (
            <SearchSection title="Curated experiences" count={providers.length}>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {providers.map((provider) => {
                  const imageSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
                  const imgAlt = provider.bannerImage?.image?.alt || provider.eventName || provider.name || "Experience";
                  return (
                    <li key={provider.slug} className="min-w-0">
                      <Link href={`/providers/${provider.slug}`} className={resultCardClassName()}>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                          <SafeContentImage
                            src={imageSrc}
                            alt={imgAlt}
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            unoptimized={cmsImageUnoptimized(imageSrc)}
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className={resultTextTitle}>{provider.eventName || provider.name}</h3>
                          {provider.name ? <p className={resultMeta}>{provider.name}</p> : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SearchSection>
          ) : null}

          {destinationHits.length > 0 ? (
            <SearchSection title="Destinations" count={destinationHits.length}>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {destinationHits.map((destination) => {
                  const imageSrc = resolveContentImageSrc(destination.imageUrl);
                  return (
                    <li key={destination.slug} className="min-w-0">
                      <Link href={`/destinations/${destination.slug}`} className={resultCardClassName()}>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                          <SafeContentImage
                            src={imageSrc}
                            alt={destination.imageAlt}
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            unoptimized={cmsImageUnoptimized(imageSrc)}
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className={resultTextTitle}>{destination.name}</h3>
                          {destination.country ? <p className={resultMeta}>{destination.country}</p> : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SearchSection>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
