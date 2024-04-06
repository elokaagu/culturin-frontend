import { connectMongoDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: any, res: any) {
  // Connect to the database
  const { db } = await connectMongoDB();

  // Get the user ID from the request params
  const { id } = req.query;

  try {
    // Convert the id to an ObjectId, and fetch the user from the database
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      // If no user is found, return a 404 error
      return res.status(404).json({ message: "User not found" });
    }

    // If a user is found, return the user data
    res.status(200).json(user);
  } catch (error) {
    // If there's an error, return a 500 error
    res.status(500).json({ message: "Error fetching user data" });
  }
}
