import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { deleteSpotList, updateSpotList } from "@/lib/repositories/spotListRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteParams = { params: { listId: string } };

export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { title?: string; placeLabel?: string | null };
  if (body.title === undefined && body.placeLabel === undefined) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await updateSpotList({
      listId: params.listId,
      userId: appUser.id,
      title: body.title,
      placeLabel: body.placeLabel,
    });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update list");
    return NextResponse.json({ message }, { status: 500 });
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
    await deleteSpotList(params.listId, appUser.id);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to delete list");
    return NextResponse.json({ message }, { status: 500 });
  }
}
