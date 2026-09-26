import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { getAdminEvents } from "@/lib/events/eventsStore";
import { RANGES, getAnalytics, type Bucket, type Kpi, type RangeKey } from "@/lib/studio/analytics";
import LazyImg from "@/app/components/LazyImg";
import { studioPanelClass } from "@/app/admin/_lib/studioTheme";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Who is joining the Culturin audience, where they come from, and what they engage with.",
};

const INTEREST_LABELS: Record<string, string> = {
  intelligence: "Intelligence",
  programming: "Programming",
  moments: "Moments",
  "cultural-marketing": "Cultural marketing",
  "new-territory": "New territory",
  "cultural-intelligence": "Cultural intelligence",
  sponsorship: "Sponsorship",
  activation: "Brand activation",
  attend: "Attending an event",
  other: "Something else",
};

function Delta({ kpi }: { kpi: Kpi }) {
  if (kpi.previous === null) return <span className="text-xs text-[color:var(--c-muted)]">all time</span>;
  if (kpi.previous === 0 && kpi.inRange === 0) return <span className="text-xs text-[color:var(--c-muted)]">no change</span>;
  if (kpi.previous === 0) return <span className="text-xs font-medium text-emerald-500">new this period</span>;
  const pct = Math.round(((kpi.inRange - kpi.previous) / kpi.previous) * 100);
  return (
    <span className={cn("text-xs font-medium", pct >= 0 ? "text-emerald-500" : "text-rose-500")}>
      {pct >= 0 ? "+" : ""}
      {pct}% vs previous
    </span>
  );
}

function BarList({ title, note, items, empty }: { title: string; note?: string; items: Bucket[]; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((n, i) => n + i.count, 0);
  return (
    <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
      <div>
        <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">{title}</h2>
        {note ? <p className="m-0 mt-1 text-xs text-[color:var(--c-muted)]">{note}</p> : null}
      </div>
      {items.length === 0 ? (
        <p className="m-0 text-sm text-[color:var(--c-muted)]">{empty}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((item) => (
            <li key={item.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-[color:var(--c-ink)]">{item.label}</span>
                <span className="shrink-0 tabular-nums text-[color:var(--c-muted)]">
                  {item.count}
                  {total > 0 ? ` · ${Math.round((item.count / total) * 100)}%` : ""}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--c-rule)" }} aria-hidden>
                <div className="h-full rounded-full" style={{ width: `${(item.count / max) * 100}%`, background: "var(--c-accent)" }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function StudioAnalyticsPage({ searchParams }: { searchParams: { range?: string } }) {
  const range = (RANGES.some((r) => r.key === searchParams.range) ? searchParams.range : "90") as RangeKey;
  const { events } = await getAdminEvents();
  const eventNames = Object.fromEntries(events.map((e) => [e.slug, e.name]));
  const a = await getAnalytics(range, eventNames);

  const weeklyMax = Math.max(1, ...a.weekly.map((w) => w.subscribers + w.rsvps + w.inquiries));
  const notGiven = a.seniority.find((s) => s.label === "Not given")?.count ?? 0;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Analytics</h1>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--c-muted)]">
        Who is joining your audience, where they come from, and what they engage with. Built from your own sign-ups, RSVPs, inquiries and downloads.
      </p>

      <nav aria-label="Time range" className="mt-6 flex flex-wrap gap-2">
        {RANGES.map((r) => {
          const active = r.key === range;
          return (
            <Link
              key={r.key}
              href={`/admin/analytics?range=${r.key}`}
              aria-current={active ? "page" : undefined}
              className="rounded-full border px-4 py-1.5 text-xs font-semibold no-underline transition"
              style={
                active
                  ? { background: "var(--c-accent)", borderColor: "var(--c-accent)", color: "#1c1a17" }
                  : { borderColor: "var(--c-rule)", color: "var(--c-ink)" }
              }
            >
              {r.label}
            </Link>
          );
        })}
      </nav>

      {!a.connected ? (
        <p className="mt-8 rounded-xl border border-dashed border-[color:var(--c-rule)] px-4 py-4 text-sm text-[color:var(--c-muted)]">
          The database isn&apos;t connected in this environment, so analytics can&apos;t be calculated.
        </p>
      ) : (
        <>
          <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-5">
            {a.kpis.map((k) => (
              <li key={k.label} className={cn(studioPanelClass, "flex flex-col gap-1 !p-4")}>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">{k.label}</span>
                <span className="font-display text-3xl font-semibold tabular-nums text-[color:var(--c-ink)]">{k.inRange}</span>
                <Delta kpi={k} />
                <span className="text-xs text-[color:var(--c-muted)]">{k.total} in total</span>
              </li>
            ))}
          </ul>

          <section className={cn(studioPanelClass, "mt-6")}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">New contacts per week</h2>
              <p className="m-0 flex items-center gap-4 text-xs text-[color:var(--c-muted)]">
                <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--c-accent)" }} />Subscribers</span>
                <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--c-ink)" }} />RSVPs</span>
                <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--c-muted)" }} />Inquiries</span>
              </p>
            </div>
            <ol className="m-0 mt-6 flex h-44 list-none items-end gap-2 p-0" aria-label="New contacts per week, last 12 weeks">
              {a.weekly.map((w) => {
                const total = w.subscribers + w.rsvps + w.inquiries;
                const h = (n: number) => `${(n / weeklyMax) * 100}%`;
                return (
                  <li key={w.weekStart} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={`Week of ${w.weekStart}: ${total} new (${w.subscribers} subscribers, ${w.rsvps} RSVPs, ${w.inquiries} inquiries)`}>
                    <div className="flex w-full flex-1 flex-col justify-end overflow-hidden rounded-md">
                      <div style={{ height: h(w.inquiries), background: "var(--c-muted)" }} />
                      <div style={{ height: h(w.rsvps), background: "var(--c-ink)" }} />
                      <div style={{ height: h(w.subscribers), background: "var(--c-accent)" }} />
                    </div>
                    <span className="text-[0.6rem] tabular-nums text-[color:var(--c-muted)]">{w.weekStart.slice(5)}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <BarList
              title="Seniority"
              note={`From job titles given on RSVPs. ${notGiven} ${notGiven === 1 ? "person" : "people"} in this period didn't give a title.`}
              items={a.seniority}
              empty="No contacts in this period."
            />
            <BarList title="Email type" note="Work email is a rough signal of a professional audience." items={a.emailKind} empty="No contacts in this period." />
            <BarList title="Top companies" note="Distinct people per company, from sign-ups, RSVPs and inquiries." items={a.topCompanies} empty="No companies given in this period." />
            <BarList title="Top work email domains" items={a.topDomains} empty="No work emails in this period." />
            <BarList title="Where subscribers came from" items={a.sources} empty="No new subscribers in this period." />
            <BarList title="RSVPs by event" items={a.rsvpByEvent} empty="No RSVPs in this period." />
            <BarList
              title="What inquiries are about"
              items={a.inquiryInterest.map((i) => ({ ...i, label: INTEREST_LABELS[i.label] ?? i.label }))}
              empty="No inquiries in this period."
            />
            <section className={cn(studioPanelClass, "flex flex-col gap-3")}>
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">Engagement across the audience</h2>
              <p className="m-0 text-sm text-[color:var(--c-muted)]">
                <span className="font-display text-3xl font-semibold text-[color:var(--c-ink)]">{a.uniquePeople}</span> unique people have shared an email with Culturin.{" "}
                <span className="font-semibold text-[color:var(--c-ink)]">{a.repeatPeople}</span> of them have engaged in more than one way (for example subscribed and RSVPed).
              </p>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">Most downloaded photos</h2>
              {a.topPhotos.length === 0 ? (
                <p className="m-0 text-sm text-[color:var(--c-muted)]">No downloads in this period.</p>
              ) : (
                <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0">
                  {a.topPhotos.map((p) => (
                    <li key={p.src} className="relative overflow-hidden rounded-lg border border-[color:var(--c-rule)]">
                      <LazyImg src={p.src} alt="" className="aspect-square w-full object-cover" />
                      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-white">{p.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">Sales deck engagement</h2>
              {a.deckViews.length === 0 ? (
                <p className="m-0 text-sm text-[color:var(--c-muted)]">No deck views in this period.</p>
              ) : (
                <ul className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
                  {a.deckViews.map((d) => (
                    <li key={d.title} className="flex items-baseline justify-between gap-3 border-b border-[color:var(--c-rule)] pb-2 last:border-0">
                      <span className="min-w-0 truncate text-[color:var(--c-ink)]">{d.title}</span>
                      <span className="shrink-0 tabular-nums text-[color:var(--c-muted)]">
                        {d.views} views · {d.avgSeconds}s avg · {d.completed} finished
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="mt-8 rounded-xl border border-dashed border-[color:var(--c-rule)] p-5 text-sm text-[color:var(--c-muted)]">
            <p className="m-0 font-semibold text-[color:var(--c-ink)]">About demographics</p>
            <p className="m-0 mt-2 max-w-3xl leading-relaxed">
              Culturin only knows what people choose to tell you: their name, email, company and, on RSVPs, their job title. Age, gender and location aren&apos;t
              collected, so they can&apos;t be reported here. Website traffic (visitors, countries, devices) lives in{" "}
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-[color:var(--c-accent)]">Google Analytics</a>.
              If you want richer audience data, the simplest step is adding optional fields (such as industry or city) to the RSVP and sign-up forms.
            </p>
          </aside>
        </>
      )}
    </div>
  );
}
