import Image from "next/image";
import { Link } from "next-view-transitions";

import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { groupCuratedProvidersByCountry } from "@/lib/curatedExperiencesIndex";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listProvidersAsCards } from "../../lib/cms/queries";
import type { providerCard } from "@/lib/interface";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default async function CuratedExperiencesPage() {
  const db = getCmsDbOrNull();
  const providers: providerCard[] = db ? await listProvidersAsCards(db) : [];
  const groups = groupCuratedProvidersByCountry(providers);

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="flex min-h-dvh flex-col px-4 pb-16 sm:px-6 lg:px-10" style={{ paddingTop: "8rem" }}>
        <header className="mx-auto mb-8 w-full max-w-6xl">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            Curated experiences
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--c-muted)" }}>
            Handpicked by the Culturin team — browse by country and city.
          </p>
        </header>

        {providers.length === 0 ? (
          <p className="mx-auto w-full max-w-6xl text-sm" style={{ color: "var(--c-muted)" }} role="status">
            No experiences to show yet. Check back soon.
          </p>
        ) : (
          <div className="mx-auto w-full max-w-6xl">
            {groups.length > 1 ? (
              <nav className="mb-10 flex flex-wrap gap-2 border-b pb-6" style={{ borderColor: "var(--c-rule)" }} aria-label="Jump to country">
                {groups.map(({ country, anchorId }) => (
                  <a
                    key={anchorId}
                    href={`#${anchorId}`}
                    className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium no-underline transition hover:opacity-80"
                    style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                  >
                    {country}
                  </a>
                ))}
              </nav>
            ) : null}

            <div className="flex flex-col gap-14 sm:gap-16">
              {groups.map(({ country, anchorId, entries }) => (
                <section key={anchorId} id={anchorId} className="scroll-mt-32">
                  <h2 className="m-0 text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
                    {country}
                  </h2>
                  <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
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
                            className="group flex h-full flex-col overflow-hidden rounded-xl border no-underline outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5"
                            style={{ borderColor: "var(--c-rule)" }}
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
                                <p className="m-0 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--c-accent)" }}>
                                  {placeLabel}
                                </p>
                              ) : null}
                              <h3 className="line-clamp-2 text-base font-medium leading-snug" style={{ ...displayFont, color: "var(--c-ink)" }}>
                                {provider.eventName}
                              </h3>
                              <p className="line-clamp-2 text-sm" style={{ color: "var(--c-muted)" }}>{provider.name}</p>
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
      <HomeFooter />
    </div>
  );
}
