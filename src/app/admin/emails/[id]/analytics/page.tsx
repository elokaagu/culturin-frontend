import type { Metadata } from "next";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

import { formatAdminDate } from "@/app/admin/_lib/formatAdminDate";
import { studioGhostButtonClass } from "@/app/admin/_lib/studioTheme";
import { getBroadcast, getBroadcastStats, getSendProgress } from "@/lib/email/broadcasts";
import { cn } from "@/lib/utils";

import { BroadcastStatsPanel } from "../BroadcastStatsPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Email analytics" };

export default async function StudioEmailAnalyticsPage({ params }: { params: { id: string } }) {
  const broadcast = await getBroadcast(params.id);
  if (!broadcast) notFound();
  const [progress, stats] = await Promise.all([getSendProgress(params.id), getBroadcastStats(params.id)]);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <Link
        href="/admin/emails"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--c-muted)] no-underline hover:text-[color:var(--c-ink)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All emails
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Analytics</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
            {broadcast.subject || "Untitled email"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--c-muted)]">
            {progress.sent.toLocaleString()} of {progress.total.toLocaleString()} sent
            {broadcast.sentAt ? `, starting ${formatAdminDate(broadcast.sentAt)}` : ""}
            {broadcast.sentBy ? ` by ${broadcast.sentBy}` : ""}. Pulled live from Resend&apos;s delivery events.
          </p>
        </div>
        <Link href={`/admin/emails/${broadcast.id}`} className={cn(studioGhostButtonClass, "gap-1.5 px-4 py-2 text-sm font-semibold no-underline")}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          {progress.sent > 0 ? "View email" : "Edit email"}
        </Link>
      </div>

      <BroadcastStatsPanel stats={stats} subject={broadcast.subject} />
    </div>
  );
}
