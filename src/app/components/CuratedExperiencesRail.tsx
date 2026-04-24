"use client";

import Image from "next/image";
import Link from "next/link";

import type { providerHeroCard } from "../../libs/interface";
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
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pt-1 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(0,0,0,0.2)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
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
              className="w-[min(78vw,17.5rem)] shrink-0 snap-center sm:w-[min(44vw,16.5rem)] md:w-[min(31vw,15.5rem)] lg:w-60"
            >
              <Link
                href={`/providers/${p.slug}`}
                className="group flex h-full min-h-[19rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-100 no-underline outline-none ring-offset-2 ring-offset-neutral-50 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] motion-reduce:transform-none motion-reduce:hover:transform-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02] dark:ring-offset-black dark:hover:border-amber-400/30 dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={imgSrc}
                    alt={imgAlt}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 31vw, 15rem"
                    unoptimized={isBundledPlaceholderSrc(imgSrc)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 px-4 pb-5 pt-4">
                  <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-neutral-900 line-clamp-2 transition-colors group-hover:text-amber-900 dark:text-white dark:group-hover:text-amber-50 sm:text-base">
                    {p.eventName}
                  </h3>
                  {p.name ? <p className="text-xs text-neutral-600 sm:text-sm dark:text-white/50">{p.name}</p> : null}
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
