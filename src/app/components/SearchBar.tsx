"use client";
import React from "react";
import { Search } from "styled-icons/boxicons-regular";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBar() {
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

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex w-full cursor-pointer flex-row items-center rounded-[10px] bg-[#262627] p-3 font-semibold text-white transition-opacity duration-300 ease-in-out hover:opacity-80">
        <Search size={20} className="shrink-0 text-white" />
        <div className="ml-2.5 flex h-full min-h-0 w-full flex-1 flex-row bg-transparent text-lg font-semibold text-white">
          <form className="flex w-full flex-1 flex-row" onSubmit={onSearchSubmit}>
            <input
              className="ml-2.5 h-full w-full flex-1 border-0 bg-transparent text-lg font-semibold text-white outline-none placeholder:text-white/60"
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
