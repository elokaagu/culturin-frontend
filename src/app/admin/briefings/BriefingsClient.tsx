"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { studioCancelButtonClass, studioCreateButtonClass, studioCreateFormShellClass } from "@/app/admin/_components/StudioCulturinListKit";
import { StudioSelect } from "@/app/admin/_components/StudioSelect";
import { studioFieldInputClass, studioMutedClass, studioPanelClass } from "@/app/admin/_lib/studioTheme";
import type { BriefingKind, Confidence, RequestStatus } from "@/lib/briefings/types";
import { cn } from "@/lib/utils";

export type BriefingRow = {
  id: string;
  kind: BriefingKind;
  place: string;
  country: string;
  audience: string;
  status: RequestStatus;
  error: string | null;
  costUsd: number;
  createdAt: string;
  confidence: Confidence | null;
  reviewedAt: string | null;
  publishedAt: string | null;
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  queued: "Queued",
  researching: "Researching",
  writing: "Writing",
  checking: "Checking",
  in_review: "In review",
  approved: "Approved",
  delivered: "Delivered",
  failed: "Failed",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const tone =
    status === "failed"
      ? "border-rose-500/40 text-rose-500"
      : status === "in_review"
        ? "border-[color:var(--c-accent)] text-[color:var(--c-accent)]"
        : status === "approved" || status === "delivered"
          ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          : "border-[color:var(--c-rule)] text-[color:var(--c-muted)]";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold", tone)}>{STATUS_LABELS[status]}</span>;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Input({ label, name, required, placeholder, type = "text", defaultValue }: { label: string; name: string; required?: boolean; placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className={cn("font-medium", studioMutedClass)}>{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className={studioFieldInputClass} />
    </label>
  );
}

function IntakeForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [kind, setKind] = useState<BriefingKind>("briefing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  const yearOn = new Date(today);
  yearOn.setFullYear(yearOn.getFullYear() + 1);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const body = { ...Object.fromEntries(new FormData(e.currentTarget).entries()), kind };
    const res = await fetch("/api/admin/briefings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !data.id) {
      setBusy(false);
      setError(data.message ?? "Couldn't start the briefing.");
      return;
    }
    router.push(`/admin/briefings/${data.id}`);
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className={cn("font-medium", studioMutedClass)}>What are we making?</span>
        <StudioSelect
          aria-label="Output"
          value={kind}
          onChange={(v) => setKind(v === "guide" ? "guide" : "briefing")}
          options={[
            { value: "briefing", label: "Professional briefing: sourced, with opportunities, shared by link" },
            { value: "guide", label: "Public city guide: free, published on the site" },
          ]}
        />
      </div>
      <Input label="City" name="place" required placeholder="Cape Town" />
      <Input label="Country" name="country" required placeholder="South Africa" />
      <Input label="Audience" name="audience" placeholder="London lifestyle and travel brands" />
      <Input label="Category" name="category" placeholder="Lifestyle and travel" />
      {kind === "briefing" ? (
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className={cn("font-medium", studioMutedClass)}>Buyer&apos;s objective</span>
          <textarea name="objective" required rows={2} placeholder="Plan a first cultural moment in the city" className={studioFieldInputClass} />
        </label>
      ) : null}
      <Input label="Timeframe starts" name="timeframeStart" type="date" required defaultValue={isoDate(today)} />
      <Input label="Timeframe ends" name="timeframeEnd" type="date" required defaultValue={isoDate(yearOn)} />
      {kind === "briefing" ? (
        <>
          <Input label="Buyer name" name="buyerName" />
          <Input label="Buyer email" name="buyerEmail" type="email" />
          <Input label="Buyer company" name="buyerCompany" />
        </>
      ) : null}
      {error ? <p className="m-0 text-sm text-rose-500 sm:col-span-2">{error}</p> : null}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className={studioCreateButtonClass}>
          {busy ? "Starting…" : "Start research"}
        </button>
        <button type="button" onClick={onCancel} className={studioCancelButtonClass}>
          Cancel
        </button>
      </div>
      <p className={cn("m-0 text-xs sm:col-span-2", studioMutedClass)}>
        Research, writing and checking take five to ten minutes. You can leave the page: it carries on in the background.
      </p>
    </form>
  );
}

export function BriefingsClient({ rows }: { rows: BriefingRow[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mt-6">
        {open ? (
          <div className={studioCreateFormShellClass}>
            <IntakeForm onCancel={() => setOpen(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className={studioCreateButtonClass}>
            New guide or briefing
          </button>
        )}
      </div>

      <section className={cn(studioPanelClass, "mt-8 !p-0 overflow-hidden")}>
        {rows.length === 0 ? (
          <p className={cn("m-0 p-6 text-sm", studioMutedClass)}>Nothing yet. Start one above.</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-[color:var(--c-rule)] p-0">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/briefings/${r.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 no-underline transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--c-accent)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-display text-base font-semibold text-[color:var(--c-ink)]">
                      {r.place}, {r.country}
                    </p>
                    <p className={cn("m-0 mt-0.5 truncate text-xs", studioMutedClass)}>
                      {r.kind === "guide" ? "Public guide" : "Professional briefing"}
                      {r.audience ? ` · ${r.audience}` : ""} · {formatAdminDate(r.createdAt)}
                    </p>
                  </div>
                  {r.publishedAt ? <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Published</span> : null}
                  {r.confidence ? <span className={cn("text-xs", studioMutedClass)}>{r.confidence} confidence</span> : null}
                  <span className={cn("text-xs tabular-nums", studioMutedClass)}>${r.costUsd.toFixed(2)}</span>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
