"use client";

import { useState, type FormEvent } from "react";

import { EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, EDITORIAL_ACCENT, SURFACE_DARK } from "@/lib/theme/culturinTokens";

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
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            disabled={pending}
            className={fieldClass}
            style={{ color: INK, borderColor: RULE }}
          >
            {INTERESTS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
