"use client";

import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Download,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Presentation,
  Sun,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link as TransitionLink, useTransitionRouter } from "next-view-transitions";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";

import { useTheme } from "@/app/styles/ThemeContext";
import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { cn } from "@/lib/utils";

import { StudioConfirmProvider } from "./_components/StudioConfirmDialog";
import { studioGhostButtonClass } from "./_lib/studioTheme";
import { useStudioLiveCounts } from "./_lib/useStudioLiveCounts";
import { useStudioPathRefresh } from "./_lib/useStudioPathRefresh";

/** Avoid prefetching Admin list routes into a stale empty client cache. */
function Link({ prefetch = false, ...props }: ComponentProps<typeof TransitionLink>) {
  return <TransitionLink prefetch={prefetch} {...props} />;
}

type StudioLayoutClientProps = {
  children: ReactNode;
  email: string | null;
  blogCount: number;
  galleryCount: number;
  salesDeckCount: number;
  subscriberCount: number;
  partnerInquiryCount: number;
  eventRsvpCount: number;
  galleryDownloadCount: number;
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
 * Standalone Admin shell: full viewport, no site marketing header/footer.
 * Uses the same cream/ink editorial palette as the public Culturin site.
 */
export default function StudioLayoutClient({
  children,
  email,
  blogCount,
  galleryCount,
  salesDeckCount,
  subscriberCount,
  partnerInquiryCount,
  eventRsvpCount,
  galleryDownloadCount,
}: StudioLayoutClientProps) {
  const router = useTransitionRouter();
  const pathname = usePathname() ?? "";
  const { mode, toggleTheme } = useTheme();
  const { supabase } = useSupabaseAuth();
  const [signingOut, setSigningOut] = useState(false);
  // On phones the nav is a drop-down menu so pages get the full screen.
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);
  useStudioPathRefresh();
  const liveCounts = useStudioLiveCounts({
    blogs: blogCount,
    galleryImages: galleryCount,
    salesDecks: salesDeckCount,
    subscribers: subscriberCount,
    partnerInquiries: partnerInquiryCount,
    eventRsvps: eventRsvpCount,
    galleryDownloads: galleryDownloadCount,
  });

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
              href="/admin"
              className="truncate font-display text-base font-semibold tracking-tight text-[color:var(--c-ink)] no-underline"
            >
              Culturin™{" "}
              <span className="font-sans text-sm font-medium text-[color:var(--c-accent)]">Admin</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(studioGhostButtonClass, "h-9 gap-1.5 px-3 text-xs font-semibold md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="admin-nav"
            >
              {menuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
              Menu
            </button>
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
            id="admin-nav"
            className={cn(
              "max-h-[75dvh] w-full shrink-0 flex-col border-b border-[color:var(--c-rule)] md:flex md:max-h-none md:w-64 md:border-b-0 md:border-r",
              menuOpen ? "flex" : "hidden",
            )}
            style={{ background: "color-mix(in srgb, var(--c-bg) 92%, black)" }}
            aria-label="Admin navigation"
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
                      href="/admin"
                      className={navItemClass(pathname === "/admin")}
                      aria-current={pathname === "/admin" ? "page" : undefined}
                    >
                      <LayoutDashboard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/articles"
                      className={navItemClass(
                        pathname === "/admin/articles" || pathname?.startsWith("/admin/articles/"),
                      )}
                      aria-current={pathname === "/admin/articles" ? "page" : undefined}
                    >
                      <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Articles & guides</span>
                      {countBadge(
                        liveCounts.blogs,
                        pathname === "/admin/articles" || pathname?.startsWith("/admin/articles/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/gallery"
                      className={navItemClass(pathname === "/admin/gallery" || pathname?.startsWith("/admin/gallery/"))}
                      aria-current={pathname === "/admin/gallery" ? "page" : undefined}
                    >
                      <Images className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Gallery</span>
                      {countBadge(
                        liveCounts.galleryImages,
                        pathname === "/admin/gallery" || pathname?.startsWith("/admin/gallery/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/events"
                      className={navItemClass(pathname === "/admin/events" || pathname?.startsWith("/admin/events/"))}
                      aria-current={pathname === "/admin/events" ? "page" : undefined}
                    >
                      <CalendarDays className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/site-images"
                      className={navItemClass(
                        pathname === "/admin/site-images" || pathname?.startsWith("/admin/site-images/"),
                      )}
                      aria-current={pathname === "/admin/site-images" ? "page" : undefined}
                    >
                      <ImageIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Site images</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/sales-decks"
                      className={navItemClass(
                        pathname === "/admin/sales-decks" || pathname?.startsWith("/admin/sales-decks/"),
                      )}
                      aria-current={pathname === "/admin/sales-decks" ? "page" : undefined}
                    >
                      <Presentation className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Sales decks</span>
                      {countBadge(
                        liveCounts.salesDecks,
                        pathname === "/admin/sales-decks" || pathname?.startsWith("/admin/sales-decks/"),
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
                      href="/admin/subscribers"
                      className={navItemClass(
                        pathname === "/admin/subscribers" || pathname?.startsWith("/admin/subscribers/"),
                      )}
                      aria-current={pathname === "/admin/subscribers" ? "page" : undefined}
                    >
                      <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Subscribers</span>
                      {countBadge(
                        liveCounts.subscribers,
                        pathname === "/admin/subscribers" || pathname?.startsWith("/admin/subscribers/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/partner-inquiries"
                      className={navItemClass(
                        pathname === "/admin/partner-inquiries" ||
                          pathname?.startsWith("/admin/partner-inquiries/"),
                      )}
                      aria-current={pathname === "/admin/partner-inquiries" ? "page" : undefined}
                    >
                      <Handshake className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Partner inquiries</span>
                      {countBadge(
                        liveCounts.partnerInquiries,
                        pathname === "/admin/partner-inquiries" ||
                          pathname?.startsWith("/admin/partner-inquiries/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/event-rsvps"
                      className={navItemClass(
                        pathname === "/admin/event-rsvps" || pathname?.startsWith("/admin/event-rsvps/"),
                      )}
                      aria-current={pathname === "/admin/event-rsvps" ? "page" : undefined}
                    >
                      <CalendarCheck className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Event RSVPs</span>
                      {countBadge(
                        liveCounts.eventRsvps,
                        pathname === "/admin/event-rsvps" || pathname?.startsWith("/admin/event-rsvps/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/gallery-downloads"
                      className={navItemClass(
                        pathname === "/admin/gallery-downloads" ||
                          pathname?.startsWith("/admin/gallery-downloads/"),
                      )}
                      aria-current={pathname === "/admin/gallery-downloads" ? "page" : undefined}
                    >
                      <Download className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Gallery downloads</span>
                      {countBadge(
                        liveCounts.galleryDownloads,
                        pathname === "/admin/gallery-downloads" ||
                          pathname?.startsWith("/admin/gallery-downloads/"),
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/analytics"
                      className={navItemClass(pathname === "/admin/analytics" || pathname?.startsWith("/admin/analytics/"))}
                      aria-current={pathname === "/admin/analytics" ? "page" : undefined}
                    >
                      <BarChart3 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="min-w-0 flex-1">Analytics</span>
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
