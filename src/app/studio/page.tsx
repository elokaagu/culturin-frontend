import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";

import { getStudioCounts } from "@/lib/studio/getStudioCounts";

import { studioEyebrowClass, studioMutedClass, studioPanelClass } from "./_lib/studioTheme";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overview",
  description: "Studio home — live catalog and audience snapshot.",
};

function formatDateline() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type CountLink = {
  href: string;
  label: string;
  value: number;
  note: string;
};

export default async function StudioOverviewPage() {
  const counts = await getStudioCounts();

  const catalog: CountLink[] = [
    { href: "/studio/articles", label: "Articles", value: counts.blogs, note: "Guides & stories" },
    { href: "/studio/videos", label: "Videos", value: counts.videos, note: "Hosted library" },
    { href: "/studio/providers", label: "Experiences", value: counts.providers, note: "Partner listings" },
    { href: "/studio/curators", label: "Curators", value: counts.curators, note: "Featured voices" },
    { href: "/studio/gallery", label: "Gallery", value: counts.galleryImages, note: "Event photography" },
    { href: "/studio/sales-decks", label: "Sales decks", value: counts.salesDecks, note: "Shareable PDFs" },
  ];

  const audience: CountLink[] = [
    { href: "/studio/subscribers", label: "Subscribers", value: counts.subscribers, note: "Mailing list" },
    {
      href: "/studio/partner-inquiries",
      label: "Partner inquiries",
      value: counts.partnerInquiries,
      note: "From /partner",
    },
    { href: "/studio/event-rsvps", label: "Event RSVPs", value: counts.eventRsvps, note: "Guest list" },
    {
      href: "/studio/gallery-downloads",
      label: "Gallery downloads",
      value: counts.galleryDownloads,
      note: "Asset requests",
    },
    {
      href: "/studio/card-applications",
      label: "Card applications",
      value: counts.cardApplications,
      note: "Pending review",
    },
  ];

  const attention = [
    counts.partnerInquiries > 0
      ? {
          href: "/studio/partner-inquiries",
          label: `${counts.partnerInquiries} partner inquir${counts.partnerInquiries === 1 ? "y" : "ies"}`,
        }
      : null,
    counts.cardApplications > 0
      ? {
          href: "/studio/card-applications",
          label: `${counts.cardApplications} card application${counts.cardApplications === 1 ? "" : "s"} pending`,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="p-4 sm:p-6 md:max-w-3xl md:p-10">
      <header className="border-b border-[color:var(--c-rule)] pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className={studioEyebrowClass}>Culturin Studio</p>
          <p className={`text-xs ${studioMutedClass}`}>{formatDateline()}</p>
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-5xl">
          Overview
        </h1>
        <p className={`mt-4 max-w-xl text-base leading-relaxed ${studioMutedClass}`}>
          Live counts from your catalog and audience. Use the sidebar to open any editor.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--c-accent)] no-underline transition hover:opacity-80"
        >
          View public site
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </header>

      {attention.length > 0 ? (
        <section className={`mt-8 ${studioPanelClass}`} aria-labelledby="attention-heading">
          <h2 id="attention-heading" className={studioEyebrowClass}>
            Needs attention
          </h2>
          <ul className="m-0 mt-4 list-none space-y-2 p-0">
            {attention.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-xl py-1 text-sm font-medium text-[color:var(--c-ink)] no-underline transition hover:text-[color:var(--c-accent)]"
                >
                  <span>{item.label}</span>
                  <span className={`text-xs font-semibold uppercase tracking-[0.12em] ${studioMutedClass} group-hover:text-[color:var(--c-accent)]`}>
                    Open
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className={studioEyebrowClass}>
          Catalog
        </h2>
        <ul className="m-0 mt-4 list-none divide-y divide-[color:var(--c-rule)] border-y border-[color:var(--c-rule)] p-0">
          {catalog.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-baseline justify-between gap-4 py-4 no-underline transition"
              >
                <div className="min-w-0">
                  <p className="m-0 text-base font-medium text-[color:var(--c-ink)] transition group-hover:text-[color:var(--c-accent)]">
                    {item.label}
                  </p>
                  <p className={`m-0 mt-0.5 text-xs ${studioMutedClass}`}>{item.note}</p>
                </div>
                <p className="m-0 shrink-0 font-display text-2xl font-semibold tabular-nums text-[color:var(--c-ink)]">
                  {item.value}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 pb-6" aria-labelledby="audience-heading">
        <h2 id="audience-heading" className={studioEyebrowClass}>
          Audience
        </h2>
        <ul className="m-0 mt-4 list-none divide-y divide-[color:var(--c-rule)] border-y border-[color:var(--c-rule)] p-0">
          {audience.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-baseline justify-between gap-4 py-4 no-underline transition"
              >
                <div className="min-w-0">
                  <p className="m-0 text-base font-medium text-[color:var(--c-ink)] transition group-hover:text-[color:var(--c-accent)]">
                    {item.label}
                  </p>
                  <p className={`m-0 mt-0.5 text-xs ${studioMutedClass}`}>{item.note}</p>
                </div>
                <p className="m-0 shrink-0 font-display text-2xl font-semibold tabular-nums text-[color:var(--c-ink)]">
                  {item.value}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
