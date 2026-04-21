import { getSupabaseAdmin } from "../supabase";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  hashed_password: string | null;
  auth_provider_id: string | null;
  created_at: string;
  updated_at: string;
};

const createUsernameFromName = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.split("@")[0] || "user";
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\s]/g, "")
    .toLowerCase();
};

export async function listUsers() {
  const supabaseAdmin: any = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AppUser[];
}

export async function getUserByEmail(email?: string | null) {
  if (!email) {
    return null;
  }

  const supabaseAdmin: any = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as AppUser | null) ?? null;
}

export async function getUserById(id: string) {
  const supabaseAdmin: any = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as AppUser | null) ?? null;
}

export async function upsertOAuthUser(input: {
  email?: string | null;
  name?: string | null;
  authProviderId?: string | null;
}) {
  if (!input.email) {
    throw new Error("Email is required to upsert OAuth user.");
  }

  const supabaseAdmin: any = getSupabaseAdmin();
  const payload = {
    email: input.email,
    name: input.name ?? null,
    username: createUsernameFromName(input.name, input.email),
    auth_provider_id: input.authProviderId ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(payload, { onConflict: "email" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AppUser;
}

export async function createCredentialsUser(input: {
  email: string;
  name: string;
  hashedPassword: string;
}) {
  const supabaseAdmin: any = getSupabaseAdmin();
  const payload = {
    email: input.email,
    name: input.name,
    username: createUsernameFromName(input.name, input.email),
    hashed_password: input.hashedPassword,
  };

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AppUser;
}

export async function saveArticleForUser(input: {
  userId: string;
  articleId: string;
}) {
  const supabaseAdmin: any = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("user_saved_articles").upsert(
    {
      user_id: input.userId,
      article_id: input.articleId,
    },
    { onConflict: "user_id,article_id" }
  );

  if (error) {
    throw error;
  }
}

export async function listSavedArticleIdsForUser(userId: string) {
  const supabaseAdmin: any = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("user_saved_articles")
    .select("article_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: any) => row.article_id as string);
}

