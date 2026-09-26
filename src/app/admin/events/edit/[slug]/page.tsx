import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAdminEvents } from "@/lib/events/eventsStore";

import { StudioEventForm } from "../../StudioEventForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit event" };

export default async function StudioEditEventPage({ params }: { params: { slug: string } }) {
  const { events, source, startsOn } = await getAdminEvents();
  const event = events.find((e) => e.slug === params.slug);
  // Built-in events must be imported before they can be edited.
  if (!event || source !== "db") notFound();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">{event.name}</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">Changes go live within a couple of minutes.</p>
      <div className="mt-8">
        <StudioEventForm mode="edit" event={event} startsOn={startsOn[event.slug] ?? null} />
      </div>
    </div>
  );
}
