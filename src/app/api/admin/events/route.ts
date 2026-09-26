import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { events as builtinEvents } from "@/lib/eventsData";
import { BUILTIN_START_DATES, getAdminEvents, normalizeEvent } from "@/lib/events/eventsStore";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const SETUP_HINT =
  "The events table isn't set up yet. Run supabase/migrations/043_cms_events.sql in the Supabase SQL editor, then try again.";

function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

async function requireAdmin() {
  const { isAdmin } = await getCurrentAdminState();
  return isAdmin ? null : NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

/** Live event list for the admin. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getAdminEvents(), { headers: NO_STORE });
}

/**
 * Create/update an event: `{ event, startsOn, originalSlug? }`.
 * Import the built-in events into the database: `{ action: "import-builtin" }`.
 */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    event?: unknown;
    startsOn?: unknown;
    originalSlug?: unknown;
  };

  const db = getSupabaseAdminFreshOrNull();
  if (!db) return NextResponse.json({ message: "The database isn't connected." }, { status: 503 });

  if (body.action === "import-builtin") {
    const rows = builtinEvents.map((event) => ({
      slug: event.slug,
      data: event,
      starts_on: BUILTIN_START_DATES[event.slug] ?? null,
    }));
    const { error } = await db.from("cms_events").upsert(rows, { onConflict: "slug", ignoreDuplicates: true });
    if (error) {
      console.error("[admin] import built-in events failed:", error.message);
      return NextResponse.json({ message: /relation .* does not exist|schema cache/i.test(error.message) ? SETUP_HINT : "Could not import the events." }, { status: 500 });
    }
    refreshPublicPages();
    return NextResponse.json({ imported: rows.length }, { headers: NO_STORE });
  }

  const parsed = normalizeEvent(body.event, body.startsOn);
  if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

  const originalSlug = typeof body.originalSlug === "string" ? body.originalSlug : "";
  if (originalSlug && originalSlug !== parsed.event.slug) {
    return NextResponse.json({ message: "An event's web address can't be changed after it's created." }, { status: 400 });
  }

  // Creating: refuse to overwrite an existing event that shares the slug.
  if (!originalSlug) {
    const { data: existing, error: lookupError } = await db.from("cms_events").select("slug").eq("slug", parsed.event.slug).maybeSingle();
    if (lookupError) {
      return NextResponse.json({ message: /relation .* does not exist|schema cache/i.test(lookupError.message) ? SETUP_HINT : "Could not save the event." }, { status: 500 });
    }
    if (existing) return NextResponse.json({ message: "An event with that web address already exists." }, { status: 409 });
  }

  const { error } = await db.from("cms_events").upsert(
    { slug: parsed.event.slug, data: parsed.event, starts_on: parsed.startsOn },
    { onConflict: "slug" },
  );
  if (error) {
    console.error("[admin] save event failed:", error.message);
    return NextResponse.json({ message: /relation .* does not exist|schema cache/i.test(error.message) ? SETUP_HINT : "Could not save the event." }, { status: 500 });
  }

  refreshPublicPages(parsed.event.slug);
  return NextResponse.json({ slug: parsed.event.slug }, { headers: NO_STORE });
}

/** Delete events by slug: body `{ slugs: string[] }`. */
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as { slugs?: unknown };
  const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === "string" && s.length > 0) : [];
  if (slugs.length === 0) return NextResponse.json({ message: "Nothing selected to delete." }, { status: 400 });

  const db = getSupabaseAdminFreshOrNull();
  if (!db) return NextResponse.json({ message: "The database isn't connected." }, { status: 503 });

  const { data, error } = await db.from("cms_events").delete().in("slug", slugs).select("slug");
  if (error) {
    console.error("[admin] delete events failed:", error.message);
    return NextResponse.json({ message: "Could not delete. Please try again." }, { status: 500 });
  }
  refreshPublicPages();
  for (const s of slugs) revalidatePath(`/events/${s}`);
  return NextResponse.json({ deleted: data?.length ?? 0 }, { headers: NO_STORE });
}
