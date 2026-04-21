import { ContentPageShell } from "../components/layout/ContentPageShell";

export default function ArticlesLoading() {
  return (
    <ContentPageShell>
      <div
        className="h-5 w-24 animate-pulse rounded bg-white/10"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
        <div className="h-9 max-w-prose animate-pulse rounded bg-white/10 sm:h-10" />
        <div className="h-24 max-w-prose animate-pulse rounded bg-white/10" />
      </div>
      <div
        className="aspect-[980/560] w-full animate-pulse rounded-2xl bg-white/10"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-[92%] animate-pulse rounded bg-white/10" />
      </div>
    </ContentPageShell>
  );
}
