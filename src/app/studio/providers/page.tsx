import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { listProvidersAsCards } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { StudioProviderForm } from "./StudioProviderForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Providers & experiences",
  description: "Create or update provider and experience cards in the CMS.",
};

export default async function StudioProvidersPage() {
  const db = getCmsDbOrNull();
  const providers = db ? await listProvidersAsCards(db) : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">CMS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Providers &amp; experiences</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Listings are available on <span className="text-neutral-800 dark:text-white/80">/providers</span>, experience rails, and
        destination-adjacent flows.
      </p>
      <StudioProviderForm />

      <section className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">All providers</h2>
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/50">
            {providers.length} item{providers.length === 1 ? "" : "s"}
          </span>
        </header>

        {!db ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            CMS is not connected in this environment, so providers cannot be listed yet.
          </p>
        ) : providers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            No providers found. Add your first provider above.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {providers.map((provider) => (
              <li
                key={provider.slug.current}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      {provider.eventName || provider.name || "Untitled provider"}
                    </p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/55">/{provider.slug.current}</p>
                    {provider.name ? (
                      <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/65">Business: {provider.name}</p>
                    ) : null}
                    {provider.location ? (
                      <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">Location: {provider.location}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/providers/${provider.slug.current}`}
                    className="inline-flex h-8 shrink-0 items-center rounded-full border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
