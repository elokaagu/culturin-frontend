import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { createFlashcard } from "@/lib/repositories/languageLearningRepository";
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
      vocabItemId?: string | null;
      frontText?: string;
      backText?: string;
      intervalDays?: number;
    };

    const frontText = typeof body.frontText === "string" ? body.frontText.trim() : "";
    const backText = typeof body.backText === "string" ? body.backText.trim() : "";
    if (!frontText || !backText) {
      return NextResponse.json({ message: "frontText and backText are required" }, { status: 400 });
    }

    const card = await createFlashcard({
      userId: appUserId,
      vocabItemId: body.vocabItemId,
      frontText,
      backText,
      intervalDays: typeof body.intervalDays === "number" ? body.intervalDays : undefined,
    });
    return NextResponse.json({ card });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to add flashcard");
    return NextResponse.json({ message }, { status: 500 });
  }
}
