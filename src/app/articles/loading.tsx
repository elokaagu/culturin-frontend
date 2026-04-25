import { ContentPageShell } from "../components/layout/ContentPageShell";

export default function ArticlesLoading() {
  return (
    <ContentPageShell
      mainClassName="min-h-screen bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
      innerClassName="flex w-full max-w-6xl flex-col gap-0 px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-5 h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-white/10 sm:mb-6" aria-hidden="true" />
      <div className="mb-8 border-b border-neutral-200 pb-8 dark:border-white/10 sm:mb-10 sm:pb-10" aria-busy="true" aria-live="polite">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="h-12 w-full max-w-3xl animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10 sm:h-14" />
          <div className="h-20 w-full max-w-xl animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6" aria-hidden="true">
        <div className="min-h-[18.5rem] animate-pulse rounded-2xl bg-neutral-200 dark:bg-white/10 sm:min-h-[24rem] sm:rounded-3xl" />
        <div className="min-h-[18.5rem] animate-pulse rounded-2xl bg-neutral-200 dark:bg-white/10 sm:min-h-[24rem] sm:rounded-3xl" />
        <div className="min-h-[18.5rem] animate-pulse rounded-2xl bg-neutral-200 dark:bg-white/10 sm:min-h-[24rem] sm:rounded-3xl" />
      </div>
    </ContentPageShell>
  );
}
