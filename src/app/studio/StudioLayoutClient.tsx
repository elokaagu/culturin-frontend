"use client";

import {
  BookOpen,
  Building2,
  CalendarCheck,
  CreditCard,
  Download,
  ExternalLink,
  Handshake,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Sun,
  Users,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useState, type ReactNode } from "react";

import { useTheme } from "@/app/styles/ThemeContext";
import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { StudioConfirmProvider } from "./_components/StudioConfirmDialog";

type StudioLayoutClientProps = {
  children: ReactNode;
  email: string | null;
  blogCount: number;
  videoCount: number;
  providerCount: number;
  curatorCount: number;
  galleryCount: number;
  subscriberCount: number;
  partnerInquiryCount: number;
  eventRsvpCount: number;
  galleryDownloadCount: number;
  cardApplicationCount: number;
};

const navItemClass = (active: boolean) =>
  [
    "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition no-underline",
    active
      ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-200 dark:text-neutral-900"
      : "text-neutral-600 hover:bg-neutral-200/80 dark:text-white/70 dark:hover:bg-white/8",
  ].join(" ");

const subLabelClass = "pl-0.5 text-xs font-normal text-neutral-500 dark:text-white/58";

function countBadge(n: number, active: boolean) {
  return (
    <span
      className={[
        "ml-auto inline-flex min-w-[1.4rem] justify-end tabular-nums text-xs",
        active ? "text-neutral-600" : "text-neutral-500 dark:text-white/62",
      ].join(" ")}
    >
      {n}
    </span>
  );
}

/**
 * Standalone Studio shell: full viewport, no site marketing header/footer.
 */
export default function StudioLayoutClient({
  children,
  email,
  blogCount,
  videoCount,
  providerCount,
  curatorCount,
  galleryCount,
  subscriberCount,
  partnerInquiryCount,
  eventRsvpCount,
  galleryDownloadCount,
  cardApplicationCount,
}: StudioLayoutClientProps) {
  const router = useTransitionRouter();
  const pathname = usePathname() ?? "";
  const { mode, toggleTheme } = useTheme();
  const { supabase } = useSupabaseAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <StudioConfirmProvider>
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-neutral-50 text-neutral-900 dark:bg-[#121212] dark:text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200/90 bg-white/90 px-3 py-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-950/90 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/studio"
            className="truncate font-display text-base font-semibold tracking-tight text-culturin-800 no-underline dark:text-culturin-300/95"
          >
            Culturin™ <span className="font-sans text-sm font-medium text-neutral-600 dark:text-white/60">Studio</span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 no-underline transition hover:border-culturin-400/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-culturin-400/35 dark:hover:bg-white/10 sm:text-sm"
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
            <span className="hidden sm:inline">View site</span>
            <span className="sm:hidden">Site</span>
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
        <aside
          className="flex max-h-[40vh] w-full shrink-0 flex-col border-b border-neutral-200 bg-white/95 dark:border-white/10 dark:bg-neutral-950/95 md:max-h-none md:w-64 md:border-b-0 md:border-r"
          aria-label="Studio navigation"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-3 py-4 md:px-3 md:py-5">
              <p className="px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/62">
                Account
              </p>
              <p
                className="mt-0.5 truncate px-2.5 text-xs text-neutral-500 dark:text-white/58"
                title={email ?? undefined}
              >
                {email ?? "—"}
              </p>
            </div>

            <nav className="space-y-4 px-2.5 pb-4 md:pb-6" aria-label="Content management">
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
                    className={navItemClass(
                      pathname === "/studio/articles" || pathname?.startsWith("/studio/articles/"),
                    )}
                    aria-current={pathname === "/studio/articles" ? "page" : undefined}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Articles & guides</span>
                    {countBadge(
                      blogCount,
                      pathname === "/studio/articles" || pathname?.startsWith("/studio/articles/"),
                    )}
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
                    {countBadge(videoCount, pathname === "/studio/videos" || pathname?.startsWith("/studio/videos/"))}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/providers"
                    className={navItemClass(
                      pathname === "/studio/providers" || pathname?.startsWith("/studio/providers/"),
                    )}
                    aria-current={pathname === "/studio/providers" ? "page" : undefined}
                  >
                    <Building2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Experiences</span>
                    {countBadge(
                      providerCount,
                      pathname === "/studio/providers" || pathname?.startsWith("/studio/providers/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/curators"
                    className={navItemClass(
                      pathname === "/studio/curators" || pathname?.startsWith("/studio/curators/"),
                    )}
                    aria-current={pathname === "/studio/curators" ? "page" : undefined}
                  >
                    <Users className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Curators</span>
                    {countBadge(
                      curatorCount,
                      pathname === "/studio/curators" || pathname?.startsWith("/studio/curators/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/gallery"
                    className={navItemClass(pathname === "/studio/gallery" || pathname?.startsWith("/studio/gallery/"))}
                    aria-current={pathname === "/studio/gallery" ? "page" : undefined}
                  >
                    <Images className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Gallery</span>
                    {countBadge(galleryCount, pathname === "/studio/gallery" || pathname?.startsWith("/studio/gallery/"))}
                  </Link>
                </li>
              </ul>

            </nav>

            <nav className="mt-5 space-y-4 px-2.5 pb-4 md:pb-6" aria-label="Audience management">
              <p className={subLabelClass}>Audience</p>
              <ul className="m-0 space-y-0.5 p-0">
                <li>
                  <Link
                    href="/studio/subscribers"
                    className={navItemClass(
                      pathname === "/studio/subscribers" || pathname?.startsWith("/studio/subscribers/"),
                    )}
                    aria-current={pathname === "/studio/subscribers" ? "page" : undefined}
                  >
                    <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Subscribers</span>
                    {countBadge(
                      subscriberCount,
                      pathname === "/studio/subscribers" || pathname?.startsWith("/studio/subscribers/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/partner-inquiries"
                    className={navItemClass(
                      pathname === "/studio/partner-inquiries" || pathname?.startsWith("/studio/partner-inquiries/"),
                    )}
                    aria-current={pathname === "/studio/partner-inquiries" ? "page" : undefined}
                  >
                    <Handshake className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Partner inquiries</span>
                    {countBadge(
                      partnerInquiryCount,
                      pathname === "/studio/partner-inquiries" || pathname?.startsWith("/studio/partner-inquiries/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/event-rsvps"
                    className={navItemClass(
                      pathname === "/studio/event-rsvps" || pathname?.startsWith("/studio/event-rsvps/"),
                    )}
                    aria-current={pathname === "/studio/event-rsvps" ? "page" : undefined}
                  >
                    <CalendarCheck className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Event RSVPs</span>
                    {countBadge(
                      eventRsvpCount,
                      pathname === "/studio/event-rsvps" || pathname?.startsWith("/studio/event-rsvps/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/gallery-downloads"
                    className={navItemClass(
                      pathname === "/studio/gallery-downloads" || pathname?.startsWith("/studio/gallery-downloads/"),
                    )}
                    aria-current={pathname === "/studio/gallery-downloads" ? "page" : undefined}
                  >
                    <Download className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Gallery downloads</span>
                    {countBadge(
                      galleryDownloadCount,
                      pathname === "/studio/gallery-downloads" || pathname?.startsWith("/studio/gallery-downloads/"),
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio/card-applications"
                    className={navItemClass(
                      pathname === "/studio/card-applications" || pathname?.startsWith("/studio/card-applications/"),
                    )}
                    aria-current={pathname === "/studio/card-applications" ? "page" : undefined}
                  >
                    <CreditCard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Card applications</span>
                    {countBadge(
                      cardApplicationCount,
                      pathname === "/studio/card-applications" || pathname?.startsWith("/studio/card-applications/"),
                    )}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-neutral-200 px-2.5 py-2.5 dark:border-white/10">
            <button
              type="button"
              disabled={signingOut}
              onClick={async () => {
                if (!supabase || signingOut) return;
                setSigningOut(true);
                try {
                  await supabase.auth.signOut();
                  router.push("/");
                  router.refresh();
                } finally {
                  setSigningOut(false);
                }
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/80 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white/70 dark:hover:bg-white/8"
            >
              <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <div
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-neutral-50 dark:bg-neutral-950/50"
          data-studio-main
        >
          {children}
        </div>
      </div>
    </div>
    </StudioConfirmProvider>
  );
}
