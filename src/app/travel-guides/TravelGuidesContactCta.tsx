"use client";

import { useMemo } from "react";

import { GoogleSignInButton } from "../components/AuthButtons";
import { useAppAuth } from "../components/SupabaseAuthProvider";

type TravelGuidesContactCtaProps = {
  supportEmail: string;
};

export default function TravelGuidesContactCta({ supportEmail }: TravelGuidesContactCtaProps) {
  const { data: session, status } = useAppAuth();

  const mailtoHref = useMemo(() => {
    if (status !== "authenticated" || !session?.user?.email) return null;
    const p = new URLSearchParams();
    p.set("subject", "Question about a travel guide");
    p.set(
      "body",
      `Hi Culturin team,\n\nI would like to get in touch about a travel guide in your marketplace.\n\n— ${session.user.name} (${session.user.email})\n`,
    );
    return `mailto:${supportEmail}?${p.toString()}`;
  }, [session, status, supportEmail]);

  if (status === "loading") {
    return (
      <div
        className="rounded-2xl border border-neutral-200 bg-white/80 p-5 dark:border-white/10 dark:bg-neutral-950/60"
        role="status"
        aria-label="Loading sign-in"
      >
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-200/90 dark:bg-white/10" />
        <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
      </div>
    );
  }

  if (status === "authenticated" && mailtoHref) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-50/90 p-5 sm:p-6 dark:border-amber-400/20 dark:bg-amber-950/25">
        <h2 className="m-0 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Talk to our curators</h2>
        <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70">
          You are signed in. Send a message about a specific guide, a collaboration, or a destination you would like
          covered.
        </p>
        <a
          href={mailtoHref}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white no-underline transition hover:bg-neutral-800 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
        >
          Contact the team
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/90 p-5 sm:p-6 dark:border-white/10 dark:bg-neutral-950/60">
      <h2 className="m-0 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Talk to our curators</h2>
      <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70">
        Sign in with your account to message the team about a guide, partnership, or a trip you are planning.
      </p>
      <div className="mt-4">
        <GoogleSignInButton appearance="default" />
      </div>
    </div>
  );
}
