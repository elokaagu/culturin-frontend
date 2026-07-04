"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  EDITORIAL_ACCENT,
  SURFACE_DARK,
} from "@/lib/theme/culturinTokens";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const INTERESTS = [
  { value: "sponsorship", label: "Event sponsorship" },
  { value: "activation", label: "Brand activation" },
  { value: "attend", label: "Attending an upcoming event" },
  { value: "other", label: "Something else" },
];

function InterestSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = INTERESTS.find((opt) => opt.value === value) ?? INTERESTS[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border bg-transparent px-4 py-3 text-left text-sm outline-none transition disabled:opacity-60"
        style={{ color: INK, borderColor: RULE }}
      >
        <span>{selected.label}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform"
          style={{ color: INK_MUTED, transform: open ? "rotate(180deg)" : undefined }}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border p-1 shadow-lg"
          style={{ background: BG, borderColor: RULE }}
        >
          {INTERESTS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                  style={{
                    color: INK,
                    background: isSelected ? "rgba(181,80,46,0.12)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "rgba(181,80,46,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.label}
                  {isSelected ? <Check className="h-4 w-4 shrink-0" style={{ color: ACCENT }} aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function PartnerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("sponsorship");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setFeedback("Enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setFeedback("Enter a valid email address.");
      return;
    }
    setPending(true);
    setStatus("idle");
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
        setStatus("error");
        setFeedback(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("ok");
      setFeedback("Thanks, we've got it. Our team will follow up directly.");
      setName("");
      setEmail("");
      setCompany("");
      setInterest("sponsorship");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition placeholder:opacity-70 disabled:opacity-60";

  if (status === "ok") {
    return (
      <div
        className="rounded-2xl border px-6 py-10 text-center"
        style={{ borderColor: RULE }}
      >
        <p className="m-0 text-lg font-medium" style={{ color: INK }}>
          {feedback}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium" style={{ color: INK_MUTED }}>
            Name
          </span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK, borderColor: RULE }}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium" style={{ color: INK_MUTED }}>
            Work email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK, borderColor: RULE }}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium" style={{ color: INK_MUTED }}>
            Company
          </span>
          <input
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK, borderColor: RULE }}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium" style={{ color: INK_MUTED }}>
            What are you interested in?
          </span>
          <InterestSelect value={interest} onChange={setInterest} disabled={pending} />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium" style={{ color: INK_MUTED }}>
          Tell us a bit more
        </span>
        <textarea
          rows={4}
          placeholder="Optional"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
          className={fieldClass}
          style={{ color: INK, borderColor: RULE, resize: "vertical" }}
        />
      </label>

      {status === "error" ? (
        <p className="m-0 text-sm font-medium" style={{ color: "#dc4444" }}>
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85 disabled:opacity-60"
        style={{ background: ACCENT, color: SURFACE_DARK }}
      >
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
