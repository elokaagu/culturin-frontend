"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Notice, formatAdminDate } from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import { studioCreateButtonClass } from "@/app/admin/_components/StudioCulturinListKit";
import { studioFieldInputClass, studioGhostButtonClass, studioPanelClass } from "@/app/admin/_lib/studioTheme";
import { ArticleRichEditor, type ArticleRichEditorHandle } from "@/app/admin/articles/_components/ArticleRichEditor";
import type { Broadcast, SendProgress } from "@/lib/email/broadcasts";
import { renderBroadcastHtml } from "@/lib/email/broadcastRender";
import { cn } from "@/lib/utils";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[color:var(--c-muted)]">{hint}</span> : null}
    </label>
  );
}

/** Live preview of exactly what subscribers will receive, sized to its content. */
function EmailPreview({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  const fit = () => {
    const doc = ref.current?.contentDocument;
    if (doc?.body) setHeight(Math.max(400, doc.documentElement.scrollHeight));
  };
  return (
    <iframe
      ref={ref}
      title="Email preview"
      srcDoc={html}
      onLoad={fit}
      sandbox="allow-same-origin"
      className="w-full rounded-xl border border-[color:var(--c-rule)] bg-[#f6f1ea]"
      style={{ height }}
    />
  );
}

/** Warm-up steps for a new sending domain: small, engaged batches first. */
const WARMUP_STEPS = [50, 150, 400];

function recommendedStep(sent: number, remaining: number): number | null {
  const next = sent === 0 ? 50 : sent < 200 ? 150 : sent < 600 ? 400 : null;
  return next !== null && next < remaining ? next : null;
}

function SendPanel({
  progress,
  busy,
  lastSentAt,
  onSend,
}: {
  progress: SendProgress;
  busy: boolean;
  lastSentAt: string | null;
  onSend: (limit: number | null) => void;
}) {
  const { sent, remaining, total } = progress;
  const recommended = recommendedStep(sent, remaining);
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
  const steps = WARMUP_STEPS.filter((n) => n < remaining);

  return (
    <section className={cn(studioPanelClass, "mt-6 flex flex-col gap-4")}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">Send in stages</h2>
        <p className="m-0 text-sm tabular-nums text-[color:var(--c-muted)]">
          {sent.toLocaleString()} of {total.toLocaleString()} sent{remaining > 0 ? ` · ${remaining.toLocaleString()} to go` : ""}
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--c-rule)]" aria-hidden>
        <div className="h-full rounded-full bg-[color:var(--c-accent)] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="m-0 max-w-2xl text-sm leading-relaxed text-[color:var(--c-muted)]">
        {sent === 0
          ? "Start small so inboxes learn to trust culturin.com. People most likely to open go first: the Culturin team, then event guests and partners, then site sign-ups, then imported contacts."
          : `Last batch sent ${lastSentAt ? formatAdminDate(lastSentAt) : "recently"}. Before the next one, check Resend for bounces and spam complaints, and leave about a day between batches.`}
        {" "}The email can&apos;t be edited once the first batch has gone.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            disabled={busy}
            onClick={() => onSend(n)}
            className={cn(
              n === recommended ? studioCreateButtonClass : cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold"),
            )}
          >
            Send to next {n}
            {n === recommended ? " (recommended)" : ""}
          </button>
        ))}
        <button
          type="button"
          disabled={busy || remaining === 0}
          onClick={() => onSend(null)}
          className={cn(recommended === null && remaining > 0 ? studioCreateButtonClass : cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold"))}
        >
          {steps.length > 0 ? `Everyone left (${remaining.toLocaleString()})` : `Send to ${remaining.toLocaleString()}`}
        </button>
      </div>
    </section>
  );
}

export function BroadcastEditor({ broadcast, progress }: { broadcast: Broadcast; progress: SendProgress }) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const editorRef = useRef<ArticleRichEditorHandle>(null);
  const isDraft = broadcast.status === "draft" && progress.sent === 0;
  const canSend = (broadcast.status === "draft" || broadcast.status === "partial") && progress.remaining > 0;

  const [subject, setSubject] = useState(broadcast.subject);
  const [preheader, setPreheader] = useState(broadcast.preheader);
  const [body, setBody] = useState<unknown>(broadcast.body);
  const [busy, setBusy] = useState<null | "save" | "test" | "send">(null);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  // Follow the editor so the preview updates as you type.
  useEffect(() => {
    if (!isDraft) return;
    let detach: (() => void) | undefined;
    const timer = setInterval(() => {
      const editor = editorRef.current?.getEditor();
      if (!editor) return;
      clearInterval(timer);
      let pending: ReturnType<typeof setTimeout> | undefined;
      const onUpdate = () => {
        clearTimeout(pending);
        pending = setTimeout(() => {
          setBody(editorRef.current?.getPortableBody() ?? []);
          setDirty(true);
        }, 300);
      };
      editor.on("update", onUpdate);
      detach = () => editor.off("update", onUpdate);
    }, 200);
    return () => {
      clearInterval(timer);
      detach?.();
    };
  }, [isDraft]);

  const previewHtml = useMemo(() => renderBroadcastHtml({ subject, preheader, body }, "#unsubscribe"), [subject, preheader, body]);

  const save = useCallback(async (): Promise<boolean> => {
    const latest = editorRef.current?.getPortableBody() ?? body;
    const res = await fetch("/api/admin/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: broadcast.id, subject, preheader, body: latest }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    if (!res?.ok) {
      setNotice({ tone: "error", text: data?.message ?? "Couldn't save." });
      return false;
    }
    setDirty(false);
    return true;
  }, [body, broadcast.id, preheader, subject]);

  async function onSave() {
    setBusy("save");
    setNotice(null);
    if (await save()) setNotice({ tone: "info", text: "Draft saved." });
    setBusy(null);
  }

  async function sendTest() {
    setNotice(null);
    setBusy("test");
    if (isDraft && !(await save())) return setBusy(null);
    await post({ id: broadcast.id, mode: "test" });
  }

  async function sendBatch(limit: number | null) {
    setNotice(null);
    const count = limit === null ? progress.remaining : Math.min(limit, progress.remaining);
    const ok = await confirm({
      title: `Send to ${count.toLocaleString()} ${count === 1 ? "person" : "people"}?`,
      description:
        progress.sent === 0
          ? `This sends “${subject || "Untitled email"}” to the first ${count.toLocaleString()} people on the list and locks the email from further edits. Send yourself a test first if you haven't.`
          : `The next ${count.toLocaleString()} people who haven't had “${subject || "Untitled email"}” yet. Nobody gets it twice.`,
      confirmLabel: "Send now",
      destructive: false,
    });
    if (!ok) return;
    setBusy("send");
    if (isDraft && !(await save())) return setBusy(null);
    await post({ id: broadcast.id, mode: "batch", limit, confirm: true });
    router.refresh();
  }

  async function post(payload: Record<string, unknown>) {
    const res = await fetch("/api/admin/broadcasts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    setBusy(null);
    setNotice({ tone: res?.ok ? "info" : "error", text: data?.message ?? (res?.ok ? "Done." : "Something went wrong.") });
  }

  return (
    <div>
      <Link href="/admin/emails" className="inline-flex items-center gap-1.5 text-sm text-[color:var(--c-muted)] no-underline hover:text-[color:var(--c-ink)]">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All emails
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
        {isDraft ? "Edit email" : subject || "Untitled email"}
      </h1>

      {!isDraft && broadcast.status !== "partial" ? (
        <p className="mt-2 text-sm text-[color:var(--c-muted)]">
          {broadcast.status === "sending"
            ? `Sending now: ${broadcast.sentCount.toLocaleString()} of ${(broadcast.recipientCount ?? 0).toLocaleString()} so far.`
            : `Sent ${broadcast.sentAt ? formatAdminDate(broadcast.sentAt) : ""} to ${broadcast.sentCount.toLocaleString()} ${broadcast.sentCount === 1 ? "person" : "people"}${broadcast.sentBy ? ` by ${broadcast.sentBy}` : ""}.`}
          {broadcast.failedCount ? ` ${broadcast.failedCount} failed${broadcast.lastError ? `: ${broadcast.lastError}` : ""}.` : ""}
        </p>
      ) : null}

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      {canSend ? <SendPanel progress={progress} busy={busy !== null} lastSentAt={broadcast.sentAt} onSend={(n) => void sendBatch(n)} /> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,620px)]">
        {isDraft ? (
          <section className={cn(studioPanelClass, "flex min-w-0 flex-col gap-5")}>
            <Field label="Subject line">
              <input
                className={studioFieldInputClass}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setDirty(true);
                }}
                maxLength={200}
                placeholder="A night of music, legacy and culture"
              />
            </Field>
            <Field label="Preview text" hint="The line shown after the subject in most inboxes.">
              <input
                className={studioFieldInputClass}
                value={preheader}
                onChange={(e) => {
                  setPreheader(e.target.value);
                  setDirty(true);
                }}
                maxLength={250}
              />
            </Field>
            <Field
              label="Email"
              hint="Heading 2 for the title, Heading 4 for the small orange label, quote for a pull quote. Add photos with the image button."
            >
              <ArticleRichEditor ref={editorRef} initialBody={broadcast.body} />
            </Field>

            <div className="flex flex-wrap items-center gap-3 border-t border-[color:var(--c-rule)] pt-5">
              <button type="button" onClick={onSave} disabled={busy !== null} className={cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold")}>
                {busy === "save" ? "Saving…" : dirty ? "Save draft" : "Saved"}
              </button>
              <button type="button" onClick={() => void sendTest()} disabled={busy !== null} className={cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold")}>
                {busy === "test" ? "Sending test…" : "Send me a test"}
              </button>
              {busy === "send" ? <span className="ml-auto text-sm text-[color:var(--c-muted)]">Sending… keep this tab open</span> : null}
            </div>
          </section>
        ) : null}

        <section className="min-w-0">
          <p className="m-0 mb-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Preview</p>
          <EmailPreview html={previewHtml} />
        </section>
      </div>
    </div>
  );
}
