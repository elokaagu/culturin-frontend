import { DetailPageShell } from "../../components/detail/DetailPageShell";

export default function ArticleDetailLoading() {
  return (
    <DetailPageShell contentMaxClassName="max-w-2xl sm:max-w-2xl">
      <div
        className="flex h-4 max-w-full animate-pulse items-center gap-2"
        aria-hidden
      >
        <div className="h-3 w-10 rounded bg-white/10" />
        <div className="h-3 w-2 rounded bg-white/5" />
        <div className="h-3 w-20 rounded bg-white/10" />
        <div className="h-3 w-2 rounded bg-white/5" />
        <div className="h-3 flex-1 rounded bg-white/8" />
      </div>
      <div className="flex flex-col gap-4 sm:gap-5" aria-busy="true" aria-live="polite">
        <div className="h-3 w-20 animate-pulse rounded bg-amber-300/20" />
        <div className="h-10 max-w-2xl animate-pulse rounded-lg bg-white/15 sm:h-12" />
        <div className="h-5 max-w-lg animate-pulse rounded bg-white/8" />
        <div className="h-5 w-2/3 max-w-md animate-pulse rounded bg-white/8" />
        <div className="mt-1 flex flex-wrap gap-3">
          <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/6" />
        </div>
      </div>
      <div
        className="aspect-[16/9] w-full animate-pulse overflow-hidden rounded-3xl bg-white/8 ring-1 ring-white/10"
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-[min(100%,38rem)] flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-white/8" />
        <div className="h-4 w-full animate-pulse rounded bg-white/8" />
        <div className="h-4 w-[88%] animate-pulse rounded bg-white/6" />
        <div className="h-4 w-full animate-pulse rounded bg-white/8" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/6" />
      </div>
    </DetailPageShell>
  );
}
