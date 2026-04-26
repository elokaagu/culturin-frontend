import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import { groupCuratedProvidersByCountry } from "@/lib/curatedExperiencesIndex";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listProvidersAsCards } from "../../lib/cms/queries";
import type { providerCard } from "@/lib/interface";

export default async function CuratedExperiencesPage() {
  const db = getCmsDbOrNull();
  const providers: providerCard[] = db ? await listProvidersAsCards(db) : [];
  const groups = groupCuratedProvidersByCountry(providers);

  return (
    <>
      <Header />
      <main className="flex min-h-dvh flex-col bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 sm:px-6 lg:px-10 dark:bg-black dark:text-white">
        <header className="mx-auto mb-8 w-full max-w-6xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Curated experiences</h1>
          <p className="mt-2 text-sm text-neutral-500 sm:text-base dark:text-white/55">
            Handpicked by the Culturin team — browse by country and city.
          </p>
        </header>

        {providers.length === 0 ? (
          <p className="mx-auto w-full max-w-6xl text-sm text-neutral-500 dark:text-white/55" role="status">
            No experiences to show yet. Check back soon.
          </p>
        ) : (
          <div className="mx-auto w-full max-w-6xl">
            {groups.length > 1 ? (
              <nav
                className="mb-10 flex flex-wrap gap-2 border-b border-neutral-200 pb-6 dark:border-white/10"
                aria-label="Jump to country"
              >
                {groups.map(({ country, anchorId }) => (
                  <a
                    key={anchorId}
                    href={`#${anchorId}`}
                    className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 no-underline transition hover:border-amber-400/50 hover:text-amber-900 dark:border-white/15 dark:bg-white/5 dark:text-white/85 dark:hover:border-amber-400/35 dark:hover:text-amber-200"
                  >
                    {country}
                  </a>
                ))}
              </nav>
            ) : null}

            <div className="flex flex-col gap-14 sm:gap-16">
              {groups.map(({ country, anchorId, entries }) => (
                <section key={anchorId} id={anchorId} className="scroll-mt-[calc(var(--header-offset)+1rem)]">
                  <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
                    {country}
                  </h2>
                  <p className="m-0 mt-1 text-sm text-neutral-500 dark:text-white/50">
                    {entries.length} {entries.length === 1 ? "experience" : "experiences"}
                  </p>
                  <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {entries.map(({ provider, city }) => {
                      const slug = provider.slug.current;
                      const imgSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
                      const imgAlt = provider.bannerImage?.image?.alt || provider.eventName || "Provider";
                      const placeLabel =
                        city && country !== "Other locations"
                          ? `${city}`
                          : city || (provider.location || "").trim() || null;

                      return (
                        <li key={slug} className="min-w-0">
                          <Link
                            href={`/providers/${slug}`}
                            className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white no-underline shadow-sm outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:border-white/10 dark:bg-neutral-950/60 dark:shadow-none dark:hover:border-amber-400/30 dark:hover:shadow-lg dark:hover:shadow-black/40 dark:focus-visible:ring-offset-black"
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                              <Image
                                src={imgSrc}
                                alt={imgAlt}
                                fill
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized={isBundledPlaceholderSrc(imgSrc)}
                              />
                            </div>
                            <div className="flex flex-col gap-1 px-4 py-4">
                              {placeLabel ? (
                                <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-800/90 dark:text-amber-300/90">
                                  {placeLabel}
                                </p>
                              ) : null}
                              <h3 className="text-base font-semibold leading-snug text-neutral-900 line-clamp-2 dark:text-white">
                                {provider.eventName}
                              </h3>
                              <p className="text-sm text-neutral-500 line-clamp-2 dark:text-white/45">{provider.name}</p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
