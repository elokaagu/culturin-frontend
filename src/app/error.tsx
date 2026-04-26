"use client";

import { useEffect } from "react";
import { Link } from "next-view-transitions";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-neutral-50 px-6 py-20 text-center text-neutral-900 dark:bg-black dark:text-white">
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-neutral-600 dark:text-white/60">
        A part of the page could not be displayed. This is often a temporary client issue — try again, or return home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 no-underline dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
