"use client";

import React, { useRef, useEffect } from "react";
import { useChat, type Message } from "ai/react";
import { useAppAuth } from "./SupabaseAuthProvider";

export default function ChatComponent() {
  const { data: session } = useAppAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const displayName = session?.user?.name?.split(" ")[0] || "You";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <section
        ref={scrollRef}
        aria-label="Conversation"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#111111] px-4 py-4 sm:px-5"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-white/50">
            Start by asking a question below. Replies stream in as Atlas responds.
          </p>
        ) : (
          <ul className="flex list-none flex-col items-stretch gap-6 p-0">
            {messages.map((message: Message) => (
              <li key={message.id} className="flex flex-col gap-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {message.role === "assistant" ? "Atlas" : displayName}
                </div>
                <div className="text-base font-normal leading-relaxed text-white/90">
                  {message.content.split("\n").map((block, index) =>
                    block === "" ? (
                      <br key={`${message.id}-${index}`} />
                    ) : (
                      <p key={`${message.id}-${index}`} className="mb-2 last:mb-0">
                        {block}
                      </p>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {isLoading ? (
          <p className="mt-4 text-sm text-white/50" aria-live="polite">
            Atlas is thinking…
          </p>
        ) : null}
      </section>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 rounded-xl border border-white/10 bg-[#1e1e1e] p-3 sm:p-4"
      >
        <label htmlFor="assistant-input" className="sr-only">
          Message to Atlas
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            id="assistant-input"
            name="message"
            placeholder="How can I help?"
            autoComplete="off"
            rows={2}
            value={input}
            onChange={handleInputChange}
            className="min-h-[3rem] w-full resize-y rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-base font-medium text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 sm:flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
