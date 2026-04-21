import { getSupabaseAdmin } from "../libs/supabase";

function generateUsername(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "user";
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\s]/g, "")
    .toLowerCase();
}

async function backfillUsernames() {
  const supabaseAdmin: any = getSupabaseAdmin();
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, username")
    .is("username", null);

  if (error) {
    throw error;
  }

  for (const user of (users ?? []) as any[]) {
    const username = generateUsername(user.name, user.email);
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ username })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }
  }

  console.log(`Updated ${(users ?? []).length} users.`);
}

backfillUsernames().catch((error) => {
  console.error("Error backfilling Supabase users:", error);
  process.exit(1);
});
