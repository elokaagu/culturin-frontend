"use client";
import React from "react";
import { Search } from "styled-icons/boxicons-regular";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type SearchBarProps = {
  /** Tighter pill style for the main site header. */
  variant?: "default" | "header";
};

export default function SearchBar({ variant = "default" }: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const q = String(fd.get("search") ?? "").trim();
    if (q) router.push(`/search?query=${encodeURIComponent(q)}`);
  };

  function handleReset() {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  }

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
        className={`flex w-full cursor-pointer flex-row items-center bg-[#262627] font-semibold text-white transition-opacity duration-300 ease-in-out hover:opacity-90 ${shell}`}
      >
        <Search size={iconSize} className="shrink-0 text-white" aria-hidden />
        <div
          className={`ml-2 flex h-full min-h-0 w-full flex-1 flex-row bg-transparent ${variant === "header" ? "" : "text-lg font-semibold text-white"}`}
        >
          <form className="flex w-full flex-1 flex-row" onSubmit={onSearchSubmit}>
            <input
              className={`ml-1.5 h-full w-full flex-1 border-0 bg-transparent outline-none placeholder:text-neutral-500 ${inputText}`}
              type="text"
              name="search"
              placeholder="Search"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              defaultValue={searchParams.get("query")?.toString()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleReset();
              }}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
