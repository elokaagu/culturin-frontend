import type { Metadata } from "next";

import { getLatestBriefing } from "@/lib/studio/audienceBriefing";

import { IntelligenceClient } from "./IntelligenceClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Intelligence",
  description: "An AI-written briefing on who is in the Culturin audience.",
};

export default async function StudioIntelligencePage() {
  const briefing = await getLatestBriefing();
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Intelligence</h1>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--c-muted)]">
        An AI-written briefing on who is in your audience: the segments, industries, people and companies that stand out, and what to do next.
        Names, roles and companies are shared with OpenAI to write it. Email addresses never are.
      </p>
      <IntelligenceClient initial={briefing} />
    </div>
  );
}
