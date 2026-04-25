"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { ExploreWorldCountry } from "@/lib/exploreWorldCountries";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type ExploreWorldCountriesRailProps = {
  countries: ExploreWorldCountry[];
};

export default function ExploreWorldCountriesRail({ countries }: ExploreWorldCountriesRailProps) {
  if (countries.length === 0) return null;

  return (
    <div
      className="-mx-1 flex gap-3 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="Countries to explore"
    >
      {countries.map((c) => {
        const src = resolveContentImageSrc(c.imageUrl);
        const href = `/search?country=${encodeURIComponent(c.searchLabel)}`;
        return (
          <article
            key={c.id}
            role="listitem"
            className="min-w-[min(78vw,16rem)] shrink-0 snap-start sm:min-w-0"
          >
            <Link
              href={href}
              className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-black"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-200 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-white/15">
                <Image
                  src={src}
                  alt={c.imageAlt}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 33vw, 22vw"
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
  );
}
