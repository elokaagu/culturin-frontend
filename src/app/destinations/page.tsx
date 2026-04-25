import { Metadata } from "next";
import { Link } from "next-view-transitions";

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
      innerClassName="w-full max-w-7xl px-4 sm:px-6"
      mainClassName="min-h-screen bg-black px-0 pb-16 pt-[var(--header-offset)] text-white"
    >
      <div className="mb-8 border-b border-white/10 pb-6 pt-6">
        <nav className="mb-5" aria-label="Breadcrumb">
          <Link href="/" className="text-sm font-medium text-amber-300/95 no-underline hover:underline">
            Home
          </Link>
          <span className="px-1 text-white/35" aria-hidden>
            /
          </span>
          <span className="text-sm text-white/60">Destinations</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="m-0 text-3xl tracking-tight sm:text-5xl">Destinations</h1>
            <p className="m-0 mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
              Browse cities, discover local context, and open detailed destination pages with tailored recommendations.
            </p>
          </div>
          <p className="m-0 text-sm text-white/60">
            <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs text-white/90">
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
