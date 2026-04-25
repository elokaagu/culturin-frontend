"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import Hamburger from "hamburger-react";

import { GoogleSignInButton } from "./AuthButtons";
import NearByPanel from "./NearByPanel";
import Sidebar from "./Sidebar";

const suggestionTags = [
  "Amsterdam",
  "Socio-cultural",
  "Health",
  "Wellness",
  "Bar",
  "Restaurant",
  "Cafe",
];

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
      className={className}
      width="18"
      height="18"
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

function LeftNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathnameMatches(pathname, href);
  return (
    <Link href={href} className={navLinkClass(active)} aria-current={active ? "page" : undefined}>
      {children}
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
  const [elevated, setElevated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  const runSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      setSearchOpen(false);
      if (!trimmed) {
        router.push("/search");
        return;
      }
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const openSearch = useCallback(() => {
    setNearbyOpen(false);
    setSearchOpen(true);
  }, []);

  const toggleNearby = useCallback(() => {
    setSearchOpen(false);
    setNearbyOpen((o) => !o);
  }, []);

  return (
    <>
      <header
        className={
          `fixed inset-x-0 top-0 z-[1100] w-full border-b border-neutral-200/90 bg-white transition-[box-shadow,background] duration-200 dark:border-white/10 dark:bg-neutral-950` +
          (elevated
            ? " shadow-sm shadow-neutral-900/5 backdrop-blur dark:shadow-black/20"
            : " supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-neutral-950/90")
        }
      >
        <div className="mx-auto flex h-[var(--header-bar-height)] max-w-[1720px] flex-nowrap items-center justify-between gap-3 px-3 sm:gap-4 sm:px-5 md:px-8">
          <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-4 sm:gap-8 md:gap-10">
            <Logo />
            <nav
              className="hidden min-w-0 items-center gap-5 whitespace-nowrap md:flex md:gap-6"
              aria-label="Main navigation"
            >
              <LeftNavLink href="/destinations">Destinations</LeftNavLink>
              <LeftNavLink href="/articles">Travel Guides</LeftNavLink>
            </nav>
          </div>

          <div className="flex flex-none flex-nowrap items-center gap-0.5 whitespace-nowrap sm:gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className={iconButtonClass}
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

            <div className="hidden pl-0.5 md:block">
              <GoogleSignInButton appearance="header" />
            </div>

            <div className="flex h-10 w-10 items-center justify-center text-neutral-800 md:hidden dark:text-white">
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
          className="fixed inset-0 z-[1300] bg-white/90 backdrop-blur dark:bg-black/80"
          onClick={() => setSearchOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md px-2 py-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:text-white/80 dark:hover:text-white"
            onClick={() => setSearchOpen(false)}
          >
            Close
          </button>
          <div
            className="absolute left-1/2 top-[20vh] w-[min(92vw,34rem)] -translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <form
              className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xl shadow-neutral-900/5 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/30"
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(searchValue);
              }}
            >
              <label className="sr-only" htmlFor="header-search-input">
                Search
              </label>
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-white/15">
                <div className="shrink-0 text-neutral-400">
                  <SearchIcon />
                </div>
                <input
                  id="header-search-input"
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Destinations, guides, culture…"
                  className="min-w-0 flex-1 border-0 bg-transparent text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-lg dark:text-white dark:placeholder:text-white/40"
                  autoFocus
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md px-2 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:text-amber-400/90 dark:hover:bg-amber-950/40"
                >
                  Go
                </button>
              </div>
              <p className="pt-3 text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-white/50">
                Suggestions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-full border border-neutral-200/90 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                    onClick={() => runSearch(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
