"use client";

import { Link } from "next-view-transitions";

import type { providerHeroCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import SafeContentImage from "./SafeContentImage";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

type ExperiencesSpreadProps = {
  providers: providerHeroCard[];
  title: string;
  description: string;
  viewAllHref: string;
  headingId: string;
};

/**
 * "Experiences" as a 2-up editorial spread — large imagery and real hierarchy
 * (event name as headline, host as byline) instead of a dense card grid.
 */
export default function ExperiencesSpread({
  providers,
  title,
  description,
  viewAllHref,
  headingId,
}: ExperiencesSpreadProps) {
  const featured = providers.slice(0, 2);

  return (
    <div className="w-full min-w-0">
      <header className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div className="min-w-0 flex-1 pr-2">
          <h2 id={headingId} className="text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed sm:mt-1.5 sm:text-[0.95rem]" style={{ color: "var(--c-muted)" }}>
            {description}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 self-center text-xs font-semibold uppercase tracking-[0.08em] no-underline transition-colors hover:opacity-70"
          style={{ color: "var(--c-accent)" }}
        >
          See all →
        </Link>
      </header>

      {featured.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>Experiences are loading into the catalog.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {featured.map((p) => {
            const imgSrc = resolveContentImageSrc(p.bannerImage?.image?.url);
            const imgAlt = p.bannerImage?.image?.alt || p.eventName || p.name || "Experience";
            return (
              <Link key={p.slug} href={`/providers/${p.slug}`} className="group block no-underline outline-none">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-900">
                  <SafeContentImage
                    src={imgSrc}
                    alt={imgAlt}
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, 40vw"
                    unoptimized={isBundledPlaceholderSrc(imgSrc) || cmsImageUnoptimized(imgSrc)}
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium tracking-tight sm:text-xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
                  {p.eventName}
                </h3>
                {p.name ? (
                  <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>Hosted by {p.name}</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
