"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import Header from "../../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdvisorsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const scrollToSection = () => {
    document.getElementById("target-section")?.scrollIntoView({ behavior: "smooth" });
  };

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
        body: JSON.stringify({ email: trimmed, billingCycle }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFormState("error");
        setFormMessage(data.error ?? "Something went wrong.");
        return;
      }
      setFormState("success");
      setFormMessage("Thanks — we received your application request.");
    } catch {
      setFormState("error");
      setFormMessage("Network error. Please try again.");
    }
  }

  return (
    <div>
      <Header />
      <div
        className="flex min-h-full flex-1 flex-col items-center bg-background px-4 py-5 pt-[var(--header-offset)] text-foreground"
        style={{ lineHeight: 2 }}
      >
        <div className="mx-auto w-full max-w-2xl items-start pl-0 pr-4 pt-5 sm:pl-6 sm:pr-5 max-[428px]:ml-0 max-[428px]:w-full">
          <h1 className="w-full text-2xl sm:pl-5">Become a Culturin advisor</h1>
        </div>
        <div className="mx-auto w-full max-w-2xl items-start pl-0 pr-4 sm:pl-6 sm:pr-5 max-[428px]:ml-14 max-[428px]:w-full max-[428px]:pl-2.5">
          <p className="text-lg text-foreground">
            Culturin is designed for the innovative and entrepreneurial travel advisor of tomorrow. Our core mission is
            to empower those with a deep-rooted passion for exploration and travel to generate a flexible income by
            curating and booking unforgettable journeys. At Culturin, we believe that travel is more than just visiting
            new destinations; it&apos;s about creating experiences that last a lifetime.
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl items-start pl-0 pr-4 sm:pl-6 sm:pr-5 max-[428px]:w-full max-[428px]:pl-5">
          <p className="pt-1.5 pb-5 text-lg text-foreground max-[428px]:pb-9">
            Whether you are just starting out or looking to elevate your existing travel advisory business, Culturin
            offers the tools, resources, and community support needed to thrive in the dynamic world of travel planning.
            Join us and become part of a vibrant community of travel enthusiasts who are transforming their love for
            exploration into rewarding careers. Let Culturin be your guide to a successful and fulfilling future in the
            travel industry.
          </p>
          <Button
            type="button"
            onClick={scrollToSection}
            className="mb-4 w-[100px] bg-foreground text-background hover:bg-foreground/90"
          >
            Apply
          </Button>
          <div className="mb-4 mt-5 w-[95%] flex-col items-start rounded-lg bg-zinc-900 px-4 py-5 sm:pl-6 sm:pr-5 max-[428px]:w-full">
            <h2 className="mb-2 text-2xl text-foreground">Community</h2>
            <p className="pt-1.5 pb-5 text-lg text-foreground max-[428px]:pb-9">
              Our diverse, inclusive &amp; engaged global community is designed to make you feel welcome.
            </p>
          </div>
          <div className="mt-10 grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
            {[
              "Live networking events across the country",
              "Community app for collaboration and support",
              "Weekly online community &amp; partner events",
              "Mentorship, FAM trips &amp; site visits",
            ].map((t) => (
              <div
                key={t}
                className="flex min-h-[4rem] items-center justify-center rounded-lg border border-zinc-900 bg-background p-5 text-center text-foreground transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="m-0 text-base">{t}</p>
              </div>
            ))}
          </div>
          <section className="flex w-full flex-col items-center justify-around gap-4 py-14 text-center text-foreground">
            <h2 className="text-center text-2xl leading-tight text-foreground sm:max-w-2xl">
              Apply to join Culturin &amp; get everything you need to succeed
            </h2>
            <p className="mb-8 max-w-xl text-center text-lg text-white/90">
              Our advisors typically make back their membership fee within their first month.
            </p>
            <Card className="w-full max-w-sm border-0 bg-zinc-100 text-zinc-900 shadow-lg">
              <CardHeader>
                <div className="mb-6 flex w-full justify-around">
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "font-bold text-zinc-900",
                      billingCycle === "annual" && "bg-sky-100",
                    )}
                    onClick={() => setBillingCycle("annual")}
                  >
                    ANNUAL
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn("font-bold text-zinc-900", billingCycle === "monthly" && "bg-sky-100")}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    MONTHLY
                  </Button>
                </div>
                {billingCycle === "annual" ? (
                  <>
                    <CardTitle className="text-5xl font-bold text-zinc-900">$299</CardTitle>
                    <p className="text-base text-zinc-900">per year</p>
                    <p className="text-sm text-zinc-600">billed every 12 months</p>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-5xl font-bold text-zinc-900">$49</CardTitle>
                    <p className="text-base text-zinc-900">per month</p>
                    <p className="text-sm text-zinc-600">billed every month</p>
                  </>
                )}
                <p className="min-h-5 text-sm text-green-600">
                  {billingCycle === "annual" ? "BEST VALUE: Save 50%" : ""}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2">
                <ul className="mb-6 w-full list-none space-y-2.5 p-0 text-left text-zinc-900">
                  {[
                    "Start at 70% commission split",
                    "Live training and mentorship",
                    "Access to 4,500+ preferred partners",
                    "Custom marketing tools",
                    "Global community of travel pros",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-base">
                      <span className="text-green-600" aria-hidden>
                        ✔
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={scrollToSection}
                  className="w-full max-w-xs font-bold"
                >
                  APPLY
                </Button>
              </CardContent>
            </Card>
          </section>
          <div id="target-section">
            <section className="mt-2 flex flex-col items-center rounded-lg bg-background py-12 text-center text-foreground">
              <h2 className="mb-5 text-center text-2xl leading-tight">
                Apply to join Culturin today &amp; get everything you need to succeed
              </h2>
              <p className="mb-8 text-base text-foreground">
                Book just $360/month in travel and you will cover your subscription fees. Everything after that is your
                profit to keep.
              </p>
              <form onSubmit={handleApply} className="flex w-full max-w-sm flex-col items-center gap-3">
                <Input
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
                  className="max-w-xs border-0 border-b-2 border-zinc-900 bg-white text-left text-zinc-900"
                />
                {formMessage ? (
                  <p
                    id="apply-form-feedback"
                    className={cn(
                      "max-w-sm text-center text-sm",
                      formState === "success" ? "text-emerald-500" : "text-red-500",
                    )}
                    role={formState === "error" ? "alert" : "status"}
                  >
                    {formMessage}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={formState === "loading" || formState === "success"}
                  className="w-full max-w-[300px] border-2 border-zinc-900 bg-white font-bold text-zinc-900 hover:bg-zinc-100"
                >
                  {formState === "loading" ? "Sending…" : "Apply"}
                </Button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
