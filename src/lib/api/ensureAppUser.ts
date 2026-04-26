import type { User } from "@supabase/supabase-js";

import { getUserById, upsertUserFromSupabaseAuth } from "@/lib/repositories/userRepository";

export type EnsuredAppUser = { id: string };

/**
 * Ensures the Supabase session user exists in `public.users` and returns that row id.
 */
export async function ensureAppUser(user: User): Promise<EnsuredAppUser | null> {
  if (!user.email) return null;

  await upsertUserFromSupabaseAuth({
    id: user.id,
    email: user.email,
    name:
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      null,
  });

  const dbUser = await getUserById(user.id);
  if (!dbUser) return null;
  return { id: dbUser.id };
}
