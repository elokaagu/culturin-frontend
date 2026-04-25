import Header from "../../components/Header";

export default function ArticleDetailLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white antialiased">
        <div className="relative w-full pt-[var(--header-offset)]">
          <div className="aspect-[16/10] min-h-[18rem] w-full animate-pulse bg-white/10 sm:aspect-[16/8] sm:min-h-[22rem] lg:min-h-[30rem]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" aria-hidden />
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
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
          <div className="mx-auto flex w-full max-w-[min(100%,38rem)] flex-col gap-3">
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-[88%] animate-pulse rounded bg-white/6" />
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/6" />
          </div>
        </div>
      </main>
    </>
  );
}
