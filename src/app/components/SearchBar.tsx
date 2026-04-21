"use client";

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { Search } from "styled-icons/boxicons-regular";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  /** Tighter pill style for the main site header. */
  variant?: "default" | "header";
};

/**
 * Search UX:
 * - Typing updates local state only (no URL churn on random pages).
 * - Submit (Enter / implicit form submit) navigates to `/search?query=…`.
 * - Clear removes `query` from the current URL and resets the field.
 */
export default function SearchBar({ variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = useId();

  const queryFromUrl = searchParams.get("query") ?? "";
  const [value, setValue] = useState(queryFromUrl);

  useEffect(() => {
    setValue(queryFromUrl);
  }, [queryFromUrl]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const q = value.trim();
      if (q) {
        router.push(`/search?query=${encodeURIComponent(q)}`);
        return;
      }
      router.push("/search");
    },
    [router, value],
  );

  const clear = useCallback(() => {
    setValue("");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("query");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  const shell =
    variant === "header"
      ? "rounded-full px-3 py-2 sm:px-5 sm:py-2.5"
      : "rounded-[10px] p-3";

  const inputText =
    variant === "header"
      ? "text-sm font-medium text-neutral-100 sm:text-base"
      : "text-lg font-semibold text-white";

  const iconSize = variant === "header" ? 18 : 20;

  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div
        className={`flex w-full flex-row items-center bg-[#262627] font-semibold text-white transition-opacity duration-300 ease-in-out hover:opacity-90 ${shell}`}
      >
        <Search size={iconSize} className="shrink-0 text-white" aria-hidden />
        <div
          className={`ml-2 flex h-full min-h-0 w-full flex-1 flex-row items-center bg-transparent ${variant === "header" ? "" : "text-lg font-semibold text-white"}`}
        >
          <form
            role="search"
            className="flex w-full min-w-0 flex-1 flex-row items-center gap-1"
            onSubmit={onSubmit}
          >
            <label htmlFor={inputId} className="sr-only">
              Search articles and destinations
            </label>
            <input
              id={inputId}
              className={`min-w-0 flex-1 border-0 bg-transparent py-0.5 outline-none placeholder:text-neutral-500 ${inputText}`}
              type="text"
              name="search"
              inputMode="search"
              placeholder="Search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && value) {
                  e.preventDefault();
                  clear();
                }
              }}
              autoComplete="off"
              enterKeyHint="search"
            />
            {value ? (
              <button
                type="button"
                className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-neutral-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                aria-label="Clear search"
                onClick={clear}
              >
                ×
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
