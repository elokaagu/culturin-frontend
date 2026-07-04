import type { Metadata } from "next";

import { events } from "@/lib/eventsData";
import { listEventRsvpsForStudio } from "@/lib/studio/eventRsvps";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioEventRsvpsPageClient } from "./StudioEventRsvpsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event RSVPs",
  description: "Every RSVP submitted from an event page, ready to become a Luma invite list.",
};

export default async function StudioEventRsvpsPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const rsvps = hasDb ? await listEventRsvpsForStudio() : [];
  const eventLabels = Object.fromEntries(events.map((e) => [e.slug, e.name]));

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-culturin-700 dark:text-culturin-300">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Event RSVPs</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Grouped by event. Export a CSV when you&apos;re ready to build the invite list in Luma.
      </p>

      <StudioEventRsvpsPageClient rsvps={rsvps} eventLabels={eventLabels} hasDb={hasDb} />
    </div>
  );
}
