import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";

import { events } from "@/lib/eventsData";
import { listEventRsvpsForStudio } from "@/lib/studio/eventRsvps";
import { getStudioCounts } from "@/lib/studio/getStudioCounts";
import { listPartnerInquiriesForStudio } from "@/lib/studio/partnerInquiries";

import { studioEyebrowClass, studioMutedClass, studioPanelClass } from "./_lib/studioTheme";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard: live counts, new partner inquiries, and recent RSVPs.",
};

const RECENT_LIMIT = 5;

function formatDateline() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

type CountLink = {
  href: string;
  label: string;
  value: number;
  note: string;
};

function CountList({ id, title, items }: { id: string; title: string; items: CountLink[] }) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 id={id} className={studioEyebrowClass}>
        {title}
      </h2>
      <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[color:var(--c-rule)] bg-[color:var(--c-rule)] p-0 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.href} className="bg-[color:var(--c-bg)]">
            <Link href={item.href} className="group flex h-full flex-col gap-1 p-4 no-underline transition">
              <p className="m-0 font-display text-3xl font-semibold tabular-nums text-[color:var(--c-ink)]">
                {item.value}
              </p>
              <p className="m-0 text-sm font-medium text-[color:var(--c-ink)] transition group-hover:text-[color:var(--c-accent)]">
                {item.label}
              </p>
              <p className={`m-0 text-xs ${studioMutedClass}`}>{item.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentList({
  id,
  title,
  href,
  empty,
  rows,
}: {
  id: string;
  title: string;
  href: string;
  empty: string;
  rows: { key: string; primary: string; secondary: string; date: string }[];
}) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className={studioEyebrowClass}>
          {title}
        </h2>
        <Link
          href={href}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--c-accent)] no-underline transition hover:opacity-80"
        >
          View all
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className={`mt-4 text-sm ${studioMutedClass}`}>{empty}</p>
      ) : (
        <ul className="m-0 mt-4 list-none divide-y divide-[color:var(--c-rule)] border-y border-[color:var(--c-rule)] p-0">
          {rows.map((row) => (
            <li key={row.key} className="flex items-baseline justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-medium text-[color:var(--c-ink)]">{row.primary}</p>
                <p className={`m-0 mt-0.5 truncate text-xs ${studioMutedClass}`}>{row.secondary}</p>
              </div>
              <p className={`m-0 shrink-0 text-xs tabular-nums ${studioMutedClass}`}>{row.date}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminDashboardPage() {
  const [counts, inquiries, rsvps] = await Promise.all([
    getStudioCounts(),
    listPartnerInquiriesForStudio(),
    listEventRsvpsForStudio(),
  ]);
  const eventNames = Object.fromEntries(events.map((e) => [e.slug, e.name]));

  const content: CountLink[] = [
    { href: "/admin/articles", label: "Articles", value: counts.blogs, note: "Guides & stories" },
    { href: "/admin/gallery", label: "Gallery", value: counts.galleryImages, note: "Event photography" },
    { href: "/admin/sales-decks", label: "Sales decks", value: counts.salesDecks, note: "Shareable PDFs" },
  ];

  const audience: CountLink[] = [
    { href: "/admin/partner-inquiries", label: "Partner inquiries", value: counts.partnerInquiries, note: "From /partner" },
    { href: "/admin/event-rsvps", label: "Event RSVPs", value: counts.eventRsvps, note: "Guest list" },
    { href: "/admin/subscribers", label: "Subscribers", value: counts.subscribers, note: "Mailing list" },
    { href: "/admin/gallery-downloads", label: "Gallery downloads", value: counts.galleryDownloads, note: "Asset requests" },
  ];

  const attention = [
    counts.partnerInquiries > 0
      ? {
          href: "/admin/partner-inquiries",
          label: `${counts.partnerInquiries} partner inquir${counts.partnerInquiries === 1 ? "y" : "ies"}`,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string }[];

  const recentInquiries = inquiries.slice(0, RECENT_LIMIT).map((inquiry) => ({
    key: inquiry.id,
    primary: inquiry.company ? `${inquiry.name}, ${inquiry.company}` : inquiry.name,
    secondary: inquiry.interest || inquiry.email,
    date: formatShortDate(inquiry.createdAt),
  }));

  const recentRsvps = rsvps.slice(0, RECENT_LIMIT).map((rsvp) => ({
    key: rsvp.id,
    primary: `${rsvp.firstName} ${rsvp.lastName}`.trim() || rsvp.email,
    secondary: eventNames[rsvp.eventSlug] ?? rsvp.eventSlug,
    date: formatShortDate(rsvp.createdAt),
  }));

  return (
    <div className="p-4 sm:p-6 md:max-w-4xl md:p-10">
      <header className="border-b border-[color:var(--c-rule)] pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className={studioEyebrowClass}>Culturin Admin</p>
          <p className={`text-xs ${studioMutedClass}`}>{formatDateline()}</p>
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-5xl">
          Dashboard
        </h1>
        <p className={`mt-4 max-w-xl text-base leading-relaxed ${studioMutedClass}`}>
          New inquiries, recent RSVPs, and live counts across the site.
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

      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
        <RecentList
          id="recent-inquiries-heading"
          title="Latest partner inquiries"
          href="/admin/partner-inquiries"
          empty="No partner inquiries yet."
          rows={recentInquiries}
        />
        <RecentList
          id="recent-rsvps-heading"
          title="Latest event RSVPs"
          href="/admin/event-rsvps"
          empty="No RSVPs yet."
          rows={recentRsvps}
        />
      </div>

      <CountList id="audience-heading" title="Audience" items={audience} />
      <div className="pb-6">
        <CountList id="content-heading" title="Content" items={content} />
      </div>
    </div>
  );
}
