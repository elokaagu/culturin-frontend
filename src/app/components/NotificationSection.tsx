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

const STORAGE_KEY = "culturin.settings.notifications.v1";

type NotifPrefs = {
  emailWeeklyDigest: boolean;
  emailSavedPlaces: boolean;
  emailProduct: boolean;
  emailMarketing: boolean;
  browserPush: boolean;
  smsPhone: string;
};

const DEFAULTS: NotifPrefs = {
  emailWeeklyDigest: true,
  emailSavedPlaces: true,
  emailProduct: true,
  emailMarketing: false,
  browserPush: false,
  smsPhone: "",
};

function loadPrefs(): NotifPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<NotifPrefs>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

type ToggleRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

function ToggleRow({ id, title, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200/90 p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-500/50 dark:border-white/10"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-neutral-300 text-amber-600 focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 dark:border-white/30 dark:bg-black/30 dark:text-amber-500"
      />
      <span>
        <span className="block text-sm font-medium text-neutral-900 dark:text-white">{title}</span>
        <span className="mt-0.5 block text-sm text-neutral-600 dark:text-white/65">{description}</span>
      </span>
    </label>
  );
}

export default function NotificationSection() {
  const { data: session, status } = useAppAuth();
  const [draft, setDraft] = useState<NotifPrefs>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [lastSaved, setLastSaved] = useState<"saved" | "reset" | null>(null);

  useEffect(() => {
    setDraft(loadPrefs());
    setHydrated(true);
  }, []);

  const update = useCallback(
    (patch: Partial<NotifPrefs>) => {
      setDraft((d) => ({ ...d, ...patch }));
    },
    [setDraft],
  );

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setLastSaved("saved");
      window.setTimeout(() => setLastSaved(null), 3200);
    } catch {
      /* storage full or private mode */
    }
  }, [draft]);

  const handleReset = useCallback(() => {
    setDraft(loadPrefs);
    setLastSaved("reset");
    window.setTimeout(() => setLastSaved(null), 2200);
  }, []);

  return (
    <section
      aria-label="Notification preferences"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-neutral-900 dark:text-white"
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className={settingsMuted}>
          Choose how you hear from Culturin. Preferences are stored in this browser only until a server sync
          is connected.
        </p>
      </header>

      {status === "loading" ? <p className={settingsMuted}>Loading session…</p> : null}
      {status !== "loading" && !session?.user ? (
        <p className={settingsMuted}>Use the sign-in option in the header to manage email and SMS options.</p>
      ) : null}

      {session?.user ? (
        <>
          <div className={settingsCardClass}>
            <h3 className={settingsH3}>Email</h3>
            <p className="text-sm text-neutral-600 dark:text-white/65">General messages sent to {session.user.email}.</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              <li>
                <ToggleRow
                  id="notif-digest"
                  title="Weekly digest"
                  description="A Sunday summary of new guides, places, and videos matching your interests."
                  checked={draft.emailWeeklyDigest}
                  onChange={(c) => update({ emailWeeklyDigest: c })}
                  disabled={!hydrated}
                />
              </li>
              <li>
                <ToggleRow
                  id="notif-places"
                  title="Updates for saved places"
                  description="When the editorial team publishes new stories for destinations you follow."
                  checked={draft.emailSavedPlaces}
                  onChange={(c) => update({ emailSavedPlaces: c })}
                  disabled={!hydrated}
                />
              </li>
              <li>
                <ToggleRow
                  id="notif-product"
                  title="Product and account"
                  description="Security alerts, sign-in, and product changes that affect your account."
                  checked={draft.emailProduct}
                  onChange={(c) => update({ emailProduct: c })}
                  disabled={!hydrated}
                />
              </li>
              <li>
                <ToggleRow
                  id="notif-marketing"
                  title="Tips, offers, and partners"
                  description="Occasional travel inspiration, partner events, and Culturin features."
                  checked={draft.emailMarketing}
                  onChange={(c) => update({ emailMarketing: c })}
                  disabled={!hydrated}
                />
              </li>
            </ul>
          </div>

          <div className={settingsCardClass}>
            <h3 className={settingsH3}>Text messages</h3>
            <p className="text-sm text-neutral-600 dark:text-white/65">
              We’ll only use your number for booking reminders and urgent account alerts when that service is
              available.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="notif-mobile" className={settingsLabelClass}>
                Mobile number (optional)
              </label>
              <input
                id="notif-mobile"
                type="tel"
                value={draft.smsPhone}
                onChange={(e) => update({ smsPhone: e.target.value })}
                autoComplete="tel"
                placeholder="+44 7…"
                className={`${settingsFieldClass} max-w-md`}
              />
            </div>
          </div>

          <div className={settingsCardClass}>
            <h3 className={settingsH3}>Browser</h3>
            <p className="text-sm text-neutral-600 dark:text-white/65">
              We’re building web push. You can opt in when your browser shows a permission prompt.
            </p>
            <ToggleRow
              id="notif-push"
              title="Web push (beta)"
              description="Short alerts for saved-experience price drops and last-minute story drops. Off by default."
              checked={draft.browserPush}
              onChange={(c) => update({ browserPush: c })}
              disabled
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300"
            >
              Save preferences
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
              Your notification preferences are saved in this browser.
            </p>
          ) : null}
          {lastSaved === "reset" ? (
            <p className="text-sm text-neutral-500 dark:text-white/50" role="status">
              Reverted to the last version saved in this device.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
