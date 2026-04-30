import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { createVocabItem } from "@/lib/repositories/languageLearningRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getSessionAppUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const appUser = await ensureAppUser(user);
  return appUser?.id ?? null;
}

export async function POST(request: Request) {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as {
      term?: string;
      translation?: string | null;
      exampleText?: string | null;
      sourceLabel?: string | null;
    };
    const term = typeof body.term === "string" ? body.term.trim() : "";
    if (!term) {
      return NextResponse.json({ message: "term is required" }, { status: 400 });
    }
    const item = await createVocabItem({
      userId: appUserId,
      term,
      translation: body.translation,
      exampleText: body.exampleText,
      sourceLabel: body.sourceLabel,
    });
    return NextResponse.json({ item });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to add vocabulary");
    return NextResponse.json({ message }, { status: 500 });
  }
}
