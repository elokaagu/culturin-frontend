"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import Header from "../../components/Header";
import SiteFooter from "../../components/SiteFooter";

export default function AdvisorsPage() {
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
        body: JSON.stringify({ email: trimmed, billingCycle: "monthly" }),
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
    <>
      <Header />
      <main className="min-h-screen bg-black pb-20 pt-[var(--header-offset)] text-white">
        <div className="mx-auto w-full max-w-[52rem] px-4 pt-8 sm:px-6 sm:pt-10">
          <header className="max-w-[40rem]">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-[2.7rem]">Become a Culturin advisor</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/82">
              Culturin is designed for the innovative and entrepreneurial travel advisor of tomorrow. Our core mission
              is to empower those with a deep-rooted passion for exploration and travel to generate a flexible income by
              curating and booking unforgettable journeys.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-white/82">
              Whether you are just starting out or looking to elevate your existing travel advisory business, Culturin
              offers the tools, resources, and community support needed to thrive in the dynamic world of travel
              planning.
            </p>
            <button
              type="button"
              onClick={scrollToApply}
              className="mt-5 inline-flex h-9 min-w-[4.25rem] items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Apply
            </button>
          </header>

          <section className="mt-8 space-y-4">
            <article className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 sm:p-6">
              <h2 className="text-[1.75rem] font-semibold tracking-tight">Community</h2>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed text-white/78">
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
                <article key={item} className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
                  <p className="text-base leading-relaxed text-white/84">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="apply-form" className="mt-10 rounded-2xl border border-white/10 bg-neutral-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Apply to join Culturin today</h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/70">
              Book just $360/month in travel and you will cover your subscription fees. Everything after that is your
              profit to keep.
            </p>

            <form onSubmit={handleApply} className="mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-start">
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
                className="h-11 flex-1 rounded-lg border border-white/20 bg-black px-3 text-base text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              />
              <button
                type="submit"
                disabled={formState === "loading" || formState === "success"}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {formState === "loading" ? "Sending..." : "Apply"}
              </button>
            </form>

            {formMessage ? (
              <p
                id="apply-form-feedback"
                className={["mt-3 text-sm", formState === "success" ? "text-emerald-400" : "text-rose-400"].join(" ")}
                role={formState === "error" ? "alert" : "status"}
              >
                {formMessage}
              </p>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
