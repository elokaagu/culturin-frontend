import "server-only";

import { checkBriefing } from "./check";
import { researchCalendar, researchFirstParty, researchSocial, researchWeb } from "./research";
import { briefingsDb, getRequest, toRequest, updateRequest } from "./store";
import { PIPELINE_STATUSES, type BriefingRequest, type RequestStatus, type StepName } from "./types";
import { writeBriefing } from "./write";

/**
 * The briefing pipeline as resumable steps. Each step saves its output and is marked done, so a
 * retry (from the cron runner, the admin page or a redeploy) starts at the first unfinished step
 * and never repeats paid work.
 */
type Step = {
  name: StepName;
  status: RequestStatus;
  label: string;
  /** Time the step needs; it isn't started with less than this left in the invocation. */
  minMs: number;
  run: (r: BriefingRequest, deadline: number) => Promise<string>;
};

export const STEPS: Step[] = [
  { name: "research_web", status: "researching", label: "Web and news research", minMs: 90_000, run: (r) => researchWeb(r) },
  { name: "research_calendar", status: "researching", label: "Moments calendar research", minMs: 60_000, run: (r) => researchCalendar(r) },
  { name: "research_social", status: "researching", label: "Social research", minMs: 150_000, run: (r, d) => researchSocial(r, d) },
  { name: "research_first_party", status: "researching", label: "Culturin audience signals", minMs: 30_000, run: (r) => researchFirstParty(r) },
  { name: "write", status: "writing", label: "Writing", minMs: 240_000, run: (r) => writeBriefing(r) },
  { name: "check", status: "checking", label: "Checking", minMs: 200_000, run: (r, d) => checkBriefing(r, d) },
];

const MAX_ATTEMPTS = 3;
/** How long one step may hold a request before another runner may take over. */
const LEASE_MS = 6 * 60_000;
const MIN_STEP_MS = Math.min(...STEPS.map((s) => s.minMs));

/** Takes the lease if nobody holds it; returns the fresh request, or null if it's busy or finished. */
async function claim(id: string): Promise<BriefingRequest | null> {
  const now = new Date();
  const { data } = await briefingsDb()
    .from("briefing_requests")
    .update({ lease_until: new Date(now.getTime() + LEASE_MS).toISOString() })
    .eq("id", id)
    .in("status", PIPELINE_STATUSES)
    .or(`lease_until.is.null,lease_until.lt.${now.toISOString()}`)
    .select("*")
    .maybeSingle();
  return data ? toRequest(data) : null;
}

async function markStep(id: string, name: StepName, patch: { done?: boolean; note?: string; startedAt?: string; finishedAt?: string; attempts?: number }) {
  const fresh = await getRequest(id);
  if (!fresh) return;
  const steps = { ...(fresh.progress.steps ?? {}) };
  steps[name] = { done: false, ...steps[name], ...patch };
  await updateRequest(id, { progress: { ...fresh.progress, steps } });
}

export function nextStep(r: BriefingRequest): Step | null {
  return STEPS.find((s) => !r.progress.steps?.[s.name]?.done) ?? null;
}

/** Runs the next unfinished step of one request. Returns false when there's nothing (more) to do now. */
async function runOneStep(id: string, deadline: number): Promise<boolean> {
  const peek = await getRequest(id);
  const upcoming = peek ? nextStep(peek) : null;
  if (upcoming && deadline - Date.now() < upcoming.minMs) return false;
  const r = await claim(id);
  if (!r) return false;
  const step = nextStep(r);
  if (!step) {
    await updateRequest(id, { status: "in_review", lease_until: null });
    return false;
  }
  const attempts = (r.progress.steps?.[step.name]?.attempts ?? 0) + 1;
  await updateRequest(id, { status: step.status, error: null });
  await markStep(id, step.name, { startedAt: new Date().toISOString(), attempts });
  try {
    const note = await step.run((await getRequest(id)) as BriefingRequest, deadline);
    await markStep(id, step.name, { done: true, note, finishedAt: new Date().toISOString() });
    const after = await getRequest(id);
    const remaining = after ? nextStep(after) : null;
    await updateRequest(id, remaining ? { status: remaining.status, lease_until: null } : { status: "in_review", lease_until: null });
    return Boolean(remaining);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[briefings] ${step.name} failed for ${id}:`, message);
    await markStep(id, step.name, { note: message.slice(0, 500) });
    await updateRequest(id, {
      error: `${step.label} failed: ${message.slice(0, 500)}`,
      lease_until: null,
      ...(attempts >= MAX_ATTEMPTS ? { status: "failed" } : {}),
    });
    return false;
  }
}

/** Advances one request as far as the time budget allows. */
export async function advance(id: string, budgetMs: number): Promise<BriefingRequest | null> {
  const deadline = Date.now() + budgetMs;
  while (deadline - Date.now() >= MIN_STEP_MS) {
    const more = await runOneStep(id, deadline);
    if (!more) break;
  }
  return getRequest(id);
}

/** Cron entry: advances the oldest requests that are mid-pipeline and not leased. */
export async function runDue(budgetMs: number): Promise<{ id: string; status: RequestStatus }[]> {
  const now = new Date().toISOString();
  const { data } = await briefingsDb()
    .from("briefing_requests")
    .select("id")
    .in("status", PIPELINE_STATUSES)
    .or(`lease_until.is.null,lease_until.lt.${now}`)
    .order("created_at", { ascending: true })
    .limit(2);
  const deadline = Date.now() + budgetMs;
  const out: { id: string; status: RequestStatus }[] = [];
  for (const row of data ?? []) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_STEP_MS) break;
    const r = await advance(String(row.id), remaining);
    if (r) out.push({ id: r.id, status: r.status });
  }
  return out;
}

/** Puts a failed request back in the queue, keeping every finished step. */
export async function retry(id: string): Promise<void> {
  const r = await getRequest(id);
  if (!r) return;
  const steps = { ...(r.progress.steps ?? {}) };
  for (const s of STEPS) if (steps[s.name] && !steps[s.name]?.done) steps[s.name] = { ...steps[s.name], done: false, attempts: 0 };
  await updateRequest(id, { status: "queued", error: null, lease_until: null, progress: { ...r.progress, steps } });
}
