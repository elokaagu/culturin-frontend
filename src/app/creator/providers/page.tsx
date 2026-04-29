import type { Metadata } from "next";

import { fetchMyCreatorSubmissions } from "@/app/creator/creatorSubmissions.server";
import { StudioProviderForm } from "@/app/studio/providers/StudioProviderForm";
import { studioListRowClass } from "@/app/studio/_components/StudioCulturinListKit";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Submit experience listings for review.",
};

function payloadTitle(payload: Record<string, unknown> | null) {
  const name = payload && typeof payload.event_name === "string" ? payload.event_name.trim() : "";
  if (name) return name;
  const n = payload && typeof payload.name === "string" ? payload.name.trim() : "";
  return n || "Untitled draft";
}

export default async function CreatorProvidersPage() {
  const rows = await fetchMyCreatorSubmissions("provider");

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Creator</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Experiences</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Partner and host cards are reviewed before they appear on Experiences and destination pages.
      </p>

      <section className="mt-8 max-w-4xl">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/55">
          New submission
        </h2>
        <div className="mt-4">
          <StudioProviderForm initial={null} workspace="creator" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/55">
          Your submissions
        </h2>
        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No experience submissions yet.
          </p>
        ) : (
          <ul className="mt-4 list-none space-y-3 p-0">
            {rows.map((row) => (
              <li key={row.id} className={studioListRowClass}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">{payloadTitle(row.payload)}</p>
                  <p className="m-0 text-xs text-neutral-500 dark:text-white/45">
                    {row.status} · {new Date(row.created_at).toLocaleString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
