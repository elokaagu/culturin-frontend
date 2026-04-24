"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useState, type FormEvent } from "react";

import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

/** European street / travel mood (Unsplash). */
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1523906834658-6e68ef0b40b0?auto=format&fit=crop&w=2000&q=80";

const QUOTE = {
  label: "Travel words",
  text: "We travel, some of us forever, to seek other states, other lives, other souls.",
  attribution: "Anaïs Nin",
} as const;

function ArrowIcon({ className }: { className?: string }) {
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

type HomeQuoteNewsletterBandProps = {
  className?: string;
};

/**
 * Full-width red duotone band: quote + inline newsletter. Culturin take on a Trippin-style CTA.
 */
export default function HomeQuoteNewsletterBand({ className = "" }: HomeQuoteNewsletterBandProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please agree to receive updates before joining the list.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}
      aria-label="Inspiration and newsletter"
    >
      <div className="relative min-h-[20rem] overflow-hidden rounded-2xl sm:min-h-[22rem] sm:rounded-3xl">
        <Image
          src={BANNER_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1200px"
          loading="lazy"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-700/85 via-red-800/80 to-red-950/90 mix-blend-multiply"
          aria-hidden
        />
        <div className="absolute inset-0 bg-red-900/50" aria-hidden />
        <div className="relative z-10 flex min-h-[20rem] flex-col justify-between gap-10 p-8 sm:min-h-[22rem] sm:gap-12 sm:p-10 md:p-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80 sm:text-sm">
              {QUOTE.label}
            </p>
            <blockquote className="mt-4 m-0 max-w-3xl border-none p-0 not-italic sm:mt-5">
              <p className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:max-w-[70%] md:text-[1.75rem] md:leading-tight lg:text-4xl">
                &ldquo;{QUOTE.text}&rdquo;
              </p>
              <footer className="mt-3 text-sm font-medium text-white/90 sm:mt-4 sm:text-base">
                — <cite className="font-semibold not-italic text-white/95">{QUOTE.attribution}</cite>
              </footer>
            </blockquote>
          </div>

          <div className="w-full max-w-md">
            {submitted ? (
              <p className="text-sm font-medium text-white" role="status">
                You are in. We will be in touch with stories and drops from Culturin.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <p className="text-sm text-white/95 sm:text-base">Stay up to date with Culturin</p>
                <div className="flex w-full min-w-0 items-stretch border-b-2 border-white/80 bg-transparent pb-0.5 focus-within:border-white">
                  <label htmlFor="culturin-home-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="culturin-home-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-white placeholder:text-white/55 focus:outline-none focus:ring-0 sm:text-base"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Submit email"
                  >
                    <ArrowIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex gap-2.5">
                  <input
                    id="culturin-home-marketing"
                    name="marketing"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/50 bg-white/20 text-red-800 focus:ring-2 focus:ring-white/80"
                  />
                  <label
                    htmlFor="culturin-home-marketing"
                    className="cursor-pointer text-xs leading-relaxed text-white/90 sm:text-sm"
                  >
                    I agree to receive marketing emails and accept the{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-white underline underline-offset-2 transition hover:text-white/90"
                    >
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>
                {error ? (
                  <p className="text-xs text-amber-200 sm:text-sm" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
