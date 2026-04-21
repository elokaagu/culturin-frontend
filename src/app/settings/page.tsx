"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";

import AccountSection from "../components/AccountSection";
import Header from "../components/Header";
import { useTheme } from "../styles/ThemeContext";
import { type SettingsSectionId, useSettingsSection } from "./useSettingsSection";

const NotificationSection = dynamic(
  () => import("../components/NotificationSection"),
  { loading: () => <p className="text-sm text-white/50">Loading…</p> }
);

const PaymentSection = dynamic(
  () => import("../components/PaymentSection"),
  { loading: () => <p className="text-sm text-white/50">Loading…</p> }
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
  const { data: session } = useSession();
  const activeSection = useSettingsSection();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-5 pb-16 pt-[150px] text-white sm:pt-[120px]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {sectionTitle(session?.user?.name)}
          </h1>

          <nav
            aria-label="Settings sections"
            className="flex flex-wrap gap-6 border-b border-white/15 pb-3"
          >
            {NAV.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <Link
                  key={id}
                  href={id}
                  className={`text-base font-medium transition-colors ${
                    active
                      ? "text-white underline decoration-white/80 underline-offset-8"
                      : "text-sky-400 hover:text-sky-300"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
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
            className="mt-4 border-t border-white/10 pt-6"
          >
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-white/60">
              Toggle is stored in app theme context (not page-local styled theme).
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
