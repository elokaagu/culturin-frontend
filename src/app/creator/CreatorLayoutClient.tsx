"use client";

import {
  BookOpen,
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { useState, type ReactNode } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { useTheme } from "@/app/styles/ThemeContext";

type CreatorLayoutClientProps = {
  children: ReactNode;
  email: string | null;
};

const navItemClass = (active: boolean) =>
  [
    "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition no-underline",
    active
      ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-200 dark:text-neutral-900"
      : "text-neutral-600 hover:bg-neutral-200/80 dark:text-white/70 dark:hover:bg-white/8",
  ].join(" ");

/**
 * Creator shell — submissions workspace for signed-in users without CMS admin access.
 */
export default function CreatorLayoutClient({ children, email }: CreatorLayoutClientProps) {
  const pathname = usePathname() ?? "";
  const { mode, toggleTheme } = useTheme();
  const { supabase } = useSupabaseAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-neutral-50 text-neutral-900 dark:bg-black dark:text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200/90 bg-white/90 px-3 py-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-950/90 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/creator"
            className="truncate font-display text-base font-semibold tracking-tight text-amber-800 no-underline dark:text-amber-300/95"
          >
            Culturin™ <span className="font-sans text-sm font-medium text-neutral-600 dark:text-white/60">Creator</span>
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
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 no-underline transition hover:border-amber-400/50 hover:bg-neutral-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-amber-400/35 dark:hover:bg-white/10 sm:text-sm"
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
          aria-label="Creator navigation"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-3 py-4 md:px-3 md:py-5">
              <p className="px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/50">
                Account
              </p>
              <p
                className="mt-0.5 truncate px-2.5 text-xs text-neutral-500 dark:text-white/45"
                title={email ?? undefined}
              >
                {email ?? "—"}
              </p>
            </div>

            <nav className="space-y-4 px-2.5 pb-4 md:pb-6" aria-label="Creator content">
              <p className="pl-0.5 text-xs font-normal text-neutral-500 dark:text-white/45">Your submissions</p>
              <ul className="m-0 space-y-0.5 p-0">
                <li>
                  <Link
                    href="/creator"
                    className={navItemClass(pathname === "/creator")}
                    aria-current={pathname === "/creator" ? "page" : undefined}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/articles"
                    className={navItemClass(
                      pathname === "/creator/articles" || pathname?.startsWith("/creator/articles/"),
                    )}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Articles</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/videos"
                    className={navItemClass(pathname === "/creator/videos" || pathname?.startsWith("/creator/videos/"))}
                  >
                    <Video className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Videos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/providers"
                    className={navItemClass(
                      pathname === "/creator/providers" || pathname?.startsWith("/creator/providers/"),
                    )}
                  >
                    <Building2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Experiences</span>
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
                await supabase.auth.signOut();
                setSigningOut(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/80 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white/70 dark:hover:bg-white/8"
            >
              <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-neutral-50 dark:bg-neutral-950/50">
          {children}
        </div>
      </div>
    </div>
  );
}
