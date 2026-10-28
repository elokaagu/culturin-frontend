import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

import { STEPS } from "@/lib/briefings/pipeline";
import { shareUrl, viewStats } from "@/lib/briefings/review";
import { briefingsDb, getRequest, getSources, latestBriefing } from "@/lib/briefings/store";

import { BriefingReviewClient } from "./BriefingReviewClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Review briefing" };

export default async function StudioBriefingPage({ params }: { params: { id: string } }) {
  const request = await getRequest(params.id);
  if (!request) notFound();
  const [briefing, sources, { data: curators }] = await Promise.all([
    latestBriefing(request.id),
    getSources(request.id),
    briefingsDb().from("cms_curators").select("id, name").order("name"),
  ]);
  const stats = briefing ? await viewStats(briefing.id) : null;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <Link
        href="/admin/briefings"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--c-muted)] no-underline hover:text-[color:var(--c-ink)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All guides and briefings
      </Link>
      <BriefingReviewClient
        request={request}
        briefing={briefing}
        sources={sources}
        curators={(curators ?? []).map((c) => ({ id: String(c.id), name: String(c.name || "Unnamed curator") }))}
        steps={STEPS.map((s) => ({ name: s.name, label: s.label }))}
        share={briefing ? { url: shareUrl(briefing), pdf: `/api/briefings/${briefing.shareToken}/pdf`, preview: `/briefings/${briefing.shareToken}` } : null}
        stats={stats}
      />
    </div>
  );
}
