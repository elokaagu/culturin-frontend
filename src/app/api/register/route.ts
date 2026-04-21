import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createCredentialsUser } from "../../../libs/repositories/userRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createCredentialsUser({
      name,
      email,
      hashedPassword,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create user" },
      { status: 400 }
    );
  }
}
