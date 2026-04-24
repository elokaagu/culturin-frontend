"use client";

import { useMemo, useState } from "react";

import {
  getMajorCitiesByContinent,
  totalMajorCityCount,
  type CountryExplorerContinent,
} from "../../lib/majorWorldCities";

import Header from "./Header";

type CountryExplorerLayoutProps = {
  title: string;
  continent: CountryExplorerContinent;
  countries: readonly string[];
};

/**
 * Shared layout for /countries/* explorer pages: header, country list panel, major cities grid.
 */
export default function CountryExplorerLayout({
  title,
  continent,
  countries,
}: CountryExplorerLayoutProps) {
  const [query, setQuery] = useState("");
  const cities = useMemo(() => getMajorCitiesByContinent(continent), [continent]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.country.toLowerCase().includes(q),
    );
  }, [cities, query]);

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
          aria-label={`Major cities in ${title}`}
          className="min-h-[min(24rem,50vh)] flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-950/40"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">
                Major cities
              </h2>
              <p className="mt-1 m-0 text-sm text-neutral-500 dark:text-white/60">
                {filtered.length} of {cities.length} in this region · {totalMajorCityCount} listed
                worldwide
              </p>
            </div>
            <label className="flex w-full min-w-0 flex-col gap-1 sm:max-w-xs">
              <span className="sr-only">Filter cities</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city or country…"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80 dark:border-white/15 dark:bg-black dark:text-white dark:placeholder:text-white/40"
              />
            </label>
          </div>
          <div className="mt-4 max-h-[min(70vh,40rem)] overflow-y-auto pr-1 [scrollbar-color:rgba(0,0,0,0.25)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent]">
            <ul
              className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              role="list"
            >
              {filtered.map((m) => (
                <li
                  key={`${m.name}-${m.country}`}
                  className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">
                    {m.name}
                  </p>
                  <p className="m-0 mt-0.5 text-xs text-neutral-500 dark:text-white/60">
                    {m.country}
                  </p>
                </li>
              ))}
            </ul>
            {filtered.length === 0 ? (
              <p className="m-0 py-8 text-center text-sm text-neutral-500 dark:text-white/55">
                No cities match that filter. Try another term.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
