import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for the GET method
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const { db } = await connectMongoDB();

    // Ensure the id is a valid ObjectId
    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id as string) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user data" });
  }
}
