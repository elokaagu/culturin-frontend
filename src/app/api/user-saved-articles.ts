import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../models/User";
import { getSession } from "next-auth/react";

export default async function handler(res: any, req: any) {
  await connectMongoDB();

  const session = await getSession({ req }); // get the session

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: session?.user?.email }).populate(
      "savedArticles"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ savedArticles: user.savedArticles });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch saved articles",
      error: error.message,
    });
  }
}
