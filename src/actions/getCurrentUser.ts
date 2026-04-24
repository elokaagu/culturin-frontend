import { createSupabaseServerClient } from "../lib/supabase/server";
import { getUserById, upsertUserFromSupabaseAuth } from "../libs/repositories/userRepository";

export async function getSession() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const user = await getSession();
    if (!user?.email) {
      return null;
    }

    await upsertUserFromSupabaseAuth({
      id: user.id,
      email: user.email,
      name:
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        null,
    });

    const currentUser = await getUserById(user.id);
    if (!currentUser) {
      return null;
    }
    return {
      ...currentUser,
      createdAt: currentUser.created_at,
      updatedAt: currentUser.updated_at,
      emailVerified: null,
    };
  } catch (error: unknown) {
    console.error("Error getting current user:", error);
    return null;
  }
}
