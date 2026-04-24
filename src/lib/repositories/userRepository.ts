import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "../supabaseServiceRole";

type AppUser = {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  hashed_password: string | null;
  auth_provider_id: string | null;
  created_at: string;
  updated_at: string;
};

function db(): SupabaseClient {
  return getSupabaseAdmin();
}

const createUsernameFromName = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.split("@")[0] || "user";
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\s]/g, "")
    .toLowerCase();
};

export async function listUsers() {
  const { data, error } = await db()
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AppUser[];
}

export async function getUserById(id: string) {
  const { data, error } = await db().from("users").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  return (data as AppUser | null) ?? null;
}

/** Keeps `public.users` in sync with `auth.users` (same primary key). */
export async function upsertUserFromSupabaseAuth(input: {
  id: string;
  email: string;
  name?: string | null;
}) {
  const payload = {
    id: input.id,
    email: input.email,
    name: input.name ?? null,
    username: createUsernameFromName(input.name, input.email),
    hashed_password: null,
    auth_provider_id: input.id,
  };

  const { error } = await db().from("users").upsert(payload, { onConflict: "id" });
  if (error) {
    throw error;
  }
}

export async function saveArticleForUser(input: { userId: string; articleId: string }) {
  const { error } = await db()
    .from("user_saved_articles")
    .upsert(
      {
        user_id: input.userId,
        article_id: input.articleId,
      },
      { onConflict: "user_id,article_id" },
    );

  if (error) {
    throw error;
  }
}
