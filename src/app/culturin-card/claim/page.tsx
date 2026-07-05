import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../../components/layout/ContentPageShell";
import SiteFooter from "../../components/SiteFooter";
import { getCardInviteByToken } from "@/lib/cardMembership";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ClaimButton, ClaimSwitchAccount } from "./ClaimActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Claim your Culturin Card | Culturin",
  robots: { index: false, follow: false },
};

function InvalidInvite() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <h1 className="m-0 font-display text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        This invite link is invalid or has expired.
      </h1>
      <p className="m-0 mt-3 text-sm text-neutral-600 dark:text-white/70">
        Reach out to whoever invited you at Culturin for a fresh link.
      </p>
    </section>
  );
}

export default async function CulturinCardClaimPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = typeof searchParams.token === "string" ? searchParams.token.trim() : "";

  const invite = token ? await getCardInviteByToken(token) : null;

  const claimPath = `/culturin-card/claim?token=${encodeURIComponent(token)}`;

  let sessionEmail: string | null = null;
  if (invite) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    sessionEmail = user?.email ?? null;
  }

  return (
    <>
      <ContentPageShell
        mainClassName="min-h-dvh bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-[#121212] dark:text-white"
        innerClassName="mx-auto w-full max-w-2xl px-4 sm:px-6"
      >
        <div className="pt-10">
          {!invite ? (
            <InvalidInvite />
          ) : (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300/90">
                Culturin Card
              </p>
              <h1 className="m-0 mt-3 font-display text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                You&apos;re invited, {invite.email}
              </h1>
              <p className="m-0 mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-white/70">
                Sign in with this email to activate your Culturin Card membership.
              </p>

              {!sessionEmail ? (
                <Link
                  href={`/login?next=${encodeURIComponent(claimPath)}`}
                  className="mt-6 inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white no-underline transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Sign in to claim
                </Link>
              ) : sessionEmail.trim().toLowerCase() !== invite.email.trim().toLowerCase() ? (
                <div className="mt-6 rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200">
                  <p className="m-0">
                    You&apos;re signed in as <span className="font-semibold">{sessionEmail}</span>, but this invite was
                    sent to <span className="font-semibold">{invite.email}</span>. Sign out and sign in with the
                    invited email to claim it.
                  </p>
                  <ClaimSwitchAccount next={claimPath} />
                </div>
              ) : (
                <ClaimButton token={token} />
              )}
            </section>
          )}
        </div>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
