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
import { filterPublicBlogs, filterPublicVideos } from "@/lib/cms/blockedFromSite";
import { getShowcaseBlogCards, getShowcaseProviderCards, getShowcaseVideoCards } from "@/lib/cms/showcaseContent";
import { textMatchesAllTokens, tokenizeSearchQuery } from "@/lib/searchTokenize";

type PageProps = { params: { slug: string } };

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

  const fallbackBlogs = getShowcaseBlogCards().filter((item) =>
    textMatchesAllTokens([item.title, item.summary, item.currentSlug].join(" "), tokens),
  );
  const fallbackVideos = getShowcaseVideoCards().filter((item) =>
    textMatchesAllTokens([item.title, item.description, item.uploader, item.currentSlug].join(" "), tokens),
  );
  const fallbackProviders = getShowcaseProviderCards().filter((item) =>
    textMatchesAllTokens([item.eventName, item.name, item.slug].join(" "), tokens),
  );

  const matchedBlogs = filterPublicBlogs(db ? await searchBlogs(db, query) : fallbackBlogs);
  const matchedVideos = filterPublicVideos(db ? await searchVideos(db, query) : fallbackVideos);
  const matchedProviders = db ? await searchProviders(db, query) : fallbackProviders;

  const travelersByDestination: Record<
    string,
    Array<{
      name: string;
      handle: string;
      itinerary: string;
      recommendation: string;
      avatar: string;
    }>
  > = {
    barcelona: [
      {
        name: "Sofia R.",
        handle: "@sofiawanders",
        itinerary: "3-day Gracia + El Born slow itinerary",
        recommendation: "Skip peak-hour Sagrada lines and book sunset slots.",
        avatar: "https://images.unsplash.com/photo-1544723795-432537d12f6f?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Mateo V.",
        handle: "@mateoviaja",
        itinerary: "Architecture walk + tapas-by-neighborhood route",
        recommendation: "Pair one major landmark with two local district stops.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      },
    ],
    lagos: [
      {
        name: "Adeola A.",
        handle: "@adeolamoves",
        itinerary: "Mainland markets + Island live music plan",
        recommendation: "Cluster your day by zones to avoid heavy transfers.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Tomi B.",
        handle: "@tomiinlagos",
        itinerary: "Weekend food crawl + waterfront evening flow",
        recommendation: "Reserve brunch early and keep evenings flexible.",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
      },
    ],
  };

  const travelerCards =
    travelersByDestination[d.slug] ??
    [
      {
        name: "Culturin Explorer",
        handle: "@culturintraveler",
        itinerary: `2-day ${d.name} essentials itinerary`,
        recommendation: "Start with neighborhood-led discovery before headline landmarks.",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      },
    ];

  const highlights = content?.highlights ?? ["Iconic city landmarks", "Neighborhood walks", "Local-led experiences"];
  const neighborhoods = content?.neighborhoods ?? ["Historic center", "Creative quarter", "Waterfront district"];
  const foodToTry = content?.foodToTry ?? ["Signature local dishes", "Seasonal street food", "Traditional desserts"];
  const localTips = content?.localTips ?? ["Start early for major sights", "Use local transport apps", "Keep a flexible evening plan"];

  return (
    <ContentPageShell
      mainClassName="min-h-dvh bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
      innerClassName={appPageContainerClass}
    >
      <nav
        className="mb-8 pt-6 text-sm text-neutral-600 dark:text-white/50"
        aria-label="Breadcrumb"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/"
            className="text-amber-600 no-underline transition hover:text-amber-700 dark:text-amber-300/90 dark:hover:text-amber-200"
          >
            Home
          </Link>
          <span className="text-neutral-400 dark:text-white/40" aria-hidden>
            /
          </span>
          <Link
            href="/destinations"
            className="text-amber-600 no-underline transition hover:text-amber-700 dark:text-amber-300/90 dark:hover:text-amber-200"
          >
            Destinations
          </Link>
          <span className="text-neutral-400 dark:text-white/40" aria-hidden>
            /
          </span>
          <span className="text-neutral-800 dark:text-white/75">{d.name}</span>
        </div>
      </nav>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
        <div className="space-y-7">
          <header className="space-y-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/45">
              Destination guide
            </p>
            <h1 className="m-0 text-4xl leading-tight text-neutral-900 dark:text-white sm:text-5xl">{d.name}</h1>
            <p className="m-0 text-base text-neutral-600 dark:text-white/65">{d.country ?? "Worldwide"}</p>
            <p className="m-0 max-w-3xl text-lg leading-relaxed text-neutral-700 dark:text-white/80">
              {content?.intro ??
                `${d.name} is a destination worth exploring through neighborhood culture, food, and local stories.`}
            </p>
          </header>

          <div className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">Vibe</p>
              <p className="m-0 mt-2 text-base text-neutral-800 dark:text-white/85">
                {content?.vibe ?? "Cultural, social, and always evolving."}
              </p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">
                Best time to visit
              </p>
              <p className="m-0 mt-2 text-base text-neutral-800 dark:text-white/85">
                {content?.bestTime ?? "Year-round, with peak season in mild weather months."}
              </p>
            </div>
          </div>

          <section aria-labelledby="dest-highlights">
            <h2
              id="dest-highlights"
              className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45"
            >
              Top highlights
            </h2>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-neutral-200 bg-neutral-100/80 px-4 py-3 text-neutral-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">
                Neighborhoods
              </h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-neutral-700 dark:text-white/80">
                {neighborhoods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">Food to try</h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-neutral-700 dark:text-white/80">
                {foodToTry.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">Local tips</h2>
            <ul className="m-0 mt-3 list-disc space-y-2 pl-5 text-neutral-700 dark:text-white/80">
              {localTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Travelers to follow
              </h2>
              <button
                type="button"
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:border-white/20 dark:bg-white/10 dark:text-white"
              >
                See all
              </button>
            </div>
            <ul className="m-0 list-none space-y-3 p-0">
              {travelerCards.map((traveler) => (
                <li
                  key={traveler.handle}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-white/10 dark:bg-black/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-white/15">
                        <Image src={traveler.avatar} alt={traveler.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{traveler.name}</p>
                        <p className="m-0 mt-0.5 text-xs text-neutral-500 dark:text-white/55">{traveler.handle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:border-white/20 dark:bg-white/10 dark:text-white"
                    >
                      Follow
                    </button>
                  </div>
                  <p className="m-0 mt-2 text-sm text-neutral-700 dark:text-white/80">
                    <span className="font-semibold">Itinerary:</span> {traveler.itinerary}
                  </p>
                  <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/70">
                    <span className="font-semibold">Recommendation:</span> {traveler.recommendation}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {matchedBlogs.length > 0 || matchedVideos.length > 0 || matchedProviders.length > 0 ? (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                More for {d.name}
              </h2>
              <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/70">
                Location-specific stories, videos, and curated recommendations.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/45">
                    Articles
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-white/80">
                    {matchedBlogs.slice(0, 5).map((item) => (
                      <li key={item.currentSlug}>
                        <Link href={`/articles/${item.currentSlug}`} className="no-underline hover:underline">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/45">
                    Videos
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-white/80">
                    {matchedVideos.slice(0, 5).map((item) => (
                      <li key={item.currentSlug}>
                        <Link href={`/stream?play=${encodeURIComponent(item.currentSlug)}`} className="no-underline hover:underline">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/45">
                    Experiences
                  </h3>
                  <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-white/80">
                    {matchedProviders.slice(0, 5).map((item) => (
                      <li key={item.slug}>
                        <Link href={`/providers/${item.slug}`} className="no-underline hover:underline">
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

        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-neutral-950">
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
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">Next steps</p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
              Discover more places on the destinations index, then pair this city with travel guides and curated experiences.
            </p>
            <Link
              href="/destinations"
              className="mt-3 inline-flex items-center text-sm font-medium text-amber-600 no-underline transition hover:text-amber-800 dark:text-amber-300/90 dark:hover:text-amber-200"
            >
              Browse all destinations
            </Link>
          </div>
        </aside>
      </section>
    </ContentPageShell>
  );
}
