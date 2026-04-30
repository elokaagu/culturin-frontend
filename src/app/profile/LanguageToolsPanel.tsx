"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DashboardPayload = {
  profile: {
    target_language: string;
    proficiency_level: string;
    daily_goal: number;
    is_public: boolean;
  };
  stats: {
    total_words: number;
    flashcards_due: number;
    current_streak: number;
  };
  vocab: Array<{
    id: string;
    term: string;
    translation: string | null;
    source_label: string | null;
  }>;
  flashcards: Array<{
    id: string;
    front_text: string;
    back_text: string;
    next_review_at: string;
  }>;
};

export default function LanguageToolsPanel() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [proficiency, setProficiency] = useState("beginner");
  const [dailyGoal, setDailyGoal] = useState(5);
  const [isPublic, setIsPublic] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me/language-tools", { cache: "no-store" });
      const data = (await res.json()) as DashboardPayload & { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setDashboard(data);
      setTargetLanguage(data.profile.target_language);
      setProficiency(data.profile.proficiency_level);
      setDailyGoal(data.profile.daily_goal);
      setIsPublic(data.profile.is_public);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load language tools.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const dueCards = useMemo(() => dashboard?.stats.flashcards_due ?? 0, [dashboard?.stats.flashcards_due]);

  const saveProfile = useCallback(async () => {
    setMessage(null);
    const res = await fetch("/api/me/language-tools", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        targetLanguage,
        proficiencyLevel: proficiency,
        dailyGoal,
        isPublic,
      }),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setMessage(data.message || "Failed to save preferences.");
      return;
    }
    setMessage("Language profile updated.");
    await loadDashboard();
  }, [dailyGoal, isPublic, loadDashboard, proficiency, targetLanguage]);

  const addVocab = useCallback(async () => {
    const term = newTerm.trim();
    if (!term) return;
    setMessage(null);
    const res = await fetch("/api/me/language-tools/vocab", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ term, translation: newTranslation }),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setMessage(data.message || "Failed to add term.");
      return;
    }
    setNewTerm("");
    setNewTranslation("");
    setMessage("Vocabulary term added.");
    await loadDashboard();
  }, [loadDashboard, newTerm, newTranslation]);

  const addFlashcard = useCallback(async () => {
    const frontText = cardFront.trim();
    const backText = cardBack.trim();
    if (!frontText || !backText) return;
    setMessage(null);
    const res = await fetch("/api/me/language-tools/flashcards", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ frontText, backText }),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setMessage(data.message || "Failed to add flashcard.");
      return;
    }
    setCardFront("");
    setCardBack("");
    setMessage("Flashcard added.");
    await loadDashboard();
  }, [cardBack, cardFront, loadDashboard]);

  if (loading) {
    return <p className="mt-8 text-sm text-neutral-600 dark:text-white/60">Loading language tools…</p>;
  }

  return (
    <section className="mt-8 space-y-5 sm:mt-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Language profile</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-neutral-700 dark:text-white/75">
            Target language
            <input
              value={targetLanguage}
              onChange={(ev) => setTargetLanguage(ev.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
            />
          </label>
          <label className="text-sm text-neutral-700 dark:text-white/75">
            Proficiency
            <input
              value={proficiency}
              onChange={(ev) => setProficiency(ev.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
            />
          </label>
          <label className="text-sm text-neutral-700 dark:text-white/75">
            Daily goal (words)
            <input
              type="number"
              min={1}
              value={dailyGoal}
              onChange={(ev) => setDailyGoal(Math.max(1, Number(ev.target.value) || 1))}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
            />
          </label>
          <label className="mt-1 flex items-center gap-2 text-sm text-neutral-700 dark:text-white/75">
            <input type="checkbox" checked={isPublic} onChange={(ev) => setIsPublic(ev.target.checked)} />
            Make my language progress public
          </label>
        </div>
        <button
          type="button"
          onClick={() => void saveProfile()}
          className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white/15"
        >
          Save language settings
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-neutral-500 dark:text-white/50">Words saved</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard?.stats.total_words ?? 0}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-neutral-500 dark:text-white/50">Flashcards due</p>
          <p className="mt-1 text-2xl font-semibold">{dueCards}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-neutral-500 dark:text-white/50">Current streak</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard?.stats.current_streak ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="text-base font-semibold">Vocabulary builder</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Word or phrase"
            value={newTerm}
            onChange={(ev) => setNewTerm(ev.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
          />
          <input
            placeholder="Translation"
            value={newTranslation}
            onChange={(ev) => setNewTranslation(ev.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => void addVocab()}
          className="mt-3 rounded-full border border-neutral-300 px-4 py-1.5 text-sm dark:border-white/20"
        >
          Add term
        </button>
        <ul className="mt-4 space-y-2">
          {(dashboard?.vocab ?? []).slice(0, 8).map((item) => (
            <li key={item.id} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-black/40">
              <span className="font-medium">{item.term}</span>
              {item.translation ? <span className="text-neutral-500 dark:text-white/60"> — {item.translation}</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="text-base font-semibold">Flashcards</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Front text"
            value={cardFront}
            onChange={(ev) => setCardFront(ev.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
          />
          <input
            placeholder="Back text"
            value={cardBack}
            onChange={(ev) => setCardBack(ev.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => void addFlashcard()}
          className="mt-3 rounded-full border border-neutral-300 px-4 py-1.5 text-sm dark:border-white/20"
        >
          Add flashcard
        </button>
        <ul className="mt-4 space-y-2">
          {(dashboard?.flashcards ?? []).slice(0, 8).map((card) => (
            <li key={card.id} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-black/40">
              <span className="font-medium">{card.front_text}</span>
              <span className="text-neutral-500 dark:text-white/60"> {"->"} {card.back_text}</span>
            </li>
          ))}
        </ul>
      </div>

      {message ? <p className="text-sm text-amber-800 dark:text-amber-200/90">{message}</p> : null}
    </section>
  );
}
