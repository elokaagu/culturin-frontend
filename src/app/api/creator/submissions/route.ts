import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["blog", "video", "provider"]);

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Sign in to submit content." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const entry = body as { content_type?: unknown; payload?: unknown };
  const contentType = typeof entry.content_type === "string" ? entry.content_type : "";
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ message: "Invalid content type." }, { status: 400 });
  }

  const payload = entry.payload;
  if (payload === null || payload === undefined || typeof payload !== "object") {
    return NextResponse.json({ message: "Payload must be an object." }, { status: 400 });
  }

  const raw = JSON.stringify(payload);
  if (raw.length > 900_000) {
    return NextResponse.json({ message: "Payload is too large." }, { status: 400 });
  }

  const { error } = await supabase.from("creator_submissions").insert({
    user_id: user.id,
    content_type: contentType,
    payload,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Submission received" });
}
