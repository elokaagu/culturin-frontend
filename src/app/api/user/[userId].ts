import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../../../libs/mongodb";
import User from "../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  const { userId } = req.query; // Assume the frontend sends the userId

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
