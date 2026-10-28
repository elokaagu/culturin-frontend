import { NextResponse } from "next/server";

import { advance, retry } from "@/lib/briefings/pipeline";
import { getRequest } from "@/lib/briefings/store";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Advances the pipeline as far as one invocation allows. The admin page calls this while a request
 * is mid-pipeline; the cron runner picks up anything left when nobody is watching.
 * `{ retry: true }` puts a failed request back in the queue first.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { retry?: unknown };
  if (!(await getRequest(params.id))) return NextResponse.json({ message: "Request not found." }, { status: 404 });
  if (body.retry === true) await retry(params.id);
  const r = await advance(params.id, 270_000);
  return NextResponse.json({ status: r?.status, error: r?.error ?? null });
}
