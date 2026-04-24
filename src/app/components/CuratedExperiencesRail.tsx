"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { providerHeroCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type CuratedExperiencesRailProps = {
  providers: providerHeroCard[];
};

/**
 * Home “Curated experiences” rail: server-fed providers, links to /providers/[slug].
 */
export default function CuratedExperiencesRail({ providers }: CuratedExperiencesRailProps) {
  if (providers.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(0,0,0,0.2)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
        role="list"
        aria-label="Curated experience cards"
      >
        {providers.map((p) => {
          const imgSrc = resolveContentImageSrc(p.bannerImage?.image?.url);
          const imgAlt = p.bannerImage?.image?.alt || p.eventName || p.name || "Experience";

          return (
            <article
              key={p.slug}
              role="listitem"
              className="w-40 shrink-0 snap-center sm:w-44 md:w-48"
            >
              <Link
                href={`/providers/${p.slug}`}
                className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-black"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src={imgSrc}
                    alt={imgAlt}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 10rem, 12rem"
                    unoptimized={isBundledPlaceholderSrc(imgSrc)}
                  />
                </div>
                <div className="mt-2.5 min-w-0 pl-0.5 text-left">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-neutral-900 sm:text-base dark:text-white">
                    {p.eventName}
                  </h3>
                  {p.name ? (
                    <p className="mt-0.5 line-clamp-1 text-xs font-medium text-neutral-500 sm:text-sm dark:text-white/50">
                      {p.name}
                    </p>
                  ) : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-neutral-400 md:hidden dark:text-white/35" aria-hidden>
        Swipe for more
      </p>
    </div>
  );
}
