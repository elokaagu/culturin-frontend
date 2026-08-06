import type { Metadata } from "next";
import { BookOpen, Building2, ChevronRight, ImageIcon, Presentation, Video } from "lucide-react";
import { Link } from "next-view-transitions";

import { getStudioCounts } from "@/lib/studio/getStudioCounts";

import { studioCardClass, studioEyebrowClass, studioMutedClass } from "./_lib/studioTheme";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overview",
  description: "Studio home — create content and jump to public pages from one place.",
};

export default async function StudioOverviewPage() {
  const counts = await getStudioCounts();
  const quickActions = [
    {
      title: "Create an article",
      description: "Publish guides and stories that appear on Articles and home rails.",
      href: "/studio/articles",
      icon: BookOpen,
      cta: "Open Articles",
    },
    {
      title: "Add a video",
      description: "Add hosted video details so they can appear on Videos and stream experiences.",
      href: "/studio/videos",
      icon: Video,
      cta: "Open Videos",
    },
    {
      title: "Add an experience",
      description: "Create curated experiences, partner listings, and destination-ready cards.",
      href: "/studio/providers",
      icon: Building2,
      cta: "Open Experiences",
    },
    {
      title: "Upload a sales deck",
      description: "Share interactive partner PDFs with email gates, passwords, and view analytics.",
      href: "/studio/sales-decks",
      icon: Presentation,
      cta: "Open Sales decks",
    },
    {
      title: "Upload images",
      description: "Upload images and copy their links for stories, cards, and listings.",
      href: "/create/upload",
      icon: ImageIcon,
      cta: "Open Uploads",
    },
  ] as const;

  return (
    <div className="p-4 sm:p-6 md:max-w-4xl md:p-10">
      <p className={studioEyebrowClass}>Overview</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-4xl">
        Culturin Studio
      </h1>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${studioMutedClass}`}>
        Create and publish from this workspace. Counts reflect your live catalog; use the sidebar to jump between editors
        and the site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {(
          [
            { href: "/studio/articles", label: "Articles", value: counts.blogs, hint: "Guides & editorial" },
            { href: "/studio/videos", label: "Videos", value: counts.videos, hint: "Hosted video library" },
            {
              href: "/studio/providers",
              label: "Experiences",
              value: counts.providers,
              hint: "Experiences & bookings",
            },
          ] as const
        ).map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className={`group block p-5 no-underline ${studioCardClass}`}
          >
            <p className={`m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${studioMutedClass}`}>
              {stat.label}
            </p>
            <p className="m-0 mt-2 font-display text-3xl font-semibold tabular-nums text-[color:var(--c-ink)]">
              {stat.value}
            </p>
            <p className={`m-0 mt-2 text-xs ${studioMutedClass}`}>{stat.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className={studioEyebrowClass}>Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`group p-5 no-underline hover:-translate-y-0.5 ${studioCardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] text-[color:var(--c-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)] transition group-hover:text-[color:var(--c-accent)]">
                    Go
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                <h3 className="m-0 mt-4 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">
                  {action.title}
                </h3>
                <p className={`m-0 mt-2 text-sm leading-relaxed ${studioMutedClass}`}>{action.description}</p>
                <p className="m-0 mt-4 text-sm font-medium text-[color:var(--c-accent)]">{action.cta}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
