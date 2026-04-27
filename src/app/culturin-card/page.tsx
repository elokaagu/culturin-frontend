import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import SiteFooter from "../components/SiteFooter";

const benefits = [
  {
    title: "Rewards across countries",
    text: "Earn points when you book experiences, attend Culturin events, or buy through partner locations in different cities.",
  },
  {
    title: "Travel perks that unlock as you go",
    text: "Use points for priority booking windows, complimentary upgrades, airport lounge day passes, and local welcome credits.",
  },
  {
    title: "Culture-first partner network",
    text: "Access discounts at vetted restaurants, creative spaces, and neighborhood hosts who align with Culturin values.",
  },
] as const;

const tierExamples = [
  { tier: "Explorer", rule: "Join free with your Culturin account", perk: "Starter rewards + partner offers" },
  { tier: "Voyager", rule: "Earn through travel and event activity", perk: "Faster points + early access drops" },
  { tier: "Insider", rule: "High activity across multiple countries", perk: "Top-tier perks + concierge support" },
] as const;

export const metadata: Metadata = {
  title: "Culturin Card | Culturin",
  description:
    "A travel rewards card for Culturin members — earn points and unlock perks across countries, events, and curated experiences.",
};

export default function CulturinCardPage() {
  return (
    <>
      <ContentPageShell
        mainClassName="min-h-dvh bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
        innerClassName="mx-auto w-full max-w-6xl px-4 sm:px-6"
      >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-amber-700 no-underline transition hover:underline dark:text-amber-300/95 dark:hover:text-amber-200"
            >
              Home
            </Link>
            <span className="text-neutral-400 dark:text-white/35" aria-hidden>
              /
            </span>
            <span className="text-neutral-600 dark:text-white/65">Culturin Card</span>
          </div>
        </nav>

        <section className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-6 text-white sm:p-10 dark:border-white/10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-center">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/90">Member Rewards</p>
              <h1 className="m-0 mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                Culturin Card
              </h1>
              <p className="m-0 mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                A credit card-style membership program for travelers who want culture-rich perks. Earn rewards when you explore
                and redeem them across partner destinations in multiple countries.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/join-us/advisors"
                  className="inline-flex min-h-[42px] items-center rounded-full border border-amber-300/40 bg-amber-300/20 px-5 text-sm font-semibold text-white no-underline transition hover:bg-amber-300/30"
                >
                  Join waitlist
                </Link>
                <Link
                  href="/travel-guides"
                  className="inline-flex min-h-[42px] items-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white no-underline transition hover:bg-white/15"
                >
                  See eligible experiences
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-amber-300/10 blur-2xl" aria-hidden />
              <Image
                src="/illustrations/culturin-card-hero.svg"
                alt="Culturin Card preview"
                width={1200}
                height={760}
                className="relative h-auto w-full rounded-2xl border border-white/20 shadow-[0_18px_55px_rgba(0,0,0,0.5)]"
                priority
                unoptimized
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h2>
              <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/75">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="m-0 text-xl font-semibold text-neutral-900 dark:text-white">How tiers work</h2>
          <p className="m-0 mt-2 text-sm text-neutral-600 dark:text-white/70">
            Your Culturin Card status scales with activity across events, bookings, and partner check-ins.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {tierExamples.map((t) => (
              <article
                key={t.tier}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-white/10 dark:bg-black/50"
              >
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                  {t.tier}
                </p>
                <p className="m-0 mt-2 text-sm font-medium text-neutral-900 dark:text-white">{t.rule}</p>
                <p className="m-0 mt-1.5 text-sm text-neutral-600 dark:text-white/70">{t.perk}</p>
              </article>
            ))}
          </div>
        </section>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
