"use client";

import { useCallback, useEffect, useState } from "react";

import {
  settingsCardClass,
  settingsFieldClass,
  settingsH3,
  settingsLabelClass,
  settingsMuted,
} from "./settingsFormClasses";
import { useAppAuth } from "./SupabaseAuthProvider";

const STORAGE_KEY = "culturin.settings.payments.v1";

type PaymentDraft = {
  billingEmail: string;
  nameOnAccount: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  country: string;
  cardLabel: string;
};

const emptyDraft: PaymentDraft = {
  billingEmail: "",
  nameOnAccount: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postCode: "",
  country: "United Kingdom",
  cardLabel: "",
};

function loadDraft(): PaymentDraft {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft;
    const parsed = JSON.parse(raw) as Partial<PaymentDraft>;
    return { ...emptyDraft, ...parsed };
  } catch {
    return emptyDraft;
  }
}

export default function PaymentSection() {
  const { data: session, status } = useAppAuth();
  const [draft, setDraft] = useState<PaymentDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [lastSaved, setLastSaved] = useState<"saved" | "reset" | null>(null);

  useEffect(() => {
    const d = loadDraft();
    setDraft(d);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!session?.user?.email) return;
    setDraft((d) => (d.billingEmail.trim() ? d : { ...d, billingEmail: session.user?.email ?? "" }));
  }, [session?.user?.email]);

  const update = useCallback((patch: Partial<PaymentDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setLastSaved("saved");
      window.setTimeout(() => setLastSaved(null), 3200);
    } catch {
      /* */
    }
  }, [draft]);

  const handleReset = useCallback(() => {
    setDraft(loadDraft());
    setLastSaved("reset");
    window.setTimeout(() => setLastSaved(null), 2200);
  }, []);

  return (
    <section
      aria-label="Payment and billing"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-neutral-900 dark:text-white"
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <p className={settingsMuted}>
          Billing and invoices will connect to a payment provider in a future release. You can still store a
          billing address draft in this browser for when checkout goes live.
        </p>
      </header>

      {status === "loading" ? <p className={settingsMuted}>Loading session…</p> : null}

      <div className={settingsCardClass}>
        <h3 className={settingsH3}>Payment method</h3>
        <p className="text-sm text-neutral-600 dark:text-white/65">
          No card is stored for Culturin yet. We’ll use a secure provider (for example Stripe) to collect
          details when you book a paid experience.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <p className="m-0 flex-1 text-sm text-neutral-500 dark:text-white/50">
            You’ll be able to add a debit or credit card here in a future update.
          </p>
          <button
            type="button"
            disabled
            title="Payment provider not connected"
            className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-500 dark:border-white/20 dark:bg-white/5 dark:text-white/50"
          >
            Add a card
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pay-card-label" className={settingsLabelClass}>
            Card label (for your reference)
          </label>
          <input
            id="pay-card-label"
            type="text"
            value={draft.cardLabel}
            onChange={(e) => update({ cardLabel: e.target.value })}
            autoComplete="off"
            disabled={!session}
            placeholder="e.g. Personal Visa"
            className={`${settingsFieldClass} max-w-md disabled:opacity-50`}
          />
        </div>
      </div>

      <div className={settingsCardClass}>
        <h3 className={settingsH3}>Billing address</h3>
        <p className="text-sm text-neutral-600 dark:text-white/65">Used for receipts and, later, for applicable taxes on bookings.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="pay-billing-email" className={settingsLabelClass}>
              Billing email
            </label>
            <input
              id="pay-billing-email"
              type="email"
              value={draft.billingEmail}
              onChange={(e) => update({ billingEmail: e.target.value })}
              autoComplete="email"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="pay-name" className={settingsLabelClass}>
              Name on account
            </label>
            <input
              id="pay-name"
              type="text"
              value={draft.nameOnAccount}
              onChange={(e) => update({ nameOnAccount: e.target.value })}
              autoComplete="name"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="pay-line1" className={settingsLabelClass}>
              Address line 1
            </label>
            <input
              id="pay-line1"
              type="text"
              value={draft.addressLine1}
              onChange={(e) => update({ addressLine1: e.target.value })}
              autoComplete="address-line1"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="pay-line2" className={settingsLabelClass}>
              Address line 2 (optional)
            </label>
            <input
              id="pay-line2"
              type="text"
              value={draft.addressLine2}
              onChange={(e) => update({ addressLine2: e.target.value })}
              autoComplete="address-line2"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pay-city" className={settingsLabelClass}>
              City
            </label>
            <input
              id="pay-city"
              type="text"
              value={draft.city}
              onChange={(e) => update({ city: e.target.value })}
              autoComplete="address-level2"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pay-postcode" className={settingsLabelClass}>
              Postcode
            </label>
            <input
              id="pay-postcode"
              type="text"
              value={draft.postCode}
              onChange={(e) => update({ postCode: e.target.value })}
              autoComplete="postal-code"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="pay-country" className={settingsLabelClass}>
              Country
            </label>
            <input
              id="pay-country"
              type="text"
              value={draft.country}
              onChange={(e) => update({ country: e.target.value })}
              autoComplete="country-name"
              className={settingsFieldClass}
              disabled={!session}
            />
          </div>
        </div>
        {!session ? (
          <p className="text-sm text-amber-800/90 dark:text-amber-200/80">Sign in to edit these fields.</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-amber-200/30 bg-amber-50/80 p-5 dark:border-amber-500/25 dark:bg-amber-500/10">
        <h3 className="m-0 text-base font-semibold text-neutral-900 dark:text-amber-100">Culturin membership</h3>
        <p className="mt-2 text-sm text-neutral-700 dark:text-amber-50/90">
          You are on the <span className="font-semibold">Free</span> plan. A paid tier with unlimited curated
          bookings, priority support, and members-only content will be offered when billing is live.
        </p>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="mt-4 w-full max-w-xs rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white opacity-50 dark:bg-amber-500"
        >
          Join waitlist
        </button>
      </div>

      <div className={settingsCardClass}>
        <h3 className={settingsH3}>Invoices and receipts</h3>
        <p className="m-0 text-sm text-neutral-600 dark:text-white/65">
          When you make a purchase through Culturin, a PDF receipt and an invoice (where applicable) will
          list here. Nothing to show yet.
        </p>
        <ul className="m-0 list-none space-y-2 p-0">
          <li className="rounded-lg border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500 dark:border-white/15 dark:text-white/50">
            No payments yet.
          </li>
        </ul>
      </div>

      {session ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hydrated}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300"
            >
              Save billing draft
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-white/20 dark:text-white/90 dark:hover:border-white/40 dark:hover:bg-white/5"
            >
              Revert to last saved
            </button>
          </div>
          {lastSaved === "saved" ? (
            <p className="text-sm text-amber-700 dark:text-amber-300" role="status">
              Billing draft stored in this browser. It does not create a real payment or subscription.
            </p>
          ) : null}
          {lastSaved === "reset" ? (
            <p className="text-sm text-neutral-500 dark:text-white/50" role="status">
              Reverted to the last draft saved on this device.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
