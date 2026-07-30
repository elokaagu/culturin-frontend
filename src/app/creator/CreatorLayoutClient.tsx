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
import { Link, useTransitionRouter } from "next-view-transitions";
import { useState, type ReactNode } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { useTheme } from "@/app/styles/ThemeContext";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";

type CreatorLayoutClientProps = {
  children: ReactNode;
  email: string | null;
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

const navItemClass = "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition no-underline";

const navItemStyle = (active: boolean): React.CSSProperties =>
  active
    ? { background: "var(--c-accent)", color: "#1c1a17" }
    : { color: "var(--c-muted)" };

/**
 * Creator shell — submissions workspace for signed-in users without CMS admin access.
 */
export default function CreatorLayoutClient({ children, email }: CreatorLayoutClientProps) {
  const router = useTransitionRouter();
  const pathname = usePathname() ?? "";
  const { mode, toggleTheme } = useTheme();
  const { supabase } = useSupabaseAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div
      className={`${editorialScopeClass} flex h-dvh max-h-dvh flex-col overflow-hidden`}
      style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}
    >
      <header
        className="flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2.5 backdrop-blur-sm sm:px-4"
        style={{ borderColor: "var(--c-rule)", background: EDITORIAL_BG }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/creator"
            className="truncate text-base font-medium tracking-tight no-underline"
            style={{ ...displayFont, color: "var(--c-ink)" }}
          >
            Culturin™ <span className="font-sans text-sm font-medium" style={{ color: "var(--c-muted)" }}>Creator</span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:opacity-80"
            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold no-underline transition hover:opacity-80 sm:text-sm"
            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
            <span className="hidden sm:inline">View site</span>
            <span className="sm:hidden">Site</span>
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
        <aside
          className="flex max-h-[40vh] w-full shrink-0 flex-col border-b md:max-h-none md:w-64 md:border-b-0 md:border-r"
          style={{ borderColor: "var(--c-rule)", background: EDITORIAL_BG }}
          aria-label="Creator navigation"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-3 py-4 md:px-3 md:py-5">
              <p className="px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                Account
              </p>
              <p
                className="mt-0.5 truncate px-2.5 text-xs"
                style={{ color: "var(--c-muted)" }}
                title={email ?? undefined}
              >
                {email ?? "—"}
              </p>
            </div>

            <nav className="space-y-4 px-2.5 pb-4 md:pb-6" aria-label="Creator content">
              <p className="pl-0.5 text-xs font-normal" style={{ color: "var(--c-muted)" }}>Your submissions</p>
              <ul className="m-0 space-y-0.5 p-0">
                <li>
                  <Link
                    href="/creator"
                    className={navItemClass}
                    style={navItemStyle(pathname === "/creator")}
                    aria-current={pathname === "/creator" ? "page" : undefined}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/articles"
                    className={navItemClass}
                    style={navItemStyle(pathname === "/creator/articles" || pathname?.startsWith("/creator/articles/"))}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Articles</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/videos"
                    className={navItemClass}
                    style={navItemStyle(pathname === "/creator/videos" || pathname?.startsWith("/creator/videos/"))}
                  >
                    <Video className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Videos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/providers"
                    className={navItemClass}
                    style={navItemStyle(pathname === "/creator/providers" || pathname?.startsWith("/creator/providers/"))}
                  >
                    <Building2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span className="min-w-0 flex-1">Experiences</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t px-2.5 py-2.5" style={{ borderColor: "var(--c-rule)" }}>
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
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "var(--c-muted)" }}
            >
              <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain" style={{ background: EDITORIAL_BG }}>
          {children}
        </div>
      </div>
    </div>
  );
}
