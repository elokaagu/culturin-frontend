import { getServerSession } from "next-auth";
import { getUserByEmail } from "../libs/repositories/userRepository";

export async function getSession() {
  return await getServerSession();
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await getUserByEmail(session?.user?.email);
    if (!currentUser) {
      return null;
    }
    return {
      ...currentUser,
      createdAt: currentUser.created_at,
      updatedAt: currentUser.updated_at,
      emailVerified: null,
    };
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return null;
  }
}
