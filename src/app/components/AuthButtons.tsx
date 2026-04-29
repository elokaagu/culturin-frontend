"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

import { getPublicSiteUrl } from "@/lib/siteUrl";

import { AccountProfileDropdown } from "./AccountProfileDropdown";
import { useAppAuth, useSupabaseAuth } from "./SupabaseAuthProvider";

const solidTriggerClass =
  "flex w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-[10px] bg-white px-2.5 py-2.5 font-semibold text-black outline-none transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-black max-[428px]:w-[100px]";

const headerTriggerClass =
  "inline-flex h-10 min-w-[5rem] max-w-[10rem] shrink-0 items-center justify-center gap-1.5 rounded-md border border-neutral-200/90 bg-white px-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10 dark:focus-visible:ring-amber-400/40 dark:focus-visible:ring-offset-neutral-950";

type GoogleSignInButtonProps = {
  className?: string;
  /** `header`: compact top-bar style. `default`: wide solid card (e.g. mobile menu). */
  appearance?: "default" | "header";
  /** When true, trigger Google OAuth directly; otherwise route to `/login`. */
  directOAuth?: boolean;
};

/**
 * Google OAuth (Supabase) + signed-in account menu.
 */
export function GoogleSignInButton({
  className,
  appearance = "default",
  directOAuth = false,
}: GoogleSignInButtonProps) {
  const { data: session, status } = useAppAuth();
  const { supabase, user } = useSupabaseAuth();
  const pathname = usePathname();
  const router = useTransitionRouter();

  const base = appearance === "header" ? headerTriggerClass : solidTriggerClass;
  const triggerCn = [base, className].filter(Boolean).join(" ");

  const signInGoogle = useCallback(() => {
    if (!directOAuth) {
      const next = pathname || "/";
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!supabase) {
      router.push("/login");
      return;
    }
    const siteUrl = getPublicSiteUrl();
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  }, [directOAuth, pathname, router, supabase]);

  if (status === "loading") {
    const loadCn = [
      appearance === "header" ? headerTriggerClass : solidTriggerClass,
      "cursor-wait opacity-60",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <button
        type="button"
        className={loadCn}
        disabled
        aria-busy="true"
        aria-label="Checking sign-in status"
      >
        Sign in
      </button>
    );
  }

  if (session?.user) {
    const avatarUrl =
      user && typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

    return (
      <AccountProfileDropdown
        sessionUser={{
          id: session.user.id,
          email: session.user.email,
          name: session.user.name ?? session.user.email,
        }}
        avatarUrl={avatarUrl}
        appearance={appearance}
        supabase={supabase}
        className={className}
      />
    );
  }

  return (
    <button type="button" className={triggerCn} onClick={signInGoogle}>
      Sign in
    </button>
  );
}
