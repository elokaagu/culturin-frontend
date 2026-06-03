import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listCurators } from "../../lib/cms/queries";
import { getShowcaseCuratorCards } from "../../lib/cms/showcaseContent";
import type { curatorCard } from "@/lib/interface";

export const metadata: Metadata = {
  title: "Curators",
  description: "Editorial partners and voices that Culturin is proud to feature.",
};

export default async function CuratorsPage() {
  const db = getCmsDbOrNull();
  const fromCms = db ? await listCurators(db) : [];
  const curators: curatorCard[] = fromCms.length > 0 ? fromCms : getShowcaseCuratorCards();

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-10 border-b border-neutral-200 pb-6 pt-6 dark:border-white/10">
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-amber-700 no-underline transition hover:text-amber-900 dark:text-amber-400/80 dark:hover:text-amber-300">
                Home
              </Link>
              <span className="px-1 text-neutral-400 dark:text-white/35" aria-hidden>/</span>
              <span className="text-neutral-600 dark:text-white/65">Curators</span>
            </nav>
            <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-5xl">Curators</h1>
            <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-white/70 sm:text-lg">
              Editorial partners and independent voices whose work we are proud to syndicate on Culturin.
            </p>
          </div>

          {curators.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.03]" role="status">
              <p className="m-0 text-neutral-600 dark:text-white/70">No curators yet. Check back soon.</p>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {curators.map((curator) => (
                <li key={curator.slug}>
                  <Link
                    href={`/curators/${curator.slug}`}
                    className="group flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 no-underline transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      {curator.avatarUrl ? (
                        <img
                          src={curator.avatarUrl}
                          alt={curator.name}
                          className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-white/10"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          {curator.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="m-0 text-base font-semibold leading-snug text-neutral-900 dark:text-white">
                          {curator.name}
                        </h2>
                        {curator.tagline ? (
                          <p className="m-0 mt-0.5 text-sm text-neutral-500 dark:text-white/50">{curator.tagline}</p>
                        ) : null}
                      </div>
                    </div>
                    {curator.specialties && curator.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {curator.specialties.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-white/55"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <span className="mt-auto text-xs font-medium text-amber-700 transition group-hover:text-amber-900 dark:text-amber-400/80 dark:group-hover:text-amber-300">
                      View profile →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
