"use client";

import { Check, Copy, ExternalLink, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { StudioSelect } from "@/app/admin/_components/StudioSelect";
import { studioFieldInputClass, studioGhostButtonClass, studioMutedClass, studioPanelClass } from "@/app/admin/_lib/studioTheme";
import { pendingItems } from "@/lib/briefings/output";
import type { Briefing } from "@/lib/briefings/store";
import {
  LIST_SECTIONS,
  PIPELINE_STATUSES,
  SECTION_META,
  type BriefingRequest,
  type BriefingSections,
  type BriefingSource,
  type Decision,
  type ItemReview,
  type ListSectionKey,
  type StepName,
} from "@/lib/briefings/types";
import { cn } from "@/lib/utils";

import { StatusBadge } from "../BriefingsClient";

type Field = { key: string; label: string; long?: boolean };

const FIELDS: Record<ListSectionKey | "numbers", Field[]> = {
  numbers: [{ key: "value", label: "Value" }, { key: "label", label: "What it measures" }],
  food: [{ key: "name", label: "Name" }, { key: "detail", label: "Detail", long: true }],
  history: [{ key: "name", label: "Name" }, { key: "detail", label: "Detail", long: true }],
  musicArt: [{ key: "name", label: "Name" }, { key: "detail", label: "Detail", long: true }],
  neighbourhoods: [{ key: "name", label: "Name" }, { key: "detail", label: "Detail", long: true }],
  influencers: [
    { key: "name", label: "Name" },
    { key: "platform", label: "Platform" },
    { key: "handle", label: "Handle" },
    { key: "reach", label: "Reach" },
    { key: "why", label: "Why they matter", long: true },
  ],
  calendar: [
    { key: "name", label: "Moment" },
    { key: "start", label: "Starts (YYYY-MM-DD)" },
    { key: "end", label: "Ends" },
    { key: "category", label: "Category" },
    { key: "location", label: "Location" },
    { key: "detail", label: "Detail", long: true },
  ],
  sensitivities: [{ key: "title", label: "Title" }, { key: "detail", label: "Detail", long: true }],
  opportunities: [{ key: "title", label: "Title" }, { key: "idea", label: "The idea", long: true }, { key: "why", label: "Why it fits", long: true }],
};

const CONFIDENCE_TONE: Record<string, string> = {
  high: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-rose-500",
};

function money(n: number | undefined) {
  return `$${(n ?? 0).toFixed(2)}`;
}

function SourceChips({ keys, byKey }: { keys: string[]; byKey: Map<string, BriefingSource> }) {
  if (!keys.length) return <span className="text-xs text-rose-500">No source</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {keys.map((k) => {
        const s = byKey.get(k);
        const label = s ? [s.publisher, s.publishedDate].filter(Boolean).join(" · ") : "missing";
        return s?.url ? (
          <a
            key={k}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={s.title ?? s.url}
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--c-rule)] px-2 py-0.5 text-[0.7rem] text-[color:var(--c-ink)] no-underline hover:border-[color:var(--c-accent)]"
          >
            <span className="font-semibold text-[color:var(--c-accent)]">{k}</span> {label}
          </a>
        ) : (
          <span key={k} title={s?.excerpt ?? ""} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--c-rule)] px-2 py-0.5 text-[0.7rem]">
            <span className="font-semibold text-[color:var(--c-accent)]">{k}</span> {label}
          </span>
        );
      })}
    </span>
  );
}

function ItemCard({
  item,
  fields,
  byKey,
  onChange,
  onDecide,
  locked,
}: {
  item: ItemReview & Record<string, unknown>;
  fields: Field[];
  byKey: Map<string, BriefingSource>;
  onChange: (key: string, value: string) => void;
  onDecide: (d: Decision) => void;
  locked: boolean;
}) {
  const rejected = item.decision === "rejected";
  return (
    <li
      className={cn(
        "rounded-xl border p-4",
        item.decision === "pending" ? "border-[color:var(--c-accent)]" : "border-[color:var(--c-rule)]",
        rejected && "opacity-55",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cn("text-[0.7rem] font-semibold uppercase tracking-[0.14em]", CONFIDENCE_TONE[item.confidence ?? "medium"])}>
          {item.confidence ?? "unchecked"} confidence
          {"verified" in item && item.handle ? (item.verified ? " · handle verified" : " · handle not verified") : ""}
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={locked}
            onClick={() => onDecide("accepted")}
            aria-pressed={item.decision === "accepted"}
            className={cn(studioGhostButtonClass, "h-7 gap-1 px-2.5 text-xs", item.decision === "accepted" && "border-emerald-500 text-emerald-600 dark:text-emerald-400")}
          >
            <Check className="h-3.5 w-3.5" aria-hidden /> Keep
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => onDecide("rejected")}
            aria-pressed={rejected}
            className={cn(studioGhostButtonClass, "h-7 gap-1 px-2.5 text-xs", rejected && "border-rose-500 text-rose-500")}
          >
            <X className="h-3.5 w-3.5" aria-hidden /> Remove
          </button>
        </div>
      </div>
      {item.flags?.length ? (
        <ul className="m-0 mt-2 list-disc pl-5 text-xs text-[color:var(--c-accent)]">
          {item.flags.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {fields.map((f) => {
          const value = typeof item[f.key] === "string" ? (item[f.key] as string) : "";
          const id = `${item.id}-${f.key}`;
          return (
            <label key={f.key} htmlFor={id} className={cn("flex flex-col gap-1 text-xs", f.long && "sm:col-span-2")}>
              <span className={studioMutedClass}>{f.label}</span>
              {f.long ? (
                <textarea id={id} rows={3} value={value} disabled={locked} onChange={(e) => onChange(f.key, e.target.value)} className={cn(studioFieldInputClass, "text-sm")} />
              ) : (
                <input id={id} value={value} disabled={locked} onChange={(e) => onChange(f.key, e.target.value)} className={cn(studioFieldInputClass, "py-2 text-sm")} />
              )}
            </label>
          );
        })}
      </div>
      <div className="mt-3">
        <SourceChips keys={item.sources} byKey={byKey} />
      </div>
    </li>
  );
}

type Props = {
  request: BriefingRequest;
  briefing: Briefing | null;
  sources: BriefingSource[];
  curators: { id: string; name: string }[];
  steps: { name: StepName; label: string }[];
  share: { url: string; pdf: string; preview: string } | null;
  stats: { sessions: number; visitors: number; avgSeconds: number; avgScroll: number; pdfDownloads: number; lastViewedAt: string | null } | null;
};

export function BriefingReviewClient({ request: r, briefing: b, sources, curators, steps, share, stats }: Props) {
  const router = useRouter();
  const byKey = useMemo(() => new Map(sources.map((s) => [s.key, s])), [sources]);
  const [sections, setSections] = useState<BriefingSections | null>(b?.sections ?? null);
  const [summary, setSummary] = useState(b?.summary ?? "");
  const [notes, setNotes] = useState(b?.localNotes ?? "");
  const [curatorId, setCuratorId] = useState(b?.curatorId ?? "");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [onlyFlagged, setOnlyFlagged] = useState(true);
  const running = PIPELINE_STATUSES.includes(r.status);
  const locked = Boolean(b?.deliveredAt);
  const runningRef = useRef(false);

  useEffect(() => {
    setSections(b?.sections ?? null);
    setSummary(b?.summary ?? "");
    setNotes(b?.localNotes ?? "");
    setCuratorId(b?.curatorId ?? "");
    setDirty(false);
  }, [b]);

  // While the pipeline runs: keep advancing it and refresh progress.
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => router.refresh(), 8000);
    if (!runningRef.current) {
      runningRef.current = true;
      fetch(`/api/admin/briefings/${r.id}/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
        .catch(() => undefined)
        .finally(() => {
          runningRef.current = false;
          router.refresh();
        });
    }
    return () => clearInterval(tick);
  }, [running, r.id, router, r.updatedAt]);

  const pending = sections ? pendingItems(sections).length : 0;

  const update = useCallback((fn: (s: BriefingSections) => void) => {
    setSections((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as BriefingSections;
      fn(next);
      return next;
    });
    setDirty(true);
  }, []);

  async function call(label: string, init: RequestInit & { path?: string }) {
    setBusy(label);
    setMessage(null);
    const res = await fetch(init.path ?? `/api/admin/briefings/${r.id}`, { ...init, headers: { "Content-Type": "application/json" } });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    setBusy(null);
    if (!res.ok) {
      setMessage(data.message ?? "Something went wrong.");
      return false;
    }
    return true;
  }

  async function save() {
    if (await call("save", { method: "PATCH", body: JSON.stringify({ sections, summary, localNotes: notes, curatorId: curatorId || null }) })) {
      setDirty(false);
      setMessage("Saved.");
      router.refresh();
    }
  }

  async function act(action: "approve" | "deliver" | "publish" | "unpublish") {
    if (dirty && !(await call("save", { method: "PATCH", body: JSON.stringify({ sections, summary, localNotes: notes, curatorId: curatorId || null }) }))) return;
    setDirty(false);
    if (await call(action, { method: "POST", body: JSON.stringify({ action }) })) {
      setMessage(
        action === "approve" ? "Approved and signed." : action === "deliver" ? "Sent to the buyer." : action === "publish" ? "The guide is live." : "The guide is unpublished.",
      );
      router.refresh();
    }
  }

  const done = steps.filter((s) => r.progress.steps?.[s.name]?.done).length;

  return (
    <div className="mt-4 flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">
            {r.kind === "guide" ? "Public guide" : "Professional briefing"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
            {r.place}, {r.country}
          </h1>
          <p className={cn("mt-2 max-w-2xl text-sm", studioMutedClass)}>
            {[r.audience && `For ${r.audience}`, r.objective && `Objective: ${r.objective}`, `${r.timeframeStart} to ${r.timeframeEnd}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={r.status} />
          <p className={cn("m-0 text-xs tabular-nums", studioMutedClass)}>
            Cost {money(r.cost.total)} · Exa {money(r.cost.exa)} · Apify {money(r.cost.apify)} · Claude {money(r.cost.llm)}
          </p>
          {b?.confidence ? <p className={cn("m-0 text-xs", CONFIDENCE_TONE[b.confidence])}>{b.confidence} overall confidence</p> : null}
        </div>
      </header>

      {running || r.status === "failed" ? (
        <section className={cn(studioPanelClass, "flex flex-col gap-4")} aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 font-display text-lg font-semibold text-[color:var(--c-ink)]">
              {r.status === "failed" ? "The run stopped" : `Working: step ${Math.min(done + 1, steps.length)} of ${steps.length}`}
            </h2>
            {r.status === "failed" || r.error ? (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void call("retry", { method: "POST", path: `/api/admin/briefings/${r.id}/run`, body: JSON.stringify({ retry: true }) }).then(() => router.refresh())}
                className={cn(studioGhostButtonClass, "h-9 gap-1.5 px-4 text-sm font-semibold")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Retry from where it stopped
              </button>
            ) : null}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--c-rule)" }} aria-hidden>
            <div className="h-full rounded-full transition-all" style={{ width: `${(done / steps.length) * 100}%`, background: "var(--c-accent)" }} />
          </div>
          <ol className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {steps.map((s) => {
              const rec = r.progress.steps?.[s.name];
              return (
                <li key={s.name} className="flex flex-wrap gap-x-3">
                  <span className={cn("w-5", rec?.done ? "text-emerald-600 dark:text-emerald-400" : studioMutedClass)}>{rec?.done ? "✓" : "·"}</span>
                  <span className="text-[color:var(--c-ink)]">{s.label}</span>
                  {rec?.note ? <span className={cn("text-xs", rec.done ? studioMutedClass : "text-rose-500")}>{rec.note}</span> : null}
                </li>
              );
            })}
          </ol>
          {r.error ? <p className="m-0 text-sm text-rose-500">{r.error}</p> : null}
          <p className={cn("m-0 text-xs", studioMutedClass)}>{sources.length} sources gathered so far. This page updates on its own.</p>
        </section>
      ) : null}

      {sections && b ? (
        <>
          <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="m-0 font-display text-lg font-semibold text-[color:var(--c-ink)]">Review</h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} />
                Show flagged items only
              </label>
            </div>
            <p className={cn("m-0 text-sm", pending ? "text-[color:var(--c-accent)]" : studioMutedClass)}>
              {pending
                ? `${pending} flagged item${pending === 1 ? "" : "s"} need${pending === 1 ? "s" : ""} a decision before approval: keep or remove each one, editing as you go.`
                : "Every item has a decision. Edit anything you like, then approve below."}
            </p>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className={studioMutedClass}>Summary</span>
              <textarea rows={2} value={summary} disabled={locked} onChange={(e) => (setSummary(e.target.value), setDirty(true))} className={studioFieldInputClass} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className={studioMutedClass}>Snapshot</span>
              <textarea
                rows={4}
                value={sections.snapshot.text}
                disabled={locked}
                onChange={(e) => update((s) => void (s.snapshot.text = e.target.value))}
                className={studioFieldInputClass}
              />
              <SourceChips keys={sections.snapshot.sources} byKey={byKey} />
            </label>
          </section>

          {(["numbers", ...LIST_SECTIONS] as const).map((key) => {
            const all = (key === "numbers" ? sections.snapshot.numbers : sections[key]) as unknown as (ItemReview & Record<string, unknown>)[];
            if (key === "opportunities" && r.kind === "guide") return null;
            const shown = onlyFlagged ? all.filter((i) => i.decision === "pending" || (i.flags?.length ?? 0) > 0) : all;
            const title = key === "numbers" ? "Key numbers" : SECTION_META[key].title;
            return (
              <section key={key} className={cn(studioPanelClass, "flex flex-col gap-3")}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="m-0 font-display text-base font-semibold text-[color:var(--c-ink)]">{title}</h3>
                  <span className={cn("text-xs", studioMutedClass)}>
                    {all.filter((i) => i.decision !== "rejected").length} kept · {all.filter((i) => i.decision === "pending").length} to decide
                  </span>
                </div>
                {shown.length === 0 ? (
                  <p className={cn("m-0 text-sm", studioMutedClass)}>{onlyFlagged ? "Nothing flagged here." : "Nothing in this section."}</p>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {shown.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        fields={FIELDS[key]}
                        byKey={byKey}
                        locked={locked}
                        onChange={(field, value) =>
                          update((s) => {
                            const list = (key === "numbers" ? s.snapshot.numbers : s[key]) as unknown as Record<string, unknown>[];
                            const target = list.find((x) => x.id === item.id);
                            if (target) target[field] = field === "end" || field === "handle" || field === "reach" || field === "location" ? value || null : value;
                          })
                        }
                        onDecide={(d) =>
                          update((s) => {
                            const list = (key === "numbers" ? s.snapshot.numbers : s[key]) as unknown as ItemReview[];
                            const target = list.find((x) => x.id === item.id);
                            if (target) target.decision = d;
                          })
                        }
                      />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
            <h2 className="m-0 font-display text-lg font-semibold text-[color:var(--c-ink)]">Sign-off</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-sm">
                <span className={studioMutedClass}>Curator</span>
                <StudioSelect
                  aria-label="Curator"
                  value={curatorId}
                  onChange={(v) => (setCuratorId(v), setDirty(true))}
                  options={[{ value: "", label: "No curator assigned" }, ...curators.map((c) => ({ value: c.id, label: c.name }))]}
                />
              </div>
              <div className={cn("text-sm", studioMutedClass)}>
                {b.reviewedAt ? `Signed by ${b.reviewedBy ?? "an admin"} on ${formatAdminDate(b.reviewedAt)}.` : "Not signed yet."}
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className={studioMutedClass}>Local notes from the curator (shown to readers)</span>
              <textarea rows={4} value={notes} disabled={locked} onChange={(e) => (setNotes(e.target.value), setDirty(true))} className={studioFieldInputClass} />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!dirty || busy !== null || locked} onClick={() => void save()} className={cn(studioGhostButtonClass, "h-10 px-5 text-sm font-semibold")}>
                {busy === "save" ? "Saving…" : dirty ? "Save changes" : "Saved"}
              </button>
              <button
                type="button"
                disabled={pending > 0 || busy !== null || locked}
                onClick={() => void act("approve")}
                className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--c-accent)", color: "#1c1a17" }}
              >
                {busy === "approve" ? "Approving…" : b.reviewedAt ? "Approve again" : "Approve and sign"}
              </button>
            </div>
            {message ? <p className="m-0 text-sm text-[color:var(--c-ink)]">{message}</p> : null}
          </section>

          {share ? (
            <section className={cn(studioPanelClass, "flex flex-col gap-4")}>
              <h2 className="m-0 font-display text-lg font-semibold text-[color:var(--c-ink)]">Delivery</h2>
              <div className="flex flex-wrap gap-2">
                <a href={share.preview} target="_blank" rel="noopener noreferrer" className={cn(studioGhostButtonClass, "h-9 gap-1.5 px-4 text-sm font-semibold no-underline")}>
                  <ExternalLink className="h-4 w-4" aria-hidden /> {b.reviewedAt ? "Open the report" : "Preview the report"}
                </a>
                <a href={share.pdf} target="_blank" rel="noopener noreferrer" className={cn(studioGhostButtonClass, "h-9 px-4 text-sm font-semibold no-underline")}>
                  PDF
                </a>
                {b.reviewedAt ? (
                  <button type="button" onClick={() => void navigator.clipboard.writeText(share.url).then(() => setMessage("Share link copied."))} className={cn(studioGhostButtonClass, "h-9 gap-1.5 px-4 text-sm font-semibold")}>
                    <Copy className="h-4 w-4" aria-hidden /> Copy share link
                  </button>
                ) : null}
                {r.kind === "briefing" && b.reviewedAt ? (
                  <button
                    type="button"
                    disabled={!r.buyerEmail || busy !== null}
                    onClick={() => void act("deliver")}
                    title={r.buyerEmail ? `Email ${r.buyerEmail}` : "Add a buyer email to the request first"}
                    className={cn(studioGhostButtonClass, "h-9 px-4 text-sm font-semibold")}
                  >
                    {b.deliveredAt ? `Sent ${formatAdminDate(b.deliveredAt)}` : r.buyerEmail ? `Email to ${r.buyerEmail}` : "No buyer email"}
                  </button>
                ) : null}
                {b.reviewedAt ? (
                  <button type="button" disabled={busy !== null} onClick={() => void act(b.publishedAt ? "unpublish" : "publish")} className={cn(studioGhostButtonClass, "h-9 px-4 text-sm font-semibold")}>
                    {b.publishedAt ? "Unpublish public guide" : "Publish as public guide"}
                  </button>
                ) : null}
                {b.publishedAt ? (
                  <a href={`/destinations/${r.slug}/guide`} target="_blank" rel="noopener noreferrer" className={cn(studioGhostButtonClass, "h-9 gap-1.5 px-4 text-sm font-semibold no-underline")}>
                    <ExternalLink className="h-4 w-4" aria-hidden /> Public guide
                  </a>
                ) : null}
              </div>
              {!b.reviewedAt ? <p className={cn("m-0 text-xs", studioMutedClass)}>The share link and public guide unlock once the briefing is approved. The preview is visible to admins only.</p> : null}
              {stats && b.reviewedAt ? (
                <p className={cn("m-0 text-sm", studioMutedClass)}>
                  {stats.sessions
                    ? `${stats.sessions} view${stats.sessions === 1 ? "" : "s"} by ${stats.visitors} visitor${stats.visitors === 1 ? "" : "s"} · ${stats.avgSeconds}s average · ${stats.avgScroll}% average read depth · ${stats.pdfDownloads} PDF download${stats.pdfDownloads === 1 ? "" : "s"}${stats.lastViewedAt ? ` · last viewed ${formatAdminDate(stats.lastViewedAt)}` : ""}`
                    : "No views yet."}
                </p>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
