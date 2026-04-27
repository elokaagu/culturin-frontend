import type { Metadata } from "next";
import { BookOpen, Building2, ChevronRight, ImageIcon, Video } from "lucide-react";
import { Link } from "next-view-transitions";

import { getStudioCounts } from "@/lib/studio/getStudioCounts";

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
      description: "Add playback IDs and metadata for /videos and stream experiences.",
      href: "/studio/videos",
      icon: Video,
      cta: "Open Videos",
    },
    {
      title: "Add a provider",
      description: "Create curated experiences, partner listings, and destination-ready cards.",
      href: "/studio/providers",
      icon: Building2,
      cta: "Open Providers",
    },
    {
      title: "Upload images",
      description: "Generate public image URLs for CMS fields and cards across the app.",
      href: "/create/upload",
      icon: ImageIcon,
      cta: "Open Uploads",
    },
  ] as const;

  return (
    <div className="p-4 sm:p-6 md:max-w-4xl md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Overview</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Culturin Studio</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/65">
        Create and publish from this workspace. Counts sync with your Supabase CMS tables; use the sidebar to jump between
        editors and the live site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/studio/articles"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Articles
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">{counts.blogs}</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Guides & editorial</p>
        </Link>
        <Link
          href="/studio/videos"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Videos
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">{counts.videos}</p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Mux-backed library</p>
        </Link>
        <Link
          href="/studio/providers"
          className="group block rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/80 dark:hover:border-amber-400/35"
        >
          <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50">
            Providers
          </p>
          <p className="m-0 mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {counts.providers}
          </p>
          <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/45">Experiences & bookings</p>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/55">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/45 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/70 dark:hover:border-amber-400/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-white/15 dark:bg-white/5 dark:text-white/85">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 transition group-hover:text-amber-700 dark:text-white/40 dark:group-hover:text-amber-300/90">
                    Go
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                <h3 className="m-0 mt-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{action.title}</h3>
                <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70">{action.description}</p>
                <p className="m-0 mt-4 text-sm font-medium text-amber-800 dark:text-amber-300/95">{action.cta}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
