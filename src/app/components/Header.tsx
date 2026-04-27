"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Moon, ScanSearch, Sun } from "lucide-react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import Hamburger from "hamburger-react";

import { useTheme } from "../styles/ThemeContext";
import { GoogleSignInButton } from "./AuthButtons";
import NearByPanel from "./NearByPanel";
import Sidebar from "./Sidebar";
import { destinations } from "@/lib/destinationsData";

const suggestionTags = [
  "Amsterdam",
  "Socio-cultural",
  "Health",
  "Wellness",
  "Bar",
  "Restaurant",
  "Cafe",
];

const SEARCH_RECENT_KEY = "culturin-search-recent";
const MAX_RECENT = 10;
type PredictiveSuggestion =
  | { label: string; kind: "destination"; href: string }
  | { label: string; kind: "topic" | "search" };

function readSearchRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEARCH_RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

function writeSearchRecent(items: string[]) {
  try {
    localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / private mode */
  }
}

function pathnameMatches(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navLinkClass = (active: boolean) =>
  [
    "text-sm font-medium tracking-tight transition-colors",
    active
      ? "text-amber-600 dark:text-amber-400"
      : "text-neutral-700 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white",
  ].join(" ");

const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-200/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-amber-400/50";

const nearbyPillClass =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={["h-[18px] w-[18px] shrink-0", className].filter(Boolean).join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 3a7.5 7.5 0 0 1 5.98 12.03l4.25 4.25a1 1 0 0 1-1.42 1.42l-4.24-4.25A7.5 7.5 0 1 1 10.5 3m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PaletteDotsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="6.5" cy="7" r="2.2" fill="#38bdf8" />
      <circle cx="12.5" cy="6" r="1.8" fill="#f472b6" />
      <circle cx="10" cy="11.5" r="2" fill="#fbbf24" />
      <circle cx="14.5" cy="12" r="1.6" fill="#a78bfa" />
      <circle cx="6" cy="13" r="1.7" fill="#4ade80" />
    </svg>
  );
}

const searchPillRowClass =
  "flex w-full min-h-[2.5rem] items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-100 py-1.5 pl-3 pr-1.5 text-sm shadow-sm shadow-neutral-900/5 transition-[border-color,box-shadow] dark:border-white/[0.08] dark:bg-[#1a1a1a] dark:shadow-none sm:min-h-[2.65rem] sm:gap-2.5 sm:pl-3.5 sm:pr-2";

const searchPillRowFocusClass =
  "focus-within:border-amber-500/35 focus-within:ring-2 focus-within:ring-amber-500/20 dark:focus-within:border-amber-400/25 dark:focus-within:ring-amber-400/15";

function LeftNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathnameMatches(pathname, href);
  return (
    <Link href={href} className={navLinkClass(active)} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

function TravelGuidesNavLink() {
  const pathname = usePathname();
  const active =
    pathnameMatches(pathname, "/travel-guides") || pathnameMatches(pathname, "/articles/guides");
  return (
    <Link href="/travel-guides" className={navLinkClass(active)} aria-current={active ? "page" : undefined}>
      Travel Guides
    </Link>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center rounded-md outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:ring-offset-neutral-950"
      aria-label="Culturin home"
    >
      <Image
        src="/culturin_logo.svg"
        alt="Culturin"
        width={84}
        height={18}
        className="h-4 w-auto max-w-[5.75rem] opacity-95 transition-opacity group-hover:opacity-100 sm:h-[1.1rem] sm:max-w-[6.25rem]"
        unoptimized
        priority
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";
  const [elevated, setElevated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNearbyOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setNearbyOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    setRecent(readSearchRecent());
  }, [searchOpen]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  const runSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (trimmed) {
        const prev = readSearchRecent();
        const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, MAX_RECENT);
        writeSearchRecent(next);
        setRecent(next);
      }
      setSearchOpen(false);
      if (!trimmed) {
        router.push("/search");
        return;
      }
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const clearRecent = useCallback(() => {
    writeSearchRecent([]);
    setRecent([]);
  }, []);

  const predictiveSuggestions = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return [] as PredictiveSuggestion[];

    const destinationMatches = destinations
      .filter((d) => d.name.toLowerCase().includes(q) || d.slug.includes(q) || (d.country ?? "").toLowerCase().includes(q))
      .slice(0, 5)
      .map((d) => ({
        label: d.country ? `${d.name}, ${d.country}` : d.name,
        kind: "destination" as const,
        href: `/destinations/${d.slug}`,
      }));

    const topicMatches = suggestionTags
      .filter((tag) => tag.toLowerCase().includes(q))
      .slice(0, 4)
      .map((tag) => ({
        label: tag,
        kind: "topic" as const,
      }));

    const seen = new Set<string>();
    const deduped = [...destinationMatches, ...topicMatches].filter((item) => {
      const key = item.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return [{ label: `Search for "${searchValue.trim()}"`, kind: "search" as const }, ...deduped].slice(0, 8);
  }, [searchValue]);

  const openSearch = useCallback(() => {
    setNearbyOpen(false);
    setSearchOpen(true);
  }, []);

  const triggerVisualSearch = useCallback(() => {
    const fallbackQuery = "nearby experiences";
    const nextQuery = searchValue.trim() || fallbackQuery;
    setSearchValue(nextQuery);
    runSearch(nextQuery);
  }, [runSearch, searchValue]);

  const triggerSurpriseSearch = useCallback(() => {
    const pool = [...suggestionTags, ...destinations.map((d) => d.name)];
    const pick = pool[Math.floor(Math.random() * pool.length)] || "Travel";
    setSearchValue(pick);
    runSearch(pick);
  }, [runSearch]);

  const toggleNearby = useCallback(() => {
    setSearchOpen(false);
    setNearbyOpen((o) => !o);
  }, []);

  return (
    <>
      <header
        className={
          `fixed inset-x-0 top-0 z-[1100] w-full border-b border-neutral-200/90 bg-white pt-[env(safe-area-inset-top,0px)] transition-[box-shadow,background] duration-200 dark:border-white/10 dark:bg-neutral-950` +
          (elevated
            ? " shadow-sm shadow-neutral-900/5 backdrop-blur dark:shadow-black/20"
            : " supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-neutral-950/90")
        }
      >
        <div className="mx-auto flex h-[var(--header-bar-height)] w-full min-w-0 max-w-[1720px] items-center gap-2 pl-[var(--gutter-l)] pr-[var(--gutter-r)] sm:gap-3">
          {/*
            <lg: logo+nav (shrink-0) and actions (ml-auto). lg+: three equal flex-1 columns; search is centered in the true middle.
          */}
          <div className="flex shrink-0 items-center justify-start gap-2 sm:gap-4 lg:min-w-0 lg:flex-1 lg:gap-8">
            <Logo />
            <nav
              className="hidden items-center gap-4 whitespace-nowrap sm:gap-5 lg:flex lg:gap-6"
              aria-label="Main navigation"
            >
              <LeftNavLink href="/destinations">Destinations</LeftNavLink>
              <TravelGuidesNavLink />
            </nav>
          </div>

          <div className="hidden min-w-0 max-w-2xl flex-1 items-center justify-center self-center px-1 lg:flex">
            <div className="w-full min-w-0 max-w-2xl">
              <div className={searchPillRowClass}>
                <button
                  type="button"
                  onClick={openSearch}
                  className="inline-flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-label="Open search"
                  aria-haspopup="dialog"
                  aria-expanded={searchOpen}
                >
                  <span className="shrink-0 text-neutral-400 dark:text-white/35" aria-hidden>
                    <SearchIcon />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left font-normal text-neutral-500 dark:text-white/45">
                    Search Culturin…
                  </span>
                </button>
                <span className="flex shrink-0 items-center gap-0.5 pr-0.5">
                  <button
                    type="button"
                    onClick={triggerVisualSearch}
                    className="rounded-full p-1.5 text-neutral-500 transition hover:bg-neutral-200/80 dark:text-white/45 dark:hover:bg-white/10"
                    aria-label="Visual search shortcut"
                  >
                    <ScanSearch className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={triggerSurpriseSearch}
                    className="rounded-full p-1.5 text-neutral-500 transition hover:bg-neutral-200/80 dark:text-white/45 dark:hover:bg-white/10"
                    aria-label="Surprise me"
                  >
                    <PaletteDotsIcon className="h-5 w-5 opacity-95" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end gap-0.5 sm:gap-1.5 lg:ml-0 lg:min-w-0 lg:flex-1">
            <button
              type="button"
              onClick={openSearch}
              className={`${iconButtonClass} lg:hidden`}
              aria-label="Open search"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              onClick={toggleNearby}
              className={nearbyPillClass}
              aria-label="Open nearby"
              aria-haspopup="dialog"
              aria-expanded={nearbyOpen}
            >
              Nearby
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={iconButtonClass}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              ) : (
                <Moon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              )}
            </button>

            <div className="hidden pl-0.5 lg:block">
              <GoogleSignInButton appearance="header" />
            </div>

            <div className="flex h-10 w-10 items-center justify-center text-neutral-800 lg:hidden dark:text-white">
              <Hamburger
                toggled={mobileMenuOpen}
                toggle={() => setMobileMenuOpen((o) => !o)}
                size={20}
                rounded
                color="currentColor"
                label={mobileMenuOpen ? "Close menu" : "Open menu"}
              />
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? <Sidebar id="mobile-navigation" onClose={closeMobile} /> : null}

      <NearByPanel open={nearbyOpen} onClose={() => setNearbyOpen(false)} />

      {searchOpen ? (
        <div
          id="search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[1300] bg-neutral-950/55 backdrop-blur-md dark:bg-black/75"
          onClick={() => setSearchOpen(false)}
        >
          <button
            type="button"
            className="absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[1] rounded-full px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:text-white/75 dark:hover:bg-white/10 dark:focus-visible:ring-amber-400/50 sm:top-4"
            onClick={() => setSearchOpen(false)}
          >
            Close
          </button>
          <div
            className="absolute left-1/2 top-[calc(var(--header-total-height)+0.75rem)] w-[min(92dvw,40rem)] -translate-x-1/2 sm:top-[calc(var(--header-total-height)+1rem)]"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(searchValue);
              }}
            >
              <label className="sr-only" htmlFor="header-search-input">
                Search Culturin
              </label>
              <div className={`${searchPillRowClass} ${searchPillRowFocusClass}`}>
                <span className="shrink-0 text-neutral-400 dark:text-white/35" aria-hidden>
                  <SearchIcon />
                </span>
                <input
                  id="header-search-input"
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search Culturin…"
                  className="min-w-0 flex-1 border-0 bg-transparent py-0.5 text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white/40"
                  autoFocus
                  autoComplete="off"
                />
                <span className="flex shrink-0 items-center gap-0.5 pr-0.5">
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-neutral-500 transition hover:bg-neutral-200/80 dark:text-white/45 dark:hover:bg-white/10"
                    aria-label="Visual search shortcut"
                    onClick={triggerVisualSearch}
                  >
                    <ScanSearch className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={triggerSurpriseSearch}
                    className="rounded-full p-1.5 text-neutral-500 dark:text-white/45"
                    aria-label="Surprise me"
                  >
                    <PaletteDotsIcon className="h-5 w-5 opacity-95" />
                  </button>
                </span>
              </div>
            </form>

            <div className="mt-3 rounded-3xl border border-neutral-200/90 bg-white p-5 shadow-2xl shadow-neutral-900/10 dark:border-white/[0.08] dark:bg-[#141414] dark:shadow-black/50 sm:p-6">
              <div className="space-y-6">
                {recent.length > 0 ? (
                  <section aria-labelledby="search-recent-heading">
                    <div className="flex items-center justify-between gap-3">
                      <h2
                        id="search-recent-heading"
                        className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/45"
                      >
                        Recent
                      </h2>
                      <button
                        type="button"
                        className="text-xs font-medium text-neutral-500 transition hover:text-neutral-800 dark:text-white/45 dark:hover:text-white/80"
                        onClick={clearRecent}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {recent.map((q) => (
                        <button
                          key={q}
                          type="button"
                          className="inline-flex max-w-[11rem] shrink-0 items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-100 px-3 py-2 text-left text-sm font-medium text-neutral-800 transition hover:bg-neutral-200/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/90 dark:hover:bg-white/10"
                          onClick={() => runSearch(q)}
                        >
                          <SearchIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-white/40" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section aria-labelledby="search-suggestions-heading">
                  <h2
                    id="search-suggestions-heading"
                    className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/45"
                  >
                    Suggestions
                  </h2>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {suggestionTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/90 dark:hover:bg-white/10"
                        onClick={() => runSearch(tag)}
                      >
                        <SearchIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-white/40" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </section>

                {predictiveSuggestions.length > 0 ? (
                  <section aria-labelledby="search-predictive-heading">
                    <h2
                      id="search-predictive-heading"
                      className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/45"
                    >
                      Predictive
                    </h2>
                    <div className="mt-3 grid gap-2">
                      {predictiveSuggestions.map((item) => (
                        <button
                          key={`${item.kind}-${item.label}`}
                          type="button"
                          className="inline-flex items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-neutral-100 px-3 py-2 text-left text-sm font-medium text-neutral-800 transition hover:bg-neutral-200/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/90 dark:hover:bg-white/10"
                          onClick={() => {
                            if (item.kind === "destination") {
                              setSearchOpen(false);
                              router.push(item.href);
                              return;
                            }
                            runSearch(item.kind === "search" ? searchValue : item.label);
                          }}
                        >
                          <span className="inline-flex items-center gap-2">
                            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-white/40" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-white/35">
                            {item.kind}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
