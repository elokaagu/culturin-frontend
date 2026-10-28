import "server-only";

import { briefingsDb, toRequest } from "./store";
import type { BriefingKind, BriefingRequest } from "./types";

export type IntakeInput = {
  kind: BriefingKind;
  place: string;
  country: string;
  audience?: string;
  objective?: string;
  category?: string;
  timeframeStart: string;
  timeframeEnd: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerCompany?: string;
};

/** "Cape Town" → "cape-town", matching the slugs in lib/destinationsData. */
export function placeSlug(place: string): string {
  return place
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateIntake(body: Record<string, unknown>): { ok: true; input: IntakeInput } | { ok: false; message: string } {
  const s = (k: string, max = 300) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const kind = body.kind === "guide" ? "guide" : "briefing";
  const input: IntakeInput = {
    kind,
    place: s("place", 120),
    country: s("country", 120),
    audience: s("audience", 400),
    objective: s("objective", 600),
    category: s("category", 120),
    timeframeStart: s("timeframeStart", 10),
    timeframeEnd: s("timeframeEnd", 10),
    buyerName: s("buyerName", 120),
    buyerEmail: s("buyerEmail", 200).toLowerCase(),
    buyerCompany: s("buyerCompany", 160),
  };
  if (!input.place || !input.country) return { ok: false, message: "Add the place and its country." };
  if (!isDate(input.timeframeStart) || !isDate(input.timeframeEnd)) return { ok: false, message: "Add a start and end date for the timeframe." };
  if (input.timeframeEnd < input.timeframeStart) return { ok: false, message: "The timeframe ends before it starts." };
  if (kind === "briefing" && !input.objective) return { ok: false, message: "A professional briefing needs the buyer's objective." };
  if (input.buyerEmail && !EMAIL_RE.test(input.buyerEmail)) return { ok: false, message: "That buyer email doesn't look right." };
  return { ok: true, input };
}

export async function createRequest(input: IntakeInput, createdBy: string | null): Promise<BriefingRequest> {
  const { data, error } = await briefingsDb()
    .from("briefing_requests")
    .insert({
      kind: input.kind,
      place: input.place,
      country: input.country,
      slug: placeSlug(input.place),
      audience: input.audience ?? "",
      objective: input.objective ?? "",
      category: input.category ?? "",
      timeframe_start: input.timeframeStart,
      timeframe_end: input.timeframeEnd,
      buyer_name: input.buyerName || null,
      buyer_email: input.buyerEmail || null,
      buyer_company: input.buyerCompany || null,
      created_by: createdBy,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Couldn't create the request: ${error?.message ?? "unknown error"}`);
  return toRequest(data);
}
