"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import {
  appPageFullBleedClass,
  appPageRailScrollPadClass,
  homeSectionSeeAllClass,
} from "@/lib/appLayout";
import type { ExploreWorldCountry } from "@/lib/exploreWorldCountries";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type ExploreWorldCountriesRailProps = {
  countries: ExploreWorldCountry[];
  /** Main row title (e.g. “Explore the World”) */
  title: string;
  description: string;
  viewAllHref?: string;
  /** Defaults to `explore-world-heading` for anchor / aria. */
  headingId?: string;
};

export default function ExploreWorldCountriesRail({
  countries,
  title,
  description,
  viewAllHref = "/destinations",
  headingId = "explore-world-heading",
}: ExploreWorldCountriesRailProps) {
  if (countries.length === 0) {
    return (
      <div className="w-full min-w-0">
        <header className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
          <div className="min-w-0 flex-1 pr-2">
            <h2
              id={headingId}
              className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:mt-1.5 sm:text-[0.95rem] dark:text-white/60">
              {description}
            </p>
          </div>
          <Link href={viewAllHref} className={homeSectionSeeAllClass}>
            See all
          </Link>
        </header>
        <p className="text-sm text-neutral-600 dark:text-white/50">No countries to show right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <header className="relative z-10 mb-4 flex items-start justify-between gap-4 sm:mb-5">
        <div className="min-w-0 flex-1 pr-2">
          <h2
            id={headingId}
            className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white"
          >
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:mt-1.5 sm:text-[0.95rem] dark:text-white/60">
            {description}
          </p>
        </div>
        <Link href={viewAllHref} className={homeSectionSeeAllClass}>
          See all
        </Link>
      </header>

      <div className={appPageFullBleedClass} role="list" aria-label="Countries to explore">
        <div
          className={`flex snap-x snap-mandatory justify-start gap-3.5 overflow-x-auto scroll-smooth pb-1.5 pt-0.5 sm:gap-4 sm:pb-1 ${appPageRailScrollPadClass}`}
        >
          {countries.map((c) => {
            const src = resolveContentImageSrc(c.imageUrl);
            const href = `/search?country=${encodeURIComponent(c.searchLabel)}`;
            return (
              <article
                key={c.id}
                role="listitem"
                className="w-[min(13.5rem,64vw)] shrink-0 snap-start"
              >
                <Link
                  href={href}
                  className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-black"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900 dark:bg-neutral-950">
                    <Image
                      src={src}
                      alt={c.imageAlt}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      sizes="(max-width: 640px) 64vw, 14rem"
                      unoptimized={cmsImageUnoptimized(src)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">Country</p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-white drop-shadow-sm sm:text-xl">{c.name}</h3>
                      <p className="mt-1 text-xs font-medium text-white/85">Stories & guides →</p>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
