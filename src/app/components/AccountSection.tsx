"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAppAuth } from "./SupabaseAuthProvider";

import { AccountProfileForm } from "./account/AccountProfileForm";
import { SpotifyConnectionCard } from "./account/SpotifyConnectionCard";
import type { AccountProfileUser } from "./account/types";

/**
 * Account tab body for `/settings` — session identity + Spotify.
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
              ? "Signed-in account details and connected services."
              : "Sign in to manage your account."}
        </p>
      </header>

      {status === "loading" ? null : profileUser ? (
        <>
          <AccountProfileForm user={profileUser} />
          <SpotifyConnectionCard />
        </>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-white/60">
          <Link href="/login?next=/settings" className="underline underline-offset-4">
            Sign in
          </Link>{" "}
          to access account settings.
        </p>
      )}
    </section>
  );
}
