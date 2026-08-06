import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../../components/layout/ContentPageShell";
import { appPageContainerClass } from "@/lib/appLayout";
import { filterPublicBlogs, filterPublicVideos } from "@/lib/cms/blockedFromSite";
import { searchBlogs, searchProviders, searchVideos } from "@/lib/cms/queries";
import { getShowcaseBlogCards, getShowcaseVideoCards } from "@/lib/cms/showcaseContent";
import { getCmsDbOrNull } from "@/lib/cms/server";
import {
  exploreWorldCountries,
  getExploreWorldCountryBySlug,
} from "@/lib/exploreWorldCountries";
import { cmsImageUnoptimized, IMAGE_BLUR_DATA_URL, resolveContentImageSrc } from "@/lib/imagePlaceholder";
import { textMatchesAllTokens, tokenizeSearchQuery } from "@/lib/searchTokenize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { listTravelerCardsForDestination } from "@/lib/repositories/followRepository";
import type { TravelerCard } from "@/lib/social/types";
import DestinationTravelersSection from "../../destinations/[slug]/DestinationTravelersSection";

type PageProps = { params: { slug: string } };

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const eyebrowClass = "m-0 text-xs font-semibold uppercase tracking-[0.22em]";
const cardClass = "rounded-2xl border p-5";
const cardStyle = { borderColor: "var(--c-rule)" };

export function generateStaticParams() {
  return exploreWorldCountries.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = getExploreWorldCountryBySlug(params.slug);
  if (!country) return { title: "Country" };
  return {
    title: `${country.name} | Culturin`,
    description: `Guides, stories, and ideas for ${country.name}.`,
  };
}

export default async function ExploreCountryPage({ params }: PageProps) {
  const country = getExploreWorldCountryBySlug(params.slug);
  if (!country) notFound();

  const db = getCmsDbOrNull();
  const query = country.name.toLowerCase();
  const tokens = tokenizeSearchQuery(query);

  const fallbackBlogs = getShowcaseBlogCards().filter((item) =>
    textMatchesAllTokens([item.title, item.summary, item.currentSlug].join(" "), tokens),
  );
  const fallbackVideos = getShowcaseVideoCards().filter((item) =>
    textMatchesAllTokens([item.title, item.description, item.uploader, item.currentSlug].join(" "), tokens),
  );
  const matchedBlogs = filterPublicBlogs(db ? await searchBlogs(db, query) : fallbackBlogs);
  const matchedVideos = filterPublicVideos(db ? await searchVideos(db, query) : fallbackVideos);
  const matchedProviders = db ? await searchProviders(db, query) : [];

  let appUserId: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    const appUser = sessionUser?.email ? await ensureAppUser(sessionUser) : null;
    appUserId = appUser?.id ?? null;
  } catch {
    appUserId = null;
  }

  let travelerCards: TravelerCard[] = [];
  try {
    travelerCards = await listTravelerCardsForDestination({
      destinationName: country.name,
      viewerUserId: appUserId,
      limit: 6,
    });
  } catch {
    travelerCards = [];
  }

  const heroSrc = resolveContentImageSrc(country.imageUrl);

  return (
    <ContentPageShell
      mainClassName="min-h-dvh pb-20 antialiased"
      innerClassName={appPageContainerClass}
    >
      <nav className="mb-8 pt-6 text-sm" style={{ color: "var(--c-muted)" }} aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Home
          </Link>
          <span style={{ color: "var(--c-muted)" }} aria-hidden>
            /
          </span>
          <Link href="/destinations" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Destinations
          </Link>
          <span style={{ color: "var(--c-muted)" }} aria-hidden>
            /
          </span>
          <span style={{ color: "var(--c-ink)" }}>{country.name}</span>
        </div>
      </nav>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
        <div className="space-y-7">
          <header className="space-y-3">
            <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
              Country
            </p>
            <h1 className="m-0 text-4xl font-medium leading-tight sm:text-5xl" style={{ ...displayFont, color: "var(--c-ink)" }}>{country.name}</h1>
            <p className="m-0 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Stories, guides, and experiences connected to {country.name}. Browse highlights below or open the full
              search for every match.
            </p>
            <p className="m-0">
              <Link
                href={`/search?country=${encodeURIComponent(country.searchLabel)}`}
                className="text-sm font-medium no-underline hover:underline"
                style={{ color: "var(--c-accent)" }}
              >
                Search all results for {country.name} →
              </Link>
            </p>
          </header>

          {travelerCards.length > 0 ? (
            <DestinationTravelersSection travelers={travelerCards} currentUserId={appUserId} />
          ) : null}

          {matchedBlogs.length > 0 || matchedVideos.length > 0 || matchedProviders.length > 0 ? (
            <section className={cardClass} style={cardStyle}>
              <h2 className="m-0 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
                Highlights for {country.name}
              </h2>
              <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                Articles, videos, and curated picks that mention this country.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                    Articles
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                    {matchedBlogs.slice(0, 8).map((item) => (
                      <li key={item.currentSlug}>
                        <Link href={`/articles/${item.currentSlug}`} className="no-underline hover:underline" style={{ color: "var(--c-ink)" }}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                    Videos
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                    {matchedVideos.slice(0, 8).map((item) => (
                      <li key={item.currentSlug}>
                        <Link
                          href={`/stream?play=${encodeURIComponent(item.currentSlug)}`}
                          className="no-underline hover:underline"
                          style={{ color: "var(--c-ink)" }}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                    Experiences
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                    {matchedProviders.slice(0, 8).map((item) => (
                      <li key={item.slug}>
                        <Link href={`/providers/${item.slug}`} className="no-underline hover:underline" style={{ color: "var(--c-ink)" }}>
                          {item.eventName || item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : (
            <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>
              No indexed stories matched yet. Try the search link above for a broader view.
            </p>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border" style={{ borderColor: "var(--c-rule)" }}>
            <Image
              src={heroSrc}
              alt={country.imageAlt}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              sizes="(max-width: 1024px) 100vw, 28rem"
              unoptimized={cmsImageUnoptimized(heroSrc)}
            />
          </div>
          <div className={cardClass} style={cardStyle}>
            <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
              Explore further
            </p>
            <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              City guides live on the destinations index. Regional overviews are under Countries in the menu.
            </p>
            <Link
              href="/destinations"
              className="mt-3 inline-flex items-center text-sm font-medium no-underline transition hover:opacity-80"
              style={{ color: "var(--c-accent)" }}
            >
              Browse destinations
            </Link>
          </div>
        </aside>
      </section>
    </ContentPageShell>
  );
}
