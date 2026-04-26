import { Metadata } from "next";
import { Link } from "next-view-transitions";

import { appPageContainerClass } from "@/lib/appLayout";
import { destinations } from "../../lib/destinationsData";
import { ContentPageShell } from "../components/layout/ContentPageShell";
import DestinationsClient from "./DestinationsClient";

const destinationsCount = destinations.length;

export const metadata: Metadata = {
  title: "Destinations | Culturin",
  description: "Explore destinations around the world with custom local insight from Culturin.",
};

export default function DestinationsPage() {
  return (
    <ContentPageShell
      innerClassName={appPageContainerClass}
      mainClassName="min-h-dvh bg-neutral-50 px-0 pb-16 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
    >
      <div className="mb-8 border-b border-neutral-200 pb-6 pt-6 dark:border-white/10">
        <nav className="mb-5" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-sm font-medium text-amber-600 no-underline hover:underline dark:text-amber-300/95"
          >
            Home
          </Link>
          <span className="px-1 text-neutral-400 dark:text-white/35" aria-hidden>
            /
          </span>
          <span className="text-sm text-neutral-600 dark:text-white/60">Destinations</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="m-0 text-3xl tracking-tight text-neutral-900 dark:text-white sm:text-5xl">Destinations</h1>
            <p className="m-0 mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-white/70">
              Browse cities, discover local context, and open detailed destination pages with tailored recommendations.
            </p>
          </div>
          <p className="m-0 text-sm text-neutral-600 dark:text-white/60">
            <span className="rounded-md bg-neutral-200 px-2 py-0.5 font-mono text-xs text-neutral-800 dark:bg-white/10 dark:text-white/90">
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
