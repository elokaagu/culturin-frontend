import type { Metadata } from "next";

import { StudioVideoEditorPage } from "../_components/StudioVideoEditorPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New video",
  description: "Create a hosted video entry with thumbnail and player ID.",
};

export default function StudioNewVideoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">New video</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        Add the playback ID from your host (e.g. Mux), optional thumbnail, and metadata. Entries can surface on Videos and
        featured rails.
      </p>

      <div className="mt-8">
        <StudioVideoEditorPage mode="create" initial={null} />
      </div>
    </div>
  );
}
