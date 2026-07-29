import { appPageContainerClass } from "@/lib/appLayout";
import IslandNav from "../../components/IslandNav";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";

export default function ArticleDetailLoading() {
  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh antialiased">
        <div className={appPageContainerClass}>
          <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8 pb-10 sm:gap-10 sm:pb-12" style={{ paddingTop: "8rem" }}>
            <div
              className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-white/10"
              aria-hidden
            />
            <div className="flex flex-col gap-4 sm:gap-5" aria-busy="true" aria-live="polite">
              <div className="h-3 w-20 animate-pulse rounded bg-amber-200 dark:bg-amber-300/20" />
              <div className="h-12 max-w-3xl animate-pulse rounded-lg bg-neutral-200 sm:h-14 dark:bg-white/15" />
              <div className="h-6 max-w-2xl animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
              <div className="h-6 w-3/4 max-w-xl animate-pulse rounded bg-neutral-200/80 dark:bg-white/8" />
              <div className="mt-1 flex flex-wrap gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
                <div className="h-4 w-20 animate-pulse rounded bg-neutral-200/70 dark:bg-white/6" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 border-t border-neutral-200 pt-8 dark:border-white/10">
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
              <div className="h-4 w-[88%] animate-pulse rounded bg-neutral-200/80 dark:bg-white/6" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200/80 dark:bg-white/6" />
              <div className="h-8 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200/90 dark:bg-white/8" />
              <div className="h-4 w-[82%] animate-pulse rounded bg-neutral-200/80 dark:bg-white/6" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
