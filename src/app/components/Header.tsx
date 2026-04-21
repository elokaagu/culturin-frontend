"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoogleSignInButton } from "./AuthButtons";
import SearchBar from "./SearchBar";
import Hamburger from "hamburger-react";
import Sidebar from "./Sidebar";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const navItemClass =
    "inline-block list-none px-5 py-5 text-white max-[428px]:px-2.5 max-[428px]:py-2.5";
  const navLinkClass =
    "text-white no-underline transition-colors duration-300 ease-in-out hover:text-neutral-400";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[1000] w-full transition-[background] duration-300 ease-out ${
        isScrolled
          ? "bg-gradient-to-r from-black to-neutral-700"
          : "bg-transparent"
      }`}
    >
      <div className="fixed z-[1000] flex min-h-[60px] w-[calc(100%-60px)] flex-row items-center justify-between bg-black px-8 py-10 max-[1024px]:p-5 max-[428px]:w-[calc(100%-20px)] max-[428px]:px-3 max-[428px]:py-5">
        <div className="z-[600] flex max-w-[33%] flex-[0.33] cursor-pointer flex-row items-center gap-2 hover:opacity-80">
          <ul className="m-0 inline-block list-none p-0 text-white">
            <li className="m-0 inline-block list-none p-0">
              <Link href="/">
                <Image
                  src="/culturin_logo.svg"
                  width={100}
                  height={100}
                  draggable={false}
                  alt="culturin logo"
                />
              </Link>
            </li>
          </ul>
          <Link href="/about" className={`${navLinkClass} px-2`}>
            About
          </Link>
        </div>

        <div className="z-[600] min-w-0 flex-1 px-2 max-[1024px]:px-1">
          <SearchBar />
        </div>

        <nav className="z-[600] hidden flex-none flex-row items-center max-[428px]:hidden min-[429px]:flex">
          <ul className="m-0 inline-block list-none p-0 text-white">
            <li className={navItemClass}>
              <Link href="/create" className={navLinkClass}>
                Create
              </Link>
            </li>
            <li className={navItemClass}>
              <Link href="/join-us/advisors" className={navLinkClass}>
                Advisor
              </Link>
            </li>
            <li className={`${navItemClass} relative`}>
              <GoogleSignInButton />
            </li>
          </ul>
        </nav>

        <div className="hidden shrink-0 max-[428px]:block">
          <Hamburger
            rounded
            toggled={isMobileSidebarOpen}
            toggle={handleMobileSidebarToggle}
            size={20}
            onToggle={() => setIsNavOpen(!isNavOpen)}
          />
          {isMobileSidebarOpen ? (
            <Sidebar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
