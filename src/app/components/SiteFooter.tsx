"use client";

import { Link } from "next-view-transitions";
import { useState, type FormEvent } from "react";

import { appPageContainerClass } from "@/lib/appLayout";
import { useTheme } from "../styles/ThemeContext";

const aboutCopy =
  "Culturin is a platform for travel, culture, and inspiration. We connect people to places through stories, guides, and experiences, and to communities that help you explore with curiosity and care—locally, and around the world.";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "WhatsApp", href: "https://www.whatsapp.com" },
] as const;

const footerLinkItems = [
  { label: "Destinations", href: "/destinations" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Agency", href: "/agency" },
  { label: "Culturin Studio", href: "/studio" },
  { label: "Partner with us", href: "/join-us/advisors" },
  { label: "Privacy", href: "/privacy" },
] as const;

function ArrowSubmitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

const headingClass =
  "text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/50";

const linkClass =
  "text-sm text-neutral-900 no-underline transition-colors hover:text-neutral-600 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-white/90 dark:hover:text-white";

const themeBtnBase =
  "min-h-9 min-w-[4.5rem] rounded-full border px-3.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

function themeLightBtnClasses(isSelected: boolean): string {
  if (isSelected) {
    return `${themeBtnBase} border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950`;
  }
  return `${themeBtnBase} border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/15 dark:bg-white/[0.03] dark:text-white/55 dark:hover:border-white/25 dark:hover:bg-white/5`;
}

function themeDarkBtnClasses(isSelected: boolean): string {
  if (isSelected) {
    return `${themeBtnBase} border-neutral-900 bg-neutral-900 text-white dark:border-white/25 dark:bg-white/15 dark:text-white`;
  }
  return themeLightBtnClasses(false);
}

function FooterThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="group"
      aria-label="Site color theme"
    >
      <span className="hidden pr-0.5 text-xs font-medium uppercase tracking-wider text-neutral-500 sm:inline dark:text-white/50">
        Theme
      </span>
      <button type="button" onClick={() => setMode("light")} className={themeLightBtnClasses(mode === "light")} aria-pressed={mode === "light"}>
        Light
      </button>
      <button type="button" onClick={() => setMode("dark")} className={themeDarkBtnClasses(mode === "dark")} aria-pressed={mode === "dark"}>
        Dark
      </button>
    </div>
  );
}

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please accept the privacy policy to subscribe.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), marketingConsent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        alreadySubscribed?: boolean;
        ok?: boolean;
      };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong. Try again.");
        return;
      }
      if (data.alreadySubscribed) {
        setSuccess("You're already subscribed. Thanks for staying in touch.");
      } else {
        setSuccess("Thanks. You are on the list.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <p className="text-sm text-neutral-700 dark:text-white/80" role="status">
        {success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex max-w-sm flex-col gap-3" noValidate>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-white/65">
        Sign up to our newsletter for updates on articles, interviews and events.
      </p>
      <div className="flex min-w-0 items-stretch border-0 border-b-2 border-neutral-900/80 pb-1 focus-within:border-neutral-600 dark:border-white/70 dark:focus-within:border-white">
        <label htmlFor="site-footer-email" className="sr-only">
          Email
        </label>
        <input
          id="site-footer-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0 disabled:cursor-wait disabled:opacity-60 dark:text-white dark:placeholder:text-white/45"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-wait disabled:opacity-50 dark:text-white dark:hover:bg-white/10"
          aria-label="Subscribe"
          aria-busy={pending}
        >
          <ArrowSubmitIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-2.5">
        <input
          id="site-footer-marketing"
          name="marketing"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-neutral-400 text-amber-600 focus:ring-2 focus:ring-amber-400/80 dark:border-white/50 dark:bg-transparent"
        />
        <label htmlFor="site-footer-marketing" className="text-xs leading-relaxed text-neutral-600 dark:text-white/65">
          I agree to receive marketing emails and accept the{" "}
          <Link href="/privacy" className="text-neutral-900 underline underline-offset-2 dark:text-white">
            privacy policy
          </Link>
          .
        </label>
      </div>
      {error ? (
        <p className="text-xs text-amber-700 dark:text-amber-300" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-8 border-t border-neutral-200/90 bg-gradient-to-b from-white to-neutral-50/90 pt-12 pb-10 text-neutral-900 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.06)] dark:border-white/10 dark:from-black dark:to-neutral-950 dark:text-white dark:shadow-[0_-4px_32px_-12px_rgba(0,0,0,0.4)]"
      role="contentinfo"
    >
      <div className={appPageContainerClass}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:items-start lg:gap-8 lg:gap-y-0">
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <h2 className={headingClass}>About</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-white/70">{aboutCopy}</p>
          </div>

          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <h2 className={headingClass}>Newsletter</h2>
            <FooterNewsletter />
          </div>

          <div className="min-w-0 lg:col-span-2">
            <h2 className={headingClass}>Social</h2>
            <ul className="mt-3 list-none space-y-2.5 p-0">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-2">
            <h2 className={headingClass}>Links</h2>
            <ul className="mt-3 list-none space-y-2.5 p-0">
              {footerLinkItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 border-t border-neutral-200/80 pt-8 text-xs dark:border-white/10 sm:mt-16 sm:grid-cols-3 sm:items-center sm:gap-4">
          <p className="m-0 font-medium uppercase tracking-wider text-neutral-500 dark:text-white/50 sm:justify-self-start">
            {year} Culturin — all rights reserved
          </p>
          <div className="sm:justify-self-center">
            <FooterThemeToggle />
          </div>
          <Link
            href="/about"
            className="justify-self-start text-neutral-500 no-underline transition hover:text-neutral-800 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:justify-self-end dark:text-white/50 dark:hover:text-white/90"
          >
            Site credit
          </Link>
        </div>
      </div>
    </footer>
  );
}
