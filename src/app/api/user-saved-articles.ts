import { getSession } from "next-auth/react";
import {
  getUserByEmail,
  listSavedArticleIdsForUser,
} from "../../libs/repositories/userRepository";

export default async function handler(req: any, res: any) {
  const session = await getSession({ req }); // get the session

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await getUserByEmail(session?.user?.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const savedArticles = await listSavedArticleIdsForUser(user.id);
    res.status(200).json({ savedArticles });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch saved articles",
      error: error.message,
    });
  }
}
