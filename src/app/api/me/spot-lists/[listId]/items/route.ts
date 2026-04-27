import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { addSpotListItem } from "@/lib/repositories/spotListRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteParams = { params: { listId: string } };

export async function POST(request: Request, { params }: RouteParams) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    notes?: string | null;
    url?: string | null;
  };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const item = await addSpotListItem({
      listId: params.listId,
      userId: appUser.id,
      title,
      notes: body.notes,
      url: body.url,
    });
    return NextResponse.json({ item });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to add spot");
    const status = message === "List not found" ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
