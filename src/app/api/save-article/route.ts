import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../lib/supabase/server";
import {
  getUserById,
  saveArticleForUser,
  upsertUserFromSupabaseAuth,
} from "../../../libs/repositories/userRepository";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { articleId } = await request.json();
  if (!articleId) {
    return NextResponse.json({ message: "articleId is required" }, { status: 400 });
  }

  try {
    await upsertUserFromSupabaseAuth({
      id: user.id,
      email: user.email,
      name:
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        null,
    });

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await saveArticleForUser({ userId: dbUser.id, articleId });
    return NextResponse.json({ message: "Article saved successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save article", error: error.message },
      { status: 500 }
    );
  }
}
