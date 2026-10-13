import "server-only";

import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

/** Every matching row, paged past Supabase's 1,000-row limit. Returns null if the query fails. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase query builders are typed per table; this helper works across tables.
export async function selectAllRowsOrNull(table: string, columns: string, filter?: (q: any) => any): Promise<Record<string, unknown>[] | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return null;
  const out: Record<string, unknown>[] = [];
  for (let from = 0; from < 200_000; from += 1000) {
    let q = db.from(table).select(columns);
    if (filter) q = filter(q);
    const { data, error } = await q.range(from, from + 999);
    if (error || !data) return null;
    out.push(...(data as unknown as Record<string, unknown>[]));
    if (data.length < 1000) break;
  }
  return out;
}
