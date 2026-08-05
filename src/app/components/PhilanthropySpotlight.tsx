"use client";

import { Link } from "next-view-transitions";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export type PhilanthropyProject = {
  name: string;
  note: string;
  href: string;
};

const PROJECTS: PhilanthropyProject[] = [
  {
    name: "Culturin Pledge for Peace",
    note: "One of several charitable initiatives we support.",
    href: "/our-mission",
  },
];

/**
 * A quieter, text-forward "statement" section — deliberately shaped differently from the
 * content rails above it, since this is a values statement, not a content feed.
 */
export default function PhilanthropySpotlight({ headingId }: { headingId: string }) {
  return (
    <div
      className="rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
      style={{ background: "color-mix(in srgb, var(--c-accent) 8%, transparent)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-accent)" }}>
        Beyond travel
      </p>
      <h2
        id={headingId}
        className="mt-3 max-w-2xl text-2xl font-medium leading-[1.15] tracking-tight sm:text-3xl"
        style={{ ...displayFont, color: "var(--c-ink)" }}
      >
        Culture, with a conscience.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--c-muted)" }}>
        Alongside our editorial and events work, Culturin supports a number of charitable
        projects — putting our platform, partners, and audience to work for causes bigger than
        travel.
      </p>

      <ul className="m-0 mt-7 flex list-none flex-col gap-4 p-0 sm:flex-row sm:flex-wrap sm:gap-8">
        {PROJECTS.map((project) => (
          <li key={project.name}>
            <Link href={project.href} className="group block no-underline outline-none">
              <p
                className="text-base font-medium tracking-tight transition-colors group-hover:opacity-70 sm:text-lg"
                style={{ ...displayFont, color: "var(--c-ink)" }}
              >
                {project.name} <span aria-hidden style={{ color: "var(--c-accent)" }}>→</span>
              </p>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--c-muted)" }}>{project.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
