import { Metadata } from "next";
import { Link } from "next-view-transitions";

import { appPageContainerClass } from "@/lib/appLayout";
import { destinations } from "../../lib/destinationsData";
import { ContentPageShell } from "../components/layout/ContentPageShell";
import DestinationsClient from "./DestinationsClient";

const destinationsCount = destinations.length;

export const metadata: Metadata = {
  title: "Cities | Culturin",
  description: "Cities where the Culturin house gathers — and the stories that come out of those rooms.",
};

export default function DestinationsPage() {
  return (
    <ContentPageShell
      innerClassName={appPageContainerClass}
      mainClassName="min-h-dvh px-0 pb-16 antialiased"
    >
      <div className="mb-8 border-b pb-6 pt-6" style={{ borderColor: "var(--c-rule)" }}>
        <nav className="mb-5" aria-label="Breadcrumb">
          <Link href="/" className="text-sm font-medium no-underline hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Home
          </Link>
          <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>
            /
          </span>
          <span className="text-sm" style={{ color: "var(--c-muted)" }}>Cities</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-muted)" }}>
              Platform
            </p>
            <h1
              className="m-0 mt-3 text-3xl font-medium tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
            >
              Cities
            </h1>
            <p className="m-0 mt-3 text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
              Where the house gathers. Open a city for stories, rooms, and the people already there.
            </p>
          </div>
          <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: "rgba(28,26,23,0.06)", color: "var(--c-ink)" }}
            >
              {destinationsCount}
            </span>{" "}
            places
          </p>
        </div>
      </div>
      <DestinationsClient />
    </ContentPageShell>
  );
}
