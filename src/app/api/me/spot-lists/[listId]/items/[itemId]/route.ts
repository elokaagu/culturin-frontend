import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { deleteSpotListItem, updateSpotListItem } from "@/lib/repositories/spotListRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteParams = { params: { listId: string; itemId: string } };

export async function PATCH(request: Request, { params }: RouteParams) {
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
    sortOrder?: number;
  };

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await updateSpotListItem({
      itemId: params.itemId,
      listId: params.listId,
      userId: appUser.id,
      title: body.title,
      notes: body.notes,
      url: body.url,
      sortOrder: body.sortOrder,
    });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update spot");
    const status = message === "List not found" ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await deleteSpotListItem({
      itemId: params.itemId,
      listId: params.listId,
      userId: appUser.id,
    });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to delete spot");
    const status = message === "List not found" ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
