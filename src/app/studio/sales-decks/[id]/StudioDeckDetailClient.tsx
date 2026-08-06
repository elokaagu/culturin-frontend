"use client";

import { Copy, Plus, Trash2 } from "lucide-react";
import { Link } from "next-view-transitions";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import {
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import {
  deckShareUrl,
  formatDuration,
  isValidSlug,
  partnerShareUrl,
  slugify,
} from "@/lib/deckLinks";
import type { DeckPageEvent, DeckPartnerLink, DeckViewSession, SalesDeck } from "@/lib/salesDecks/types";
import { cn } from "@/lib/utils";

import { useStudioConfirm } from "../../_components/StudioConfirmDialog";

type Tab = "analytics" | "settings";

const fieldLabelClass =
  "text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58";

const fieldInputClass =
  "mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35 dark:focus-visible:border-culturin-400/55 dark:focus-visible:ring-culturin-400/20";

const panelClass =
  "rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#121212] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]";

const sectionLabelClass =
  "text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90";

type Props = {
  deck: SalesDeck;
  sessions: DeckViewSession[];
  events: DeckPageEvent[];
  partnerLinks: DeckPartnerLink[];
  initialTab?: Tab;
};

export function StudioDeckDetailClient({
  deck: initialDeck,
  sessions,
  events,
  partnerLinks: initialLinks,
  initialTab = "analytics",
}: Props) {
  const { supabase } = useSupabaseAuth();
  const confirm = useStudioConfirm();
  const [deck, setDeck] = useState(initialDeck);
  const [partnerLinks, setPartnerLinks] = useState(initialLinks);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [message, setMessage] = useState<string | null>(null);

  const partnerLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const link of partnerLinks) map[link.id] = link.label;
    return map;
  }, [partnerLinks]);

  const stats = useMemo(() => {
    const views = sessions.length;
    const unique = new Set(sessions.map((s) => s.viewer_email || s.visitor_id)).size;
    const avgDuration =
      views === 0
        ? 0
        : Math.round(sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / views);
    const completed = sessions.filter((s) => s.completed).length;
    const completionRate = views === 0 ? 0 : Math.round((completed / views) * 100);
    return { views, unique, avgDuration, completionRate };
  }, [sessions]);

  const pageEngagement = useMemo(() => {
    const byPage: Record<number, { totalMs: number; count: number }> = {};
    for (const e of events) {
      if (!byPage[e.page_number]) byPage[e.page_number] = { totalMs: 0, count: 0 };
      byPage[e.page_number].totalMs += e.time_spent_ms;
      byPage[e.page_number].count += 1;
    }
    const maxPage = Math.max(deck.page_count || 0, ...Object.keys(byPage).map(Number), 0);
    return Array.from({ length: maxPage }, (_, i) => {
      const page = i + 1;
      const data = byPage[page];
      return {
        page: `P${page}`,
        avgSeconds: data ? Math.round(data.totalMs / data.count / 1000) : 0,
      };
    });
  }, [events, deck.page_count]);

  const partnerBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sessions) {
      const key = s.partner_link_id
        ? partnerLabelById[s.partner_link_id] || "Partner"
        : "Default link";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([label, views]) => ({ label, views }))
      .sort((a, b) => b.views - a.views);
  }, [sessions, partnerLabelById]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(deckShareUrl(deck));
      setMessage("Share link copied.");
    } catch {
      setMessage("Could not copy link.");
    }
  };

  return (
    <div>
      <Link
        href="/studio/sales-decks"
        className="text-sm font-medium text-culturin-800 no-underline transition hover:text-culturin-600 dark:text-culturin-300 dark:hover:text-culturin-200"
      >
        ← All decks
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
            {deck.title}
          </h1>
          {deck.description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-white/65">
              {deck.description}
            </p>
          ) : null}
        </div>
        <button type="button" onClick={copyLink} className={studioListEditLinkClass}>
          <Copy className="mr-1.5 h-4 w-4" aria-hidden />
          Copy share link
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

      <div className="mt-8 flex gap-1 border-b border-neutral-200 dark:border-white/10">
        {(
          [
            { id: "analytics", label: "Analytics" },
            { id: "settings", label: "Settings" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition",
              tab === item.id
                ? "border-culturin-500 text-culturin-800 dark:border-culturin-400 dark:text-culturin-300"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-white/55 dark:hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "settings" ? (
        <DeckSettingsPanel
          deck={deck}
          partnerLinks={partnerLinks}
          onDeckUpdated={setDeck}
          onPartnerLinksChange={setPartnerLinks}
          setMessage={setMessage}
          confirm={confirm}
          supabase={supabase}
        />
      ) : (
        <div className="mt-8 space-y-10">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Views", value: String(stats.views) },
              { label: "Unique", value: String(stats.unique) },
              { label: "Avg time", value: formatDuration(stats.avgDuration) },
              { label: "Completion", value: `${stats.completionRate}%` },
            ].map((card) => (
              <div key={card.label} className={cn(panelClass, "px-4 py-4")}>
                <p className={sectionLabelClass}>{card.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-neutral-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {partnerBreakdown.length > 0 ? (
            <section>
              <h2 className={sectionLabelClass}>Views by link</h2>
              <ul className={cn(panelClass, "mt-3 divide-y divide-neutral-200 dark:divide-white/10")}>
                {partnerBreakdown.map((row) => (
                  <li
                    key={row.label}
                    className="flex justify-between px-4 py-3 text-sm text-neutral-800 dark:text-white/90"
                  >
                    <span>{row.label}</span>
                    <span className="text-neutral-500 dark:text-white/55">{row.views}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className={sectionLabelClass}>Time per page</h2>
            {pageEngagement.length === 0 ? (
              <p
                className={cn(
                  panelClass,
                  "mt-3 px-5 py-10 text-center text-sm text-neutral-500 dark:text-white/55",
                )}
              >
                No page engagement yet.
              </p>
            ) : (
              <div className={cn(panelClass, "mt-3 h-72 p-4")}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(224,138,91,0.2)" />
                    <XAxis dataKey="page" tick={{ fontSize: 11, fill: "currentColor" }} className="text-neutral-500" />
                    <YAxis tick={{ fontSize: 11, fill: "currentColor" }} unit="s" className="text-neutral-500" />
                    <Tooltip
                      contentStyle={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                      formatter={(value) => [`${Number(value ?? 0)}s avg`, "Time"]}
                    />
                    <Bar dataKey="avgSeconds" fill="#e08a5b" radius={[4, 4, 0, 0]} opacity={0.9} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section>
            <h2 className={sectionLabelClass}>Recent sessions</h2>
            {sessions.length === 0 ? (
              <p
                className={cn(
                  panelClass,
                  "mt-3 px-5 py-10 text-center text-sm text-neutral-500 dark:text-white/55",
                )}
              >
                No views yet.
              </p>
            ) : (
              <div className={cn(panelClass, "mt-3 overflow-x-auto")}>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 dark:border-white/10">
                    <tr>
                      {["Viewer", "Link", "Opened", "Duration", "Page", "Done"].map((h) => (
                        <th key={h} className={cn("px-4 py-3 font-semibold", sectionLabelClass)}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                    {sessions.map((session) => (
                      <tr key={session.id} className="text-neutral-800 dark:text-white/90">
                        <td className="max-w-[12rem] truncate px-4 py-3">
                          {session.viewer_email ||
                            session.viewer_name ||
                            `Anonymous · ${session.visitor_id.slice(0, 8)}`}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-white/55">
                          {session.partner_link_id
                            ? partnerLabelById[session.partner_link_id] || "Partner"
                            : "Default"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-neutral-500 dark:text-white/55">
                          {new Date(session.started_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-white/55">
                          {formatDuration(session.duration_seconds)}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-white/55">
                          {session.max_page_reached}
                          {deck.page_count ? `/${deck.page_count}` : ""}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-white/55">
                          {session.completed ? "Yes" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function DeckSettingsPanel({
  deck,
  partnerLinks,
  onDeckUpdated,
  onPartnerLinksChange,
  setMessage,
  confirm,
  supabase,
}: {
  deck: SalesDeck;
  partnerLinks: DeckPartnerLink[];
  onDeckUpdated: (deck: SalesDeck) => void;
  onPartnerLinksChange: (links: DeckPartnerLink[]) => void;
  setMessage: (msg: string | null) => void;
  confirm: (opts: {
    title: string;
    description?: string;
    confirmLabel?: string;
    destructive?: boolean;
  }) => Promise<boolean>;
  supabase: ReturnType<typeof useSupabaseAuth>["supabase"];
}) {
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || "");
  const [requireEmail, setRequireEmail] = useState(deck.require_email);
  const [allowDownload, setAllowDownload] = useState(deck.allow_download);
  const [customSlug, setCustomSlug] = useState(deck.custom_slug || "");
  const [password, setPassword] = useState("");
  const [clearPassword, setClearPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partnerLabel, setPartnerLabel] = useState("");
  const [partnerSlug, setPartnerSlug] = useState("");

  const hasPassword = !!deck.password_hash;

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const trimmedSlug = customSlug.trim().toLowerCase();
    if (trimmedSlug && !isValidSlug(trimmedSlug)) {
      setMessage("Custom link must be lowercase letters, numbers, and hyphens.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("sales_decks")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        require_email: requireEmail,
        allow_download: allowDownload,
        custom_slug: trimmedSlug || null,
      })
      .eq("id", deck.id)
      .select("*")
      .single();

    if (error) {
      setMessage(error.code === "23505" ? "That custom link is already in use." : "Could not save settings.");
      setSaving(false);
      return;
    }

    if (clearPassword) {
      await supabase.rpc("set_deck_password", { p_deck_id: deck.id, p_password: "" });
    } else if (password.trim()) {
      await supabase.rpc("set_deck_password", { p_deck_id: deck.id, p_password: password.trim() });
    }

    const { data: refreshed } = await supabase.from("sales_decks").select("*").eq("id", deck.id).single();
    onDeckUpdated((refreshed as SalesDeck) || (data as SalesDeck));
    setPassword("");
    setClearPassword(false);
    setSaving(false);
    setMessage("Settings saved.");
  };

  const addPartnerLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const label = partnerLabel.trim();
    const slug = (partnerSlug.trim() || slugify(label)).toLowerCase();
    if (!label || !isValidSlug(slug)) {
      setMessage("Add a partner name and valid slug.");
      return;
    }
    const { data, error } = await supabase
      .from("deck_partner_links")
      .insert({ deck_id: deck.id, label, slug })
      .select("*")
      .single();
    if (error) {
      setMessage(error.code === "23505" ? "That partner slug is already in use." : "Could not create link.");
      return;
    }
    onPartnerLinksChange([data as DeckPartnerLink, ...partnerLinks]);
    setPartnerLabel("");
    setPartnerSlug("");
    setMessage("Partner link created.");
  };

  const deletePartnerLink = async (link: DeckPartnerLink) => {
    if (!supabase) return;
    const ok = await confirm({
      title: "Delete partner link?",
      description: `Remove “${link.label}” (/d/${link.slug}).`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("deck_partner_links").delete().eq("id", link.id);
    if (error) {
      setMessage("Could not delete link.");
      return;
    }
    onPartnerLinksChange(partnerLinks.filter((l) => l.id !== link.id));
    setMessage("Partner link deleted.");
  };

  return (
    <div className="mt-8 space-y-10">
      <form onSubmit={saveSettings} className={cn(panelClass, "max-w-xl space-y-5 p-5 sm:p-6")}>
        <label className="block">
          <span className={fieldLabelClass}>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={fieldInputClass}
          />
        </label>
        <label className="block">
          <span className={fieldLabelClass}>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={cn(fieldInputClass, "resize-none")}
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-neutral-800 dark:text-white/85">
          <input
            type="checkbox"
            checked={requireEmail}
            onChange={(e) => setRequireEmail(e.target.checked)}
            className="mt-1 accent-culturin-500"
          />
          Require viewer email
        </label>
        <label className="flex items-start gap-3 text-sm text-neutral-800 dark:text-white/85">
          <input
            type="checkbox"
            checked={allowDownload}
            onChange={(e) => setAllowDownload(e.target.checked)}
            className="mt-1 accent-culturin-500"
          />
          Allow download
        </label>
        <div>
          <p className={fieldLabelClass}>Password</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/55">
            {hasPassword ? "A password is set. Enter a new one to replace it." : "Optional password gate."}
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value) setClearPassword(false);
            }}
            autoComplete="new-password"
            className={fieldInputClass}
            placeholder={hasPassword ? "New password" : "Set a password"}
          />
          {hasPassword ? (
            <label className="mt-2 flex items-center gap-2 text-sm text-neutral-800 dark:text-white/85">
              <input
                type="checkbox"
                checked={clearPassword}
                onChange={(e) => {
                  setClearPassword(e.target.checked);
                  if (e.target.checked) setPassword("");
                }}
                className="accent-culturin-500"
              />
              Remove password
            </label>
          ) : null}
        </div>
        <label className="block">
          <span className={fieldLabelClass}>Custom link</span>
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
        <button type="submit" disabled={saving} className={studioCreateButtonClass}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>

      <section className={cn(panelClass, "p-5 sm:p-6")}>
        <h2 className={sectionLabelClass}>Partner links</h2>
        <p className="mt-1 max-w-lg text-xs text-neutral-500 dark:text-white/55">
          Unique link per partner so analytics show who opened what.
        </p>
        <form onSubmit={addPartnerLink} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            value={partnerLabel}
            onChange={(e) => {
              setPartnerLabel(e.target.value);
              if (!partnerSlug || partnerSlug === slugify(partnerLabel)) {
                setPartnerSlug(slugify(e.target.value));
              }
            }}
            placeholder="Partner name"
            className={cn(fieldInputClass, "mt-0")}
          />
          <div className="flex overflow-hidden rounded-xl border border-neutral-300 dark:border-white/12 dark:bg-black/60">
            <span className="border-r border-neutral-300 px-3 py-2.5 text-xs text-neutral-500 dark:border-white/12 dark:text-white/45">
              /d/
            </span>
            <input
              value={partnerSlug}
              onChange={(e) => setPartnerSlug(slugify(e.target.value))}
              placeholder="nike"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-culturin-700/25 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-900 transition hover:border-culturin-600/40 hover:bg-culturin-50 dark:border-culturin-400/40 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add link
          </button>
        </form>
        {partnerLinks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            No partner links yet.
          </p>
        ) : (
          <ul className="mt-4 m-0 list-none space-y-3 p-0">
            {partnerLinks.map((link) => (
              <li key={link.id} className={cn(studioListRowClass, "flex items-center gap-3")}>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm font-medium text-neutral-900 dark:text-white">{link.label}</p>
                  <p className="m-0 truncate text-xs text-neutral-500 dark:text-white/55">/d/{link.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(partnerShareUrl(link.slug));
                    setMessage("Partner link copied.");
                  }}
                  className={studioListEditLinkClass}
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => deletePartnerLink(link)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 transition hover:border-rose-400/60 hover:text-rose-700 dark:border-white/18 dark:text-white/65 dark:hover:border-rose-400/40 dark:hover:text-rose-200"
                  aria-label={`Delete ${link.label}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
