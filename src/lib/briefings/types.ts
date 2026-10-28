import { z } from "zod";

/** Everything a briefing says comes from one of these sources, cited by key ("S12"). */
export type SourceKind = "web" | "news" | "social" | "calendar" | "first_party";

export type BriefingSource = {
  key: string;
  url: string | null;
  title: string | null;
  publisher: string | null;
  publishedDate: string | null;
  excerpt: string | null;
  kind: SourceKind;
  meta: Record<string, unknown>;
};

export type RequestStatus = "queued" | "researching" | "writing" | "checking" | "in_review" | "approved" | "delivered" | "failed";
export const PIPELINE_STATUSES: RequestStatus[] = ["queued", "researching", "writing", "checking"];

export type BriefingKind = "guide" | "briefing";

export type BriefingRequest = {
  id: string;
  kind: BriefingKind;
  place: string;
  country: string;
  countryCode: string | null;
  slug: string;
  audience: string;
  objective: string;
  category: string;
  timeframeStart: string;
  timeframeEnd: string;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerCompany: string | null;
  status: RequestStatus;
  progress: Progress;
  cost: RunCost;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StepName = "research_web" | "research_calendar" | "research_social" | "research_first_party" | "write" | "check";

export type StepRecord = { done: boolean; startedAt?: string; finishedAt?: string; note?: string; attempts?: number };

export type Progress = {
  steps?: Partial<Record<StepName, StepRecord>>;
  /** Research evidence the writer reads: long page text kept per source key. */
  pages?: Record<string, string>;
  /** Draft sections between the write and check steps. */
  draft?: BriefingSections;
  draftSummary?: string;
};

export type RunCost = { exa?: number; apify?: number; llm?: number; total?: number; llmInputTokens?: number; llmOutputTokens?: number };

// ── Sections ────────────────────────────────────────

export type Confidence = "high" | "medium" | "low";
export type Decision = "pending" | "accepted" | "rejected";

/** Review state the checking pass and the reviewer add to every item. */
export type ItemReview = {
  id: string;
  sources: string[];
  confidence?: Confidence;
  flags?: string[];
  decision?: Decision;
};

export type NamedItem = ItemReview & { name: string; detail: string };
export type SnapshotNumber = ItemReview & { label: string; value: string };
export type Influencer = ItemReview & {
  name: string;
  platform: string;
  handle: string | null;
  reach: string | null;
  why: string;
  verified?: boolean;
  followers?: number | null;
};
export type CalendarMoment = ItemReview & {
  name: string;
  start: string;
  end: string | null;
  category: string;
  location: string | null;
  detail: string;
};
export type Sensitivity = ItemReview & { title: string; detail: string };
export type Opportunity = ItemReview & { title: string; idea: string; why: string };

export type BriefingSections = {
  snapshot: { text: string; sources: string[]; numbers: SnapshotNumber[] };
  food: NamedItem[];
  history: NamedItem[];
  musicArt: NamedItem[];
  neighbourhoods: NamedItem[];
  influencers: Influencer[];
  calendar: CalendarMoment[];
  sensitivities: Sensitivity[];
  opportunities: Opportunity[];
  /** Checker notes on the summary and snapshot, which aren't list items. */
  notes?: string[];
};

export type ListSectionKey = Exclude<keyof BriefingSections, "snapshot" | "notes">;

export type SectionKey = Exclude<keyof BriefingSections, "notes">;

export const SECTION_META: Record<SectionKey, { title: string; eyebrow: string; inGuide: boolean }> = {
  snapshot: { title: "Snapshot", eyebrow: "The place", inGuide: true },
  food: { title: "Food", eyebrow: "What to eat", inGuide: true },
  history: { title: "History", eyebrow: "The stories behind it", inGuide: true },
  musicArt: { title: "Music and art", eyebrow: "Scenes and sounds", inGuide: true },
  neighbourhoods: { title: "Neighbourhoods", eyebrow: "Where culture lives", inGuide: true },
  influencers: { title: "Who influences it", eyebrow: "People to know", inGuide: true },
  calendar: { title: "Moments calendar", eyebrow: "The next 12 months", inGuide: true },
  sensitivities: { title: "Sensitivities", eyebrow: "What to get right", inGuide: false },
  opportunities: { title: "Opportunities", eyebrow: "Ideas for your objective", inGuide: false },
};

export const LIST_SECTIONS: ListSectionKey[] = ["food", "history", "musicArt", "neighbourhoods", "influencers", "calendar", "sensitivities", "opportunities"];

export const EMPTY_SECTIONS: BriefingSections = {
  snapshot: { text: "", sources: [], numbers: [] },
  food: [],
  history: [],
  musicArt: [],
  neighbourhoods: [],
  influencers: [],
  calendar: [],
  sensitivities: [],
  opportunities: [],
};

// ── Writer output schemas (what the model must return) ─────

const sources = z.array(z.string()).describe("Source keys from the evidence, e.g. [\"S3\", \"S7\"]. At least one per item.");
const named = z.object({ name: z.string(), detail: z.string().describe("Two or three sentences."), sources });

export const guideDraftSchema = z.object({
  snapshot: z.object({
    text: z.string().describe("One paragraph on the place and what makes its culture distinct."),
    sources,
    numbers: z.array(z.object({ label: z.string(), value: z.string(), sources })).describe("Three to five key numbers, each sourced."),
  }),
  food: z.array(named).describe("Five to eight dishes, traditions, places or people that define the food culture."),
  history: z.array(named).describe("Four to six stories that explain the place today."),
  musicArt: z.array(named).describe("Five to eight scenes, venues, artists and sounds."),
  neighbourhoods: z.array(named).describe("Five to eight neighbourhoods where culture lives, a line or two on each."),
  influencers: z
    .array(
      z.object({
        name: z.string(),
        platform: z.string().describe("instagram, tiktok, media, venue, community or web"),
        handle: z.string().nullable().describe("Only a handle that appears in the evidence, without @. Null if none."),
        reach: z.string().nullable().describe("Approximate reach from the evidence, e.g. \"48k Instagram followers\". Null if unknown."),
        why: z.string(),
        sources,
      }),
    )
    .describe("Six to ten creators, media, communities, venues and tastemakers."),
});

export const briefingDraftSchema = z.object({
  summary: z.string().describe("Two sentences summing up the briefing for the buyer."),
  calendar: z
    .array(
      z.object({
        name: z.string(),
        start: z.string().describe("YYYY-MM-DD"),
        end: z.string().nullable().describe("YYYY-MM-DD, or null for one-day moments"),
        category: z.string().describe("holiday, festival, sport, music, fashion, art, food or industry"),
        location: z.string().nullable(),
        detail: z.string(),
        sources,
      }),
    )
    .describe("Twelve to twenty moments inside the timeframe, in date order."),
  sensitivities: z.array(z.object({ title: z.string(), detail: z.string(), sources })).describe("Four to six things to get right or avoid."),
  opportunities: z
    .array(z.object({ title: z.string(), idea: z.string(), why: z.string().describe("Why it fits the objective and audience."), sources }))
    .describe("Three to five ideas tied to the buyer's objective. Empty for public guides."),
});

export type GuideDraft = z.infer<typeof guideDraftSchema>;
export type BriefingDraft = z.infer<typeof briefingDraftSchema>;
