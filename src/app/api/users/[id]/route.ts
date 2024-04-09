import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../libs/mongodb";
import User from "../../../models/User";

export async function GET(request: Request, params: { id: string }) {
  try {
    await connectMongoDB();
    const user = await User.findOne();
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
