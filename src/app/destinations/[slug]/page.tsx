import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { destinations, getDestinationBySlug } from "../../../lib/destinationsData";
import { getDestinationContent } from "../../../lib/destinationContent";
import { appPageContainerClass } from "@/lib/appLayout";
import { ContentPageShell } from "../../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { searchBlogs, searchProviders, searchVideos } from "@/lib/cms/queries";
import { getShowcaseVideoCards } from "@/lib/cms/showcaseContent";
import { textMatchesAllTokens, tokenizeSearchQuery } from "@/lib/searchTokenize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { listTravelerCardsForDestination } from "@/lib/repositories/followRepository";
import type { TravelerCard } from "@/lib/social/types";
import DestinationTravelersSection from "./DestinationTravelersSection";

type PageProps = { params: { slug: string } };

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const eyebrowClass = "m-0 text-xs font-semibold uppercase tracking-[0.2em]";
const cardClass = "rounded-2xl border p-5";
const cardStyle = { borderColor: "var(--c-rule)", background: "rgba(28,26,23,0.03)" };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const d = getDestinationBySlug(params.slug);
  if (!d) return { title: "Destination" };
  return {
    title: `${d.name} | Culturin`,
    description: d.country
      ? `Guides, stories, and ideas for ${d.name}, ${d.country}.`
      : `Guides, stories, and ideas for ${d.name}.`,
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const d = getDestinationBySlug(params.slug);
  if (!d) notFound();
  const content = getDestinationContent(d.slug);
  const db = getCmsDbOrNull();
  const query = d.name.toLowerCase();
  const tokens = tokenizeSearchQuery(query);

  const fallbackVideos = getShowcaseVideoCards().filter((item) =>
    textMatchesAllTokens([item.title, item.description, item.uploader, item.currentSlug].join(" "), tokens),
  );
  const matchedBlogs = db ? await searchBlogs(db, query) : [];
  const matchedVideos = db ? await searchVideos(db, query) : fallbackVideos;
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
      destinationName: d.name,
      viewerUserId: appUserId,
      limit: 6,
    });
  } catch {
    travelerCards = [];
  }

  const highlights = content?.highlights ?? ["Iconic city landmarks", "Neighborhood walks", "Local-led experiences"];
  const neighborhoods = content?.neighborhoods ?? ["Historic center", "Creative quarter", "Waterfront district"];
  const foodToTry = content?.foodToTry ?? ["Signature local dishes", "Seasonal street food", "Traditional desserts"];
  const localTips = content?.localTips ?? ["Start early for major sights", "Use local transport apps", "Keep a flexible evening plan"];

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
          <span style={{ color: "var(--c-ink)" }}>{d.name}</span>
        </div>
      </nav>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
        <div className="space-y-7">
          <header className="space-y-3">
            <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
              Destination guide
            </p>
            <h1 className="m-0 text-4xl font-medium leading-tight sm:text-5xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              {d.name}
            </h1>
            <p className="m-0 text-base" style={{ color: "var(--c-muted)" }}>{d.country ?? "Worldwide"}</p>
            <p className="m-0 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
              {content?.intro ??
                `${d.name} is a destination worth exploring through neighborhood culture, food, and local stories.`}
            </p>
          </header>

          <div className={`grid gap-4 sm:grid-cols-2 ${cardClass}`} style={cardStyle}>
            <div>
              <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>Vibe</p>
              <p className="m-0 mt-2 text-base" style={{ color: "var(--c-ink)" }}>
                {content?.vibe ?? "Cultural, social, and always evolving."}
              </p>
            </div>
            <div>
              <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
                Best time to visit
              </p>
              <p className="m-0 mt-2 text-base" style={{ color: "var(--c-ink)" }}>
                {content?.bestTime ?? "Year-round, with peak season in mild weather months."}
              </p>
            </div>
          </div>

          <section aria-labelledby="dest-highlights">
            <h2 id="dest-highlights" className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
              Top highlights
            </h2>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0">
              {highlights.map((item) => (
                <li key={item} className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className={eyebrowClass} style={{ color: "var(--c-muted)" }}>
                Neighborhoods
              </h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5" style={{ color: "var(--c-muted)" }}>
                {neighborhoods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={eyebrowClass} style={{ color: "var(--c-muted)" }}>Food to try</h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5" style={{ color: "var(--c-muted)" }}>
                {foodToTry.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className={eyebrowClass} style={{ color: "var(--c-muted)" }}>Local tips</h2>
            <ul className="m-0 mt-3 list-disc space-y-2 pl-5" style={{ color: "var(--c-muted)" }}>
              {localTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {travelerCards.length > 0 ? (
            <DestinationTravelersSection travelers={travelerCards} currentUserId={appUserId} />
          ) : null}

          {matchedBlogs.length > 0 || matchedVideos.length > 0 || matchedProviders.length > 0 ? (
            <section className={cardClass} style={cardStyle}>
              <h2 className="m-0 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
                More for {d.name}
              </h2>
              <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                Location-specific stories, videos, and curated recommendations.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                    Articles
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                    {matchedBlogs.slice(0, 5).map((item) => (
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
                    {matchedVideos.slice(0, 5).map((item) => (
                      <li key={item.currentSlug}>
                        <Link href={`/stream?play=${encodeURIComponent(item.currentSlug)}`} className="no-underline hover:underline" style={{ color: "var(--c-ink)" }}>
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
                    {matchedProviders.slice(0, 5).map((item) => (
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
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border" style={{ borderColor: "var(--c-rule)" }}>
            <Image
              src={d.imageUrl}
              alt={d.imageAlt}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              sizes="(max-width: 1024px) 100vw, 28rem"
            />
          </div>
          <div className={cardClass} style={cardStyle}>
            <p className={eyebrowClass} style={{ color: "var(--c-muted)" }}>Next steps</p>
            <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Discover more places on the destinations index, then pair this city with travel guides and curated experiences.
            </p>
            <Link
              href="/destinations"
              className="mt-3 inline-flex items-center text-sm font-medium no-underline transition hover:opacity-80"
              style={{ color: "var(--c-accent)" }}
            >
              Browse all destinations
            </Link>
          </div>
        </aside>
      </section>
    </ContentPageShell>
  );
}
