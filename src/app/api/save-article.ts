import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import {
  getUserByEmail,
  saveArticleForUser,
} from "../../libs/repositories/userRepository";
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
  const { articleId } = req.body;
  const userEmail = session?.user?.email;
  if (!articleId) {
    return res.status(400).json({ message: "articleId is required" });
  }

  try {
    const user = await getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await saveArticleForUser({ userId: user.id, articleId });
    res.status(200).json({ message: "Article saved successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to save article", error: error.message });
  }
}
