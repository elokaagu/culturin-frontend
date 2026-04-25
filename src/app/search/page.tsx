import Image from "next/image";
import { Link } from "next-view-transitions";
import type { ReactNode } from "react";

import Header from "../components/Header";
import type { providerHeroCard, simpleBlogCard, videoCard } from "@/lib/interface";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { searchBlogs, searchProviders, searchVideos } from "../../lib/cms/queries";
import { getShowcaseBlogCards, getShowcaseVideoCards } from "../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";

function containsTerm(value: string | null | undefined, term: string) {
  return (value || "").toLowerCase().includes(term);
}

function normalizeQuery(query: string | undefined): string {
  return (query || "").trim().toLowerCase();
}

function filterFallbackBlogs(items: simpleBlogCard[], term: string) {
  if (!term) return items;
  return items.filter((item) => containsTerm(item.title, term) || containsTerm(item.summary, term));
}

function filterFallbackVideos(items: videoCard[], term: string) {
  if (!term) return items;
  return items.filter(
    (item) =>
      containsTerm(item.title, term) ||
      containsTerm(item.uploader, term) ||
      containsTerm(item.description, term),
  );
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
    <section className="mt-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45">{count} result{count === 1 ? "" : "s"}</span>
      </header>
      {children}
    </section>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-lg text-neutral-700 dark:text-white/80">No results found for &quot;{query}&quot;.</p>
      <p className="mt-2 text-sm text-neutral-500 dark:text-white/55">Try a broader term like a city, culture topic, or category.</p>
    </div>
  );
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    /** Browse editorial stories by country/place (home “Explore the World”). */
    country?: string;
  };
}) {
  const rawQuery = (searchParams?.country || searchParams?.query || "").trim();
  const query = normalizeQuery(rawQuery);
  const db = getCmsDbOrNull();

  const [articles, videos, providers] = db
    ? await Promise.all([searchBlogs(db, query), searchVideos(db, query), searchProviders(db, query)])
    : [
        filterFallbackBlogs(getShowcaseBlogCards(), query),
        filterFallbackVideos(getShowcaseVideoCards(), query),
        [] as providerHeroCard[],
      ];

  const hasResults = articles.length > 0 || videos.length > 0 || providers.length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight">Search Results</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/60">
            {searchParams?.country && rawQuery
              ? `Stories and guides related to ${rawQuery}`
              : query
                ? `Showing results for "${rawQuery}"`
                : "Search articles, videos, and experiences — or open a country from the home page."}
          </p>

          {!hasResults && query ? <EmptyResults query={rawQuery} /> : null}

          {articles.length > 0 ? (
            <SearchSection title="Articles" count={articles.length}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
                  const imageSrc = resolveContentImageSrc(article.titleImageUrl);
                  return (
                    <Link
                      key={article.currentSlug}
                      href={`/articles/${article.currentSlug}`}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/70 no-underline"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                        <Image
                          src={imageSrc}
                          alt={article.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(imageSrc)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{article.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">{article.summary}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SearchSection>
          ) : null}

          {videos.length > 0 ? (
            <SearchSection title="Videos" count={videos.length}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => {
                  const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
                  return (
                    <Link
                      key={video.currentSlug}
                      href={`/stream?play=${video.currentSlug}`}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/70 no-underline"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                        <Image
                          src={thumbSrc}
                          alt={video.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{video.title}</h3>
                        <p className="mt-1 text-sm text-white/65">{video.uploader}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SearchSection>
          ) : null}

          {providers.length > 0 ? (
            <SearchSection title="Curated experiences" count={providers.length}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => {
                  const imageSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
                  return (
                    <Link
                      key={provider.slug}
                      href={`/providers/${provider.slug}`}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/70 no-underline"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                        <Image
                          src={imageSrc}
                          alt={provider.bannerImage?.image?.alt || provider.eventName || provider.name || "Experience"}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(imageSrc)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                          {provider.eventName || provider.name}
                        </h3>
                        {provider.name ? <p className="mt-1 text-sm text-white/65">{provider.name}</p> : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SearchSection>
          ) : null}
        </div>
      </main>
    </>
  );
}
