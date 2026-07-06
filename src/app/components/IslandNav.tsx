"use client";

import Image from "next/image";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { useEffect, useState } from "react";

import { useTheme } from "../styles/ThemeContext";
import MagneticButton from "./motion/MagneticButton";
import CulturinWordmark from "./CulturinWordmark";

const NAV = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Partners", href: "/#partners" },
] as const;

/**
 * Primary nav. Desktop gets a floating "dynamic island" pill; mobile gets a
 * flush top bar with a hamburger that opens a full-screen menu, since the
 * pill's collapsed-links treatment doesn't give mobile visitors a way to
 * actually reach Events/Gallery/Partners.
 */
export default function IslandNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === "dark";

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
      {/* ── Desktop: floating dynamic island ──────────────────────── */}
      <nav aria-label="Primary" className="fixed inset-x-0 top-4 z-50 hidden justify-center px-3 sm:flex">
        <div
          className={[
            "flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border backdrop-blur-xl",
            "animate-in fade-in slide-in-from-top-4 duration-500",
            "transition-[padding,box-shadow,background-color] duration-300 ease-out",
            "border-[#cec7be]/80 bg-[#e8e3da]/80 dark:border-white/10 dark:bg-[#17130f]/75",
            scrolled
              ? "p-1 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
              : "p-1.5 shadow-[0_6px_20px_-14px_rgba(0,0,0,0.35)]",
          ].join(" ")}
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label="Culturin home"
            className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 no-underline opacity-95 transition hover:bg-black/[0.04] hover:opacity-100 dark:hover:bg-white/[0.06]"
          >
            <Image
              src={isDark ? "/culturin_icon_yellow.png" : "/culturin_icon_black.png"}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              unoptimized
              priority
            />
            <CulturinWordmark isDark={isDark} className="text-base font-semibold tracking-tight" />
          </Link>

          {/* Links */}
          <div className="flex items-center">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1c1a17] no-underline transition hover:bg-black/[0.05] dark:text-[#f1e9dc] dark:hover:bg-white/[0.07]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <MagneticButton strength={0.4} className="shrink-0">
            <Link
              href="/partner"
              className="block rounded-full bg-[#b5502e] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#17130f] no-underline transition hover:opacity-90 dark:bg-[#e08a5b]"
            >
              Contact
            </Link>
          </MagneticButton>
        </div>
      </nav>

      {/* ── Mobile: flush top bar + hamburger ──────────────────────── */}
      <nav
        aria-label="Primary"
        className={[
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur-xl sm:hidden",
          "border-[#cec7be]/80 bg-[#e8e3da]/90 dark:border-white/10 dark:bg-[#17130f]/90",
        ].join(" ")}
      >
        <Link
          href="/"
          aria-label="Culturin home"
          onClick={() => setMobileOpen(false)}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <Image
            src={isDark ? "/culturin_icon_yellow.png" : "/culturin_icon_black.png"}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            unoptimized
            priority
          />
          <CulturinWordmark isDark={isDark} className="text-[15px] font-semibold tracking-tight" />
        </Link>
        <div className="text-[#1c1a17] dark:text-[#f1e9dc]">
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

      {/* ── Mobile: full-screen menu ───────────────────────────────── */}
      {mobileOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-[#e8e3da] pt-[52px] sm:hidden dark:bg-[#17130f]"
        >
          <div className="flex flex-1 flex-col gap-1 px-4 py-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-4 text-base font-semibold uppercase tracking-[0.12em] text-[#1c1a17] no-underline transition hover:bg-black/[0.05] dark:text-[#f1e9dc] dark:hover:bg-white/[0.07]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center border-t border-[#cec7be]/80 px-4 py-4 dark:border-white/10">
            <Link
              href="/partner"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-full bg-[#b5502e] px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#17130f] no-underline transition hover:opacity-90 dark:bg-[#e08a5b]"
            >
              Contact
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
