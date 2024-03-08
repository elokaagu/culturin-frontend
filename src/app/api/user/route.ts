import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../models/User";

export async function POST(request: any) {
  const { name, email, username } = await request.json();
  await connectMongoDB();
  await User.create({ name, email, username });
  return NextResponse.json({ message: "New User Registered" }, { status: 201 });
}
