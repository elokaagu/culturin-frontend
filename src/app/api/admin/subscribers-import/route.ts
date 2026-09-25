import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type ImportRow = {
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  company?: unknown;
  raw?: unknown;
};

export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { rows?: ImportRow[]; source?: unknown };
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) {
    return NextResponse.json({ message: "No rows to import." }, { status: 400 });
  }

  const sourceLabel = String(body.source ?? "").trim().slice(0, 120);
  const source = sourceLabel || "csv_import";

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Importing isn’t available—your workspace isn’t fully connected. Try again later." },
      { status: 503 },
    );
  }

  const seen = new Set<string>();
  const toInsert: Array<{
    email: string;
    first_name: string;
    last_name: string;
    company: string | null;
    source: string;
    raw_data: Record<string, string> | null;
  }> = [];
  let invalid = 0;
  let duplicateInFile = 0;

  for (const row of rows) {
    const email = String(row.email ?? "").trim().toLowerCase();
    const firstName = String(row.firstName ?? "").trim();
    const lastName = String(row.lastName ?? "").trim();
    const company = String(row.company ?? "").trim();
    const raw =
      row.raw && typeof row.raw === "object" && !Array.isArray(row.raw)
        ? (row.raw as Record<string, unknown>)
        : null;
    const rawData: Record<string, string> | null = raw
      ? Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v ?? "")]))
      : null;

    if (!email || !emailOk(email)) {
      invalid++;
      continue;
    }
    if (seen.has(email)) {
      duplicateInFile++;
      continue;
    }
    seen.add(email);
    toInsert.push({
      email,
      first_name: firstName,
      last_name: lastName,
      company: company || null,
      source,
      raw_data: rawData,
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json({ inserted: 0, skippedExisting: 0, duplicateInFile, invalid });
  }

  // The uniqueness guard on this table is a functional index on lower(email),
  // not a plain-column constraint, so Postgres ON CONFLICT (email) can't
  // target it — check existing emails first and insert only the new ones.
  const { data: existingRows, error: existingError } = await admin
    .from("newsletter_subscribers")
    .select("email")
    .in(
      "email",
      toInsert.map((r) => r.email),
    );

  if (existingError) {
    return NextResponse.json({ message: existingError.message }, { status: 500 });
  }

  const existingEmails = new Set((existingRows ?? []).map((r) => String(r.email).toLowerCase()));
  const freshRows = toInsert.filter((r) => !existingEmails.has(r.email));
  const skippedExisting = toInsert.length - freshRows.length;

  if (freshRows.length === 0) {
    return NextResponse.json({ inserted: 0, skippedExisting, duplicateInFile, invalid });
  }

  const { data, error } = await admin.from("newsletter_subscribers").insert(freshRows).select("id");
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ inserted: data?.length ?? 0, skippedExisting, duplicateInFile, invalid });
}
