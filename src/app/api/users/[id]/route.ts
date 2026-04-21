import { NextResponse } from "next/server";
import { getUserById } from "../../../../libs/repositories/userRepository";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "ok finding the user:",
      user,
    });
  } catch (error) {
    return NextResponse.json({
      message: "error",
      error,
    });
  }
}
