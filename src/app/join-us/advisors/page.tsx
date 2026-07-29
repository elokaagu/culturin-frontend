"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import IslandNav from "../../components/IslandNav";
import HomeFooter from "../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const cardStyle = { borderColor: "var(--c-rule)" };
const inputClass = "h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-2";
const inputStyle = { borderColor: "var(--c-rule)", background: "var(--c-bg)", color: "var(--c-ink)" };

export default function AdvisorsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const scrollToApply = () =>
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function handleApply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");

    const trimmed = email.trim();
    if (!trimmed) {
      setFormState("error");
      setFormMessage("Enter your email.");
      return;
    }

    setFormState("loading");
    try {
      const res = await fetch("/api/advisor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          billingCycle: "monthly",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFormState("error");
        setFormMessage(data.error ?? "Something went wrong.");
        return;
      }
      setFormState("success");
      setFormMessage("Thanks - we received your application request.");
    } catch {
      setFormState("error");
      setFormMessage("Network error. Please try again.");
    }
  }

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-20" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto w-full max-w-[52rem] px-4 pt-8 sm:px-6 sm:pt-10">
          <header className="max-w-[40rem]">
            <h1 className="text-4xl font-medium tracking-tight sm:text-[2.7rem]" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Become a Culturin advisor
            </h1>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Culturin is designed for the innovative and entrepreneurial travel advisor of tomorrow. Our core mission
              is to empower those with a deep-rooted passion for exploration and travel to generate a flexible income by
              curating and booking unforgettable journeys.
            </p>
            <p className="mt-3 text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Whether you are just starting out or looking to elevate your existing travel advisory business, Culturin
              offers the tools, resources, and community support needed to thrive in the dynamic world of travel
              planning.
            </p>
            <button
              type="button"
              onClick={scrollToApply}
              className="mt-5 inline-flex h-9 min-w-[4.25rem] items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--c-accent)" }}
            >
              Apply
            </button>
          </header>

          <section className="mt-8 space-y-4">
            <article className="rounded-2xl border p-5 sm:p-6" style={cardStyle}>
              <h2 className="text-[1.75rem] font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
                Community
              </h2>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
                Our diverse, inclusive and engaged global community is designed to make you feel welcome.
              </p>
            </article>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Live networking events across the country",
                "Community app for collaboration and support",
                "Weekly online community and partner events",
                "Mentorship, FAM trips and site visits",
              ].map((item) => (
                <article key={item} className="rounded-2xl border p-5" style={cardStyle}>
                  <p className="text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="apply-form" className="mt-10 rounded-2xl border p-5 sm:p-6" style={cardStyle}>
            <h2 className="text-2xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Apply to join Culturin today
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Book just $360/month in travel and you will cover your subscription fees. Everything after that is your
              profit to keep.
            </p>

            <form onSubmit={handleApply} className="mt-5 flex w-full max-w-xl flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="advisor-first-name" className="sr-only">
                    First name
                  </label>
                  <input
                    id="advisor-first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(ev) => setFirstName(ev.target.value)}
                    disabled={formState === "loading" || formState === "success"}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="advisor-last-name" className="sr-only">
                    Last name
                  </label>
                  <input
                    id="advisor-last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(ev) => setLastName(ev.target.value)}
                    disabled={formState === "loading" || formState === "success"}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <label htmlFor="advisor-company" className="sr-only">
                Company
              </label>
              <input
                id="advisor-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Company (optional)"
                value={company}
                onChange={(ev) => setCompany(ev.target.value)}
                disabled={formState === "loading" || formState === "success"}
                className={inputClass}
                style={inputStyle}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <label htmlFor="advisor-email" className="sr-only">
                  Email
                </label>
                <input
                  id="advisor-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={formState === "loading" || formState === "success"}
                  aria-invalid={formState === "error"}
                  aria-describedby={formMessage ? "apply-form-feedback" : undefined}
                  className={`flex-1 ${inputClass}`}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={formState === "loading" || formState === "success"}
                  className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
                  style={{ background: "var(--c-accent)" }}
                >
                  {formState === "loading" ? "Sending..." : "Apply"}
                </button>
              </div>
            </form>

            {formMessage ? (
              <p
                id="apply-form-feedback"
                className={["mt-3 text-sm", formState === "success" ? "text-emerald-500" : "text-rose-500"].join(" ")}
                role={formState === "error" ? "alert" : "status"}
              >
                {formMessage}
              </p>
            ) : null}
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
