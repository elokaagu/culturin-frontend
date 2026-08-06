"use client";

import { BarChart3, Copy, ExternalLink, Plus, Presentation, Trash2 } from "lucide-react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import {
  StudioCulturinListSection,
  studioCancelButtonClass,
  studioCreateButtonClass,
  studioCreateFormShellClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { studioCheckboxClass } from "@/app/studio/_lib/studioTheme";
import { deckSharePath, deckShareUrl, formatBytes, isValidSlug, slugify } from "@/lib/deckLinks";
import { prepareDeckPageImages } from "@/lib/salesDecks/uploadPageImages";
import type { SalesDeck } from "@/lib/salesDecks/types";
import { SUPABASE_SALES_DECKS_BUCKET } from "@/lib/storageConstants";
import { cn } from "@/lib/utils";

import { useStudioConfirm } from "../_components/StudioConfirmDialog";

const fieldLabelClass =
  "text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58";

const fieldInputClass =
  "mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35 dark:focus-visible:border-culturin-400/55 dark:focus-visible:ring-culturin-400/20";

type Props = {
  initialDecks: SalesDeck[];
  viewCounts: Record<string, number>;
  hasDb: boolean;
};

export function StudioSalesDecksPageClient({ initialDecks, viewCounts: initialCounts, hasDb }: Props) {
  const { supabase, user } = useSupabaseAuth();
  const confirm = useStudioConfirm();
  const pathname = usePathname();
  const [decks, setDecks] = useState(initialDecks);
  const [viewCounts, setViewCounts] = useState(initialCounts);
  const [showUpload, setShowUpload] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Prefer the admin API (service role) so soft-nav cache / RLS quirks can't hide decks.
    try {
      const res = await fetch("/api/studio/sales-decks", { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as {
          decks?: SalesDeck[];
          viewCounts?: Record<string, number>;
        };
        if (Array.isArray(body.decks)) {
          setDecks(body.decks);
          setViewCounts(body.viewCounts ?? {});
          return;
        }
      }
    } catch (err) {
      console.error("Studio sales-decks refresh failed", err);
    }

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

  // Always re-fetch on visit. Don't sync from initialDecks after mount — a stale
  // empty RSC payload can otherwise wipe a successful live response.
  useEffect(() => {
    void refresh();
  }, [pathname, refresh]);

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
    const paths = [deck.file_path, ...(deck.page_image_urls || []).map((_, i) => {
      const owner = deck.file_path.split("/")[0];
      return `${owner}/${deck.id}/pages/${i + 1}.jpg`;
    })];
    await supabase.storage.from(SUPABASE_SALES_DECKS_BUCKET).remove(paths);
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

  const countLabel = `${decks.length} item${decks.length === 1 ? "" : "s"}`;

  return (
    <>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowUpload(true)}
          disabled={!hasDb || !supabase || !user}
          className={studioCreateButtonClass}
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          Upload PDF
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className="mt-4 rounded-lg border border-culturin-300/50 bg-culturin-50 px-3 py-2 text-sm text-culturin-900 dark:border-culturin-400/25 dark:bg-culturin-500/10 dark:text-culturin-200"
        >
          {message}
        </p>
      ) : null}

      <StudioCulturinListSection title="All decks" countLabel={countLabel}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Database is not configured. Check Supabase env vars.
          </p>
        ) : decks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center dark:border-white/15">
            <Presentation className="mx-auto h-8 w-8 text-culturin-500/70 dark:text-culturin-300/70" aria-hidden />
            <p className="mt-4 font-display text-xl font-semibold text-neutral-900 dark:text-white">No decks yet</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
              Upload a partner or brand PDF to get a shareable interactive link with analytics.
            </p>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className={cn(studioCreateButtonClass, "mt-6")}
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden />
              Upload PDF
            </button>
          </div>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {decks.map((deck) => (
              <li key={deck.id} className={studioListRowClass}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                        {deck.title}
                      </h2>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                          deck.status === "live"
                            ? "bg-culturin-100 text-culturin-900 dark:bg-culturin-500/15 dark:text-culturin-200"
                            : "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-white/65",
                        )}
                      >
                        {deck.status}
                      </span>
                    </div>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/62">
                      {deck.file_name} · {formatBytes(deck.file_size)} · {viewCounts[deck.id] || 0} views
                      {deck.custom_slug ? ` · /d/${deck.custom_slug}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button type="button" onClick={() => copyLink(deck)} className={studioListEditLinkClass}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Copy
                    </button>
                    <a
                      href={deckSharePath(deck)}
                      target="_blank"
                      rel="noreferrer"
                      className={studioListEditLinkClass}
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Open
                    </a>
                    <Link href={`/studio/sales-decks/${deck.id}`} className={studioListEditLinkClass}>
                      <BarChart3 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Analytics
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleStatus(deck)}
                      className="px-2 py-2 text-xs font-medium text-neutral-500 transition hover:text-culturin-800 dark:text-white/55 dark:hover:text-culturin-300"
                    >
                      {deck.status === "live" ? "Archive" : "Go live"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDeck(deck)}
                      aria-label={`Delete ${deck.title}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-200"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>

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
    </>
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
  const [uploadLabel, setUploadLabel] = useState("Upload");
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
    setUploadLabel("Uploading PDF…");
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
          setUploadLabel("Upload");
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

      setUploadLabel("Preparing fast preview…");
      try {
        await prepareDeckPageImages({
          supabase,
          ownerId: user.id,
          deckId,
          source: file,
          onProgress: ({ page, total, phase }) => {
            setUploadLabel(
              phase === "render"
                ? `Rendering page ${page}/${total}…`
                : `Uploading preview ${page}/${total}…`,
            );
          },
        });
      } catch (previewErr) {
        console.error(previewErr);
        // Deck is still usable via PDF fallback if preview generation fails.
      }

      onUploaded();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Has migration 038/040 been applied?");
    } finally {
      setUploading(false);
      setUploadLabel("Upload");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div className={cn(studioCreateFormShellClass, "max-h-[90vh] w-full max-w-lg overflow-y-auto p-0")}>
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-white/10">
          <h2 className="m-0 font-display text-lg font-semibold text-neutral-900 dark:text-white">Upload deck</h2>
          <button type="button" onClick={onClose} className={studioCancelButtonClass}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <label className="block">
            <span className={fieldLabelClass}>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={fieldInputClass}
              placeholder="Partner pitch — Summer 2026"
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={cn(fieldInputClass, "resize-none")}
            />
          </label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-600 transition hover:border-culturin-400/50 dark:border-white/20 dark:text-white/65 dark:hover:border-culturin-400/40">
            {file ? file.name : "Choose a PDF (max 50MB)"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[color:var(--c-ink)]">
            <input
              type="checkbox"
              checked={requireEmail}
              onChange={(e) => setRequireEmail(e.target.checked)}
              className={studioCheckboxClass}
            />
            Require viewer email
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[color:var(--c-ink)]">
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={(e) => setAllowDownload(e.target.checked)}
              className={studioCheckboxClass}
            />
            Allow download
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Password (optional)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={fieldInputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Custom link (optional)</span>
            <div className="mt-1.5 flex overflow-hidden rounded-xl border border-neutral-300 dark:border-white/12 dark:bg-black/60">
              <span className="border-r border-neutral-300 px-3 py-2.5 text-xs text-neutral-500 dark:border-white/12 dark:text-white/45">
                /d/
              </span>
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(slugify(e.target.value))}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none dark:text-white"
                placeholder="nike-summer-2026"
              />
            </div>
          </label>
          {error ? (
            <p className="rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={studioCancelButtonClass}>
              Cancel
            </button>
            <button type="submit" disabled={uploading || !file} className={studioCreateButtonClass}>
              {uploading ? uploadLabel : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
