"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useState, type FormEvent } from "react";

import { SURFACE_DARK, ACCENT_ON_DARK } from "@/lib/theme/culturinTokens";
import { useTheme } from "../styles/ThemeContext";
import CulturinWordmark from "./CulturinWordmark";

const INK = SURFACE_DARK;
const CREAM = "#e8e3da";
const RULE = "#cec7be";
const ACCENT = ACCENT_ON_DARK;

function FooterSubscribe() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setStatus("error");
      setMessage("Enter your first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setPending(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company.trim(),
          email: email.trim(),
          marketingConsent: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        alreadySubscribed?: boolean;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("ok");
      setMessage(data.alreadySubscribed ? "You're already on the list." : "You're on the list.");
      setFirstName("");
      setLastName("");
      setCompany("");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:opacity-70 disabled:opacity-60";

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="flex w-full max-w-sm flex-col gap-2">
        <div
          className="flex items-stretch overflow-hidden rounded-full border"
          style={{ borderColor: RULE, background: CREAM }}
        >
          <label htmlFor="home-footer-first-name" className="sr-only">
            First name
          </label>
          <input
            id="home-footer-first-name"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK, borderRight: `1px solid ${RULE}` }}
          />
          <label htmlFor="home-footer-last-name" className="sr-only">
            Last name
          </label>
          <input
            id="home-footer-last-name"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK }}
          />
        </div>
        <div
          className="flex items-stretch overflow-hidden rounded-full border"
          style={{ borderColor: RULE, background: CREAM }}
        >
          <label htmlFor="home-footer-company" className="sr-only">
            Company
          </label>
          <input
            id="home-footer-company"
            type="text"
            autoComplete="organization"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK }}
          />
        </div>
        <div
          className="flex items-stretch overflow-hidden rounded-full border"
          style={{ borderColor: RULE, background: CREAM }}
        >
          <label htmlFor="home-footer-email" className="sr-only">
            Email
          </label>
          <input
            id="home-footer-email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK }}
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-85 disabled:opacity-60"
            style={{ background: ACCENT, color: INK }}
          >
            {pending ? "…" : "Subscribe →"}
          </button>
        </div>
      </form>
      {message ? (
        <p
          className="mt-2 text-xs"
          style={{ color: status === "error" ? "#b3543f" : "rgba(232,227,218,0.7)" }}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

const footerLinks = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Partners", href: "#partners" },
  { label: "Our Mission", href: "/our-mission" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/culturinworld/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/culturin" },
];

export default function HomeFooter() {
  const year = new Date().getFullYear();
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: RULE, background: INK }}>
      <div className="relative z-10 mx-auto max-w-6xl px-8 pt-16 sm:px-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CulturinWordmark isDark className="text-xl font-semibold tracking-tight" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              Where inspiration meets exploration.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.15em] text-white/55 no-underline transition-opacity hover:text-white/85"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 no-underline transition-opacity hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <FooterSubscribe />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t py-6 text-xs" style={{ borderColor: "rgba(232,227,218,0.15)" }}>
          <span className="text-white/45">© {year} Culturin. All Rights Reserved.</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center gap-2 text-white/45 transition-opacity hover:text-white/80"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> : <Moon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            <a
              href="mailto:unik@culturin.com"
              className="text-white/45 no-underline transition-opacity hover:text-white/80"
            >
              unik@culturin.com
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark, clipped at the bottom edge: OPUS-style footer signature */}
      <CulturinWordmark
        isDark
        aria-hidden
        className="pointer-events-none relative z-0 m-0 block select-none whitespace-nowrap text-center font-medium leading-none !text-white/[0.06]"
        style={{
          // 260px previously overflowed the footer (got clipped mid-letter) on
          // any viewport narrower than ~1300px, since the cap kicked in at
          // 1182px but "CULTURIN" at 260px measures ~1285px wide. 200px keeps
          // a comfortable margin at every width the vw scaling can reach.
          fontSize: "min(18vw, 200px)",
          marginTop: "-2vw",
        }}
      />
    </footer>
  );
}
