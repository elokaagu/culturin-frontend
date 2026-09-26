"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "hamburger-react";
import { useEffect, useState } from "react";

import { useTheme } from "../styles/ThemeContext";
import CulturinWordmark from "./CulturinWordmark";

const NAV = [
  { label: "Reports", href: "/platform" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
] as const;

const gutterX = "pl-[var(--gutter-l)] pr-[var(--gutter-r)]";

function isPhotoHeroPath(pathname: string): boolean {
  if (pathname === "/travel-guides/nice-and-cannes") return true;
  if (/^\/events\/[^/]+$/.test(pathname)) return true;
  return false;
}

/**
 * Primary nav: a flush, full-width editorial masthead.
 * Over a photo hero it stays transparent with white type until the page
 * scrolls, then settles into a solid bar. Everywhere else it is the
 * translucent masthead with a hairline once you move.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const pathname = usePathname();
  const overHero = isPhotoHeroPath(pathname);
  const clearOverHero = overHero && !scrolled && !mobileOpen;
  const ink = clearOverHero ? "#ffffff" : "var(--c-ink)";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b py-3.5 transition-[background-color,border-color,padding] duration-300 ease-out sm:py-4 ${gutterX} ${
          clearOverHero ? "" : "backdrop-blur-xl"
        }`}
        style={{
          background: clearOverHero
            ? "transparent"
            : scrolled
              ? "color-mix(in srgb, var(--c-bg) 92%, transparent)"
              : "color-mix(in srgb, var(--c-bg) 68%, transparent)",
          borderColor: scrolled || mobileOpen ? "var(--c-rule)" : "transparent",
        }}
      >
        <Link
          href="/"
          aria-label="Culturin home"
          onClick={() => setMobileOpen(false)}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <Image
            src={clearOverHero || isDark ? "/culturin_icon_yellow.png" : "/culturin_icon_black.png"}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            unoptimized
            priority
          />
          <CulturinWordmark
            isDark={clearOverHero || isDark}
            className="text-base font-semibold tracking-tight sm:text-lg"
            style={clearOverHero ? { color: "#ffffff" } : undefined}
          />
        </Link>

        {/* Desktop: links + CTA inline */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-70"
              style={{ color: ink }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/partner"
            className="ml-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-90"
            style={{ background: "var(--c-accent)", color: "#1c1a17" }}
          >
            Create an experience
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <div className="sm:hidden" style={{ color: ink }}>
          <Hamburger
            toggled={mobileOpen}
            toggle={() => setMobileOpen((o) => !o)}
            size={20}
            rounded
            color="currentColor"
            label={mobileOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {mobileOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col pt-[60px] sm:hidden"
          style={{ background: "var(--c-bg)" }}
        >
          <div className="flex flex-1 flex-col gap-1 px-4 py-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-4 text-base font-semibold uppercase tracking-[0.12em] no-underline transition hover:opacity-70"
                style={{ color: "var(--c-ink)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center border-t px-4 py-4" style={{ borderColor: "var(--c-rule)" }}>
            <Link
              href="/partner"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-full px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-90"
              style={{ background: "var(--c-accent)", color: "#1c1a17" }}
            >
              Create an experience
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
