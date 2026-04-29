import { NextResponse } from "next/server";

import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getErrorMessage } from "@/lib/api/errorMessage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isAllowedPublicMediaUrl(imageUrl: string, supabasePublicOrigin: string): boolean {
  try {
    const u = new URL(imageUrl);
    if (u.protocol !== "https:") return false;
    const pub = new URL(supabasePublicOrigin);
    if (u.hostname !== pub.hostname) return false;
    return u.pathname.includes("/storage/v1/object/public/media/");
  } catch {
    return false;
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

  const body = (await request.json()) as { imageUrl?: string; title?: string | null };
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 200) : "";

  if (!imageUrl) {
    return NextResponse.json({ message: "imageUrl is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  if (!supabaseUrl || !isAllowedPublicMediaUrl(imageUrl, supabaseUrl)) {
    return NextResponse.json(
      { message: "Image must be uploaded to Culturin media storage first." },
      { status: 400 },
    );
  }

  try {
    const appUser = await ensureAppUser(user);
    if (!appUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("community_travel_pins")
      .insert({
        user_id: appUser.id,
        image_url: imageUrl,
        title: title || null,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: data?.id ?? null });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Could not save pin");
    return NextResponse.json({ message }, { status: 500 });
  }
}
