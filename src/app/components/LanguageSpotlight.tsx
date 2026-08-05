"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { exploreWorldCountries } from "@/lib/exploreWorldCountries";
import { countryPhrasebooks, getCountryPhrasebook } from "@/lib/countryPhrasebook";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

const AVAILABLE_COUNTRIES = exploreWorldCountries.filter((c) =>
  countryPhrasebooks.some((p) => p.countryId === c.id),
);

type LanguageSpotlightProps = {
  headingId: string;
};

/**
 * Public "Learn a few words" widget — pick a country, see 2-3 common words in its
 * language. No account needed; a lighter, teaser counterpart to the authenticated
 * language-learning tools on the profile page.
 */
export default function LanguageSpotlight({ headingId }: LanguageSpotlightProps) {
  const [activeId, setActiveId] = useState(AVAILABLE_COUNTRIES[0]?.id ?? "");
  const active = getCountryPhrasebook(activeId);
  const activeCountry = AVAILABLE_COUNTRIES.find((c) => c.id === activeId);

  return (
    <div className="w-full min-w-0">
      <header className="mb-5 sm:mb-6">
        <h2 id={headingId} className="text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
          Learn a few words
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed sm:mt-1.5 sm:text-[0.95rem]" style={{ color: "var(--c-muted)" }}>
          Pick a country and pick up a couple of words before you go.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a country">
        {AVAILABLE_COUNTRIES.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(c.id)}
              className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
              style={
                isActive
                  ? { background: "var(--c-accent)", borderColor: "var(--c-accent)", color: "#1c1a17" }
                  : { borderColor: "var(--c-rule)", color: "var(--c-ink)" }
              }
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="mt-6 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--c-rule)" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-accent)" }}>
            {active.language}
          </p>
          {active.languageNote ? (
            <p className="mt-1 text-xs" style={{ color: "var(--c-muted)" }}>{active.languageNote}</p>
          ) : null}

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {active.phrases.map((p) => (
              <div key={p.en}>
                <dt className="text-xs uppercase tracking-wide" style={{ color: "var(--c-muted)" }}>{p.en}</dt>
                <dd
                  className="mt-1 text-lg font-medium tracking-tight sm:text-xl"
                  style={{ ...displayFont, color: "var(--c-ink)" }}
                >
                  {p.phrase}
                </dd>
              </div>
            ))}
          </dl>

          {activeCountry ? (
            <Link
              href={`/countries/${activeCountry.id}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-colors hover:opacity-70"
              style={{ color: "var(--c-accent)" }}
            >
              More on {activeCountry.name} <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
