"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { StudioCardApplication } from "@/lib/studio/cardApplications";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function sourceLabel(app: StudioCardApplication): string {
  if (app.source === "event_rsvp") return app.sourceEventSlug ? `Event · ${app.sourceEventSlug}` : "Event RSVP";
  if (app.source === "advisor_application") return "Advisors form";
  return "Manual";
}

const statusBadgeClass: Record<StudioCardApplication["status"], string> = {
  pending: "bg-neutral-200 text-neutral-700 dark:bg-white/10 dark:text-white/70",
  invited: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  declined: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
};

function claimUrlFor(inviteToken: string): string {
  if (!inviteToken || typeof window === "undefined") return "";
  return `${window.location.origin}/culturin-card/claim?token=${inviteToken}`;
}

export function StudioCardApplicationsPageClient({
  applications,
  hasDb,
}: {
  applications: StudioCardApplication[];
  hasDb: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.firstName, a.lastName, a.email, a.company, a.title, sourceLabel(a)].some((f) => f.toLowerCase().includes(q)),
    );
  }, [applications, search]);

  async function handleInvite(id: string) {
    setInvitingId(id);
    setErrorById((prev) => ({ ...prev, [id]: "" }));

    const response = await fetch("/api/studio/card-applications/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setInvitingId(null);

    if (!response.ok) {
      setErrorById((prev) => ({ ...prev, [id]: data.message ?? "Could not send that invite." }));
      return;
    }

    router.refresh();
  }

  async function handleCopy(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      /* clipboard unavailable — the link is still visible to copy manually */
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All applications
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
          {search.trim() ? `${filtered.length} of ${applications.length} shown` : `${applications.length} application${applications.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {hasDb && applications.length > 0 ? (
        <label className="mt-5 flex flex-col gap-2 sm:max-w-sm">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, source…"
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
          />
        </label>
      ) : null}

      <div className="mt-8 space-y-3">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so applications can&apos;t be listed yet.
          </p>
        ) : applications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No applications yet. Nominate an event RSVP or wait for advisors-form submissions.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No applications match your search. Try a different term or clear the search box.
          </p>
        ) : (
          filtered.map((a) => {
            const claimUrl = claimUrlFor(a.inviteToken);
            return (
              <div
                key={a.id}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-white/12 dark:bg-white/[0.04]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                      {a.firstName || a.lastName ? `${a.firstName} ${a.lastName}`.trim() : a.email}
                      <span className={["rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide", statusBadgeClass[a.status]].join(" ")}>
                        {a.status}
                      </span>
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <a href={`mailto:${a.email}`} className="text-neutral-600 no-underline hover:underline dark:text-white/70">
                        {a.email}
                      </a>
                      <span className="text-neutral-500 dark:text-white/58">{sourceLabel(a)}</span>
                      {a.company ? (
                        <span className="text-neutral-500 dark:text-white/58">
                          {a.title ? `${a.title}, ` : ""}
                          {a.company}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-white/58">{formatDate(a.createdAt)}</span>
                </div>

                {a.status === "active" ? (
                  <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
                    Active Card member since {formatDate(a.activatedAt)}.
                  </p>
                ) : a.status === "invited" && claimUrl ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <code className="truncate rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-700 dark:bg-black/50 dark:text-white/75 max-w-full sm:max-w-md">
                      {claimUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(a.id, claimUrl)}
                      className="inline-flex h-7 shrink-0 items-center rounded-full border border-neutral-300 px-2.5 text-[0.7rem] font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:bg-white/[0.06] dark:text-white/85 dark:hover:bg-white/10"
                    >
                      {copiedId === a.id ? "Copied" : "Copy link"}
                    </button>
                    <span className="text-[0.7rem] text-neutral-500 dark:text-white/55">
                      Expires {formatDate(a.inviteTokenExpiresAt)}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInvite(a.id)}
                      disabled={invitingId === a.id}
                      className="inline-flex h-8 items-center rounded-full bg-culturin-700 px-3.5 text-xs font-semibold text-white transition hover:bg-culturin-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-culturin-600 dark:hover:bg-culturin-500"
                    >
                      {invitingId === a.id ? "Inviting…" : "Invite to Card"}
                    </button>
                    {errorById[a.id] ? (
                      <span className="text-xs text-rose-600 dark:text-rose-400">{errorById[a.id]}</span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
