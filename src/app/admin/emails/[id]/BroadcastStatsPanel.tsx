"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { studioGhostButtonClass, studioPanelClass } from "@/app/admin/_lib/studioTheme";
import type { BroadcastStats, EngagedPerson } from "@/lib/email/broadcasts";
import { cn } from "@/lib/utils";

type Filter = "clicked" | "opened" | "bounced";

const pct = (n: number, of: number) => (of > 0 ? `${Math.round((n / of) * 1000) / 10}%` : "–");

function Tile({ label, value, sub, tone }: { label: string; value: number; sub?: string; tone?: "warn" }) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-[color:var(--c-rule)] p-4">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">{label}</span>
      <span className={cn("font-display text-3xl font-semibold tabular-nums", tone === "warn" && value > 0 ? "text-rose-500" : "text-[color:var(--c-ink)]")}>
        {value.toLocaleString()}
      </span>
      {sub ? <span className="text-xs text-[color:var(--c-muted)]">{sub}</span> : null}
    </li>
  );
}

function downloadCsv(people: EngagedPerson[], name: string) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    ["Email", "Name", "Company", "Opened", "Clicked", "Bounced", "Marked as spam"].join(","),
    ...people.map((p) => [p.email, p.name, p.company, p.openedAt ?? "", p.clickedAt ?? "", p.bouncedAt ?? "", p.complainedAt ?? ""].map(esc).join(",")),
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** Results for a sent (or partly sent) broadcast, fed by Resend's webhook. Refreshes itself every minute. */
export function BroadcastStatsPanel({ stats, subject }: { stats: BroadcastStats; subject: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("clicked");

  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 60_000);
    return () => clearInterval(t);
  }, [router]);

  const base = stats.delivered || stats.sent;
  const list = useMemo(
    () =>
      stats.people.filter((p) =>
        filter === "clicked" ? p.clickedAt : filter === "opened" ? p.openedAt || p.clickedAt : p.bouncedAt || p.complainedAt,
      ),
    [filter, stats.people],
  );

  return (
    <section className={cn(studioPanelClass, "mt-6 flex flex-col gap-5")}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">Results</h2>
        <p className="m-0 text-xs text-[color:var(--c-muted)]">
          {stats.lastEventAt ? `Last activity ${formatAdminDate(stats.lastEventAt)} · updates every minute` : "Updates every minute"}
        </p>
      </div>

      {!stats.tracking ? (
        <p className="m-0 rounded-lg border border-dashed border-[color:var(--c-rule)] px-3 py-3 text-sm text-[color:var(--c-muted)]">
          No tracking data yet. Results appear a few minutes after sending, once Resend&apos;s webhook is set up (URL{" "}
          <code>https://www.culturin.com/api/webhooks/resend</code>, secret in Vercel as <code>RESEND_WEBHOOK_SECRET</code>) and
          migration 046 has been run. Emails sent before tracking was on won&apos;t have results.
        </p>
      ) : null}

      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
        <Tile label="Sent" value={stats.sent} />
        <Tile label="Delivered" value={stats.delivered} sub={pct(stats.delivered, stats.sent)} />
        <Tile label="Opened" value={stats.opened} sub={`${pct(stats.opened, base)} · approximate`} />
        <Tile label="Clicked" value={stats.clicked} sub={pct(stats.clicked, base)} />
        <Tile label="Bounced" value={stats.bounced} sub={`${pct(stats.bounced, stats.sent)} · keep under 2%`} tone="warn" />
        <Tile label="Marked spam" value={stats.complained} sub={`${pct(stats.complained, stats.sent)} · keep under 0.1%`} tone="warn" />
      </ul>
      <p className="m-0 text-xs text-[color:var(--c-muted)]">
        Opens are approximate: Apple Mail opens every email automatically for privacy, and some apps block tracking. Clicks are the reliable
        signal. People who bounce or mark it as spam are taken off the list automatically.
      </p>

      {stats.topLinks.length > 0 ? (
        <div>
          <h3 className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">Most clicked links</h3>
          <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0 text-sm">
            {stats.topLinks.map((l) => (
              <li key={l.link} className="flex items-baseline justify-between gap-4 border-b border-[color:var(--c-rule)] pb-2 last:border-0">
                <a href={l.link} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-[color:var(--c-ink)] underline decoration-[color:var(--c-accent)] underline-offset-2">
                  {l.link.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
                <span className="shrink-0 tabular-nums text-[color:var(--c-muted)]">
                  {l.people} {l.people === 1 ? "person" : "people"} · {l.clicks} clicks
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {stats.people.length > 0 ? (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5" role="tablist" aria-label="Who">
              {(
                [
                  ["clicked", `Clicked (${stats.clicked})`],
                  ["opened", `Opened (${stats.opened})`],
                  ["bounced", `Bounced or spam (${stats.bounced + stats.complained})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    filter === key
                      ? "border-[color:var(--c-accent)] bg-[color:var(--c-accent)] text-[#1c1a17]"
                      : "border-[color:var(--c-rule)] text-[color:var(--c-ink)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => downloadCsv(stats.people, `${(subject || "email").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-results.csv`)}
              className={cn(studioGhostButtonClass, "h-8 px-3 text-xs font-semibold")}
            >
              Download CSV
            </button>
          </div>
          {list.length === 0 ? (
            <p className="m-0 mt-3 text-sm text-[color:var(--c-muted)]">Nobody here yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-xl border border-[color:var(--c-rule)]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--c-rule)] text-[color:var(--c-muted)]">
                    <th className="px-3 py-2 font-medium">Person</th>
                    <th className="px-3 py-2 font-medium">Company</th>
                    <th className="px-3 py-2 font-medium">{filter === "bounced" ? "What happened" : "When"}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.slice(0, 200).map((p) => (
                    <tr key={p.email} className="border-b border-[color:var(--c-rule)] last:border-0">
                      <td className="px-3 py-2">
                        <span className="block text-[color:var(--c-ink)]">{p.name || p.email}</span>
                        {p.name ? <span className="block text-xs text-[color:var(--c-muted)]">{p.email}</span> : null}
                      </td>
                      <td className="px-3 py-2 text-[color:var(--c-muted)]">{p.company || "–"}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-[color:var(--c-muted)]">
                        {filter === "bounced"
                          ? p.complainedAt
                            ? "Marked as spam"
                            : "Bounced"
                          : formatAdminDate((filter === "clicked" ? p.clickedAt : p.openedAt ?? p.clickedAt) ?? "")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {list.length > 200 ? (
                <p className="m-0 px-3 py-2 text-xs text-[color:var(--c-muted)]">Showing 200 of {list.length}. Download the CSV for everyone.</p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
