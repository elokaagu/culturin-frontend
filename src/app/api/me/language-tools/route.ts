import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { getLanguageDashboard, upsertLanguageProfile } from "@/lib/repositories/languageLearningRepository";
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

export async function GET() {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const dashboard = await getLanguageDashboard(appUserId);
    return NextResponse.json(dashboard);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load language tools");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const appUserId = await getSessionAppUserId();
    if (!appUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as {
      targetLanguage?: string;
      proficiencyLevel?: string;
      dailyGoal?: number;
      isPublic?: boolean;
    };
    const profile = await upsertLanguageProfile({
      userId: appUserId,
      targetLanguage: typeof body.targetLanguage === "string" ? body.targetLanguage : undefined,
      proficiencyLevel: typeof body.proficiencyLevel === "string" ? body.proficiencyLevel : undefined,
      dailyGoal: typeof body.dailyGoal === "number" ? Math.max(1, Math.floor(body.dailyGoal)) : undefined,
      isPublic: typeof body.isPublic === "boolean" ? body.isPublic : undefined,
    });
    return NextResponse.json({ profile });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update language profile");
    return NextResponse.json({ message }, { status: 500 });
  }
}
