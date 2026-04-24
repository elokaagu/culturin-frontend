import { ContentPageShell } from "../components/layout/ContentPageShell";

export default function ArticlesLoading() {
  return (
    <ContentPageShell
      mainClassName="min-h-screen bg-white pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
      innerClassName="flex w-full max-w-7xl flex-col gap-0 px-4 sm:px-6"
    >
      <div className="mb-2 h-4 w-32 animate-pulse rounded bg-white/10" aria-hidden="true" />
      <div className="mb-10 flex flex-col gap-4 pt-2 sm:mb-12" aria-busy="true" aria-live="polite">
        <div className="h-12 max-w-2xl animate-pulse rounded-lg bg-white/10 sm:h-14" />
        <div className="h-20 max-w-md animate-pulse rounded bg-white/8" />
      </div>
      <div
        className="min-h-[280px] w-full animate-pulse rounded-2xl bg-white/10"
        aria-hidden="true"
      />
    </ContentPageShell>
  );
}
