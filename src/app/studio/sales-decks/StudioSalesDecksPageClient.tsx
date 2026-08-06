"use client";

import { BarChart3, Copy, ExternalLink, Plus, Presentation, Trash2 } from "lucide-react";
import { Link } from "next-view-transitions";
import { useCallback, useState } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import { deckSharePath, deckShareUrl, formatBytes, isValidSlug, slugify } from "@/lib/deckLinks";
import type { SalesDeck } from "@/lib/salesDecks/types";
import { SUPABASE_SALES_DECKS_BUCKET } from "@/lib/storageConstants";

import { useStudioConfirm } from "../_components/StudioConfirmDialog";

type Props = {
  initialDecks: SalesDeck[];
  viewCounts: Record<string, number>;
  hasDb: boolean;
};

export function StudioSalesDecksPageClient({ initialDecks, viewCounts: initialCounts, hasDb }: Props) {
  const { supabase, user } = useSupabaseAuth();
  const confirm = useStudioConfirm();
  const [decks, setDecks] = useState(initialDecks);
  const [viewCounts, setViewCounts] = useState(initialCounts);
  const [showUpload, setShowUpload] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("sales_decks")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (data as SalesDeck[]) || [];
    setDecks(list);
    if (list.length === 0) {
      setViewCounts({});
      return;
    }
    const { data: sessions } = await supabase
      .from("deck_view_sessions")
      .select("deck_id")
      .in(
        "deck_id",
        list.map((d) => d.id),
      );
    const counts: Record<string, number> = {};
    for (const s of sessions || []) {
      counts[s.deck_id] = (counts[s.deck_id] || 0) + 1;
    }
    setViewCounts(counts);
  }, [supabase]);

  const copyLink = async (deck: SalesDeck) => {
    try {
      await navigator.clipboard.writeText(deckShareUrl(deck));
      setMessage("Share link copied.");
    } catch {
      setMessage("Could not copy link.");
    }
  };

  const deleteDeck = async (deck: SalesDeck) => {
    if (!supabase) return;
    const ok = await confirm({
      title: "Delete deck?",
      description: `“${deck.title}” will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await supabase.storage.from(SUPABASE_SALES_DECKS_BUCKET).remove([deck.file_path]);
    const { error } = await supabase.from("sales_decks").delete().eq("id", deck.id);
    if (error) {
      setMessage("Could not delete deck.");
      return;
    }
    setMessage("Deck deleted.");
    await refresh();
  };

  const toggleStatus = async (deck: SalesDeck) => {
    if (!supabase) return;
    const next = deck.status === "live" ? "archived" : "live";
    const { error } = await supabase.from("sales_decks").update({ status: next }).eq("id", deck.id);
    if (error) {
      setMessage("Could not update status.");
      return;
    }
    await refresh();
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600 dark:text-white/65">
          {decks.length} {decks.length === 1 ? "deck" : "decks"}
        </p>
        <button
          type="button"
          onClick={() => setShowUpload(true)}
          disabled={!hasDb || !supabase || !user}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Upload PDF
        </button>
      </div>

      {message ? (
        <p className="mt-4 text-sm text-neutral-600 dark:text-white/70" role="status">
          {message}
        </p>
      ) : null}

      {!hasDb ? (
        <p className="mt-8 rounded-2xl border border-neutral-200 px-5 py-10 text-center text-sm text-neutral-600 dark:border-white/10 dark:text-white/65">
          Database is not configured. Check Supabase env vars.
        </p>
      ) : decks.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-white/15">
          <Presentation className="mx-auto h-8 w-8 text-neutral-400 dark:text-white/40" aria-hidden />
          <p className="mt-4 font-display text-xl font-semibold dark:text-white">No decks yet</p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
            Upload a partner or brand PDF to get a shareable interactive link with analytics.
          </p>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-semibold transition hover:border-neutral-500 dark:border-white/20 dark:hover:border-white/40"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Upload PDF
          </button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-neutral-950/80">
          {decks.map((deck) => (
            <li key={deck.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-display text-lg font-semibold dark:text-white">{deck.title}</h2>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                      deck.status === "live"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-white/65",
                    ].join(" ")}
                  >
                    {deck.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-neutral-500 dark:text-white/55">
                  {deck.file_name} · {formatBytes(deck.file_size)} · {viewCounts[deck.id] || 0} views
                  {deck.custom_slug ? ` · /d/${deck.custom_slug}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyLink(deck)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold transition hover:border-neutral-400 dark:border-white/15 dark:hover:border-white/35"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy link
                </button>
                <a
                  href={deckSharePath(deck)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold no-underline transition hover:border-neutral-400 dark:border-white/15 dark:hover:border-white/35"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Open
                </a>
                <Link
                  href={`/studio/sales-decks/${deck.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold no-underline transition hover:border-neutral-400 dark:border-white/15 dark:hover:border-white/35"
                >
                  <BarChart3 className="h-3.5 w-3.5" aria-hidden />
                  Analytics
                </Link>
                <button
                  type="button"
                  onClick={() => toggleStatus(deck)}
                  className="px-2 py-2 text-xs font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-white/55 dark:hover:text-white"
                >
                  {deck.status === "live" ? "Archive" : "Go live"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteDeck(deck)}
                  className="rounded-lg p-2 text-neutral-400 transition hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`Delete ${deck.title}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showUpload && supabase && user ? (
        <DeckUploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={async () => {
            setShowUpload(false);
            setMessage("Deck uploaded.");
            await refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function DeckUploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const { supabase, user } = useSupabaseAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requireEmail, setRequireEmail] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);
  const [password, setPassword] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user || !file) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Add a title.");
      return;
    }
    const trimmedSlug = customSlug.trim().toLowerCase();
    if (trimmedSlug && !isValidSlug(trimmedSlug)) {
      setError("Custom link must be lowercase letters, numbers, and hyphens.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("PDF must be under 50MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const deckId = crypto.randomUUID();
      const path = `${user.id}/${deckId}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_SALES_DECKS_BUCKET)
        .upload(path, file, { contentType: "application/pdf", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(SUPABASE_SALES_DECKS_BUCKET).getPublicUrl(path);

      const { error: insertError } = await supabase.from("sales_decks").insert({
        id: deckId,
        title: trimmedTitle,
        description: description.trim() || null,
        file_path: path,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        require_email: requireEmail,
        allow_download: allowDownload,
        custom_slug: trimmedSlug || null,
        created_by: user.id,
        status: "live",
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("That custom link is already in use.");
          setUploading(false);
          return;
        }
        throw insertError;
      }

      if (password.trim()) {
        await supabase.rpc("set_deck_password", {
          p_deck_id: deckId,
          p_password: password.trim(),
        });
      }

      onUploaded();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Has migration 038 been applied?");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-white/10">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Upload deck</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
              placeholder="Partner pitch — Summer 2026"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
            />
          </label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-600 dark:border-white/20 dark:text-white/65">
            {file ? file.name : "Choose a PDF (max 50MB)"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={requireEmail} onChange={(e) => setRequireEmail(e.target.checked)} className="mt-1" />
            Require viewer email
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={allowDownload} onChange={(e) => setAllowDownload(e.target.checked)} className="mt-1" />
            Allow download
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Password (optional)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Custom link (optional)</span>
            <div className="mt-1.5 flex overflow-hidden rounded-xl border border-neutral-200 dark:border-white/15">
              <span className="border-r border-neutral-200 px-3 py-2.5 text-xs text-neutral-500 dark:border-white/15">/d/</span>
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(slugify(e.target.value))}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm"
                placeholder="nike-summer-2026"
              />
            </div>
          </label>
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 dark:text-white/65">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
