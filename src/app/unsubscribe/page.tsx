import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { verifyUnsubscribe } from "@/lib/email/unsubscribe";
import { editorialScopeClass } from "@/lib/theme/culturinTokens";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe | Culturin",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({ searchParams }: { searchParams: { e?: string; t?: string; done?: string } }) {
  const done = searchParams.done === "1";
  const email = done ? null : verifyUnsubscribe(searchParams.e ?? null, searchParams.t ?? null);

  return (
    <main className={`${editorialScopeClass} flex min-h-dvh items-center justify-center bg-[color:var(--c-bg)] px-4 py-16 text-[color:var(--c-ink)]`}>
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] no-underline">
          Culturin
        </Link>
        {done ? (
          <>
            <h1 className="m-0 mt-10 font-display text-4xl font-medium tracking-tight">You&apos;re unsubscribed.</h1>
            <p className="m-0 mt-3 text-sm text-[color:var(--c-muted)]">
              You won&apos;t get Culturin emails any more. If that was a mistake, you can sign up again at the bottom of any page.
            </p>
          </>
        ) : email ? (
          <>
            <h1 className="m-0 mt-10 font-display text-4xl font-medium tracking-tight">Unsubscribe?</h1>
            <p className="m-0 mt-3 break-words text-sm text-[color:var(--c-muted)]">
              We&apos;ll stop sending Culturin emails to <span className="text-[color:var(--c-ink)]">{email}</span>.
            </p>
            <form method="post" action="/api/unsubscribe" className="mt-8">
              <input type="hidden" name="e" value={searchParams.e} />
              <input type="hidden" name="t" value={searchParams.t} />
              <button
                type="submit"
                className="rounded-full bg-[color:var(--c-accent)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1c1a17] transition hover:opacity-90"
              >
                Unsubscribe
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="m-0 mt-10 font-display text-4xl font-medium tracking-tight">Link not recognised.</h1>
            <p className="m-0 mt-3 text-sm text-[color:var(--c-muted)]">
              This unsubscribe link is incomplete or has been changed. Use the link at the bottom of any Culturin email, or email hello@culturin.com.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
