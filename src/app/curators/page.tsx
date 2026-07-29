import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listCurators } from "../../lib/cms/queries";
import { getShowcaseCuratorCards } from "../../lib/cms/showcaseContent";
import type { curatorCard } from "@/lib/interface";

export const metadata: Metadata = {
  title: "Curators",
  description: "Editorial partners and voices that Culturin is proud to feature.",
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default async function CuratorsPage() {
  const db = getCmsDbOrNull();
  const fromCms = db ? await listCurators(db) : [];
  const curators: curatorCard[] = fromCms.length > 0 ? fromCms : getShowcaseCuratorCards();

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-16" style={{ paddingTop: "8rem" }}>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-10 border-b pb-6 pt-6" style={{ borderColor: "var(--c-rule)" }}>
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
                Home
              </Link>
              <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>/</span>
              <span style={{ color: "var(--c-muted)" }}>Curators</span>
            </nav>
            <h1 className="m-0 text-3xl font-medium tracking-tight sm:text-5xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Curators
            </h1>
            <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
              Editorial partners and independent voices whose work we are proud to syndicate on Culturin.
            </p>
          </div>

          {curators.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--c-rule)" }} role="status">
              <p className="m-0" style={{ color: "var(--c-muted)" }}>No curators yet. Check back soon.</p>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {curators.map((curator) => (
                <li key={curator.slug}>
                  <Link
                    href={`/curators/${curator.slug}`}
                    className="group flex h-full flex-col gap-4 overflow-hidden rounded-2xl border p-5 no-underline transition hover:-translate-y-0.5"
                    style={{ borderColor: "var(--c-rule)" }}
                  >
                    <div className="flex items-center gap-3">
                      {curator.avatarUrl ? (
                        <img
                          src={curator.avatarUrl}
                          alt={curator.name}
                          className="h-14 w-14 shrink-0 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 1px var(--c-rule)" }}
                        />
                      ) : (
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
                          style={{ background: "rgba(224,138,91,0.15)", color: "var(--c-accent)" }}
                        >
                          {curator.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="m-0 text-base font-medium leading-snug" style={{ ...displayFont, color: "var(--c-ink)" }}>
                          {curator.name}
                        </h2>
                        {curator.tagline ? (
                          <p className="m-0 mt-0.5 text-sm" style={{ color: "var(--c-muted)" }}>{curator.tagline}</p>
                        ) : null}
                      </div>
                    </div>
                    {curator.specialties && curator.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {curator.specialties.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{ background: "rgba(28,26,23,0.06)", color: "var(--c-muted)" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <span className="mt-auto text-xs font-medium transition" style={{ color: "var(--c-accent)" }}>
                      View profile →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
