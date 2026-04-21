"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const signInButtonClass =
  "flex w-full min-w-0 cursor-pointer flex-col items-center rounded-[10px] bg-white px-2.5 py-2.5 font-semibold text-black transition-colors duration-300 ease-in-out hover:bg-neutral-400 max-[428px]:w-[100px]";

const dropdownPanelClass =
  "absolute right-0 z-[100] w-[200px] text-black";

const dropdownListClass =
  "ml-2.5 mt-2 animate-fade-in rounded-[10px] bg-white py-1 shadow-lg";

const dropdownItemClass =
  "list-none px-3 py-2 text-black [&_a]:text-black [&_a]:no-underline [&_a:hover]:text-neutral-600";

export function GoogleSignInButton() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  if (session) {
    return (
      <div className="relative">
        <button type="button" className={signInButtonClass} onClick={toggleDropdown}>
          {session?.user?.name?.split(" ")[0] || "Guest"}
        </button>
        {showDropdown ? (
          <div className={dropdownPanelClass}>
            <ul className={dropdownListClass}>
              <li className={dropdownItemClass}>
                <Link
                  href={
                    session.user?.id
                      ? `/profile/${session.user.id}`
                      : "/profile"
                  }
                >
                  Profile
                </Link>
              </li>
              <li className={dropdownItemClass}>
                <Link href="/settings">Settings</Link>
              </li>
              <li className={dropdownItemClass}>
                <Link href="/assistant">Culturin AI</Link>
              </li>
              <li className={dropdownItemClass}>
                <button
                  type="button"
                  className="w-full cursor-pointer bg-transparent p-0 text-left text-inherit"
                  onClick={async () => {
                    await signOut({
                      redirect: false,
                      callbackUrl: "/",
                    });
                    setShowDropdown(false);
                  }}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={signInButtonClass}
      onClick={async () => {
        await signIn("google", {
          redirect: true,
          callbackUrl: "/",
        });
      }}
    >
      Sign in
    </button>
  );
}
