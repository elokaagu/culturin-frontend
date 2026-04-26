"use client";

import {
  BookOpen,
  Building2,
  CloudUpload,
  Home,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import type { ReactNode } from "react";

type StudioLayoutClientProps = {
  children: ReactNode;
  email: string | null;
  blogCount: number;
  videoCount: number;
  providerCount: number;
};

const navItemClass = (active: boolean) =>
  [
    "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition no-underline",
    active
      ? "bg-neutral-200 text-neutral-900 dark:bg-white/12 dark:text-white"
      : "text-neutral-600 hover:bg-neutral-200/80 dark:text-white/70 dark:hover:bg-white/8",
  ].join(" ");

const subLabelClass = "pl-0.5 text-xs font-normal text-neutral-500 dark:text-white/45";

function countBadge(n: number) {
  return (
    <span className="ml-auto inline-flex min-w-[1.4rem] justify-end tabular-nums text-xs text-neutral-500 dark:text-white/50">
      {n}
    </span>
  );
}

/**
 * Studio shell: persistent sidebar with all creation surfaces and site links.
 */
export default function StudioLayoutClient({
  children,
  email,
  blogCount,
  videoCount,
  providerCount,
}: StudioLayoutClientProps) {
  const pathname = usePathname() ?? "";

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1920px] flex-1 flex-col border-t border-neutral-200/80 dark:border-white/6 md:min-h-0 md:flex-row">
      <aside
        className="w-full shrink-0 border-b border-neutral-200 bg-white/90 dark:border-white/10 dark:bg-neutral-950/80 md:w-64 md:border-b-0 md:border-r"
        aria-label="Studio navigation"
      >
        <div className="md:sticky md:top-[var(--header-offset)] md:max-h-[calc(100dvh-var(--header-offset))] md:overflow-y-auto">
          <div className="px-3 py-4 md:px-3 md:py-6">
            <p className="px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/50">
              Culturin Studio
            </p>
            <p className="mt-0.5 truncate px-2.5 text-xs text-neutral-500 dark:text-white/45" title={email ?? undefined}>
              {email ?? "—"}
            </p>
          </div>

          <nav className="space-y-4 px-2.5 pb-3 md:pb-6" aria-label="Content management">
            <p className={subLabelClass}>Content</p>
            <ul className="m-0 space-y-0.5 p-0">
              <li>
                <Link
                  href="/studio"
                  className={navItemClass(pathname === "/studio")}
                  aria-current={pathname === "/studio" ? "page" : undefined}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/studio/articles"
                  className={navItemClass(pathname === "/studio/articles" || pathname?.startsWith("/studio/articles/"))}
                  aria-current={pathname === "/studio/articles" ? "page" : undefined}
                >
                  <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 flex-1">Articles & guides</span>
                  {countBadge(blogCount)}
                </Link>
              </li>
              <li>
                <Link
                  href="/studio/videos"
                  className={navItemClass(pathname === "/studio/videos" || pathname?.startsWith("/studio/videos/"))}
                  aria-current={pathname === "/studio/videos" ? "page" : undefined}
                >
                  <Video className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 flex-1">Videos</span>
                  {countBadge(videoCount)}
                </Link>
              </li>
              <li>
                <Link
                  href="/studio/providers"
                  className={navItemClass(pathname === "/studio/providers" || pathname?.startsWith("/studio/providers/"))}
                  aria-current={pathname === "/studio/providers" ? "page" : undefined}
                >
                  <Building2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 flex-1">Providers & experiences</span>
                  {countBadge(providerCount)}
                </Link>
              </li>
            </ul>

            <p className={subLabelClass}>Media &amp; site</p>
            <ul className="m-0 space-y-0.5 p-0">
              <li>
                <Link
                  href="/create/upload"
                  className={navItemClass(!!pathname?.startsWith("/create/upload"))}
                >
                  <ImageIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 flex-1">Image uploads</span>
                  <CloudUpload className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={navItemClass(false)}
                >
                  <Home className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className={navItemClass(false)}
                >
                  <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  View articles
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className={navItemClass(false)}
                >
                  <Video className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  View videos
                </Link>
              </li>
              <li>
                <Link
                  href="/providers"
                  className={navItemClass(false)}
                >
                  <Building2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  View providers
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className={navItemClass(false)}
                >
                  <MapPin className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  Destinations
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-neutral-50 dark:bg-black/40" data-studio-main>
        {children}
      </div>
    </div>
  );
}
