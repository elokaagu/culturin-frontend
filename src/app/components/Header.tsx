"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "hamburger-react";

import { GoogleSignInButton } from "./AuthButtons";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

function navIsActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

  const navLinkClass =
    "text-white no-underline transition-colors duration-200 ease-out hover:text-neutral-400";
  const navLinkActive = "text-amber-300 hover:text-amber-200";

  const desktopNavLink = (href: string, label: string) => {
    const active = navIsActive(pathname, href);
    return (
      <li className="inline-block list-none px-5 py-5 text-white max-md:px-2.5 max-md:py-5">
        <Link
          href={href}
          className={`${navLinkClass} ${active ? navLinkActive : ""}`}
          aria-current={active ? "page" : undefined}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[1000] w-full transition-[background] duration-300 ease-out ${
        isScrolled ? "bg-gradient-to-r from-black to-neutral-700" : "bg-transparent"
      }`}
    >
      <div className="relative z-[1000] mx-auto flex min-h-[60px] w-full max-w-[100vw] flex-row items-center justify-between gap-2 bg-black px-4 py-4 sm:px-6 sm:py-5 md:px-8">
        <div className="z-[600] flex min-w-0 max-w-[40%] shrink-0 flex-row items-center gap-2 sm:max-w-[33%] sm:flex-[0.33]">
          <Link
            href="/"
            className="shrink-0 rounded-md outline-none ring-offset-2 ring-offset-black hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Culturin home"
          >
            <Image
              src="/culturin_logo.svg"
              width={100}
              height={100}
              draggable={false}
              alt=""
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>
          <Link
            href="/about"
            className={`${navLinkClass} shrink-0 px-2 text-sm sm:text-base ${
              navIsActive(pathname, "/about") ? navLinkActive : ""
            }`}
            aria-current={navIsActive(pathname, "/about") ? "page" : undefined}
          >
            About
          </Link>
        </div>

        <div className="z-[600] min-w-0 flex-1 px-1 sm:px-2">
          <SearchBar />
        </div>

        <nav
          aria-label="Primary"
          className="z-[600] hidden flex-none flex-row items-center md:flex"
        >
          <ul className="m-0 flex list-none flex-row p-0 text-white">
            {desktopNavLink("/create", "Create")}
            {desktopNavLink("/join-us/advisors", "Advisor")}
            <li className={`inline-block list-none px-5 py-5 max-md:px-2.5 max-md:py-5`}>
              <GoogleSignInButton />
            </li>
          </ul>
        </nav>

        <div className="flex shrink-0 items-center justify-center text-white md:hidden [&_button]:rounded-md [&_button]:text-white [&_button]:outline-none [&_button]:ring-offset-2 [&_button]:ring-offset-black [&_button]:hover:bg-white/10 [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-amber-400">
          <Hamburger
            toggled={mobileMenuOpen}
            toggle={() => setMobileMenuOpen((o) => !o)}
            size={20}
            rounded
            label={mobileMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </div>

      {mobileMenuOpen ? (
        <Sidebar id="mobile-navigation" onClose={closeMobile} />
      ) : null}
    </header>
  );
}
