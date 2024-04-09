import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../libs/mongodb";
import User from "../../models/User";
import Article from "../../models/Article";

export async function POST(request: Request) {
  await connectMongoDB();
  return NextResponse.json({
    message: "ok",
  });
}
