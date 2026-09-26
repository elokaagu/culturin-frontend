"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { Check } from "lucide-react";

import { useSpamTrap } from "@/app/components/useSpamTrap";
import { ACCENT_ON_DARK, EDITORIAL_ACCENT, SURFACE_DARK } from "@/lib/theme/culturinTokens";

const DISPLAY = "var(--font-display), 'Times New Roman', serif";
const ACCENT = EDITORIAL_ACCENT;

export type PartnerImage = { src: string; alt: string; blur: string };

const CHOICES = [
  { value: "intelligence", label: "Intelligence", line: "An ongoing read on culture, and what it means for your brand." },
  { value: "programming", label: "Programming", line: "A year of rooms, built around your brand." },
  { value: "moments", label: "Moments", line: "Sponsor a room we've already built." },
  { value: "cultural-marketing", label: "Not sure yet", line: "Tell us the goal and we'll point you the right way." },
] as const;

type Field = "name" | "email";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const fieldClass =
  "w-full border-0 border-b bg-transparent px-0 py-2.5 text-base outline-none transition placeholder:opacity-50 focus:border-[color:var(--c-accent)] disabled:opacity-60";

/** One photo in the stack: lazy-loaded, blur placeholder, then blur-to-sharp once decoded. */
function PanelImage({ img, active }: { img: PartnerImage; active: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!active}
    >
      <Image
        src={img.src}
        alt={active ? img.alt : ""}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        placeholder="blur"
        blurDataURL={img.blur}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-[filter,transform] duration-1000 ease-out motion-reduce:transition-none ${
          loaded ? "scale-100 blur-0" : "scale-105 blur-xl"
        }`}
      />
    </div>
  );
}

export function PartnerExperience({
  initialInterest,
  images,
}: {
  initialInterest?: string;
  images: Record<string, PartnerImage>;
}) {
  const uid = useId();
  const [interest, setInterest] = useState<string>(
    CHOICES.some((c) => c.value === initialInterest) ? (initialInterest as string) : "cultural-marketing",
  );
  // Only mount an image once it's been chosen, so we never download all four up front.
  const [visited, setVisited] = useState<Set<string>>(() => new Set([interest]));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const { trap, trapPayload } = useSpamTrap();

  const active = CHOICES.find((c) => c.value === interest) ?? CHOICES[3];

  function choose(value: string) {
    setInterest(value);
    setVisited((prev) => (prev.has(value) ? prev : new Set(prev).add(value)));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!emailOk(email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const res = await fetch("/api/partner-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), company: company.trim(), interest, message: message.trim(), ...trapPayload() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again, or email unik@culturin.com.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Photo panel: changes with the chosen service */}
      <section
        aria-label="Create an experience"
        className="relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl sm:min-h-[26rem]"
        style={{ background: SURFACE_DARK }}
      >
        {CHOICES.filter((c) => visited.has(c.value) && images[c.value]).map((c) => (
          <PanelImage key={c.value} img={images[c.value]} active={c.value === interest} />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.88) 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 p-7 sm:p-10">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Create an experience</p>
          <h1 className="m-0 mt-4 max-w-lg text-4xl font-medium leading-[1.05] text-white sm:text-5xl" style={{ fontFamily: DISPLAY }}>
            Let&apos;s build the room together.
          </h1>
          <p className="m-0 mt-4 max-w-sm text-sm leading-relaxed text-white/80" aria-live="polite">
            {active.line}
          </p>
        </div>
      </section>

      {/* Form panel */}
      <section
        className="flex flex-col justify-center rounded-3xl border px-6 py-9 sm:px-10 lg:px-14"
        style={{ borderColor: "var(--c-rule)" }}
      >
        {done ? (
          <div role="status" className="flex flex-col items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }} aria-hidden>
              <Check className="h-5 w-5" />
            </span>
            <h2 className="m-0 text-3xl font-medium leading-tight" style={{ fontFamily: DISPLAY, color: "var(--c-ink)" }}>
              Thank you. We&apos;ll be in touch.
            </h2>
            <p className="m-0 max-w-sm text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              We read every note ourselves and will reply to set up a call.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6" style={{ color: "var(--c-ink)" }}>
            {trap}
            <fieldset className="m-0 border-0 p-0" disabled={pending}>
              <legend className="mb-3 p-0 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>
                I&apos;m interested in
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="I'm interested in">
                {CHOICES.map((c) => {
                  const selected = interest === c.value;
                  return (
                    <label
                      key={c.value}
                      className="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-[color:var(--c-accent)]"
                      style={{
                        borderColor: selected ? ACCENT : "var(--c-rule)",
                        background: selected ? ACCENT : "transparent",
                        color: selected ? SURFACE_DARK : "var(--c-ink)",
                      }}
                    >
                      <input
                        type="radio"
                        name={`${uid}-interest`}
                        value={c.value}
                        checked={selected}
                        onChange={() => choose(c.value)}
                        className="sr-only"
                      />
                      {c.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor={`${uid}-name`} className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--c-muted)" }}>
                  Name
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={pending}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                  className={fieldClass}
                  style={{ borderColor: errors.name ? "#dc4444" : "var(--c-rule)", color: "var(--c-ink)" }}
                />
                {errors.name ? (
                  <p id={`${uid}-name-err`} className="m-0 text-xs font-medium" style={{ color: "#dc4444" }}>
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${uid}-email`} className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--c-muted)" }}>
                  Work email
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={pending}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                  className={fieldClass}
                  style={{ borderColor: errors.email ? "#dc4444" : "var(--c-rule)", color: "var(--c-ink)" }}
                />
                {errors.email ? (
                  <p id={`${uid}-email-err`} className="m-0 text-xs font-medium" style={{ color: "#dc4444" }}>
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${uid}-company`} className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--c-muted)" }}>
                Company <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
              </label>
              <input
                id={`${uid}-company`}
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={pending}
                className={fieldClass}
                style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${uid}-message`} className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--c-muted)" }}>
                What do you have in mind? <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
              </label>
              <textarea
                id={`${uid}-message`}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={pending}
                className={`${fieldClass} resize-y`}
                style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
              />
            </div>

            <div aria-live="polite">
              {formError ? (
                <p className="m-0 text-sm font-medium" style={{ color: "#dc4444" }}>
                  {formError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85 disabled:opacity-60"
                style={{ background: ACCENT, color: SURFACE_DARK }}
              >
                {pending ? "Sending…" : "Request a call"}
              </button>
              <a href="mailto:unik@culturin.com" className="text-sm no-underline hover:underline" style={{ color: "var(--c-muted)" }}>
                or email unik@culturin.com
              </a>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
