import type { Metadata } from "next";

import { countRecipients, listBroadcasts } from "@/lib/email/broadcasts";
import { listEmailLists } from "@/lib/email/lists";

import { EmailListsSection } from "./EmailListsSection";
import { StudioEmailsPageClient } from "./StudioEmailsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emails",
  description: "Write Culturin emails and send them to the mailing list.",
};

export default async function StudioEmailsPage() {
  const [{ tableReady, items }, recipients, lists] = await Promise.all([listBroadcasts(), countRecipients(), listEmailLists()]);
  const listNames = Object.fromEntries(lists.lists.map((l) => [l.id, l.name]));
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Emails</h1>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--c-muted)]">
        Write an email in Culturin style, send yourself a test, then send it to everyone on the mailing list
        {recipients !== null ? ` (${recipients.toLocaleString()} subscribed)` : ""} or just the guests of one event.
      </p>
      <StudioEmailsPageClient tableReady={tableReady} initial={items} listNames={listNames} />
      {tableReady ? <EmailListsSection ready={lists.ready} lists={lists.lists} /> : null}
    </div>
  );
}
