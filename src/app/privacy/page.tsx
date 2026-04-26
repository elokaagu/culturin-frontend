import { Metadata } from "next";
import type { ReactNode } from "react";

import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy | Culturin",
  description: "How Culturin handles your information.",
};

function P({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-base leading-relaxed text-neutral-700 dark:text-white/80">
      {children}
    </p>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <ContentPageShell
        mainClassName="min-h-screen bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
        innerClassName="mx-auto w-full max-w-5xl px-4 sm:px-6"
      >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-amber-300/95 no-underline transition hover:text-amber-200"
            >
              Home
            </Link>
            <span aria-hidden className="text-neutral-400 dark:text-white/35">
              /
            </span>
            <span className="text-neutral-600 dark:text-white/65">Privacy</span>
          </div>
        </nav>

        <article className="space-y-8">
          <header className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/45">
              Policy
            </p>
            <h1 className="m-0 mt-3 text-3xl tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Privacy policy
            </h1>
            <p className="m-0 mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 dark:text-white/80 sm:text-lg">
              This policy explains how Culturin collects, uses, and protects
              personal information when you browse our website, create an
              account, save content, or contact providers.
            </p>
            <p className="m-0 mt-3 text-sm text-neutral-500 dark:text-white/55">
              Last updated: April 25, 2026
            </p>
          </header>

          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Controller
              </p>
              <p className="m-0 mt-2 text-sm text-white/80">Culturin</p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Contact
              </p>
              <p className="m-0 mt-2 text-sm text-white/80">
                privacy@culturin.example
              </p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Region scope
              </p>
              <p className="m-0 mt-2 text-sm text-white/80">Global users</p>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Information we collect</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <ul className="m-0 list-disc space-y-2 pl-5 text-white/80">
                <li>
                  Account details such as your name, email address, and
                  authentication identifiers.
                </li>
                <li>
                  Profile and preference data, including saved articles, saved
                  experiences, and browsing selections.
                </li>
                <li>
                  Technical data such as IP address, browser type, device
                  metadata, and log events.
                </li>
                <li>Messages or inquiry content you submit through forms.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <H2>How we use your information</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <ul className="m-0 list-disc space-y-2 pl-5 text-white/80">
                <li>
                  Provide and maintain core product features across articles,
                  videos, destinations, and providers.
                </li>
                <li>
                  Personalize recommendations, nearby suggestions, and saved
                  content experiences.
                </li>
                <li>
                  Secure accounts, prevent abuse, and investigate suspicious
                  activity.
                </li>
                <li>
                  Send service messages and, where consent is provided, optional
                  product updates.
                </li>
                <li>
                  Measure product performance and improve design, relevance, and
                  reliability.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Legal bases for processing</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                Depending on your region, we process data on the basis of
                contract performance, legitimate interests, legal obligations,
                and consent where required.
              </P>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Sharing and third parties</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                We may share data with infrastructure, analytics,
                authentication, customer support, and payment-related providers
                that help us operate Culturin. We require these partners to
                process data only for authorized purposes.
              </P>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Cookies and similar technologies</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                We use cookies and local storage for session handling,
                preferences, login persistence, and usage measurement. You can
                manage cookie behavior through your browser settings.
              </P>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Data retention</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                We retain personal data only as long as needed for the purposes
                above, legal compliance, dispute resolution, and service
                integrity. When no longer needed, data is deleted or anonymized.
              </P>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Your rights</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <ul className="m-0 list-disc space-y-2 pl-5 text-white/80">
                <li>Request access to personal data we hold about you.</li>
                <li>
                  Request correction, deletion, or limitation of processing.
                </li>
                <li>
                  Object to certain processing activities where applicable.
                </li>
                <li>Request data portability where supported by law.</li>
                <li>Withdraw consent where processing is based on consent.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Children&apos;s privacy</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                Culturin is not directed to children under the age required by
                local law. If you believe a child has provided personal data,
                contact us so we can take appropriate action.
              </P>
            </div>
          </section>

          <section className="space-y-4">
            <H2>Policy changes</H2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <P>
                We may update this policy from time to time. Material changes
                will be reflected on this page and, when appropriate,
                communicated through product notices.
              </P>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="m-0 text-lg font-semibold text-white">Contact us</h2>
            <p className="m-0 mt-3 text-white/80">
              For privacy questions or rights requests, contact{" "}
              <a
                className="text-amber-300/95 underline decoration-amber-300/50 underline-offset-2"
                href="mailto:privacy@culturin.example"
              >
                privacy@culturin.example
              </a>
              .
            </p>
          </section>
        </article>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
