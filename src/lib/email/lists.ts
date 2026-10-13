import "server-only";

import { selectAllRowsOrNull } from "@/lib/email/selectAllRows";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export type EmailList = {
  id: string;
  name: string;
  createdAt: string;
  /** Everyone imported onto the list. */
  memberCount: number;
  /** Members who can be emailed (not unsubscribed, bounced or marked as spam). */
  sendable: number;
};

export type ListMemberInput = { email: string; firstName?: string; lastName?: string; company?: string; raw?: Record<string, string> };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Lower-cased addresses that must never be emailed. Null when the lookup fails, so callers never send blind. */
export async function suppressedEmails(): Promise<Set<string> | null> {
  const [subs, extra] = await Promise.all([
    selectAllRowsOrNull("newsletter_subscribers", "email", (q) => q.not("unsubscribed_at", "is", null).order("id")),
    selectAllRowsOrNull("email_suppressions", "email", (q) => q.order("email")),
  ]);
  if (!subs) return null;
  return new Set([...subs, ...(extra ?? [])].map((r) => String(r.email ?? "").trim().toLowerCase()));
}

/** Everyone on a list who can be emailed, the Culturin team first, then in import order. Null if the list can't be read. */
export async function listRecipients(listId: string, suppressed?: Set<string> | null): Promise<string[] | null> {
  const [members, blocked] = await Promise.all([
    selectAllRowsOrNull("email_list_members", "email, added_at", (q) => q.eq("list_id", listId).order("added_at").order("email")),
    suppressed === undefined ? suppressedEmails() : Promise.resolve(suppressed),
  ]);
  if (!members || !blocked) return null;
  const emails = Array.from(new Set(members.map((m) => String(m.email ?? "").trim().toLowerCase()))).filter(
    (e) => EMAIL_RE.test(e) && !blocked.has(e),
  );
  return [...emails.filter((e) => e.endsWith("@culturin.com")), ...emails.filter((e) => !e.endsWith("@culturin.com"))];
}

/** All lists, newest first. `ready` is false until migration 049 has been run. */
export async function listEmailLists(): Promise<{ ready: boolean; lists: EmailList[] }> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ready: false, lists: [] };
  const { data, error } = await db.from("email_lists").select("id, name, created_at").order("created_at", { ascending: false });
  if (error || !data) return { ready: false, lists: [] };
  const suppressed = await suppressedEmails();
  const lists = await Promise.all(
    data.map(async (l) => {
      const { count } = await db.from("email_list_members").select("email", { count: "exact", head: true }).eq("list_id", l.id);
      const sendable = await listRecipients(String(l.id), suppressed);
      return {
        id: String(l.id),
        name: String(l.name ?? ""),
        createdAt: String(l.created_at ?? ""),
        memberCount: count ?? 0,
        sendable: sendable?.length ?? 0,
      };
    }),
  );
  return { ready: true, lists };
}

/** Adds people to a list (creating it when `listId` is empty). Re-importing the same person just refreshes their details. */
export async function importToList(input: { listId?: string; name?: string; members: ListMemberInput[] }): Promise<
  { ok: true; id: string; added: number; skipped: number } | { ok: false; message: string }
> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ok: false, message: "The database isn't connected." };

  let listId = input.listId?.trim() ?? "";
  if (!listId) {
    const name = input.name?.trim().slice(0, 120) ?? "";
    if (!name) return { ok: false, message: "Give the list a name." };
    const { data, error } = await db.from("email_lists").insert({ name }).select("id").single();
    if (error || !data) return { ok: false, message: "Couldn't create the list. Has migration 049 been run?" };
    listId = String(data.id);
  }

  const rows = new Map<string, Record<string, unknown>>();
  let skipped = 0;
  for (const m of input.members) {
    const email = String(m.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      skipped++;
      continue;
    }
    rows.set(email, {
      list_id: listId,
      email,
      first_name: m.firstName?.trim() || null,
      last_name: m.lastName?.trim() || null,
      company: m.company?.trim() || null,
      raw_data: m.raw && Object.keys(m.raw).length > 0 ? m.raw : null,
    });
  }

  const all = Array.from(rows.values());
  for (let i = 0; i < all.length; i += 500) {
    const { error } = await db.from("email_list_members").upsert(all.slice(i, i + 500), { onConflict: "list_id,email" });
    if (error) return { ok: false, message: `Couldn't save the guests: ${error.message}` };
  }
  await db.from("email_lists").update({ updated_at: new Date().toISOString() }).eq("id", listId);
  return { ok: true, id: listId, added: all.length, skipped };
}

export async function deleteEmailList(id: string): Promise<string | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return "The database isn't connected.";
  const { count } = await db.from("email_broadcasts").select("id", { count: "exact", head: true }).eq("list_id", id);
  if (count) return "An email is set to go to this list. Point it at another audience or delete it first.";
  const { error } = await db.from("email_lists").delete().eq("id", id);
  return error ? error.message : null;
}

/** Names and companies from event lists, for people who aren't newsletter subscribers. */
export async function listMemberProfiles(emails: string[]): Promise<Map<string, { name: string; company: string }>> {
  const out = new Map<string, { name: string; company: string }>();
  const db = getSupabaseAdminFreshOrNull();
  if (!db || emails.length === 0) return out;
  for (let i = 0; i < emails.length; i += 200) {
    const { data, error } = await db
      .from("email_list_members")
      .select("email, first_name, last_name, company")
      .in("email", emails.slice(i, i + 200).map((e) => e.toLowerCase()));
    if (error) return out;
    for (const p of data ?? []) {
      out.set(String(p.email), { name: [p.first_name, p.last_name].filter(Boolean).join(" "), company: String(p.company ?? "") });
    }
  }
  return out;
}
