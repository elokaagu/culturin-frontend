"use client";

import dynamic from "next/dynamic";
import { useAppAuth } from "../components/SupabaseAuthProvider";

import AccountSection from "../components/AccountSection";
import Header from "../components/Header";
import { useTheme } from "../styles/ThemeContext";
import { type SettingsSectionId, useSettingsSection } from "./useSettingsSection";

const NotificationSection = dynamic(
  () => import("../components/NotificationSection"),
  { loading: () => <p className="text-sm text-neutral-500 dark:text-white/50">Loading…</p> }
);

const PaymentSection = dynamic(
  () => import("../components/PaymentSection"),
  { loading: () => <p className="text-sm text-neutral-500 dark:text-white/50">Loading…</p> }
);

const NAV: { id: SettingsSectionId; label: string }[] = [
  { id: "#account", label: "Account" },
  { id: "#notifications", label: "Notifications" },
  { id: "#payments", label: "Payments" },
];

function sectionTitle(sessionName: string | null | undefined) {
  const first = sessionName?.trim()?.split(/\s+/)[0];
  return first ? `${first}'s settings` : "Your settings";
}

export default function SettingsPage() {
  const { data: session } = useAppAuth();
  const activeSection = useSettingsSection();
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {sectionTitle(session?.user?.name)}
          </h1>

          <nav
            aria-label="Settings sections"
            className="flex flex-wrap gap-6 border-b border-neutral-200 pb-3 dark:border-white/15"
          >
            {NAV.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={id}
                  className={`text-base font-medium transition-colors ${
                    active
                      ? "text-neutral-900 underline decoration-neutral-400 underline-offset-8 dark:text-white dark:decoration-white/80"
                      : "text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          <div className="min-h-[12rem]">
            {activeSection === "#account" ? <AccountSection /> : null}
            {activeSection === "#notifications" ? <NotificationSection /> : null}
            {activeSection === "#payments" ? <PaymentSection /> : null}
          </div>

          <section
            aria-label="Appearance"
            className="mt-4 border-t border-neutral-200 pt-6 dark:border-white/10"
          >
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/60">
              Your choice is saved in this browser (localStorage) and applies across the site.
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              {isDark ? "Switch to light theme" : "Switch to dark theme"}
            </button>
          </section>
        </div>
      </main>
    </>
  );
}
