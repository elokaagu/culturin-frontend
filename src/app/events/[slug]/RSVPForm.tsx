"use client";

import { useState } from "react";

export default function RSVPForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Placeholder — wire to your mailing list / Supabase table when ready.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="mt-10 max-w-md">
        <p className="text-lg font-medium" style={{ color: "#1c1a17" }}>
          You&rsquo;re on the list.
        </p>
        <p className="mt-2 text-sm" style={{ color: "#6b6456" }}>
          We&rsquo;ll be in touch with details, tickets, and everything you need to know before the night.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-none border-b-2 bg-transparent px-0 py-3 text-base outline-none transition placeholder:text-[#9e9080] focus:border-[#1c1a17]"
        style={{ borderColor: "#9e9080", color: "#1c1a17" }}
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-opacity disabled:opacity-60"
        style={{ background: "#1c1a17", color: "#e8e3da" }}
      >
        {loading ? "Sending…" : "Request Access"}
      </button>
    </form>
  );
}
