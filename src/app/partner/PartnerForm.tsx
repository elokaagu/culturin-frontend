"use client";

import { useId, useState, type FormEvent } from "react";
import { Check } from "lucide-react";

import { EDITORIAL_ACCENT, EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, SURFACE_DARK } from "@/lib/theme/culturinTokens";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;
const DISPLAY = "var(--font-display), 'Times New Roman', serif";

const CHOICES = [
  { value: "intelligence", label: "Intelligence", hint: "An ongoing read on culture and what it means for your brand" },
  { value: "programming", label: "Programming", hint: "A year of rooms, built around your brand" },
  { value: "moments", label: "Moments", hint: "Sponsor a room we've already built" },
  { value: "cultural-marketing", label: "Not sure yet", hint: "Tell us the goal and we'll point you in the right direction" },
] as const;

type Field = "name" | "email";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function PartnerForm({ initialInterest }: { initialInterest?: string }) {
  const uid = useId();
  const [interest, setInterest] = useState<string>(
    CHOICES.some((c) => c.value === initialInterest) ? (initialInterest as string) : "cultural-marketing",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

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
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          interest,
          message: message.trim(),
        }),
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

  if (done) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: ACCENT, color: SURFACE_DARK }}
          aria-hidden
        >
          <Check className="h-5 w-5" />
        </span>
        <h2 className="m-0 text-3xl font-medium leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
          Thank you. We&apos;ll be in touch.
        </h2>
        <p className="m-0 max-w-sm text-sm leading-relaxed" style={{ color: MUTED }}>
          We read every note ourselves and will reply to set up a call.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition placeholder:opacity-60 focus-visible:border-[#e08a5b] disabled:opacity-60";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <fieldset className="m-0 border-0 p-0" disabled={pending}>
        <legend className="mb-3 p-0 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: MUTED }}>
          What are you looking for?
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="What are you looking for?">
          {CHOICES.map((c) => {
            const selected = interest === c.value;
            return (
              <label
                key={c.value}
                className="relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition"
                style={{
                  borderColor: selected ? ACCENT : RULE,
                  background: selected ? "color-mix(in srgb, var(--c-accent) 10%, transparent)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name={`${uid}-interest`}
                  value={c.value}
                  checked={selected}
                  onChange={() => setInterest(c.value)}
                  className="sr-only"
                />
                <span className="text-base font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
                  {c.label}
                </span>
                <span className="text-xs leading-relaxed" style={{ color: MUTED }}>
                  {c.hint}
                </span>
                {selected ? (
                  <Check className="absolute right-3 top-3 h-4 w-4" style={{ color: ACCENT }} aria-hidden />
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-name`} className="text-sm font-medium" style={{ color: MUTED }}>
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
            className={inputClass}
            style={{ color: INK, borderColor: errors.name ? "#dc4444" : RULE }}
          />
          {errors.name ? (
            <p id={`${uid}-name-err`} className="m-0 text-xs font-medium" style={{ color: "#dc4444" }}>
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-email`} className="text-sm font-medium" style={{ color: MUTED }}>
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
            className={inputClass}
            style={{ color: INK, borderColor: errors.email ? "#dc4444" : RULE }}
          />
          {errors.email ? (
            <p id={`${uid}-email-err`} className="m-0 text-xs font-medium" style={{ color: "#dc4444" }}>
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-company`} className="text-sm font-medium" style={{ color: MUTED }}>
          Company <span className="font-normal opacity-70">(optional)</span>
        </label>
        <input
          id={`${uid}-company`}
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={pending}
          className={inputClass}
          style={{ color: INK, borderColor: RULE }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-message`} className="text-sm font-medium" style={{ color: MUTED }}>
          Tell us a bit more <span className="font-normal opacity-70">(optional)</span>
        </label>
        <textarea
          id={`${uid}-message`}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
          className={inputClass}
          style={{ color: INK, borderColor: RULE, resize: "vertical", background: BG }}
        />
      </div>

      <div aria-live="polite">
        {formError ? (
          <p className="m-0 text-sm font-medium" style={{ color: "#dc4444" }}>
            {formError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85 disabled:opacity-60"
        style={{ background: ACCENT, color: SURFACE_DARK }}
      >
        {pending ? "Sending…" : "Request a call"}
      </button>
    </form>
  );
}
