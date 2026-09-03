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
import { getShowcaseVideoCards } from "../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  resolveContentImageSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "../components/SafeContentImage";

export const revalidate = 120;

function normalizeQuery(query: string | undefined): string {
  return (query || "").trim().toLowerCase();
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

function withShowcaseVideosIfEmpty(fromDb: videoCard[], term: string): videoCard[] {
  if (fromDb.length > 0) return fromDb;
  if (!term) return fromDb;
  return filterFallbackVideos(getShowcaseVideoCards(), term);
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
        <h2
          className="text-xl font-medium tracking-tight sm:text-2xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
        >
          {title}
        </h2>
        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em]" style={{ color: "var(--c-muted)" }}>
          {count} result{count === 1 ? "" : "s"}
        </span>
      </header>
      {children}
    </section>
  );
}

function resultCardClassName() {
  return "group block overflow-hidden rounded-2xl border no-underline transition";
}

const resultCardStyle = { borderColor: "var(--c-rule)" };
const resultTextTitle = "line-clamp-2 text-lg font-medium leading-tight";
const resultTextTitleStyle = { fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" };
const resultTextBody = "mt-2 line-clamp-2 text-sm leading-relaxed";
const resultMeta = "mt-1 text-sm";

type SearchPageProps = {
  searchParams?: { query?: string; country?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const raw = (searchParams?.country || searchParams?.query || "").trim();
  if (!raw) {
    return {
      title: "Search | Culturin",
      description: "Search stories, video, and rooms in the Culturin house.",
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
    fromDbBlogs = [];
    fromDbVideos = filterFallbackVideos(getShowcaseVideoCards(), query);
    fromDbProviders = [];
  }

  const articles = fromDbBlogs;
  const videos = withShowcaseVideosIfEmpty(fromDbVideos, query);
  const providers = fromDbProviders;
  const destinationHits = searchDestinations(query);

  const hasResults =
    articles.length > 0 || videos.length > 0 || providers.length > 0 || destinationHits.length > 0;
  const showSupplementNote = null;

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-20 antialiased" id="main-content" style={{ paddingTop: "8rem" }}>
        <div className={appPageContainerClass}>
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="font-medium no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
              Home
            </Link>
            <span className="px-1.5" style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <span style={{ color: "var(--c-muted)" }}>Search</span>
          </nav>

          <h1
            className="m-0 text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            Search
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--c-muted)" }}>
            {searchParams?.country && rawQuery
              ? `Places, stories, and media related to ${rawQuery}.`
              : query
                ? `Results for “${rawQuery}”.`
                : "Search articles, videos, and rooms — or pick a city from the house."}
          </p>

          {showSupplementNote ? (
            <p className="mt-4 max-w-2xl text-xs" style={{ color: "var(--c-muted)" }}>{showSupplementNote}</p>
          ) : null}

          {!hasResults && query ? (
            <div className="mt-8 rounded-2xl border px-6 py-12 text-center sm:px-8" style={{ borderColor: "var(--c-rule)" }}>
              <p className="m-0 text-base font-medium" style={{ color: "var(--c-ink)" }}>
                No index matches for &ldquo;{rawQuery}&rdquo;.
              </p>
              <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
                Try a city, a region, a topic like food or art, or browse the library first.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/travel-guides"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-sm font-semibold no-underline transition hover:opacity-80"
                  style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                >
                  Browse notes
                </Link>
                <Link
                  href="/destinations"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-sm font-semibold no-underline transition hover:opacity-80"
                  style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                >
                  Cities
                </Link>
                <Link
                  href="/videos"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-sm font-semibold no-underline transition hover:opacity-80"
                  style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                >
                  Videos
                </Link>
              </div>
            </div>
          ) : null}

          {!query ? (
            <p className="mt-6 max-w-2xl text-sm" style={{ color: "var(--c-muted)" }}>
              Add a <span className="font-mono text-xs" style={{ color: "var(--c-accent)" }}>?query=</span> or use the
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
                      <Link href={`/articles/${article.currentSlug}`} className={resultCardClassName()} style={resultCardStyle}>
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
                          <h3 className={resultTextTitle} style={resultTextTitleStyle}>{article.title}</h3>
                          {article.summary ? <p className={resultTextBody} style={{ color: "var(--c-muted)" }}>{article.summary}</p> : null}
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
                      <Link href={`/stream?play=${encodeURIComponent(video.currentSlug)}`} className={resultCardClassName()} style={resultCardStyle}>
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
                          <h3 className={resultTextTitle} style={resultTextTitleStyle}>{video.title}</h3>
                          {video.uploader ? <p className={resultMeta} style={{ color: "var(--c-muted)" }}>{video.uploader}</p> : null}
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
                      <Link href={`/providers/${provider.slug}`} className={resultCardClassName()} style={resultCardStyle}>
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
                          <h3 className={resultTextTitle} style={resultTextTitleStyle}>{provider.eventName || provider.name}</h3>
                          {provider.name ? <p className={resultMeta} style={{ color: "var(--c-muted)" }}>{provider.name}</p> : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SearchSection>
          ) : null}

          {destinationHits.length > 0 ? (
            <SearchSection title="Cities" count={destinationHits.length}>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {destinationHits.map((destination) => {
                  const imageSrc = resolveContentImageSrc(destination.imageUrl);
                  return (
                    <li key={destination.slug} className="min-w-0">
                      <Link href={`/destinations/${destination.slug}`} className={resultCardClassName()} style={resultCardStyle}>
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
                          <h3 className={resultTextTitle} style={resultTextTitleStyle}>{destination.name}</h3>
                          {destination.country ? <p className={resultMeta} style={{ color: "var(--c-muted)" }}>{destination.country}</p> : null}
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
      <HomeFooter />
    </div>
  );
}
