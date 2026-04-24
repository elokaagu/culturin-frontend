import { Metadata } from "next";
import { Link } from "next-view-transitions";

import { destinations } from "../../lib/destinationsData";
import { ContentPageShell } from "../components/layout/ContentPageShell";
import DestinationsClient from "./DestinationsClient";

const destinationsCount = destinations.length;

export const metadata: Metadata = {
  title: "Destinations | Culturin",
  description: "Explore places around the world with Culturin. Hover a destination to see a preview.",
};

export default function DestinationsPage() {
  return (
    <ContentPageShell
      innerClassName="w-full max-w-7xl flex flex-col gap-0 px-4 sm:px-6"
      mainClassName="flex min-h-screen justify-center bg-white px-0 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
    >
      <div className="mb-6 flex items-center justify-between gap-4 pt-4 sm:pt-5">
        <h1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">Destinations</h1>
        <p className="m-0 hidden text-sm text-neutral-500 sm:block dark:text-white/55">
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700 dark:bg-white/10 dark:text-white/80">
            {destinationsCount}
          </span>{" "}
          places
        </p>
      </div>
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href="/"
          className="text-sm font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
        >
          Home
        </Link>
        <span className="px-1 text-neutral-400" aria-hidden>
          /
        </span>
        <span className="text-sm text-neutral-600 dark:text-white/60">Destinations</span>
      </nav>
      <DestinationsClient />
    </ContentPageShell>
  );
}
