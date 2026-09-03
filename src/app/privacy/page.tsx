import { Metadata } from "next";
import type { ReactNode } from "react";

import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";

export const metadata: Metadata = {
  title: "Privacy | Culturin",
  description: "How Culturin handles your information.",
};

const cardClass = "rounded-2xl border p-5";
const cardStyle = { borderColor: "var(--c-rule)", background: "rgba(28,26,23,0.03)" };

function P({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>
      {children}
    </p>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="m-0 list-disc space-y-2 pl-5 text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>
      {children}
    </ul>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="m-0 text-xl font-medium tracking-tight sm:text-2xl"
      style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
    >
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <ContentPageShell
      mainClassName="min-h-dvh pb-16"
      innerClassName="mx-auto w-full max-w-3xl px-4 sm:px-6"
    >
      <nav aria-label="Breadcrumb" className="mb-6 pt-6">
        <div className="flex items-center gap-1 text-sm">
          <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Home
          </Link>
          <span aria-hidden style={{ color: "var(--c-muted)" }}>
            /
          </span>
          <span style={{ color: "var(--c-muted)" }}>Privacy</span>
        </div>
      </nav>

      <article className="space-y-8">
        <header className={cardClass} style={cardStyle}>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-muted)" }}>
            Policy
          </p>
          <h1
            className="m-0 mt-3 text-3xl leading-[1.1] tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            Privacy policy
          </h1>
          <p className="m-0 mt-4 max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
            This policy explains how Culturin collects, uses, and protects personal information when you browse our
            website, create an account, save content, or contact providers.
          </p>
          <p className="m-0 mt-3 text-sm" style={{ color: "var(--c-muted)" }}>
            Last updated: April 25, 2026
          </p>
        </header>

        <section className={`grid gap-4 sm:grid-cols-3 ${cardClass}`} style={cardStyle}>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
              Controller
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-ink)" }}>
              Culturin
            </p>
          </div>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
              Contact
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-ink)" }}>
              privacy@culturin.example
            </p>
          </div>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
              Region scope
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-ink)" }}>
              Global users
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Information we collect</H2>
          <div className={cardClass} style={cardStyle}>
            <List>
              <li>Account details such as your name, email address, and authentication identifiers.</li>
              <li>Profile and preference data, including saved articles, saved experiences, and browsing selections.</li>
              <li>Technical data such as IP address, browser type, device metadata, and log events.</li>
              <li>Messages or inquiry content you submit through forms.</li>
            </List>
          </div>
        </section>

        <section className="space-y-4">
          <H2>How we use your information</H2>
          <div className={cardClass} style={cardStyle}>
            <List>
              <li>Provide and maintain core product features across articles, videos, cities, and providers.</li>
              <li>Personalize recommendations, nearby suggestions, and saved content experiences.</li>
              <li>Secure accounts, prevent abuse, and investigate suspicious activity.</li>
              <li>Send service messages and, where consent is provided, optional product updates.</li>
              <li>Measure product performance and improve design, relevance, and reliability.</li>
            </List>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Legal bases for processing</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              Depending on your region, we process data on the basis of contract performance, legitimate interests,
              legal obligations, and consent where required.
            </P>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Sharing and third parties</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              We may share data with infrastructure, analytics, authentication, customer support, and
              payment-related providers that help us operate Culturin. We require these partners to process data
              only for authorized purposes.
            </P>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Cookies and similar technologies</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              We use cookies and local storage for session handling, preferences, login persistence, and usage
              measurement. You can manage cookie behavior through your browser settings.
            </P>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Data retention</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              We retain personal data only as long as needed for the purposes above, legal compliance, dispute
              resolution, and service integrity. When no longer needed, data is deleted or anonymized.
            </P>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Your rights</H2>
          <div className={cardClass} style={cardStyle}>
            <List>
              <li>Request access to personal data we hold about you.</li>
              <li>Request correction, deletion, or limitation of processing.</li>
              <li>Object to certain processing activities where applicable.</li>
              <li>Request data portability where supported by law.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </List>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Children&apos;s privacy</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              Culturin is not directed to children under the age required by local law. If you believe a child has
              provided personal data, contact us so we can take appropriate action.
            </P>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Policy changes</H2>
          <div className={cardClass} style={cardStyle}>
            <P>
              We may update this policy from time to time. Material changes will be reflected on this page and,
              when appropriate, communicated through product notices.
            </P>
          </div>
        </section>

        <section className={cardClass} style={cardStyle}>
          <H2>Contact us</H2>
          <p className="m-0 mt-3" style={{ color: "var(--c-muted)" }}>
            For privacy questions or rights requests, contact{" "}
            <a
              className="underline underline-offset-2"
              style={{ color: "var(--c-accent)" }}
              href="mailto:privacy@culturin.example"
            >
              privacy@culturin.example
            </a>
            .
          </p>
        </section>
      </article>
    </ContentPageShell>
  );
}
