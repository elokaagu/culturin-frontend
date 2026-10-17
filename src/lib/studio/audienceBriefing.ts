import "server-only";

import { generateText, Output } from "ai";
import { z } from "zod";

import { selectAllRowsOrNull } from "@/lib/email/selectAllRows";
import { getAdminEvents } from "@/lib/events/eventsStore";
import { PERSONAL_DOMAINS, seniorityOf } from "@/lib/studio/analytics";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export const BRIEFING_MODEL = "openai/gpt-5.4";

/** Most people sent to the model in one briefing; the best-profiled come first. */
const MAX_PROFILES = 3000;

export const briefingSchema = z.object({
  headline: z.string().describe("One sentence that sums up who the audience is right now."),
  summary: z.string().describe("Two or three short paragraphs separated by blank lines: who is in the audience and what stands out."),
  segments: z
    .array(
      z.object({
        name: z.string(),
        approxPeople: z.number().describe("Rough number of people in this segment, from the data."),
        description: z.string().describe("Who they are and why they matter to Culturin, in one or two sentences."),
        examples: z.array(z.string()).describe("Two to four example people as 'Name, Role at Company'."),
      }),
    )
    .describe("Three to seven audience segments, largest or most valuable first."),
  industries: z
    .array(z.object({ name: z.string(), approxPeople: z.number() }))
    .describe("Industries represented, inferred from companies and roles, largest first. Up to ten."),
  standoutPeople: z
    .array(z.object({ name: z.string(), role: z.string(), company: z.string(), why: z.string() }))
    .describe("Up to twelve people Culturin should get to know better, with a one-sentence reason."),
  standoutCompanies: z
    .array(z.object({ name: z.string(), people: z.number(), why: z.string() }))
    .describe("Up to ten companies with a notable presence or partnership potential."),
  nextMoves: z
    .array(z.object({ title: z.string(), detail: z.string() }))
    .describe("Three to six concrete, specific next moves for the Culturin team."),
  dataGaps: z.array(z.string()).describe("What's missing from the data that would sharpen this picture. Up to four."),
});

export type BriefingContent = z.infer<typeof briefingSchema>;

export type BriefingStats = {
  people: number;
  profiled: number;
  sentToModel: number;
  subscribers: number;
  rsvps: number;
  inquiries: number;
  listMembers: number;
  emailsSent: number;
};

export type AudienceBriefing = {
  id: string;
  createdAt: string;
  createdBy: string | null;
  model: string;
  content: BriefingContent;
  stats: BriefingStats;
};

type Person = {
  name: string;
  title: string;
  company: string;
  /** Employer's email domain ("vml.com"), never the address itself; empty for personal providers. */
  domain: string;
  country: string;
  events: Set<string>;
  channels: Set<string>;
  interests: Set<string>;
  subscribed: boolean;
  sent: number;
  opened: number;
  clicked: number;
};

type Raw = Record<string, unknown> | null;

const EMAIL_LIKE = /[^\s|,;<>()]+@[^\s|,;<>()]+\.[a-z]{2,}/gi;
const str = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
const rawField = (raw: Raw, ...keys: string[]) => {
  for (const k of keys) {
    const v = str(raw?.[k]);
    if (v) return v;
  }
  return "";
};
const fullName = (first: unknown, last: unknown) => [str(first), str(last)].filter(Boolean).join(" ");

function parseTags(v: string): string[] {
  const quoted = Array.from(v.matchAll(/"([^"]+)"/g), (m) => m[1].trim());
  return (quoted.length > 0 ? quoted : v.split(",")).map((t) => t.trim()).filter(Boolean);
}

/**
 * Builds an email-free roster of the audience. Emails are only used here to merge the same person
 * across tables; they never leave this function.
 */
async function gatherAudience() {
  const [subscribers, rsvps, inquiries, members, recipients, adminEvents] = await Promise.all([
    selectAllRowsOrNull("newsletter_subscribers", "email, first_name, last_name, company, source, raw_data, unsubscribed_at"),
    selectAllRowsOrNull("event_rsvps", "email, first_name, last_name, company, title, event_slug"),
    selectAllRowsOrNull("partner_inquiries", "email, name, company, interest"),
    selectAllRowsOrNull("email_list_members", "email, first_name, last_name, company, raw_data"),
    selectAllRowsOrNull("email_broadcast_recipients", "email, sent_at, opened_at, clicked_at"),
    getAdminEvents(),
  ]);
  if (!subscribers) return null;
  const eventNames = Object.fromEntries(adminEvents.events.map((e) => [e.slug, e.name]));

  const people = new Map<string, Person>();
  const get = (email: unknown) => {
    const key = str(email).toLowerCase();
    if (!key.includes("@")) return null;
    let p = people.get(key);
    if (!p) {
      const domain = key.split("@")[1] ?? "";
      p = {
        name: "", title: "", company: "", domain: PERSONAL_DOMAINS.has(domain) ? "" : domain, country: "",
        events: new Set(), channels: new Set(), interests: new Set(),
        subscribed: false, sent: 0, opened: 0, clicked: 0,
      };
      people.set(key, p);
    }
    return p;
  };
  const fill = (p: Person, name: string, title: string, company: string) => {
    if (!p.name && name) p.name = name;
    if (!p.title && title) p.title = title;
    if (!p.company && company) p.company = company;
  };

  for (const r of subscribers) {
    const p = get(r.email);
    if (!p) continue;
    const raw = r.raw_data as Raw;
    p.subscribed = !r.unsubscribed_at;
    fill(p, fullName(r.first_name, r.last_name), rawField(raw, "Title", "Role", "TITLE", "ROLE"), str(r.company) || rawField(raw, "Company", "COMPANY"));
    const country = rawField(raw, "CC", "Country", "COUNTRY");
    p.country ||= /^[a-z]{2}$/i.test(country) ? country.toUpperCase() : country;
    const channel = rawField(raw, "Source") || str(r.source);
    if (channel) p.channels.add(channel);
    for (const t of parseTags(rawField(raw, "Tags", "TAGS"))) p.events.add(t);
  }
  for (const r of rsvps ?? []) {
    const p = get(r.email);
    if (!p) continue;
    fill(p, fullName(r.first_name, r.last_name), str(r.title), str(r.company));
    const slug = str(r.event_slug);
    if (slug) p.events.add(eventNames[slug] ?? slug);
  }
  for (const r of inquiries ?? []) {
    const p = get(r.email);
    if (!p) continue;
    fill(p, str(r.name), "", str(r.company));
    if (str(r.interest)) p.interests.add(str(r.interest));
  }
  for (const r of members ?? []) {
    const p = get(r.email);
    if (!p) continue;
    const raw = r.raw_data as Raw;
    fill(p, fullName(r.first_name, r.last_name), rawField(raw, "Title", "Role"), str(r.company));
    const channel = rawField(raw, "Source");
    if (channel) p.channels.add(channel);
  }
  let emailsSent = 0;
  for (const r of recipients ?? []) {
    const p = people.get(str(r.email).toLowerCase());
    if (!p || !r.sent_at) continue;
    emailsSent++;
    p.sent++;
    if (r.opened_at) p.opened++;
    if (r.clicked_at) p.clicked++;
  }

  const all = Array.from(people.values());
  // Older subscribers often have no role or company on file, but a work email still says where they work.
  const profiled = all.filter((p) => p.title || p.company || p.domain);
  const score = (p: Person) =>
    (p.title ? 3 : 0) + (p.company ? 3 : p.domain ? 1 : 0) + p.clicked * 2 + Math.min(p.opened, 3) + p.events.size + p.interests.size * 2;
  const ranked = profiled.sort((a, b) => score(b) - score(a)).slice(0, MAX_PROFILES);

  const stats: BriefingStats = {
    people: all.length,
    profiled: profiled.length,
    sentToModel: ranked.length,
    subscribers: subscribers.filter((r) => !r.unsubscribed_at).length,
    rsvps: rsvps?.length ?? 0,
    inquiries: inquiries?.length ?? 0,
    listMembers: members?.length ?? 0,
    emailsSent,
  };

  const tally = (pick: (p: Person) => string[]) => {
    const m = new Map<string, number>();
    for (const p of all) for (const k of pick(p)) m.set(k, (m.get(k) ?? 0) + 1);
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([k, n]) => `${k} (${n})`)
      .join("; ");
  };

  const lines = ranked.map((p) => {
    const parts = [p.name || "(no name)", p.title || "-", p.company || (p.domain ? `${p.domain} (from work email)` : "-"), p.country || "-"];
    if (p.events.size) parts.push(`events: ${Array.from(p.events).join(", ")}`);
    if (p.channels.size) parts.push(`came via: ${Array.from(p.channels).join(", ")}`);
    if (p.interests.size) parts.push(`enquired about: ${Array.from(p.interests).join(", ")}`);
    if (p.sent) parts.push(`emails: opened ${p.opened}/${p.sent}, clicked ${p.clicked}`);
    if (!p.subscribed) parts.push("not on mailing list");
    return parts.join(" | ");
  });

  const overview = [
    `Total people: ${stats.people}. With a role, company or work email: ${stats.profiled}. Active newsletter subscribers: ${stats.subscribers}.`,
    `Work email domains of people with no company given: ${tally((p) => (!p.company && p.domain ? [p.domain] : []))}.`,
    `Event RSVPs: ${stats.rsvps}. Partnership inquiries: ${stats.inquiries}. Event guest list entries: ${stats.listMembers}. Campaign emails sent: ${emailsSent}.`,
    `Seniority across everyone: ${tally((p) => [seniorityOf(p.title)])}.`,
    `Most common events: ${tally((p) => Array.from(p.events))}.`,
    `How people found Culturin: ${tally((p) => Array.from(p.channels))}.`,
    `Countries: ${tally((p) => (p.country ? [p.country] : []))}.`,
  ].join("\n");

  return { stats, overview, lines };
}

const SYSTEM = `You are the audience strategist for Culturin, a cultural marketing company that builds brand experiences, cultural programming and cultural intelligence, and hosts invite-only events around moments like Cannes Lions and MIPCOM.

You write an internal briefing for Culturin's co-founders about who is in their audience. Base every claim on the data provided; when you estimate, say roughly. Name real people and companies from the roster where useful. Be specific and commercially minded: who could become clients, partners, sponsors, speakers or collaborators.

Write in British English, in a warm, confident and concise voice. Don't use em dashes. Don't invent facts about people beyond what the roster says, though you may draw on general knowledge of well-known companies.`;

export async function generateAudienceBriefing(createdBy: string | null): Promise<{ ok: true; briefing: AudienceBriefing } | { ok: false; message: string }> {
  const data = await gatherAudience();
  if (!data) return { ok: false, message: "Couldn't read the audience from the database." };
  if (data.lines.length === 0) return { ok: false, message: "Nobody in the audience has shared a role or company yet." };

  // Free-text fields sometimes hold an email address; those must never reach the model.
  const prompt = `AUDIENCE OVERVIEW\n${data.overview}\n\nROSTER (${data.lines.length} best-profiled people; format: name | role | company | country | extra)\n${data.lines.join("\n")}`.replace(
    EMAIL_LIKE,
    "[email removed]",
  );

  let content: BriefingContent;
  try {
    const result = await generateText({
      model: BRIEFING_MODEL,
      system: SYSTEM,
      prompt,
      output: Output.object({ schema: briefingSchema }),
    });
    content = result.output;
  } catch (err) {
    console.error("[audienceBriefing] generation failed", err);
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `The AI briefing couldn't be generated: ${msg.slice(0, 300)}` };
  }

  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ok: false, message: "The database isn't connected." };
  const { data: row, error } = await db
    .from("audience_briefings")
    .insert({ created_by: createdBy, model: BRIEFING_MODEL, content, stats: data.stats })
    .select("id, created_at")
    .single();
  if (error || !row) return { ok: false, message: error?.message ?? "Couldn't save the briefing." };

  return {
    ok: true,
    briefing: { id: row.id, createdAt: row.created_at, createdBy, model: BRIEFING_MODEL, content, stats: data.stats },
  };
}

/** The most recent briefing, or null when there isn't one (or the table doesn't exist yet). */
export async function getLatestBriefing(): Promise<AudienceBriefing | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return null;
  const { data, error } = await db
    .from("audience_briefings")
    .select("id, created_at, created_by, model, content, stats")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  const parsed = briefingSchema.safeParse(data.content);
  if (!parsed.success) return null;
  return {
    id: data.id,
    createdAt: data.created_at,
    createdBy: data.created_by,
    model: data.model,
    content: parsed.data,
    stats: data.stats as BriefingStats,
  };
}
