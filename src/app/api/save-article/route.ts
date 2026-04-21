import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  getUserByEmail,
  saveArticleForUser,
} from "../../../libs/repositories/userRepository";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { articleId } = await request.json();
  if (!articleId) {
    return NextResponse.json({ message: "articleId is required" }, { status: 400 });
  }

  try {
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await saveArticleForUser({ userId: user.id, articleId });
    return NextResponse.json({ message: "Article saved successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save article", error: error.message },
      { status: 500 }
    );
  }
}
