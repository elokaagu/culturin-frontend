import { Metadata } from "next";
import type { ReactNode } from "react";

import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";

export const metadata: Metadata = {
  title: "Privacy | Culturin",
  description: "How Culturin handles your information.",
};

function P({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-neutral-700 dark:text-white/85">{children}</p>;
}

export default function PrivacyPage() {
  return (
    <ContentPageShell>
      <nav aria-label="Back to home" className="mb-4">
        <Link
          href="/"
          className="text-sm font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
        >
          ← Home
        </Link>
      </nav>
      <article>
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <div className="mt-6 flex max-w-prose flex-col gap-4">
          <P>
            This page is a placeholder for Culturin’s privacy policy. When you go live, replace
            it with your full terms for data collection, marketing email consent, and third-party
            services.
          </P>
          <P>Questions? Reach us through the contact options on the About page.</P>
        </div>
      </article>
    </ContentPageShell>
  );
}
