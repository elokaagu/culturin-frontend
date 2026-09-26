"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DeleteIconButton, EmptyNote, Notice, formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import { StudioCulturinListSection, studioCreateButtonClass } from "@/app/admin/_components/StudioCulturinListKit";
import type { Broadcast } from "@/lib/email/broadcasts";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Broadcast["status"], string> = { draft: "Draft", sending: "Sending…", sent: "Sent", failed: "Failed" };

export function StudioEmailsPageClient({ tableReady, initial }: { tableReady: boolean; initial: Broadcast[] }) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const [items, setItems] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function create() {
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create" }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { id?: string; message?: string } | undefined;
    setCreating(false);
    if (!res?.ok || !data?.id) return setError(data?.message ?? "Couldn't create the email.");
    router.push(`/admin/emails/${data.id}`);
  }

  async function remove(b: Broadcast) {
    const ok = await confirm({
      title: `Delete "${b.subject || "Untitled email"}"?`,
      description: b.status === "sent" ? "This removes the record of the send. It doesn't unsend anything." : "This permanently deletes the draft.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const res = await fetch("/api/admin/broadcasts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [b.id] }),
    }).catch(() => null);
    if (!res?.ok) return setError("Couldn't delete that email.");
    setItems((prev) => prev.filter((x) => x.id !== b.id));
  }

  if (!tableReady) {
    return (
      <Notice tone="info">
        Emails need a one-off database update. In Supabase, open the SQL editor and run{" "}
        <code>supabase/migrations/044_email_broadcasts.sql</code>, then reload this page. It also adds your first draft.
      </Notice>
    );
  }

  const toolbar = (
    <button type="button" onClick={create} disabled={creating} className={studioCreateButtonClass}>
      {creating ? "Creating…" : "New email"}
    </button>
  );

  return (
    <>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <StudioCulturinListSection title="All emails" countLabel={`${items.length} ${items.length === 1 ? "email" : "emails"}`} toolbar={toolbar}>
        {items.length === 0 ? (
          <EmptyNote>No emails yet. Start one with “New email”.</EmptyNote>
        ) : (
          <ul className="m-0 flex list-none flex-col divide-y divide-[color:var(--c-rule)] rounded-xl border border-[color:var(--c-rule)] p-0">
            {items.map((b) => (
              <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                <Link href={`/admin/emails/${b.id}`} className="min-w-0 flex-1 no-underline">
                  <p className="m-0 truncate font-medium text-[color:var(--c-ink)]">{b.subject || "Untitled email"}</p>
                  <p className="m-0 mt-0.5 truncate text-xs text-[color:var(--c-muted)]">
                    {b.status === "sent" || b.status === "failed"
                      ? `Sent ${b.sentAt ? formatAdminDate(b.sentAt) : ""} to ${b.sentCount.toLocaleString()}${b.failedCount ? ` · ${b.failedCount} failed` : ""}`
                      : `Edited ${formatAdminDate(b.updatedAt)}`}
                  </p>
                </Link>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold",
                    b.status === "sent"
                      ? "border-emerald-500/40 text-emerald-500"
                      : b.status === "failed"
                        ? "border-rose-500/40 text-rose-500"
                        : "border-[color:var(--c-rule)] text-[color:var(--c-muted)]",
                  )}
                >
                  {STATUS_LABEL[b.status]}
                </span>
                {b.status !== "sending" ? <DeleteIconButton label={`Delete ${b.subject || "email"}`} onClick={() => void remove(b)} /> : null}
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
