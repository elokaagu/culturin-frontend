"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { studioPanelClass } from "@/app/admin/_lib/studioTheme";
import type { AudienceBriefing } from "@/lib/studio/audienceBriefing";
import { cn } from "@/lib/utils";

const headingClass = "m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function IntelligenceClient({ initial }: { initial: AudienceBriefing | null }) {
  const [briefing, setBriefing] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/intelligence/briefing", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message ?? "Something went wrong.");
      setBriefing(body as AudienceBriefing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const c = briefing?.content;
  const industryMax = Math.max(1, ...(c?.industries.map((i) => i.approxPeople) ?? []));

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60"
          style={{ background: "var(--c-accent)", color: "#1c1a17" }}
        >
          <Sparkles className={cn("h-4 w-4", busy && "animate-pulse")} aria-hidden />
          {busy ? "Writing the briefing…" : briefing ? "Generate a new briefing" : "Generate a briefing"}
        </button>
        {busy ? <span className="text-xs text-[color:var(--c-muted)]">This usually takes a minute or two.</span> : null}
        {briefing && !busy ? (
          <span className="text-xs text-[color:var(--c-muted)]">
            Last written {formatWhen(briefing.createdAt)}
            {briefing.createdBy ? ` by ${briefing.createdBy}` : ""}, from {briefing.stats.sentToModel.toLocaleString()} profiled people out of{" "}
            {briefing.stats.people.toLocaleString()} in total.
          </span>
        ) : null}
      </div>
      {error ? <p className="m-0 rounded-xl border border-rose-500/40 px-4 py-3 text-sm text-rose-500">{error}</p> : null}

      {!c ? (
        <p className="m-0 rounded-xl border border-dashed border-[color:var(--c-rule)] px-4 py-6 text-sm text-[color:var(--c-muted)]">
          No briefing yet. Generate one to see who is in your audience and where the opportunities are.
        </p>
      ) : (
        <>
          <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
            <h2 className="m-0 font-display text-xl font-semibold leading-snug tracking-tight text-[color:var(--c-ink)] sm:text-2xl">{c.headline}</h2>
            {c.summary
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="m-0 max-w-3xl text-sm leading-relaxed text-[color:var(--c-ink)]">
                  {para}
                </p>
              ))}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={headingClass}>Segments</h2>
            <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
              {c.segments.map((s) => (
                <li key={s.name} className={cn(studioPanelClass, "flex flex-col gap-2")}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-[color:var(--c-ink)]">{s.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-[color:var(--c-muted)]">~{s.approxPeople}</span>
                  </div>
                  <p className="m-0 text-sm leading-relaxed text-[color:var(--c-muted)]">{s.description}</p>
                  {s.examples.length ? (
                    <ul className="m-0 mt-1 flex list-none flex-col gap-1 p-0 text-xs text-[color:var(--c-ink)]">
                      {s.examples.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
            <h2 className={headingClass}>Suggested next moves</h2>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {c.nextMoves.map((m, i) => (
                <li key={m.title} className="flex gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: "var(--c-accent)", color: "#1c1a17" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">{m.title}</p>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-[color:var(--c-muted)]">{m.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
              <h2 className={headingClass}>Standout people</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {c.standoutPeople.map((p) => (
                  <li key={`${p.name}-${p.company}`} className="border-b border-[color:var(--c-rule)] pb-3 last:border-0 last:pb-0">
                    <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">{p.name}</p>
                    <p className="m-0 text-xs text-[color:var(--c-muted)]">{[p.role, p.company].filter(Boolean).join(" · ")}</p>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-[color:var(--c-ink)]">{p.why}</p>
                  </li>
                ))}
              </ul>
            </section>
            <div className="flex flex-col gap-6">
              <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
                <h2 className={headingClass}>Standout companies</h2>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {c.standoutCompanies.map((co) => (
                    <li key={co.name} className="border-b border-[color:var(--c-rule)] pb-3 last:border-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-[color:var(--c-ink)]">{co.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-[color:var(--c-muted)]">
                          {co.people} {co.people === 1 ? "person" : "people"}
                        </span>
                      </div>
                      <p className="m-0 mt-1 text-sm leading-relaxed text-[color:var(--c-muted)]">{co.why}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
                <h2 className={headingClass}>Industries</h2>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {c.industries.map((ind) => (
                    <li key={ind.name} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-[color:var(--c-ink)]">{ind.name}</span>
                        <span className="shrink-0 tabular-nums text-[color:var(--c-muted)]">~{ind.approxPeople}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--c-rule)" }} aria-hidden>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(ind.approxPeople / industryMax) * 100}%`, background: "var(--c-accent)" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {c.dataGaps.length ? (
            <aside className="rounded-xl border border-dashed border-[color:var(--c-rule)] p-5 text-sm text-[color:var(--c-muted)]">
              <p className="m-0 font-semibold text-[color:var(--c-ink)]">What would sharpen this</p>
              <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5">
                {c.dataGaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </aside>
          ) : null}
        </>
      )}
    </div>
  );
}
