"use client";

import Header from "./Header";
import MapGl from "./Map";

export type CountryExplorerContinent =
  | "africa"
  | "asia"
  | "europe"
  | "northAmerica"
  | "southAmerica";

type CountryExplorerLayoutProps = {
  title: string;
  continent: CountryExplorerContinent;
  countries: readonly string[];
};

/**
 * Shared layout for /countries/* explorer pages: header, country list panel, map.
 * Replaces duplicated styled-components + per-page ThemeProvider blocks.
 */
export default function CountryExplorerLayout({
  title,
  continent,
  countries,
}: CountryExplorerLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col gap-6 bg-neutral-50 px-5 pb-12 pt-[var(--header-offset)] text-neutral-900 lg:flex-row lg:items-stretch lg:gap-8 lg:px-10 dark:bg-black dark:text-white">
        <aside className="flex w-full max-w-md shrink-0 flex-col rounded-2xl border-2 border-neutral-200 bg-white transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-transparent dark:hover:bg-neutral-950 lg:max-w-xs">
          <div className="flex flex-col gap-1 px-5 pb-2 pt-6">
            <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
            <p className="text-sm text-neutral-500 dark:text-white/65">Browse countries</p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-2 px-5 pb-6">
            {countries.map((name) => (
              <li key={name} className="text-base text-neutral-800 dark:text-white/90">
                {name}
              </li>
            ))}
          </ul>
        </aside>
        <section
          aria-label={`Map of ${title}`}
          className="min-h-[min(24rem,50vh)] flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/80 p-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-950/40"
        >
          <div className="h-full w-full overflow-x-auto">
            <MapGl continent={continent} />
          </div>
        </section>
      </div>
    </>
  );
}
