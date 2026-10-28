import type { ReactNode } from "react";

import { citedKeys, formatDateRange, visibleSections, type Audience } from "@/lib/briefings/output";
import { SECTION_META, type BriefingSections, type BriefingSource, type NamedItem, type SectionKey } from "@/lib/briefings/types";
import { EDITORIAL_ACCENT, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE } from "@/lib/theme/culturinTokens";

const DISPLAY = "var(--font-display), 'Times New Roman', serif";

function Cites({ keys }: { keys: string[] }) {
  if (!keys.length) return null;
  return (
    <sup className="ml-0.5 whitespace-nowrap text-[10px] font-semibold">
      {keys.map((k, i) => (
        <a key={k} href={`#source-${k}`} className="no-underline" style={{ color: EDITORIAL_ACCENT }} aria-label={`Source ${k}`}>
          {i ? "," : ""}
          {k}
        </a>
      ))}
    </sup>
  );
}

function Section({ k, children }: { k: keyof typeof SECTION_META; children: ReactNode }) {
  return (
    <section id={k} className="border-t py-16" style={{ borderColor: EDITORIAL_RULE }}>
      <p className="m-0 mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: EDITORIAL_MUTED }}>
        {SECTION_META[k].eyebrow}
      </p>
      <h2 className="m-0 text-3xl font-medium leading-tight sm:text-4xl" style={{ fontFamily: DISPLAY }}>
        {SECTION_META[k].title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function NamedGrid({ items }: { items: NamedItem[] }) {
  return (
    <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i.id}>
          <h3 className="m-0 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
            {i.name}
          </h3>
          <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: EDITORIAL_INK }}>
            {i.detail}
            <Cites keys={i.sources} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/** The briefing body, shared by the professional share-link report and the public guide. */
export function BriefingReport({
  sections: raw,
  sources,
  audience,
  localNotes,
  curatorName,
}: {
  sections: BriefingSections;
  sources: BriefingSource[];
  audience: Audience;
  localNotes?: string;
  curatorName?: string | null;
}) {
  const s = visibleSections(raw, audience);
  const used = new Set(citedKeys(s));
  const listed = sources.filter((x) => used.has(x.key));
  const nav = (Object.keys(SECTION_META) as SectionKey[]).filter((k) =>
    k === "snapshot" ? true : (s[k] as unknown[]).length > 0,
  );

  return (
    <>
      <nav aria-label="Sections" className="flex flex-wrap gap-2 py-8">
        {nav.map((k) => (
          <a
            key={k}
            href={`#${k}`}
            className="rounded-full border px-4 py-1.5 text-xs font-semibold no-underline transition-colors hover:border-[color:var(--c-accent)]"
            style={{ borderColor: EDITORIAL_RULE, color: EDITORIAL_INK }}
          >
            {SECTION_META[k].title}
          </a>
        ))}
      </nav>

      <Section k="snapshot">
        <p className="m-0 max-w-3xl text-lg leading-relaxed sm:text-xl" style={{ fontFamily: DISPLAY }}>
          {s.snapshot.text}
          <Cites keys={s.snapshot.sources} />
        </p>
        {s.snapshot.numbers.length ? (
          <ul className="m-0 mt-10 grid list-none grid-cols-1 border-t p-0 sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: EDITORIAL_RULE }}>
            {s.snapshot.numbers.map((n) => (
              <li key={n.id} className="border-b py-6 pr-6" style={{ borderColor: EDITORIAL_RULE }}>
                <p className="m-0 text-4xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: EDITORIAL_ACCENT }}>
                  {n.value}
                </p>
                <p className="m-0 mt-3 text-sm leading-relaxed">
                  {n.label}
                  <Cites keys={n.sources} />
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {s.food.length ? (
        <Section k="food">
          <NamedGrid items={s.food} />
        </Section>
      ) : null}
      {s.history.length ? (
        <Section k="history">
          <NamedGrid items={s.history} />
        </Section>
      ) : null}
      {s.musicArt.length ? (
        <Section k="musicArt">
          <NamedGrid items={s.musicArt} />
        </Section>
      ) : null}
      {s.neighbourhoods.length ? (
        <Section k="neighbourhoods">
          <NamedGrid items={s.neighbourhoods} />
        </Section>
      ) : null}

      {s.influencers.length ? (
        <Section k="influencers">
          <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
            {s.influencers.map((p) => (
              <li key={p.id}>
                <h3 className="m-0 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
                  {p.name}
                </h3>
                <p className="m-0 mt-1 text-xs uppercase tracking-[0.15em]" style={{ color: EDITORIAL_MUTED }}>
                  {[p.handle ? `@${p.handle}` : null, p.platform, p.reach].filter(Boolean).join(" · ")}
                </p>
                <p className="m-0 mt-2 text-sm leading-relaxed">
                  {p.why}
                  <Cites keys={p.sources} />
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {s.calendar.length ? (
        <Section k="calendar">
          <ol className="m-0 list-none p-0">
            {s.calendar.map((m) => (
              <li key={m.id} className="grid gap-2 border-t py-5 sm:grid-cols-[12rem_1fr]" style={{ borderColor: EDITORIAL_RULE }}>
                <p className="m-0 text-sm font-semibold" style={{ color: EDITORIAL_ACCENT }}>
                  {formatDateRange(m.start, m.end)}
                </p>
                <div>
                  <h3 className="m-0 text-lg font-medium" style={{ fontFamily: DISPLAY }}>
                    {m.name}
                  </h3>
                  <p className="m-0 mt-1 text-xs uppercase tracking-[0.15em]" style={{ color: EDITORIAL_MUTED }}>
                    {[m.category, m.location].filter(Boolean).join(" · ")}
                  </p>
                  <p className="m-0 mt-2 text-sm leading-relaxed">
                    {m.detail}
                    <Cites keys={m.sources} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {s.sensitivities.length ? (
        <Section k="sensitivities">
          <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
            {s.sensitivities.map((x) => (
              <li key={x.id}>
                <h3 className="m-0 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
                  {x.title}
                </h3>
                <p className="m-0 mt-2 text-sm leading-relaxed">
                  {x.detail}
                  <Cites keys={x.sources} />
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {s.opportunities.length ? (
        <Section k="opportunities">
          <ol className="m-0 grid list-none gap-5 p-0 lg:grid-cols-2">
            {s.opportunities.map((o, i) => (
              <li key={o.id} className="rounded-3xl border p-8" style={{ borderColor: EDITORIAL_RULE }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: EDITORIAL_ACCENT }}>
                  Idea {i + 1}
                </p>
                <h3 className="m-0 mt-3 text-2xl font-medium" style={{ fontFamily: DISPLAY }}>
                  {o.title}
                </h3>
                <p className="m-0 mt-3 text-sm leading-relaxed">{o.idea}</p>
                <p className="m-0 mt-3 text-sm leading-relaxed" style={{ color: EDITORIAL_MUTED }}>
                  {o.why}
                  <Cites keys={o.sources} />
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {localNotes ? (
        <section className="border-t py-16" style={{ borderColor: EDITORIAL_RULE }}>
          <p className="m-0 mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: EDITORIAL_MUTED }}>
            {curatorName ? `From ${curatorName}` : "From our curators"}
          </p>
          <p className="m-0 max-w-3xl whitespace-pre-line text-lg leading-relaxed" style={{ fontFamily: DISPLAY }}>
            {localNotes}
          </p>
        </section>
      ) : null}

      {listed.length ? (
        <section id="sources" className="border-t py-16" style={{ borderColor: EDITORIAL_RULE }}>
          <p className="m-0 mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: EDITORIAL_MUTED }}>
            Sources
          </p>
          <h2 className="m-0 text-3xl font-medium" style={{ fontFamily: DISPLAY }}>
            Where every claim comes from
          </h2>
          <ol className="m-0 mt-8 flex list-none flex-col gap-3 p-0 text-sm">
            {listed.map((x) => (
              <li key={x.key} id={`source-${x.key}`} className="grid scroll-mt-24 grid-cols-[3rem_1fr] gap-2">
                <span className="font-semibold" style={{ color: EDITORIAL_ACCENT }}>
                  {x.key}
                </span>
                <span>
                  {x.url ? (
                    <a href={x.url} target="_blank" rel="noopener noreferrer" style={{ color: EDITORIAL_INK }}>
                      {x.title ?? x.url}
                    </a>
                  ) : (
                    x.title
                  )}
                  <span style={{ color: EDITORIAL_MUTED }}>{[x.publisher, x.publishedDate].filter(Boolean).map((v) => ` · ${v}`).join("")}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  );
}
