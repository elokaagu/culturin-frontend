"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { SURFACE_DARK, ACCENT_ON_DARK } from "@/lib/theme/culturinTokens";

const INK = SURFACE_DARK;
const CREAM = "#e8e3da";
const RULE = "#cec7be";
const ACCENT = ACCENT_ON_DARK;

function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        body: JSON.stringify({ email: email.trim(), marketingConsent: true }),
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
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="flex w-full max-w-sm items-stretch overflow-hidden rounded-full border" style={{ borderColor: RULE, background: CREAM }}>
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
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:opacity-50 disabled:opacity-60"
          style={{ color: INK }}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-85 disabled:opacity-60"
          style={{ background: ACCENT, color: INK }}
        >
          {pending ? "…" : "Subscribe →"}
        </button>
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
  { label: "Sign in", href: "/sign-in" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
];

export default function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: RULE, background: INK }}>
      <div className="relative z-10 mx-auto max-w-6xl px-8 pt-16 sm:px-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Image
              src="/culturin_logo.svg"
              alt="Culturin"
              width={84}
              height={18}
              className="h-4 w-auto max-w-[5.75rem]"
              unoptimized
            />
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

        <div className="mt-14 flex items-center justify-between border-t py-6 text-xs" style={{ borderColor: "rgba(232,227,218,0.15)" }}>
          <span className="text-white/45">© {year} Culturin — All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/45 no-underline transition-opacity hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/privacy" className="text-white/45 no-underline transition-opacity hover:text-white/80">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Giant wordmark, clipped at the bottom edge — OPUS-style footer signature */}
      <p
        aria-hidden
        className="pointer-events-none relative z-0 m-0 select-none whitespace-nowrap text-center font-medium leading-none text-white/[0.06]"
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "min(22vw, 260px)",
          marginTop: "-2vw",
        }}
      >
        CULTURIN
      </p>
    </footer>
  );
}
