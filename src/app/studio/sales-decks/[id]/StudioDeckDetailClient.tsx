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
  deckShareUrl,
  formatDuration,
  isValidSlug,
  partnerShareUrl,
  slugify,
} from "@/lib/deckLinks";
import type { DeckPageEvent, DeckPartnerLink, DeckViewSession, SalesDeck } from "@/lib/salesDecks/types";

import { useStudioConfirm } from "../../_components/StudioConfirmDialog";

type Tab = "analytics" | "settings";

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
        className="text-sm font-medium text-culturin-800 no-underline hover:underline dark:text-culturin-300"
      >
        ← All decks
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
            {deck.title}
          </h1>
          {deck.description ? (
            <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-white/65">{deck.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold dark:border-white/15"
        >
          <Copy className="h-4 w-4" aria-hidden />
          Copy share link
        </button>
      </div>

      {message ? (
        <p className="mt-3 text-sm text-neutral-600 dark:text-white/70" role="status">
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
            className={[
              "border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition -mb-px",
              tab === item.id
                ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-white/55 dark:hover:text-white",
            ].join(" ")}
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
              <div
                key={card.label}
                className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-neutral-950/80"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/55">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>

          {partnerBreakdown.length > 0 ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Views by link</h2>
              <ul className="mt-3 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-white/10 dark:border-white/10">
                {partnerBreakdown.map((row) => (
                  <li key={row.label} className="flex justify-between px-4 py-3 text-sm">
                    <span>{row.label}</span>
                    <span className="text-neutral-500">{row.views}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Time per page</h2>
            {pageEngagement.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-neutral-200 px-5 py-10 text-center text-sm text-neutral-500 dark:border-white/10">
                No page engagement yet.
              </p>
            ) : (
              <div className="mt-3 h-72 rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                    <XAxis dataKey="page" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="s" />
                    <Tooltip formatter={(value) => [`${Number(value ?? 0)}s avg`, "Time"]} />
                    <Bar dataKey="avgSeconds" fill="currentColor" className="text-neutral-800 dark:text-white" opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Recent sessions</h2>
            {sessions.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-neutral-200 px-5 py-10 text-center text-sm text-neutral-500 dark:border-white/10">
                No views yet.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 text-[0.65rem] uppercase tracking-wide text-neutral-500 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Viewer</th>
                      <th className="px-4 py-3 font-semibold">Link</th>
                      <th className="px-4 py-3 font-semibold">Opened</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>
                      <th className="px-4 py-3 font-semibold">Page</th>
                      <th className="px-4 py-3 font-semibold">Done</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                    {sessions.map((session) => (
                      <tr key={session.id}>
                        <td className="max-w-[12rem] truncate px-4 py-3">
                          {session.viewer_email ||
                            session.viewer_name ||
                            `Anonymous · ${session.visitor_id.slice(0, 8)}`}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {session.partner_link_id
                            ? partnerLabelById[session.partner_link_id] || "Partner"
                            : "Default"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                          {new Date(session.started_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {formatDuration(session.duration_seconds)}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {session.max_page_reached}
                          {deck.page_count ? `/${deck.page_count}` : ""}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
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
  confirm: (opts: { title: string; description?: string; confirmLabel?: string; destructive?: boolean }) => Promise<boolean>;
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
      <form onSubmit={saveSettings} className="max-w-xl space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Password</p>
          <p className="mt-1 text-xs text-neutral-500">
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
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
            placeholder={hasPassword ? "New password" : "Set a password"}
          />
          {hasPassword ? (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={clearPassword}
                onChange={(e) => {
                  setClearPassword(e.target.checked);
                  if (e.target.checked) setPassword("");
                }}
              />
              Remove password
            </label>
          ) : null}
        </div>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Custom link</span>
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
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>

      <section className="border-t border-neutral-200 pt-8 dark:border-white/10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Partner links</h2>
        <p className="mt-1 max-w-lg text-xs text-neutral-500">
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
            className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-sm dark:border-white/15"
          />
          <div className="flex overflow-hidden rounded-xl border border-neutral-200 dark:border-white/15">
            <span className="border-r border-neutral-200 px-3 py-2.5 text-xs text-neutral-500 dark:border-white/15">/d/</span>
            <input
              value={partnerSlug}
              onChange={(e) => setPartnerSlug(slugify(e.target.value))}
              placeholder="nike"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-xs font-semibold dark:border-white/15"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add link
          </button>
        </form>
        {partnerLinks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-white/15">
            No partner links yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-white/10 dark:border-white/10">
            {partnerLinks.map((link) => (
              <li key={link.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{link.label}</p>
                  <p className="truncate text-xs text-neutral-500">/d/{link.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(partnerShareUrl(link.slug));
                    setMessage("Partner link copied.");
                  }}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold dark:border-white/15"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => deletePartnerLink(link)}
                  className="p-2 text-neutral-400 hover:text-red-600"
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
