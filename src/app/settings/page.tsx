"use client";

import dynamic from "next/dynamic";
import { useAppAuth } from "../components/SupabaseAuthProvider";

import AccountSection from "../components/AccountSection";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { useTheme } from "../styles/ThemeContext";
import { type SettingsSectionId, useSettingsSection } from "./useSettingsSection";

const NotificationSection = dynamic(
  () => import("../components/NotificationSection"),
  { loading: () => <p className="text-sm" style={{ color: "var(--c-muted)" }}>Loading…</p> }
);

const PaymentSection = dynamic(
  () => import("../components/PaymentSection"),
  { loading: () => <p className="text-sm" style={{ color: "var(--c-muted)" }}>Loading…</p> }
);

const NAV: { id: SettingsSectionId; label: string }[] = [
  { id: "#account", label: "Account" },
  { id: "#notifications", label: "Notifications" },
  { id: "#payments", label: "Payments" },
];

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh px-5 pb-16" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <h1 className="text-2xl font-medium sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {sectionTitle(session?.user?.name)}
          </h1>

          <nav aria-label="Settings sections" className="flex flex-wrap gap-6 border-b pb-3" style={{ borderColor: "var(--c-rule)" }}>
            {NAV.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={id}
                  className="text-base font-medium transition-colors underline-offset-8"
                  style={{ color: active ? "var(--c-ink)" : "var(--c-accent)", textDecoration: active ? "underline" : "none" }}
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

          <section aria-label="Appearance" className="mt-4 border-t pt-6" style={{ borderColor: "var(--c-rule)" }}>
            <h2 className="text-lg font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>Appearance</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
              Your choice is saved in this browser (localStorage) and applies across the site.
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: "var(--c-accent)" }}
            >
              {isDark ? "Switch to light theme" : "Switch to dark theme"}
            </button>
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
