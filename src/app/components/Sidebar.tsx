"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "styled-icons/boxicons-regular";

import { GoogleSignInButton } from "./AuthButtons";

type SidebarProps = {
  id?: string;
  onClose: () => void;
};

const linkClass =
  "block px-5 py-4 text-base text-neutral-900 no-underline transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-400 max-[428px]:px-2.5 max-[428px]:py-2.5";

const dropdownItemClass =
  "list-none px-3 py-2.5 text-black [&_a]:block [&_a]:text-black [&_a]:no-underline [&_a:hover]:text-neutral-600";

export default function Sidebar({ id, onClose }: SidebarProps) {
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);

  return (
    <div
      id={id}
      className="fixed inset-0 z-[100] flex h-full w-full animate-fade-in flex-col overflow-x-hidden bg-neutral-50 pt-[var(--header-bar-height)] text-neutral-900 transition-opacity duration-200 ease-out dark:bg-black dark:text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onClick={onClose}
    >
      <nav className="mt-16 flex flex-col px-2" onClick={(e) => e.stopPropagation()}>
        <ul className="m-0 flex list-none flex-col p-0">
          <li className="p-1">
            <Link href="/" className={linkClass} onClick={onClose}>
              Home
            </Link>
          </li>

          <li className="relative p-1">
            <button
              type="button"
              onClick={() => setDestinationsOpen((o) => !o)}
              className="flex w-full items-center gap-2 px-5 py-4 text-left text-base text-neutral-900 max-[428px]:px-2.5 max-[428px]:py-2.5 dark:text-white"
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
                    <Link href="/countries/africa" onClick={onClose}>
                      Africa
                    </Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/asia" onClick={onClose}>
                      Asia
                    </Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/europe" onClick={onClose}>
                      Europe
                    </Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/north-america" onClick={onClose}>
                      North America
                    </Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/countries/south-america" onClick={onClose}>
                      South America
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </li>

          <li className="p-1">
            <Link href="/articles" className={linkClass} onClick={onClose}>
              Travel Guides
            </Link>
          </li>

          <li className="relative p-1">
            <button
              type="button"
              onClick={() => setNearbyOpen((o) => !o)}
              className="flex w-full items-center gap-2 px-5 py-4 text-left text-base text-neutral-900 max-[428px]:px-2.5 max-[428px]:py-2.5 dark:text-white"
              aria-expanded={nearbyOpen}
              aria-controls="sidebar-nearby-menu"
            >
              Nearby
              <ChevronDown size={20} className="shrink-0" aria-hidden />
            </button>
            {nearbyOpen ? (
              <div
                id="sidebar-nearby-menu"
                className="absolute left-0 top-full z-[110] w-[min(100vw-2rem,16rem)] pt-1"
              >
                <ul className="m-0 animate-fade-in list-none rounded-[10px] bg-white py-1 shadow-lg">
                  <li className={dropdownItemClass}>
                    <Link href="/curated-experiences" onClick={onClose}>
                      Experiences
                    </Link>
                  </li>
                  <li className={dropdownItemClass}>
                    <Link href="/search?query=cafe" onClick={onClose}>
                      Cafes
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </li>

          <li className="p-1">
            <Link href="/create" className={linkClass} onClick={onClose}>
              Create
            </Link>
          </li>

          <li className="p-1">
            <Link href="/join-us/advisors" className={linkClass} onClick={onClose}>
              Advisor
            </Link>
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
