"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import Hamburger from "hamburger-react";

import { GoogleSignInButton } from "./AuthButtons";
import NearByPanel from "./NearByPanel";
import Sidebar from "./Sidebar";

const suggestionTags = ["Amsterdam", "Socio-cultural", "Health", "Wellness", "Bar", "Restaurant", "Cafe"];

function pathnameMatches(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const leftNavText =
  "inline-flex items-center whitespace-nowrap text-sm font-medium leading-none text-neutral-800 no-underline transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300";

export default function Header() {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const [elevated, setElevated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      setNearbyOpen(false);
      setSearchOpen(false);
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

  function LeftNavLink({ href, children }: { href: string; children: ReactNode }) {
    const active = pathnameMatches(pathname, href);
    return (
      <Link
        href={href}
        className={`${leftNavText} ${active ? "text-amber-500 dark:text-amber-300" : ""}`}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1100] w-full transition-[background-color,box-shadow,border-color] duration-200 ${
          elevated
            ? "border-b border-neutral-200 bg-white/95 shadow-sm shadow-neutral-900/10 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95 dark:shadow-black/40"
            : "border-b border-neutral-200/80 bg-white dark:border-white/10 dark:bg-neutral-950"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-bar-height)] min-h-0 max-w-[1720px] items-center px-3 sm:px-5 md:px-8">
          <div className="hidden w-full min-w-0 items-center gap-2 md:flex md:gap-3 lg:gap-4">
            <Link
              href="/"
              className="group flex h-full shrink-0 items-center rounded-sm outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-400/90 dark:ring-offset-neutral-950"
              aria-label="Culturin home"
            >
              <Image
                src="/culturin_logo.svg"
                alt="Culturin"
                width={72}
                height={16}
                className="h-4 w-auto opacity-95 transition-opacity group-hover:opacity-100"
                loading="lazy"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                unoptimized
              />
            </Link>
            <nav
              className="flex shrink-0 items-center gap-3 lg:gap-4"
              aria-label="Section navigation"
            >
              <LeftNavLink href="/destinations">Destinations</LeftNavLink>
              <LeftNavLink href="/articles">Travel Guides</LeftNavLink>
            </nav>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  setNearbyOpen(false);
                  setSearchOpen(true);
                }}
                className="flex h-8 w-full max-w-none items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3 text-left text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 min-[1100px]:text-sm dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
              >
                <span className="shrink-0 text-neutral-500 dark:text-white/50">
                  <SearchIcon />
                </span>
                <span className="truncate">Search destinations, guides, and culture…</span>
              </button>
            </div>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setNearbyOpen((open) => !open);
                }}
                className="inline-flex h-8 items-center justify-center rounded-full bg-neutral-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:px-3.5 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                aria-haspopup="dialog"
                aria-expanded={nearbyOpen}
                aria-controls="nearby-experience-panel"
              >
                Nearby
              </button>
            </div>
            <nav
              aria-label="Primary actions"
              className="flex shrink-0 items-center"
            >
              <GoogleSignInButton className="!flex !h-8 !min-h-0 !w-auto !max-w-none !flex-row !items-center !justify-center !whitespace-nowrap !rounded-lg !px-2.5 !py-1.5 !text-[11px] !font-semibold !shadow-none min-[1200px]:!px-3 min-[1200px]:!text-xs" />
            </nav>
          </div>

          <div className="flex h-full w-full min-w-0 items-center justify-between gap-2 md:hidden">
            <Link
              href="/"
              className="group flex items-center rounded-sm outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-400/90 dark:ring-offset-neutral-950"
              aria-label="Culturin home"
            >
              <Image
                src="/culturin_logo.svg"
                alt="Culturin"
                width={72}
                height={16}
                className="h-4 w-auto opacity-95 transition-opacity group-hover:opacity-100"
                loading="lazy"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-1.5 text-neutral-800 dark:text-white [&_button]:rounded-md [&_button]:outline-none [&_button]:ring-offset-2 [&_button]:ring-offset-white dark:[&_button]:ring-offset-neutral-950 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-amber-400">
              <button
                type="button"
                onClick={() => {
                  setNearbyOpen(false);
                  setSearchOpen(true);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-neutral-200 dark:hover:bg-white/10"
                aria-label="Open search"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setNearbyOpen((open) => !open);
                }}
                className="inline-flex h-8 min-w-0 shrink items-center justify-center rounded-full bg-neutral-900 px-2.5 text-[11px] font-semibold text-white dark:bg-white dark:text-black"
                aria-haspopup="dialog"
                aria-expanded={nearbyOpen}
                aria-label="Open nearby"
              >
                Nearby
              </button>
              <Hamburger
                toggled={mobileMenuOpen}
                toggle={() => setMobileMenuOpen((open) => !open)}
                size={18}
                rounded
                label={mobileMenuOpen ? "Close menu" : "Open menu"}
              />
            </div>
          </div>
        </div>

        {mobileMenuOpen ? <Sidebar id="mobile-navigation" onClose={closeMobile} /> : null}
      </header>

      <NearByPanel open={nearbyOpen} onClose={() => setNearbyOpen(false)} />

      {searchOpen ? (
        <div
          id="search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search destinations and experiences"
          className="fixed inset-0 z-[1300] bg-white/80 backdrop-blur-sm dark:bg-black/75"
          onClick={() => setSearchOpen(false)}
        >
          <button
            type="button"
            className="absolute right-6 top-5 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-white/70"
            onClick={() => setSearchOpen(false)}
          >
            Close
          </button>

          <div className="mx-auto mt-24 w-[min(92vw,48rem)]" onClick={(e) => e.stopPropagation()}>
            <form
              className="rounded-xl border border-neutral-200 bg-white px-6 py-5 shadow-xl shadow-neutral-900/10 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/40"
              onSubmit={(event) => {
                event.preventDefault();
                runSearch(searchValue);
              }}
            >
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-white/15">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search destinations & more"
                  className="w-full bg-transparent text-lg font-medium text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white/45"
                  autoFocus
                />
                <button
                  type="submit"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
                  aria-label="Submit search"
                >
                  <SearchIcon />
                </button>
              </div>

              <div className="pt-4">
                <p className="text-xs font-semibold text-neutral-500 dark:text-white/60">Suggestions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestionTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full border border-neutral-300 bg-transparent px-3 py-1.5 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
                      onClick={() => runSearch(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M10.5 3a7.5 7.5 0 015.977 12.033l4.245 4.245a1 1 0 11-1.414 1.414l-4.245-4.245A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
        fill="currentColor"
      />
    </svg>
  );
}
