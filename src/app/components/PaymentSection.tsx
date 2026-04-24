"use client";

import { useState } from "react";
import { useAppAuth } from "./SupabaseAuthProvider";

export default function PaymentSection() {
  const { data: session } = useAppAuth();
  const [email, setEmail] = useState("");
  const [cardLabel, setCardLabel] = useState("");

  return (
    <section
      aria-label="Payment and billing"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-white"
    >
      <header>
        <h2 className="text-2xl font-semibold">Payments</h2>
        <p className="mt-2 text-sm text-white/70">
          Billing details below are local drafts only until checkout is integrated.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="pay-email" className="text-sm font-medium text-white/80">
            Billing email
          </label>
          <input
            id="pay-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={!session}
            className="max-w-md rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pay-card" className="text-sm font-medium text-white/80">
            Card label
          </label>
          <input
            id="pay-card"
            type="text"
            value={cardLabel}
            onChange={(e) => setCardLabel(e.target.value)}
            autoComplete="off"
            disabled={!session}
            placeholder="e.g. Personal Visa"
            className="max-w-md rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="text-base font-semibold">Culturin Premium</h3>
        <p className="mt-2 text-sm text-white/75">
          Subscribe for unlimited access to curated events and experiences when billing
          goes live.
        </p>
      </div>
    </section>
  );
}
