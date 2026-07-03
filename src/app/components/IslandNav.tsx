"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "../styles/ThemeContext";

const NAV = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Partners", href: "/#partners" },
] as const;

/**
 * Floating "dynamic island" nav: a centered, pill-shaped bar detached from
 * the screen edges that blurs the content behind it and tightens (stronger
 * background + shadow, slightly smaller) once the page is scrolled.
 */
export default function IslandNav() {
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
    >
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
          className="flex shrink-0 items-center rounded-full px-4 py-2 no-underline opacity-95 transition hover:bg-black/[0.04] hover:opacity-100 dark:hover:bg-white/[0.06]"
        >
          <Image
            src="/culturin_logo.svg"
            alt="Culturin"
            width={84}
            height={18}
            className="h-4 w-auto max-w-[5.5rem]"
            unoptimized
            priority
          />
        </Link>

        {/* Links (hidden on mobile) */}
        <div className="hidden items-center sm:flex">
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

        {/* Light / dark toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex shrink-0 items-center justify-center rounded-full p-2 text-[#1c1a17] transition hover:bg-black/[0.05] dark:text-[#f1e9dc] dark:hover:bg-white/[0.07]"
        >
          {isDark ? (
            <Sun className="h-4 w-4" strokeWidth={2} aria-hidden />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={2} aria-hidden />
          )}
        </button>

        {/* CTA */}
        <Link
          href="/#partners"
          className="shrink-0 rounded-full bg-[#b5502e] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#17130f] no-underline transition hover:opacity-90 dark:bg-[#e08a5b]"
        >
          Partner<span className="hidden sm:inline"> with us</span>
        </Link>
      </div>
    </nav>
  );
}
