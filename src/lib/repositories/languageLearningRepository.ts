import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "../supabaseServiceRole";

export type UserLanguageProfileRow = {
  user_id: string;
  target_language: string;
  proficiency_level: string;
  daily_goal: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type VocabItemRow = {
  id: string;
  user_id: string;
  term: string;
  translation: string | null;
  example_text: string | null;
  source_label: string | null;
  mastery: number;
  created_at: string;
  updated_at: string;
};

export type FlashcardRow = {
  id: string;
  user_id: string;
  vocab_item_id: string | null;
  front_text: string;
  back_text: string;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LearningStatsRow = {
  user_id: string;
  total_words: number;
  flashcards_due: number;
  current_streak: number;
  last_activity_date: string | null;
  updated_at: string;
};

function db(): SupabaseClient {
  return getSupabaseAdmin();
}

async function ensureStatsRow(userId: string): Promise<void> {
  const { error } = await db().from("learning_stats").upsert({ user_id: userId }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function getLanguageDashboard(userId: string): Promise<{
  profile: UserLanguageProfileRow;
  stats: LearningStatsRow;
  vocab: VocabItemRow[];
  flashcards: FlashcardRow[];
}> {
  const profile = await upsertLanguageProfile({ userId });
  await ensureStatsRow(userId);

  const [{ data: statsData, error: statsErr }, { data: vocabData, error: vocabErr }, { data: flashData, error: flashErr }] =
    await Promise.all([
      db().from("learning_stats").select("*").eq("user_id", userId).single(),
      db().from("vocab_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(25),
      db().from("flashcards").select("*").eq("user_id", userId).order("next_review_at", { ascending: true }).limit(25),
    ]);

  if (statsErr) throw statsErr;
  if (vocabErr) throw vocabErr;
  if (flashErr) throw flashErr;

  const nowIso = new Date().toISOString();
  const dueCount = ((flashData ?? []) as FlashcardRow[]).filter((card) => card.next_review_at <= nowIso).length;
  await db().from("learning_stats").update({ flashcards_due: dueCount }).eq("user_id", userId);

  return {
    profile,
    stats: { ...(statsData as LearningStatsRow), flashcards_due: dueCount },
    vocab: (vocabData ?? []) as VocabItemRow[],
    flashcards: (flashData ?? []) as FlashcardRow[],
  };
}

export async function upsertLanguageProfile(input: {
  userId: string;
  targetLanguage?: string;
  proficiencyLevel?: string;
  dailyGoal?: number;
  isPublic?: boolean;
}): Promise<UserLanguageProfileRow> {
  const payload: Record<string, unknown> = { user_id: input.userId };
  if (input.targetLanguage !== undefined) payload.target_language = input.targetLanguage.trim() || "Spanish";
  if (input.proficiencyLevel !== undefined) payload.proficiency_level = input.proficiencyLevel.trim() || "beginner";
  if (input.dailyGoal !== undefined) payload.daily_goal = input.dailyGoal;
  if (input.isPublic !== undefined) payload.is_public = input.isPublic;

  const { data, error } = await db()
    .from("user_language_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as UserLanguageProfileRow;
}

export async function createVocabItem(input: {
  userId: string;
  term: string;
  translation?: string | null;
  exampleText?: string | null;
  sourceLabel?: string | null;
}): Promise<VocabItemRow> {
  const { data, error } = await db()
    .from("vocab_items")
    .insert({
      user_id: input.userId,
      term: input.term.trim(),
      translation: input.translation?.trim() || null,
      example_text: input.exampleText?.trim() || null,
      source_label: input.sourceLabel?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw error;

  await ensureStatsRow(input.userId);
  const { count } = await db().from("vocab_items").select("*", { count: "exact", head: true }).eq("user_id", input.userId);
  await db().from("learning_stats").update({ total_words: count ?? 0 }).eq("user_id", input.userId);

  return data as VocabItemRow;
}

export async function createFlashcard(input: {
  userId: string;
  vocabItemId?: string | null;
  frontText: string;
  backText: string;
  intervalDays?: number;
}): Promise<FlashcardRow> {
  const interval = Math.max(1, input.intervalDays ?? 1);
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + interval);

  const { data, error } = await db()
    .from("flashcards")
    .insert({
      user_id: input.userId,
      vocab_item_id: input.vocabItemId ?? null,
      front_text: input.frontText.trim(),
      back_text: input.backText.trim(),
      interval_days: interval,
      next_review_at: nextReview.toISOString(),
      last_reviewed_at: null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as FlashcardRow;
}

export async function getPublicLanguageSummary(userId: string): Promise<{
  targetLanguage: string;
  proficiencyLevel: string;
  totalWords: number;
  currentStreak: number;
} | null> {
  const { data: profile, error: profileErr } = await db()
    .from("user_language_profiles")
    .select("target_language,proficiency_level,is_public")
    .eq("user_id", userId)
    .maybeSingle();
  if (profileErr) throw profileErr;
  if (!profile || !profile.is_public) return null;

  const { data: stats, error: statsErr } = await db()
    .from("learning_stats")
    .select("total_words,current_streak")
    .eq("user_id", userId)
    .maybeSingle();
  if (statsErr) throw statsErr;

  return {
    targetLanguage: (profile as { target_language: string }).target_language,
    proficiencyLevel: (profile as { proficiency_level: string }).proficiency_level,
    totalWords: ((stats as { total_words?: number } | null)?.total_words ?? 0),
    currentStreak: ((stats as { current_streak?: number } | null)?.current_streak ?? 0),
  };
}
