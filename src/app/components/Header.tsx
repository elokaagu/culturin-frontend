"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Hamburger from "hamburger-react";

import { GoogleSignInButton } from "./AuthButtons";
import Sidebar from "./Sidebar";

type NearbyItem = {
  label: string;
  href: string;
  description: string;
};

const nearbyItems: NearbyItem[] = [
  {
    label: "Experiences",
    href: "/curated-experiences",
    description: "Hand-picked activities and stays",
  },
  {
    label: "Cafes",
    href: "/search?query=cafe",
    description: "Popular cafe spots and local gems",
  },
];

const suggestionTags = ["Amsterdam", "Socio-cultural", "Health", "Wellness", "Bar", "Restaurant", "Cafe"];

function pathnameMatches(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const leftNavText =
  "whitespace-nowrap text-[15px] font-medium leading-none text-neutral-800 no-underline transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [elevated, setElevated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const nearbyRef = useRef<HTMLDivElement>(null);

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
    if (!nearbyOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (nearbyRef.current?.contains(node)) return;
      setNearbyOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [nearbyOpen]);

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
        <div className="mx-auto flex min-h-[var(--header-bar-height)] max-w-[1720px] items-center gap-2 px-3 sm:px-5 md:px-8">
          <div className="hidden min-w-0 flex-1 items-center gap-5 md:flex lg:gap-6">
            <Link
              href="/"
              className="group shrink-0 rounded-sm outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-400/90 dark:ring-offset-neutral-950"
              aria-label="Culturin home"
            >
              <Image
                src="/culturin_logo.svg"
                alt="Culturin"
                width={178}
                height={36}
                className="h-9 w-auto opacity-95 transition-opacity group-hover:opacity-100"
                unoptimized
                priority
              />
            </Link>
            <LeftNavLink href="/about">About</LeftNavLink>
            <LeftNavLink href="/countries/europe">Destinations</LeftNavLink>
            <LeftNavLink href="/articles">Travel Guides</LeftNavLink>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex w-[min(50vw,26rem)] items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 py-2 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
            >
              <SearchIcon />
              <span className="truncate">Search destinations, guides, and culture...</span>
            </button>

            <div ref={nearbyRef} className="relative">
              <button
                type="button"
                onClick={() => setNearbyOpen((open) => !open)}
                className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                aria-haspopup="menu"
                aria-expanded={nearbyOpen}
              >
                Nearby
              </button>
              {nearbyOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.55rem)] z-[1200] w-[19rem] rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/10 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/40"
                >
                  {nearbyItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2.5 no-underline transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
                      onClick={() => setNearbyOpen(false)}
                    >
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{item.label}</p>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-white/60">{item.description}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <nav aria-label="Primary actions" className="flex items-center gap-5 lg:gap-6">
              <GoogleSignInButton className="!w-auto !max-w-none shrink-0 !rounded-lg px-5 py-2.5 text-sm font-bold shadow-none max-[428px]:!w-auto" />
            </nav>
          </div>

          <div className="flex w-full items-center justify-between gap-2 md:hidden">
            <Link
              href="/"
              className="group shrink-0 rounded-sm outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-400/90 dark:ring-offset-neutral-950"
              aria-label="Culturin home"
            >
              <Image
                src="/culturin_logo.svg"
                alt="Culturin"
                width={139}
                height={28}
                className="h-7 w-auto opacity-95 transition-opacity group-hover:opacity-100"
                unoptimized
                priority
              />
            </Link>
            <div className="flex items-center gap-1.5 text-neutral-800 dark:text-white [&_button]:rounded-md [&_button]:outline-none [&_button]:ring-offset-2 [&_button]:ring-offset-white dark:[&_button]:ring-offset-neutral-950 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-amber-400">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-neutral-200 dark:hover:bg-white/10"
                aria-label="Open search"
              >
                <SearchIcon />
              </button>
              <Hamburger
                toggled={mobileMenuOpen}
                toggle={() => setMobileMenuOpen((open) => !open)}
                size={20}
                rounded
                label={mobileMenuOpen ? "Close menu" : "Open menu"}
              />
            </div>
          </div>
        </div>

        {mobileMenuOpen ? <Sidebar id="mobile-navigation" onClose={closeMobile} /> : null}
      </header>

      {searchOpen ? (
        <div
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
