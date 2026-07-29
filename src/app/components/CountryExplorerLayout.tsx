"use client";

import { useMemo, useState } from "react";

import {
  getMajorCitiesByContinent,
  totalMajorCityCount,
  type CountryExplorerContinent,
} from "../../lib/majorWorldCities";

import IslandNav from "./IslandNav";
import HomeFooter from "./HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";

type CountryExplorerLayoutProps = {
  title: string;
  continent: CountryExplorerContinent;
  countries: readonly string[];
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

/**
 * Shared layout for /countries/* explorer pages: nav, country list panel, major cities grid.
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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <div className="flex min-h-dvh flex-col gap-6 px-5 pb-12 lg:flex-row lg:items-stretch lg:gap-8 lg:px-10" style={{ paddingTop: "8rem" }}>
        <aside className="flex w-full max-w-md shrink-0 flex-col rounded-2xl border-2 transition-colors lg:max-w-xs" style={{ borderColor: "var(--c-rule)" }}>
          <div className="flex flex-col gap-1 px-5 pb-2 pt-6">
            <h1 className="text-3xl font-medium leading-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>{title}</h1>
            <p className="text-sm" style={{ color: "var(--c-muted)" }}>Browse countries</p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-2 px-5 pb-6">
            {countries.map((name) => (
              <li key={name} className="text-base" style={{ color: "var(--c-ink)" }}>
                {name}
              </li>
            ))}
          </ul>
        </aside>
        <section
          aria-label={`Major cities in ${title}`}
          className="min-h-[min(24rem,50vh)] flex-1 overflow-hidden rounded-2xl border p-4 sm:p-5"
          style={{ borderColor: "var(--c-rule)" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <h2 className="m-0 text-lg font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>
                Major cities
              </h2>
              <p className="mt-1 m-0 text-sm" style={{ color: "var(--c-muted)" }}>
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
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)", color: "var(--c-ink)" }}
              />
            </label>
          </div>
          <div className="mt-4 max-h-[min(70vh,40rem)] overflow-y-auto pr-1">
            <ul
              className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              role="list"
            >
              {filtered.map((m) => (
                <li key={`${m.name}-${m.country}`} className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--c-rule)" }}>
                  <p className="m-0 text-sm font-semibold" style={{ color: "var(--c-ink)" }}>
                    {m.name}
                  </p>
                  <p className="m-0 mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                    {m.country}
                  </p>
                </li>
              ))}
            </ul>
            {filtered.length === 0 ? (
              <p className="m-0 py-8 text-center text-sm" style={{ color: "var(--c-muted)" }}>
                No cities match that filter. Try another term.
              </p>
            ) : null}
          </div>
        </section>
      </div>
      <HomeFooter />
    </div>
  );
}
