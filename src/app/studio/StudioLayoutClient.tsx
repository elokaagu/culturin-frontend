"use client";

import {
  BookOpen,
  Building2,
  CalendarCheck,
  CreditCard,
  Download,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Presentation,
  Sun,
  Users,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link as TransitionLink, useTransitionRouter } from "next-view-transitions";
import { useState, type ComponentProps, type ReactNode } from "react";

import { useTheme } from "@/app/styles/ThemeContext";
import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { cn } from "@/lib/utils";

import { StudioConfirmProvider } from "./_components/StudioConfirmDialog";
import { studioGhostButtonClass } from "./_lib/studioTheme";
import { useStudioPathRefresh } from "./_lib/useStudioPathRefresh";

/** Avoid prefetching Studio list routes into a stale empty client cache. */
function Link({ prefetch = false, ...props }: ComponentProps<typeof TransitionLink>) {
  return <TransitionLink prefetch={prefetch} {...props} />;
}

type StudioLayoutClientProps = {
  children: ReactNode;
  email: string | null;
  blogCount: number;
  videoCount: number;
  providerCount: number;
  curatorCount: number;
  galleryCount: number;
  salesDeckCount: number;
  subscriberCount: number;
  partnerInquiryCount: number;
  eventRsvpCount: number;
  galleryDownloadCount: number;
  cardApplicationCount: number;
};

const navItemClass = (active: boolean) =>
  cn(
    "flex w-full min-w-0 items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-sm font-medium transition no-underline",
    active
      ? "bg-[color:var(--c-ink)] text-[color:var(--c-bg)] shadow-sm"
      : "text-[color:var(--c-muted)] hover:bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] hover:text-[color:var(--c-ink)]",
  );

const subLabelClass =
  "pl-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-accent)]";

function countBadge(n: number, active: boolean) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex min-w-[1.4rem] justify-end tabular-nums text-xs",
        active ? "text-[color:color-mix(in_srgb,var(--c-bg)_70%,transparent)]" : "text-[color:var(--c-muted)]",
      )}
    >
      {n}
    </span>
  );
}

/**
 * Standalone Studio shell: full viewport, no site marketing header/footer.
 * Uses the same cream/ink editorial palette as the public Culturin site.
 */
export default function StudioLayoutClient({
  children,
  email,
  blogCount,
  videoCount,
  providerCount,
  curatorCount,
  galleryCount,
  salesDeckCount,
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
  useStudioPathRefresh();

  return (
    <StudioConfirmProvider>
      <div
        className={cn(
          editorialScopeClass,
          "flex h-dvh max-h-dvh flex-col overflow-hidden font-sans antialiased",
        )}
        style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}
      >
        <header
          className="flex shrink-0 items-center justify-between gap-3 border-b border-[color:var(--c-rule)] px-3 py-2.5 backdrop-blur-sm sm:px-4"
          style={{ background: "color-mix(in srgb, var(--c-bg) 88%, transparent)" }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/studio"
              className="truncate font-display text-base font-semibold tracking-tight text-[color:var(--c-ink)] no-underline"
            >
              Culturin™{" "}
              <span className="font-sans text-sm font-medium text-[color:var(--c-accent)]">Studio</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(studioGhostButtonClass, "h-9 w-9")}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {mode === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            </button>
            <Link
              href="/"
              className={cn(studioGhostButtonClass, "gap-1.5 px-3 py-1.5 text-xs font-semibold no-underline sm:text-sm")}
            >
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
              <span className="hidden sm:inline">View site</span>
              <span className="sm:hidden">Site</span>
            </Link>
          </div>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
          <aside
            className="flex max-h-[40vh] w-full shrink-0 flex-col border-b border-[color:var(--c-rule)] md:max-h-none md:w-64 md:border-b-0 md:border-r"
            style={{ background: "color-mix(in srgb, var(--c-bg) 92%, black)" }}
            aria-label="Studio navigation"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-3 py-4 md:px-3 md:py-5">
                <p className="px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-accent)]">
                  Account
                </p>
                <p
                  className="mt-0.5 truncate px-2.5 text-xs text-[color:var(--c-muted)]"
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
                      {countBadge(
                        galleryCount,
                        pathname === "/studio/gallery" || pathname?.startsWith("/studio/gallery/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/studio/site-images"
                      className={navItemClass(
                        pathname === "/studio/site-images" || pathname?.startsWith("/studio/site-images/"),
                      )}
                      aria-current={pathname === "/studio/site-images" ? "page" : undefined}
                    >
                      <ImageIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Site images</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/studio/sales-decks"
                      className={navItemClass(
                        pathname === "/studio/sales-decks" || pathname?.startsWith("/studio/sales-decks/"),
                      )}
                      aria-current={pathname === "/studio/sales-decks" ? "page" : undefined}
                    >
                      <Presentation className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Sales decks</span>
                      {countBadge(
                        salesDeckCount,
                        pathname === "/studio/sales-decks" || pathname?.startsWith("/studio/sales-decks/"),
                      )}
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
                        pathname === "/studio/partner-inquiries" ||
                          pathname?.startsWith("/studio/partner-inquiries/"),
                      )}
                      aria-current={pathname === "/studio/partner-inquiries" ? "page" : undefined}
                    >
                      <Handshake className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Partner inquiries</span>
                      {countBadge(
                        partnerInquiryCount,
                        pathname === "/studio/partner-inquiries" ||
                          pathname?.startsWith("/studio/partner-inquiries/"),
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
                        pathname === "/studio/gallery-downloads" ||
                          pathname?.startsWith("/studio/gallery-downloads/"),
                      )}
                      aria-current={pathname === "/studio/gallery-downloads" ? "page" : undefined}
                    >
                      <Download className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Gallery downloads</span>
                      {countBadge(
                        galleryDownloadCount,
                        pathname === "/studio/gallery-downloads" ||
                          pathname?.startsWith("/studio/gallery-downloads/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/studio/card-applications"
                      className={navItemClass(
                        pathname === "/studio/card-applications" ||
                          pathname?.startsWith("/studio/card-applications/"),
                      )}
                      aria-current={pathname === "/studio/card-applications" ? "page" : undefined}
                    >
                      <CreditCard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Card applications</span>
                      {countBadge(
                        cardApplicationCount,
                        pathname === "/studio/card-applications" ||
                          pathname?.startsWith("/studio/card-applications/"),
                      )}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="border-t border-[color:var(--c-rule)] px-2.5 py-2.5">
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
                className="flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-sm font-medium text-[color:var(--c-muted)] transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] hover:text-[color:var(--c-ink)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </aside>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain" data-studio-main>
            {children}
          </div>
        </div>
      </div>
    </StudioConfirmProvider>
  );
}
