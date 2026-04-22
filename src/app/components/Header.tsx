"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "hamburger-react";

import { GoogleSignInButton } from "./AuthButtons";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

function pathnameMatches(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navText =
  "whitespace-nowrap text-[15px] font-medium leading-none text-neutral-800 no-underline transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300";

export default function Header() {
  const pathname = usePathname();
  const [elevated, setElevated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  function NavLink({ href, children }: { href: string; children: ReactNode }) {
    const active = pathnameMatches(pathname, href);
    return (
      <Link
        href={href}
        className={`${navText} ${active ? "text-amber-300 hover:text-amber-200" : ""}`}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] w-full transition-[background-color,box-shadow,border-color] duration-200 ${
        elevated
          ? "border-b border-neutral-200 bg-white/90 shadow-sm shadow-neutral-900/10 backdrop-blur-sm dark:border-white/10 dark:bg-black/90 dark:shadow-black/40"
          : "border-b border-transparent bg-white dark:bg-black"
      }`}
    >
      <div className="mx-auto flex min-h-[var(--header-bar-height)] max-w-[1680px] items-center gap-2 px-3 sm:gap-3 sm:px-5 md:gap-5 md:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-5 md:gap-6">
          <Link
            href="/"
            className="group shrink-0 rounded-sm outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-amber-400/90 dark:ring-offset-black"
            aria-label="Culturin home"
          >
            <span className="inline-flex items-baseline font-serif text-lg font-bold tracking-tight text-amber-400 transition-colors group-hover:text-amber-300 sm:text-xl md:text-2xl">
              Culturin
              <span className="ml-0.5 translate-y-[-0.35em] text-[0.42em] font-semibold leading-none" aria-hidden>
                ™
              </span>
            </span>
          </Link>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/trending">Trending</NavLink>
        </div>

        <div className="min-w-0 flex-1 md:px-2">
          <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl">
            <SearchBar variant="header" />
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 shrink-0 items-center gap-4 md:flex lg:gap-6"
        >
          <NavLink href="/create">Create</NavLink>
          <NavLink href="/join-us/advisors">Advisor</NavLink>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <GoogleSignInButton className="!w-auto !max-w-none shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold shadow-none max-[428px]:!w-auto" />
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-neutral-800 dark:text-white md:hidden [&_button]:rounded-md [&_button]:outline-none [&_button]:ring-offset-2 [&_button]:ring-offset-white [&_button]:hover:bg-neutral-200/80 dark:[&_button]:ring-offset-black dark:[&_button]:hover:bg-white/10 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-amber-400">
          <ThemeToggle />
          <Hamburger
            toggled={mobileMenuOpen}
            toggle={() => setMobileMenuOpen((open) => !open)}
            size={22}
            rounded
            label={mobileMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </div>

      {mobileMenuOpen ? <Sidebar id="mobile-navigation" onClose={closeMobile} /> : null}
    </header>
  );
}
