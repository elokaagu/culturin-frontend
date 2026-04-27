import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { createSpotList, listSpotListsWithItems } from "@/lib/repositories/spotListRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
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
    const lists = await listSpotListsWithItems(appUser.id);
    return NextResponse.json({ lists });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load lists");
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    placeLabel?: string | null;
    listType?: "itinerary" | "collection" | "highlights";
    description?: string | null;
    isPublished?: boolean;
  };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }
  if (body.listType !== undefined && !["itinerary", "collection", "highlights"].includes(body.listType)) {
    return NextResponse.json({ message: "listType must be itinerary, collection, or highlights" }, { status: 400 });
  }

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const list = await createSpotList({
      userId: appUser.id,
      title,
      placeLabel: body.placeLabel,
      listType: body.listType,
      description: body.description,
      isPublished: body.isPublished,
    });
    return NextResponse.json({ list });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to create list");
    return NextResponse.json({ message }, { status: 500 });
  }
}
