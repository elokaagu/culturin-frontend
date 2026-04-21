"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "styled-icons/boxicons-regular";

import { GoogleSignInButton } from "./AuthButtons";

type SidebarProps = {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const linkClass =
  "block px-5 py-4 text-base text-white no-underline transition-colors hover:text-neutral-400 max-[428px]:px-2.5 max-[428px]:py-2.5";

const dropdownItemClass =
  "list-none px-3 py-2.5 text-black [&_a]:block [&_a]:text-black [&_a]:no-underline [&_a:hover]:text-neutral-600";

export default function Sidebar({ isNavOpen: _isNavOpen, setIsNavOpen: _setIsNavOpen }: SidebarProps) {
  const [destinationsOpen, setDestinationsOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex h-full w-full animate-fade-in flex-col overflow-x-hidden bg-black pt-[60px] text-white transition-opacity duration-200 ease-out"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <nav className="mt-16 flex flex-col px-2">
        <ul className="m-0 flex list-none flex-col p-0">
          <li className="p-1">
            <Link href="/" className={linkClass}>
              Home
            </Link>
          </li>

          <li className="relative p-1">
            <button
              type="button"
              onClick={() => setDestinationsOpen((o) => !o)}
              className="flex w-full items-center gap-2 px-5 py-4 text-left text-base text-white max-[428px]:px-2.5 max-[428px]:py-2.5"
              aria-expanded={destinationsOpen}
              aria-controls="sidebar-destinations-menu"
            >
              Destinations
              <ChevronDown size={20} className="shrink-0" aria-hidden />
            </button>
            {destinationsOpen ? (
              <div
                id="sidebar-destinations-menu"
                className="absolute left-0 top-full z-[110] w-[min(100vw-2rem,16rem)] pt-1"
              >
                <ul className="m-0 animate-fade-in list-none rounded-[10px] bg-white py-1 shadow-lg">
                  <li className={dropdownItemClass}>
                    <Link href="/countries/africa">Africa</Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/asia">Asia</Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/europe">Europe</Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/north-america">North America</Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/south-america">South America</Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </li>

          <li className="relative p-1">
            <div className="px-3 py-2">
              <GoogleSignInButton />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
