import type { Metadata } from "next";

import { getAdminEvents } from "@/lib/events/eventsStore";

import { StudioEventsPageClient } from "./StudioEventsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Create and update the events shown on the site.",
};

export default async function StudioEventsPage() {
  const initial = await getAdminEvents();
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Events</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        The events on the events page and the homepage. Add new ones, update details, or mark them as past.
      </p>
      <StudioEventsPageClient initial={initial} />
    </div>
  );
}
