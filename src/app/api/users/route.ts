import { NextResponse } from "next/server";
import { listUsers } from "../../../libs/repositories/userRepository";

export const dynamic = "force-dynamic";
export async function GET(request: Request, context: any) {
  try {
    const users = await listUsers();
    return NextResponse.json({ message: "ok", users });
  } catch (error: any) {
    return NextResponse.json(
      { message: "error", error: error.message ?? "Failed to fetch users" },
      { status: 500 }
    );
  }
}
