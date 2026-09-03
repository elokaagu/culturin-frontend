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
    p.set("subject", "A note for the house");
    p.set(
      "body",
      `Hi Culturin team,\n\nI would like to get in touch about a note, a collaboration, or a room.\n\n— ${session.user.name} (${session.user.email})\n`,
    );
    return `mailto:${supportEmail}?${p.toString()}`;
  }, [session, status, supportEmail]);

  if (status === "loading") {
    return (
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--c-rule)" }}
        role="status"
        aria-label="Loading sign-in"
      >
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-200/90 dark:bg-white/10" />
        <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
      </div>
    );
  }

  const headingStyle = { fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" };

  if (status === "authenticated" && mailtoHref) {
    return (
      <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: "#e08a5b", background: "rgba(224,138,91,0.08)" }}>
        <h2 className="m-0 text-lg font-medium tracking-tight" style={headingStyle}>Talk to our curators</h2>
        <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
          You are signed in. Send a message about a note, a collaboration, or a room you would like to build with us.
        </p>
        <a
          href={mailtoHref}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-semibold text-white no-underline transition hover:opacity-90"
          style={{ background: "var(--c-accent)" }}
        >
          Contact the team
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--c-rule)" }}>
      <h2 className="m-0 text-lg font-medium tracking-tight" style={headingStyle}>Talk to our curators</h2>
      <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
        Sign in with your account to message the house about a note, a partnership, or a room.
      </p>
      <div className="mt-4">
        <GoogleSignInButton appearance="default" />
      </div>
    </div>
  );
}
