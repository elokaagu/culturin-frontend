import { NextResponse } from "next/server";
import { listUsers } from "@/lib/repositories/userRepository";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, _context: unknown) {
  try {
    const users = await listUsers();
    return NextResponse.json({ message: "ok", users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ message: "error", error: message }, { status: 500 });
  }
}
