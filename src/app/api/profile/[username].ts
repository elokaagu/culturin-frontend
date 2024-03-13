import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  const username = (req.query.username as string).toLowerCase();

  const profile = await User.findOne({ username: username });
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.status(200).json(profile);
}
