"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import {
  EDITORIAL_ACCENT,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  SURFACE_DARK,
} from "@/lib/theme/culturinTokens";
import Reveal from "@/app/components/motion/Reveal";
import {
  CASE_STUDY,
  CH1_STATS,
  CH2_COMPARISON,
  CH3_BARS,
  CH3_DRIVERS,
  CH3_STATS,
  CH4_STATS,
  CHAPTERS,
  EXECUTIVE_SUMMARY,
  HEADLINE_STATS,
  MEASUREMENT,
  PLAYBOOK,
  REPORT_EDITION,
  REPORT_SOURCE,
  REPORT_SUBTITLE,
  REPORT_TITLE,
  SOURCES,
  type Stat,
} from "./reportContent";

const INK = EDITORIAL_INK;
const MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;
const DISPLAY = "var(--font-display), 'Times New Roman', serif";
const UNLOCK_KEY = `culturin:${REPORT_SOURCE}:unlocked`;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
      {children}
    </p>
  );
}

function Cite({ id }: { id: number }) {
  return (
    <a href={`#source-${id}`} className="ml-0.5 align-super text-[10px] font-semibold no-underline" style={{ color: ACCENT }}>
      [{id}]
    </a>
  );
}

function StatGrid({ stats, cols = 4 }: { stats: Stat[]; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-1 border-t sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      style={{ borderColor: RULE }}
    >
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 90} className="h-full" as="div">
          <div className="h-full border-b py-8 pr-8 sm:pl-0" style={{ borderColor: RULE }}>
            <p className="m-0 text-6xl font-medium leading-none sm:text-7xl" style={{ fontFamily: DISPLAY, color: ACCENT }}>
              {s.value}
            </p>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed" style={{ color: INK }}>
              {s.label}
              <Cite id={s.source} />
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Chapter({
  n,
  title,
  lede,
  children,
}: {
  n: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <section id={`chapter-${n}`} className="border-t py-24 print:break-before-page print:border-t-0 print:py-10" style={{ borderColor: RULE }}>
      <Reveal>
        <Eyebrow>Chapter {n}</Eyebrow>
        <h2 className="m-0 max-w-3xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
          {title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-loose" style={{ color: MUTED }}>
          {lede}
        </p>
      </Reveal>
      <div className="mt-14">{children}</div>
    </section>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) return setError("Enter your first and last name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid work email.");
    if (!consent) return setError("Please accept the privacy policy to continue.");
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company.trim(),
          email: email.trim(),
          marketingConsent: true,
          source: REPORT_SOURCE,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      onUnlock();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  const input =
    "w-full rounded-full border bg-transparent px-5 py-3 text-sm outline-none transition-colors placeholder:opacity-60 focus:border-[color:var(--c-accent)] disabled:opacity-60";

  return (
    <section id="get-the-report" className="border-t py-24 print:hidden" style={{ borderColor: RULE }}>
      <div
        className="grid grid-cols-1 gap-12 overflow-hidden rounded-3xl p-8 sm:p-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20"
        style={{ background: SURFACE_DARK, color: "#f1e9dc" }}
      >
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">Free report</p>
          <h2 className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
            Read the full report.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-loose text-white/70">
            Six chapters, 15 independent data points, the Culturin playbook for building rooms that sell, and a
            measurement framework you can take to your CFO. Instant access, plus a downloadable PDF.
          </p>
          <ul className="mt-8 flex flex-col gap-3 p-0">
            {CHAPTERS.map((c) => (
              <li key={c.n} className="flex list-none items-baseline gap-4 text-sm text-white/80">
                <span className="w-6 text-[11px] font-semibold tracking-[0.15em] text-white/40">{c.n}</span>
                {c.title}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 self-center">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              aria-label="First name"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={pending}
              className={input}
              style={{ borderColor: "rgba(241,233,220,0.25)" }}
            />
            <input
              aria-label="Last name"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={pending}
              className={input}
              style={{ borderColor: "rgba(241,233,220,0.25)" }}
            />
          </div>
          <input
            aria-label="Company"
            autoComplete="organization"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={pending}
            className={input}
            style={{ borderColor: "rgba(241,233,220,0.25)" }}
          />
          <input
            aria-label="Work email"
            type="email"
            autoComplete="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className={input}
            style={{ borderColor: "rgba(241,233,220,0.25)" }}
          />
          <label className="mt-2 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-white/60">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#e08a5b]"
            />
            <span>
              Send me the report and occasional Culturin intelligence. I agree to the{" "}
              <Link href="/privacy" className="text-white/80 underline">
                privacy policy
              </Link>
              .
            </span>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-3 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85 disabled:opacity-60"
            style={{ background: "#e08a5b", color: SURFACE_DARK }}
          >
            {pending ? "Unlocking…" : "Get the report →"}
          </button>
          {error ? (
            <p className="m-0 text-xs text-[#f0ab85]" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function FullReport() {
  const maxLoss = CH2_COMPARISON.after.value;
  return (
    <>
      <Chapter
        n="01"
        title="The synthetic internet"
        lede="The feed was built for people. It’s now increasingly written by machines, browsed by machines, and ignored by the humans brands are trying to reach. Visibility online no longer means being seen."
      >
        <StatGrid stats={CH1_STATS} />
        <p className="mt-10 max-w-2xl text-base leading-loose" style={{ color: MUTED }}>
          When anyone can generate a thousand polished posts in an afternoon, polish stops being a signal. What
          becomes scarce, and therefore valuable, is proof that something real happened, with real people, in a real
          place.
        </p>
      </Chapter>

      <Chapter
        n="02"
        title="Attention got expensive"
        lede="Privacy changes, the end of cheap targeting, and ever more crowded auctions mean brands pay more for every new customer they win online, and keep less of the margin."
      >
        <Reveal as="div">
          <div className="rounded-3xl border p-8 sm:p-12" style={{ borderColor: RULE }}>
            <p className="m-0 text-sm" style={{ color: MUTED }}>
              Average amount merchants lose on each new customer acquired
              <Cite id={CH2_COMPARISON.source} />
            </p>
            <div className="mt-10 flex flex-col gap-6">
              {[CH2_COMPARISON.before, CH2_COMPARISON.after].map((row, i) => (
                <div key={row.year} className="flex items-center gap-5">
                  <span className="w-12 text-sm font-semibold" style={{ color: MUTED }}>
                    {row.year}
                  </span>
                  <div className="h-12 flex-1">
                    <div
                      className="flex h-full items-center justify-end rounded-full px-5 text-sm font-semibold"
                      style={{
                        width: `${(row.value / maxLoss) * 100}%`,
                        minWidth: "5rem",
                        background: i === 0 ? RULE : ACCENT,
                        color: i === 0 ? INK : SURFACE_DARK,
                      }}
                    >
                      ${row.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-6xl font-medium leading-none sm:text-7xl" style={{ fontFamily: DISPLAY, color: ACCENT }}>
              {CH2_COMPARISON.change}
            </p>
            <p className="mt-3 text-sm" style={{ color: INK }}>
              rise in eight years, driven almost entirely by acquisition costs and returns.
            </p>
          </div>
        </Reveal>
      </Chapter>

      <Chapter
        n="03"
        title="Why rooms work"
        lede="A live experience can’t be skipped, muted, or generated. It engages every sense at once, and it leaves people with something they want to talk about. The data from EventTrack 2026 is unambiguous."
      >
        {CH3_BARS.map((bar) => (
          <Reveal key={bar.label} className="mb-16" as="div">
            <p className="mb-8 text-sm font-semibold" style={{ color: INK }}>
              {bar.label}
              <Cite id={bar.source} />
            </p>
            {[
              { label: bar.adLabel, value: bar.ad, strong: false },
              { label: bar.liveLabel, value: bar.live, strong: true },
            ].map((row) => (
              <div key={row.label} className="mb-5 grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-5 sm:grid-cols-[14rem_1fr]">
                <span className="text-sm" style={{ color: MUTED }}>
                  {row.label}
                </span>
                <div className="h-12">
                  <div
                    className="flex h-full items-center justify-end rounded-full px-5 text-sm font-semibold"
                    style={{
                      width: `${row.value}%`,
                      minWidth: "4.5rem",
                      background: row.strong ? ACCENT : RULE,
                      color: row.strong ? SURFACE_DARK : INK,
                    }}
                  >
                    {row.value}%
                  </div>
                </div>
              </div>
            ))}
            <p className="mt-6 text-sm" style={{ color: MUTED }}>
              That is roughly 15× the positive sentiment of the average ad.
            </p>
          </Reveal>
        ))}

        <StatGrid stats={CH3_STATS} />

        <Reveal className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]" as="div">
          <p className="m-0 text-2xl font-medium leading-snug" style={{ fontFamily: DISPLAY }}>
            What actually drives the purchase after an event?
            <Cite id={6} />
          </p>
          <ol className="m-0 flex flex-col gap-4 p-0">
            {CH3_DRIVERS.map((d, i) => (
              <li key={d} className="flex list-none items-baseline gap-5 border-b pb-4 text-base" style={{ borderColor: RULE }}>
                <span className="text-3xl font-medium" style={{ fontFamily: DISPLAY, color: ACCENT }}>
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ol>
        </Reveal>
      </Chapter>

      <Chapter
        n="04"
        title="Culture is the trust lever"
        lede="Consumers now trust the brands they use more than almost any institution, and they reward brands that show up in culture and give them a way to belong."
      >
        <StatGrid stats={CH4_STATS} />
        <Reveal className="mt-14" as="div">
          <div className="rounded-3xl p-8 sm:p-12" style={{ background: SURFACE_DARK, color: "#f1e9dc" }}>
            <p className="m-0 text-3xl font-medium leading-snug sm:text-4xl" style={{ fontFamily: DISPLAY }}>
              “To earn trust, be in my world through culture.”
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/55">
              Edelman Trust Barometer, 2025 <Cite id={7} />
            </p>
          </div>
        </Reveal>
      </Chapter>

      <Chapter
        n="05"
        title="The Culturin playbook"
        lede="Six principles from the rooms we’ve built at the Super Bowl, the Oscars, Davos, Cannes, and the UN General Assembly."
      >
        <div className="grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: RULE }}>
          {PLAYBOOK.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 90} className="h-full print:break-inside-avoid" as="div">
              <div className="h-full border-b py-10 pr-8" style={{ borderColor: RULE }}>
                <p className="m-0 text-[11px] font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-2xl font-medium leading-snug" style={{ fontFamily: DISPLAY }}>
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-loose" style={{ color: MUTED }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20" as="div">
          <div className="grid grid-cols-1 gap-10 rounded-3xl border p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] print:break-inside-avoid" style={{ borderColor: RULE }}>
          <div>
            <Eyebrow>{CASE_STUDY.eyebrow}</Eyebrow>
            <h3 className="m-0 text-3xl font-medium leading-snug" style={{ fontFamily: DISPLAY }}>
              {CASE_STUDY.title}
            </h3>
            <p className="mt-5 text-sm leading-loose" style={{ color: MUTED }}>
              {CASE_STUDY.body}
            </p>
          </div>
          <div className="flex gap-10 self-end">
            {CASE_STUDY.stats.map((s) => (
              <div key={s.label}>
                <p className="m-0 text-6xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: ACCENT }}>
                  {s.value}
                </p>
                <p className="mt-3 text-sm" style={{ color: INK }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          </div>
        </Reveal>
      </Chapter>

      <Chapter
        n="06"
        title="Measuring the room"
        lede="Experiences earn budget when they’re measured like any other channel. Track the night across three stages, and report on all of them."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {MEASUREMENT.map((m, i) => (
            <Reveal key={m.stage} delay={i * 100} className="h-full print:break-inside-avoid" as="div">
              <div className="h-full rounded-3xl border p-8" style={{ borderColor: RULE }}>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                  Stage {i + 1}
                </p>
                <h3 className="mt-3 text-2xl font-medium" style={{ fontFamily: DISPLAY }}>
                  {m.stage}
                </h3>
                <ul className="mt-6 flex flex-col gap-3 p-0">
                  {m.metrics.map((metric) => (
                    <li key={metric} className="flex list-none gap-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                      <span style={{ color: ACCENT }}>—</span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Chapter>

      <section className="border-t py-24 print:break-before-page" style={{ borderColor: RULE }}>
        <div className="rounded-3xl p-10 sm:p-16" style={{ background: SURFACE_DARK, color: "#f1e9dc" }}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">Work with Culturin</p>
          <h2 className="m-0 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
            Ready to build a room people talk about?
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-loose text-white/70">
            Sponsor a moment we’ve already built, or make Culturin your cultural programming partner for the year.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 print:hidden">
            <Link
              href="/partner?service=moments"
              className="rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: "#e08a5b", color: SURFACE_DARK }}
            >
              Talk to us →
            </Link>
            <Link
              href="/events"
              className="rounded-full border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 no-underline transition-opacity hover:opacity-85"
              style={{ borderColor: "rgba(241,233,220,0.3)" }}
            >
              See upcoming rooms
            </Link>
          </div>
          <p className="mt-10 hidden text-sm text-white/80 print:block">culturin.com/partner · unik@culturin.com</p>
        </div>
      </section>

      <section id="sources" className="border-t py-16" style={{ borderColor: RULE }}>
        <Eyebrow>Sources</Eyebrow>
        <ol className="m-0 grid grid-cols-1 gap-3 p-0 lg:grid-cols-2">
          {SOURCES.map((s) => (
            <li key={s.id} id={`source-${s.id}`} className="flex list-none gap-3 text-xs leading-relaxed" style={{ color: MUTED }}>
              <span className="font-semibold" style={{ color: ACCENT }}>
                [{s.id}]
              </span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2" style={{ color: MUTED }}>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed" style={{ color: MUTED }}>
          Figures are reported as published by each source. EventTrack 2026 figures refer to surveyed event attendees.
          Culturin case study figures are from Culturin’s own event records.
        </p>
      </section>
    </>
  );
}

export default function IrlReportClient() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
  }, []);

  function unlock() {
    window.localStorage.setItem(UNLOCK_KEY, "1");
    setUnlocked(true);
    requestAnimationFrame(() => document.getElementById("chapter-01")?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <div className="mx-auto max-w-6xl px-8 sm:px-14">
      {/* Cover */}
      <header className="pb-20 print:flex print:min-h-[90vh] print:flex-col print:justify-center" style={{ paddingTop: "9rem" }}>
        <Reveal>
          <Eyebrow>{REPORT_EDITION}</Eyebrow>
          <h1 className="m-0 text-6xl font-medium leading-[1.02] sm:text-8xl" style={{ fontFamily: DISPLAY }}>
            {REPORT_TITLE}
          </h1>
          <p className="mt-6 max-w-2xl text-2xl leading-snug sm:text-3xl" style={{ fontFamily: DISPLAY, color: ACCENT }}>
            <em>{REPORT_SUBTITLE}</em>
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-12 flex flex-wrap gap-4 print:hidden">
          {unlocked ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
              style={{ background: ACCENT, color: SURFACE_DARK }}
            >
              Download PDF
            </button>
          ) : (
            <a
              href="#get-the-report"
              className="rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: ACCENT, color: SURFACE_DARK }}
            >
              Get the free report →
            </a>
          )}
        </Reveal>
      </header>

      {/* Headline stats */}
      <section className="pb-20">
        <StatGrid stats={HEADLINE_STATS} cols={3} />
      </section>

      {/* Executive summary */}
      <section className="grid grid-cols-1 gap-12 border-t py-24 lg:grid-cols-[1fr_1.6fr] print:break-before-page" style={{ borderColor: RULE }}>
        <Reveal>
          <Eyebrow>Executive summary</Eyebrow>
          <h2 className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
            The more synthetic the internet gets, the more a real room is worth.
          </h2>
        </Reveal>
        <div className="flex flex-col gap-6">
          {EXECUTIVE_SUMMARY.map((p, i) => (
            <Reveal key={i} delay={150 + i * 120}>
              <p className="m-0 text-base leading-loose" style={{ color: i === 0 ? INK : MUTED }}>
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {unlocked ? <FullReport /> : <Gate onUnlock={unlock} />}
    </div>
  );
}
