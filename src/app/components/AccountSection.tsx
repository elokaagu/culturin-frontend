"use client";

import { useMemo } from "react";
import { useAppAuth } from "./SupabaseAuthProvider";

import { AccountProfileForm } from "./account/AccountProfileForm";
import { SpotifyConnectionCard } from "./account/SpotifyConnectionCard";
import type { AccountProfileUser } from "./account/types";

/**
 * Account tab body for `/settings` — profile draft + placeholders only.
 * Shell, hash tabs, and theme live on the settings page / root layout.
 */
export default function AccountSection() {
  const { data: session, status } = useAppAuth();

  const profileUser: AccountProfileUser | null = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email ?? "",
      username: session.user.username ?? "",
    };
  }, [session?.user]);

  return (
    <section
      aria-label="Account settings"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-neutral-900 dark:text-white"
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Account</h2>
        <p className="text-sm text-neutral-600 dark:text-white/70">
          {status === "loading"
            ? "Loading session…"
            : session?.user
              ? "Update your profile details. Changes stay on this device until save is enabled."
              : "Sign in to manage your account."}
        </p>
      </header>

      {status === "loading" ? null : profileUser ? (
        <>
          <SpotifyConnectionCard />
          <AccountProfileForm user={profileUser} />
        </>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-white/60">
          Use the sign-in option in the header to access account settings.
        </p>
      )}
    </section>
  );
}
