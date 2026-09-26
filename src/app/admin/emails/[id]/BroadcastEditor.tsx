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
import type { Broadcast } from "@/lib/email/broadcasts";
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

export function BroadcastEditor({ broadcast, recipients }: { broadcast: Broadcast; recipients: number }) {
  const router = useRouter();
  const confirm = useStudioConfirm();
  const editorRef = useRef<ArticleRichEditorHandle>(null);
  const isDraft = broadcast.status === "draft";

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

  async function send(mode: "test" | "all") {
    setNotice(null);
    if (mode === "all") {
      const ok = await confirm({
        title: `Send to ${recipients.toLocaleString()} ${recipients === 1 ? "person" : "people"}?`,
        description: `“${subject || "Untitled email"}” goes to everyone on the mailing list who hasn't unsubscribed. This can't be undone, so send yourself a test first.`,
        confirmLabel: "Send now",
        destructive: false,
      });
      if (!ok) return;
    }
    setBusy(mode === "test" ? "test" : "send");
    if (!(await save())) return setBusy(null);
    const res = await fetch("/api/admin/broadcasts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: broadcast.id, mode, confirm: mode === "all" }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    setBusy(null);
    setNotice({ tone: res?.ok ? "info" : "error", text: data?.message ?? (res?.ok ? "Done." : "Something went wrong.") });
    if (mode === "all") router.refresh();
  }

  return (
    <div>
      <Link href="/admin/emails" className="inline-flex items-center gap-1.5 text-sm text-[color:var(--c-muted)] no-underline hover:text-[color:var(--c-ink)]">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All emails
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
        {isDraft ? "Edit email" : subject || "Untitled email"}
      </h1>

      {!isDraft ? (
        <p className="mt-2 text-sm text-[color:var(--c-muted)]">
          {broadcast.status === "sending"
            ? `Sending now: ${broadcast.sentCount.toLocaleString()} of ${(broadcast.recipientCount ?? 0).toLocaleString()} so far.`
            : `Sent ${broadcast.sentAt ? formatAdminDate(broadcast.sentAt) : ""} to ${broadcast.sentCount.toLocaleString()} ${broadcast.sentCount === 1 ? "person" : "people"}${broadcast.sentBy ? ` by ${broadcast.sentBy}` : ""}.`}
          {broadcast.failedCount ? ` ${broadcast.failedCount} failed${broadcast.lastError ? `: ${broadcast.lastError}` : ""}.` : ""}
        </p>
      ) : null}

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

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
              <button type="button" onClick={() => void send("test")} disabled={busy !== null} className={cn(studioGhostButtonClass, "h-10 px-4 text-sm font-semibold")}>
                {busy === "test" ? "Sending test…" : "Send me a test"}
              </button>
              <button type="button" onClick={() => void send("all")} disabled={busy !== null || recipients === 0} className={cn(studioCreateButtonClass, "ml-auto")}>
                {busy === "send" ? "Sending… keep this tab open" : `Send to ${recipients.toLocaleString()} subscribers`}
              </button>
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
