"use client";

import { Link } from "next-view-transitions";

import type { ExploreWorldCountry } from "@/lib/exploreWorldCountries";
import { resolveContentImageSrc } from "../../lib/imagePlaceholder";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

type WorldIndexGridProps = {
  countries: ExploreWorldCountry[];
  title: string;
  description: string;
  viewAllHref: string;
  headingId: string;
};

/**
 * "Explore the World" as a typographic atlas index rather than a rail of photo cards —
 * country names are the primary content; imagery only appears as a small accent on hover.
 */
export default function WorldIndexGrid({
  countries,
  title,
  description,
  viewAllHref,
  headingId,
}: WorldIndexGridProps) {
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

      {countries.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>No countries to show right now.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-x-6 p-0 sm:grid-cols-3 md:grid-cols-4">
          {countries.map((c) => {
            const src = resolveContentImageSrc(c.imageUrl);
            return (
              <li key={c.id} className="border-b" style={{ borderColor: "var(--c-rule)" }}>
                <Link
                  href={`/countries/${c.id}`}
                  className="group flex items-center justify-between gap-2 py-3 no-underline outline-none"
                >
                  <span
                    className="truncate text-base font-medium tracking-tight transition-colors group-hover:opacity-70 sm:text-lg"
                    style={{ ...displayFont, color: "var(--c-ink)" }}
                  >
                    {c.name}
                  </span>
                  <span
                    aria-hidden
                    className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-cover bg-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
