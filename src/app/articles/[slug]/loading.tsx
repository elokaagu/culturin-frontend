import Header from "../../components/Header";

export default function ArticleDetailLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white antialiased">
        <div className="relative w-full pt-[var(--header-offset)]">
          <div className="aspect-[16/9] min-h-[18rem] w-full animate-pulse bg-white/10 sm:min-h-[24rem] lg:min-h-[35rem]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" aria-hidden />
        </div>

        <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:gap-5" aria-busy="true" aria-live="polite">
            <div className="h-3 w-20 animate-pulse rounded bg-amber-300/20" />
            <div className="h-12 max-w-3xl animate-pulse rounded-lg bg-white/15 sm:h-14" />
            <div className="h-6 max-w-2xl animate-pulse rounded bg-white/8" />
            <div className="h-6 w-3/4 max-w-xl animate-pulse rounded bg-white/8" />
            <div className="mt-1 flex flex-wrap gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/6" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 border-t border-white/10 pt-8">
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-[88%] animate-pulse rounded bg-white/6" />
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/6" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/8" />
            <div className="h-4 w-[82%] animate-pulse rounded bg-white/6" />
          </div>
        </div>
      </main>
    </>
  );
}
