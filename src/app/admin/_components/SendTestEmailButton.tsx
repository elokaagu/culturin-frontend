"use client";

import { useState } from "react";

export function SendTestEmailButton() {
  const [state, setState] = useState<{ kind: "idle" | "sending" | "ok" | "error"; message?: string }>({ kind: "idle" });

  async function send() {
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { to?: string[]; message?: string };
      if (!res.ok) return setState({ kind: "error", message: data.message ?? "Could not send the test email." });
      setState({ kind: "ok", message: `Sent to ${(data.to ?? []).join(" and ")}.` });
    } catch {
      setState({ kind: "error", message: "Network error. Try again." });
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={send}
        disabled={state.kind === "sending"}
        className="rounded-full border border-[color:var(--c-rule)] px-4 py-1.5 text-xs font-semibold text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)] disabled:opacity-60"
      >
        {state.kind === "sending" ? "Sending…" : "Send test email"}
      </button>
      {state.message ? (
        <span role="status" className={`text-xs ${state.kind === "error" ? "text-rose-500" : "text-emerald-500"}`}>
          {state.message}
        </span>
      ) : null}
    </span>
  );
}
