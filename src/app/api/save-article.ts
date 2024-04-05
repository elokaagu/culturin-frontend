import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../../libs/mongodb";
import User from "../models/User";
import { getSession } from "next-auth/react";
// This is a simplified example. Ensure proper authentication and error handling.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await connectMongoDB();
  const { articleId } = req.body;
  const userEmail = session?.user?.email;

  try {
    await User.findOneAndUpdate(
      { email: userEmail },
      { $addToSet: { savedArticles: articleId } },
      { new: true }
    );
    res.status(200).json({ message: "Article saved successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to save article", error: error.message });
  }
}
