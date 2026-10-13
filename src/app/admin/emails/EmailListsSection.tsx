"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { DeleteIconButton, EmptyNote, Notice, formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import { StudioCulturinListSection, studioCreateButtonClass } from "@/app/admin/_components/StudioCulturinListKit";
import { studioFieldInputClass, studioGhostButtonClass } from "@/app/admin/_lib/studioTheme";
import type { EmailList } from "@/lib/email/lists";
import { parseGuestCsv as parseGuests } from "@/lib/email/lumaGuests";
import { cn } from "@/lib/utils";

type Filter = "approved" | "checked_in" | "all";

function listNameFromFile(fileName: string): string {
  return fileName
    .replace(/\.csv$/i, "")
    .replace(/\s*-\s*guests?\b.*$/i, "")
    .trim();
}

function ImportPanel({ lists, onDone, onCancel }: { lists: EmailList[]; onDone: (message: string) => void; onCancel: () => void }) {
  const [target, setTarget] = useState<string>("new");
  const [name, setName] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseGuests> | null>(null);
  const [filter, setFilter] = useState<Filter>("approved");
  const [addToNewsletter, setAddToNewsletter] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const g = parsed?.guests ?? [];
    return { all: g.length, approved: g.filter((x) => x.approved).length, checked_in: g.filter((x) => x.checkedIn).length };
  }, [parsed]);
  const selected = useMemo(
    () => (parsed?.guests ?? []).filter((g) => (filter === "all" ? true : filter === "approved" ? g.approved : g.checkedIn)),
    [parsed, filter],
  );

  async function onFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    const result = parseGuests(await file.text());
    if (result.guests.length === 0) {
      setParsed(null);
      return setError("Couldn't find an email column in that file.");
    }
    setParsed(result);
    setFilter(result.hasStatus ? "approved" : "all");
    if (!name) setName(listNameFromFile(file.name));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/email-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listId: target === "new" ? undefined : target,
        name,
        addToNewsletter,
        members: selected.map(({ email, firstName, lastName, company, raw }) => ({ email, firstName, lastName, company, raw })),
      }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as
      | { added?: number; skipped?: number; newsletter?: { added: number; updated: number }; message?: string }
      | undefined;
    setBusy(false);
    if (!res?.ok) return setError(data?.message ?? "Couldn't import the list.");
    const nl = data?.newsletter ? ` ${data.newsletter.added} new on the mailing list, ${data.newsletter.updated} existing subscribers updated.` : "";
    onDone(`Imported ${data?.added?.toLocaleString() ?? 0} guests${data?.skipped ? ` (${data.skipped} without a valid email left out)` : ""}.${nl}`);
  }

  const options: { id: Filter; label: string; show: boolean }[] = [
    { id: "approved", label: `Approved guests (${counts.approved})`, show: Boolean(parsed?.hasStatus) },
    { id: "checked_in", label: `Only people who checked in (${counts.checked_in})`, show: Boolean(parsed?.hasCheckIn) },
    { id: "all", label: `Everyone in the file (${counts.all})`, show: true },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[color:var(--c-rule)] p-4">
      <p className="m-0 text-sm text-[color:var(--c-muted)]">
        In Luma, open the event, go to Guests and choose Download as CSV. Role, company, LinkedIn and how they heard about the event are kept with each guest.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Add to</span>
          <select className={studioFieldInputClass} value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="new">A new list</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        {target === "new" ? (
          <label className="flex flex-col gap-2">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">List name</span>
            <input className={studioFieldInputClass} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="MIPCOM 2026: Welcome to Cannes" />
          </label>
        ) : null}
      </div>
      <input type="file" accept=".csv,text/csv" onChange={(e) => void onFile(e.target.files?.[0])} className="text-sm text-[color:var(--c-ink)]" />
      {parsed ? (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Who to include</legend>
          {options
            .filter((o) => o.show)
            .map((o) => (
              <label key={o.id} className="flex items-center gap-2.5 text-sm text-[color:var(--c-ink)]">
                <input type="radio" name="guest-filter" checked={filter === o.id} onChange={() => setFilter(o.id)} className="h-4 w-4 accent-[color:var(--c-accent)]" />
                {o.label}
              </label>
            ))}
          {parsed.hasCheckIn && counts.checked_in === 0 ? (
            <p className="m-0 text-xs text-[color:var(--c-muted)]">Nobody was checked in on Luma, so use approved guests instead.</p>
          ) : null}
        </fieldset>
      ) : null}
      {parsed ? (
        <label className="flex items-start gap-2.5 text-sm text-[color:var(--c-ink)]">
          <input
            type="checkbox"
            checked={addToNewsletter}
            onChange={(e) => setAddToNewsletter(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[color:var(--c-accent)]"
          />
          <span>
            Also add them to the mailing list
            <span className="block text-xs text-[color:var(--c-muted)]">
              Only if they agreed to hear from Culturin. Anyone who has unsubscribed stays unsubscribed.
            </span>
          </span>
        </label>
      ) : null}
      {error ? <Notice tone="error">{error}</Notice> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy || selected.length === 0 || (target === "new" && !name.trim())}
          className={studioCreateButtonClass}
        >
          {busy ? "Importing…" : `Import ${selected.length.toLocaleString()} ${selected.length === 1 ? "guest" : "guests"}`}
        </button>
        <button type="button" onClick={onCancel} className={cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function EmailListsSection({ ready, lists }: { ready: boolean; lists: EmailList[] }) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  async function remove(l: EmailList) {
    const ok = await confirm({
      title: `Delete "${l.name}"?`,
      description: "This removes the list and its guests from Culturin. It doesn't affect the newsletter.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const res = await fetch("/api/admin/email-lists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: l.id }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    if (!res?.ok) return setNotice({ tone: "error", text: data?.message ?? "Couldn't delete that list." });
    router.refresh();
  }

  if (!ready) {
    return (
      <StudioCulturinListSection title="Event lists" countLabel="Setup needed">
        <Notice tone="info">
          To email an event&apos;s guests, run <code>supabase/migrations/049_email_lists.sql</code> in the Supabase SQL editor, then reload this page.
        </Notice>
      </StudioCulturinListSection>
    );
  }

  const toolbar = importing ? (
    <ImportPanel
      lists={lists}
      onCancel={() => setImporting(false)}
      onDone={(text) => {
        setImporting(false);
        setNotice({ tone: "info", text: `${text} Pick this list as the audience on an email to send to them.` });
        router.refresh();
      }}
    />
  ) : (
    <button type="button" onClick={() => setImporting(true)} className={studioCreateButtonClass}>
      Import guest list
    </button>
  );

  return (
    <StudioCulturinListSection title="Event lists" countLabel={`${lists.length} ${lists.length === 1 ? "list" : "lists"}`} toolbar={toolbar}>
      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
      {lists.length === 0 ? (
        <EmptyNote>No event lists yet. Import a Luma guest export to email just that event&apos;s guests.</EmptyNote>
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-[color:var(--c-rule)] rounded-xl border border-[color:var(--c-rule)] p-0">
          {lists.map((l) => (
            <li key={l.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate font-medium text-[color:var(--c-ink)]">{l.name}</p>
                <p className="m-0 mt-0.5 truncate text-xs text-[color:var(--c-muted)]">
                  {l.memberCount.toLocaleString()} {l.memberCount === 1 ? "guest" : "guests"}
                  {l.sendable < l.memberCount ? ` · ${l.sendable.toLocaleString()} can be emailed` : ""} · Imported {formatAdminDate(l.createdAt)}
                </p>
              </div>
              <DeleteIconButton label={`Delete ${l.name}`} onClick={() => void remove(l)} />
            </li>
          ))}
        </ul>
      )}
    </StudioCulturinListSection>
  );
}
