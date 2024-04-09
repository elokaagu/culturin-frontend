import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../libs/mongodb";
import User from "../../models/User";

export const dynamic = "force-dynamic";
export async function GET(request: Request, context: any) {
  await connectMongoDB();
  const users = await User.find();
  return NextResponse.json({
    message: "ok",
    users,
  });
}
