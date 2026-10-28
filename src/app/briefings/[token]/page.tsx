import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomeFooter from "@/app/components/HomeFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { formatDateRange } from "@/lib/briefings/output";
import { briefingsDb, getBriefingByToken } from "@/lib/briefings/store";
import { getCurrentAdminState } from "@/lib/studio/admin";
import {
  ACCENT_ON_DARK,
  EDITORIAL_BG,
  EDITORIAL_INK,
  ON_DARK_MUTED,
  ON_DARK_TEXT,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";

import { BriefingReport } from "../BriefingReport";
import { ViewTracker } from "./ViewTracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Culturin briefing",
  // Shared privately by link.
  robots: { index: false, follow: false },
};

const DISPLAY = "var(--font-display), 'Times New Roman', serif";

export default async function BriefingSharePage({ params }: { params: { token: string } }) {
  const found = await getBriefingByToken(params.token).catch(() => null);
  if (!found) notFound();
  const { briefing: b, request: r, sources } = found;
  const preview = !b.reviewedAt;
  if (preview && !(await getCurrentAdminState()).isAdmin) notFound();

  const { data: curator } = b.curatorId
    ? await briefingsDb().from("cms_curators").select("name").eq("id", b.curatorId).maybeSingle()
    : { data: null };
  const professional = r.kind === "briefing";
  const reviewed = b.reviewedAt ? new Date(b.reviewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <SiteHeader />
      {preview ? null : <ViewTracker token={params.token} />}
      <main className="px-3 pb-3 pt-[5.25rem] sm:px-4 sm:pt-24">
        <header className="rounded-3xl px-6 py-14 sm:px-14 sm:py-20" style={{ background: SURFACE_DARK, color: ON_DARK_TEXT }}>
          {preview ? (
            <p className="m-0 mb-6 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}>
              Preview: not yet approved
            </p>
          ) : null}
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ON_DARK_MUTED }}>
            {professional ? "Culturin briefing" : "Culturin guide"}
          </p>
          <h1 className="m-0 mt-4 text-5xl font-medium leading-[1.04] sm:text-7xl" style={{ fontFamily: DISPLAY }}>
            {r.place}, {r.country}
          </h1>
          {b.summary ? (
            <p className="mt-6 max-w-2xl text-base leading-loose sm:text-lg" style={{ color: ON_DARK_MUTED }}>
              {b.summary}
            </p>
          ) : null}
          <dl className="m-0 mt-10 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2" style={{ color: ON_DARK_MUTED }}>
            {r.buyerCompany ? (
              <div>
                <dt className="inline">Prepared for </dt>
                <dd className="inline" style={{ color: ON_DARK_TEXT }}>{r.buyerCompany}</dd>
              </div>
            ) : null}
            {professional && r.audience ? (
              <div>
                <dt className="inline">Audience: </dt>
                <dd className="inline" style={{ color: ON_DARK_TEXT }}>{r.audience}</dd>
              </div>
            ) : null}
            {professional && r.objective ? (
              <div>
                <dt className="inline">Objective: </dt>
                <dd className="inline" style={{ color: ON_DARK_TEXT }}>{r.objective}</dd>
              </div>
            ) : null}
            <div>
              <dt className="inline">Timeframe: </dt>
              <dd className="inline" style={{ color: ON_DARK_TEXT }}>{formatDateRange(r.timeframeStart, r.timeframeEnd)}</dd>
            </div>
            {reviewed ? (
              <div>
                <dt className="inline">Checked by </dt>
                <dd className="inline" style={{ color: ON_DARK_TEXT }}>
                  {curator?.name ? `${curator.name} for Culturin` : "Culturin"} on {reviewed}
                </dd>
              </div>
            ) : null}
          </dl>
          <a
            href={`/api/briefings/${params.token}/pdf`}
            data-briefing-pdf
            className="mt-10 inline-flex items-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
            style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
          >
            Download the PDF
          </a>
        </header>
        <div className="mx-auto max-w-5xl px-4 sm:px-10">
          <BriefingReport
            sections={b.sections}
            sources={sources}
            audience={professional ? "professional" : "guide"}
            localNotes={b.localNotes}
            curatorName={(curator?.name as string | undefined) ?? null}
          />
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
