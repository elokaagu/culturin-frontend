import type { Metadata } from "next";

import { StudioEventForm } from "../StudioEventForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New event" };

export default function StudioNewEventPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">New event</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">It appears on the events page and the homepage as soon as you save.</p>
      <div className="mt-8">
        <StudioEventForm mode="create" event={null} startsOn={null} />
      </div>
    </div>
  );
}
