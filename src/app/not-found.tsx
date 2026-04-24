import Link from "next/link";

import Header from "./components/Header";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-center text-neutral-900 dark:bg-black dark:text-white">
        <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white/90 px-8 py-12 shadow-sm dark:border-white/10 dark:bg-neutral-950/60 dark:shadow-none">
          <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
          <p className="text-base text-neutral-600 dark:text-white/75">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            Back to home
          </Link>
        </div>
      </main>
    </>
  );
}
