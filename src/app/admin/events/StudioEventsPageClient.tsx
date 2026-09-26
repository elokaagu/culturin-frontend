"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "next-view-transitions";

import { DeleteIconButton, EmptyNote, Notice } from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import {
  StudioCulturinListSection,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/admin/_components/StudioCulturinListKit";
import type { AdminEvents } from "@/lib/events/eventsStore";

export function StudioEventsPageClient({ initial }: { initial: AdminEvents }) {
  const confirm = useStudioConfirm();
  const [data, setData] = useState<AdminEvents>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events", { cache: "no-store" });
      if (res.ok) setData((await res.json()) as AdminEvents);
    } catch {
      /* keep what's on screen */
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function importBuiltins() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import-builtin" }),
    }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    setBusy(false);
    if (!res || !res.ok) {
      setError(body?.message ?? "Could not import the events.");
      return;
    }
    await reload();
  }

  async function removeEvent(slug: string, name: string) {
    const ok = await confirm({
      title: `Delete "${name}"?`,
      description: "This removes the event and its page from the site. RSVPs already collected are kept.",
      confirmLabel: "Delete event",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: [slug] }),
    }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    setBusy(false);
    if (!res || !res.ok) {
      setError(body?.message ?? "Could not delete the event.");
      return;
    }
    await reload();
  }

  const managed = data.source === "db";

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {managed || data.tableReady ? (
          <Link href="/admin/events/new" className={studioCreateButtonClass}>
            New event
          </Link>
        ) : null}
      </div>

      {!data.tableReady ? (
        <Notice tone="error">
          The events table isn&apos;t set up yet. Run <code>supabase/migrations/043_cms_events.sql</code> in the Supabase SQL editor, then
          reload this page. Until then the site shows the built-in events.
        </Notice>
      ) : null}

      {data.tableReady && !managed ? (
        <div className="mt-4 rounded-xl border border-[color:var(--c-rule)] p-4 text-sm text-[color:var(--c-ink)]">
          <p className="m-0 font-medium">These are the built-in events.</p>
          <p className="m-0 mt-1 text-[color:var(--c-muted)]">
            Import them once to start editing here. The site looks the same afterwards, and the admin becomes the source of truth.
          </p>
          <button
            type="button"
            onClick={() => void importBuiltins()}
            disabled={busy}
            className="mt-3 inline-flex h-9 items-center rounded-full bg-[color:var(--c-ink)] px-4 text-sm font-semibold text-[color:var(--c-bg)] transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Importing…" : "Import built-in events"}
          </button>
        </div>
      ) : null}

      {error ? <Notice tone="error">{error}</Notice> : null}

      <StudioCulturinListSection title="All events" countLabel={`${data.events.length} event${data.events.length === 1 ? "" : "s"}`}>
        {data.events.length === 0 ? (
          <EmptyNote>No events yet.</EmptyNote>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {data.events.map((event) => (
              <li key={event.slug} className={`${studioListRowClass} flex items-start gap-3`}>
                <a
                  href={`/events/${event.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-w-0 flex-1 no-underline"
                  title="Open the public page"
                >
                  <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-semibold text-[color:var(--c-ink)] group-hover:text-[color:var(--c-accent)]">
                    {event.name}
                    <span className="rounded-full border border-[color:var(--c-rule)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--c-muted)]">
                      {event.isPast ? "Past" : "Upcoming"}
                    </span>
                  </p>
                  <p className="m-0 mt-1 text-xs text-[color:var(--c-muted)]">
                    {[event.date, event.location].filter(Boolean).join(" · ")}
                  </p>
                  <p className="m-0 mt-1 text-xs text-[color:var(--c-muted)]">/events/{event.slug}</p>
                </a>
                {managed ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/admin/events/edit/${encodeURIComponent(event.slug)}`} className={studioListEditLinkClass}>
                      Edit
                    </Link>
                    <DeleteIconButton label={`Delete ${event.name}`} disabled={busy} onClick={() => void removeEvent(event.slug, event.name)} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
