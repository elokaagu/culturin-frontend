"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

/** Primary nav / sidebar: stable profile URL by NextAuth user id. */
function profileHref(userId: string | undefined) {
  return userId ? `/profile/${userId}` : "/profile";
}

const triggerClass =
  "flex w-full min-w-0 cursor-pointer flex-col items-center rounded-[10px] bg-white px-2.5 py-2.5 font-semibold text-black outline-none transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-black max-[428px]:w-[100px]";

const menuPanelClass =
  "absolute right-0 top-full z-[100] mt-1 w-[min(100vw-1rem,14rem)] rounded-[10px] border border-neutral-200 bg-white py-1 shadow-lg";

const menuListClass = "m-0 list-none p-0";

const menuItemLinkClass =
  "block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-neutral-900 no-underline outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400";

const menuItemButtonClass =
  "w-full cursor-pointer rounded-md border-0 bg-transparent px-3 py-2.5 text-left text-sm font-medium text-neutral-900 outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400";

function useDismissOnEscapeAndOutside(
  open: boolean,
  setOpen: (v: boolean) => void,
  rootRef: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (rootRef.current?.contains(node)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      queueMicrotask(() => triggerRef.current?.focus());
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, rootRef, setOpen, triggerRef]);
}

/**
 * Google OAuth entry + signed-in account menu.
 * Menu is self-contained (internal open state), with escape/outside dismiss and ARIA attributes.
 */
export function GoogleSignInButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useDismissOnEscapeAndOutside(open, setOpen, rootRef, triggerRef);

  if (status === "loading") {
    return (
      <button
        type="button"
        className={`${triggerClass} cursor-wait opacity-60`}
        disabled
        aria-busy="true"
        aria-label="Checking sign-in status"
      >
        Sign in
      </button>
    );
  }

  if (session?.user) {
    const label = session.user.name?.split(" ")[0] ?? "Account";

    return (
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={toggle}
        >
          {label}
        </button>
        {open ? (
          <div className={menuPanelClass} id={menuId} role="presentation">
            <ul className={menuListClass} role="menu" aria-label="Account">
              <li role="none">
                <Link
                  role="menuitem"
                  href={profileHref(session.user.id)}
                  className={menuItemLinkClass}
                  onClick={close}
                >
                  Profile
                </Link>
              </li>
              <li role="none">
                <Link
                  role="menuitem"
                  href="/settings"
                  className={menuItemLinkClass}
                  onClick={close}
                >
                  Settings
                </Link>
              </li>
              <li role="none">
                <Link
                  role="menuitem"
                  href="/assistant"
                  className={menuItemLinkClass}
                  onClick={close}
                >
                  Culturin AI
                </Link>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemButtonClass}
                  onClick={async () => {
                    await signOut({ redirect: false, callbackUrl: "/" });
                    close();
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
      className={triggerClass}
      onClick={() =>
        void signIn("google", { redirect: true, callbackUrl: "/" })
      }
    >
      Sign in
    </button>
  );
}
