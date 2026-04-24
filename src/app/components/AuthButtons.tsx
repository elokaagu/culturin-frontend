"use client";

import { Link } from "next-view-transitions";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useAppAuth, useSupabaseAuth } from "./SupabaseAuthProvider";

function profileHref(userId: string | undefined) {
  return userId ? `/profile/${userId}` : "/profile";
}

const solidTriggerClass =
  "flex w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-[10px] bg-white px-2.5 py-2.5 font-semibold text-black outline-none transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-black max-[428px]:w-[100px]";

const headerTriggerClass =
  "inline-flex h-9 min-w-[5rem] max-w-[10rem] shrink-0 items-center justify-center gap-1.5 rounded-md border border-neutral-200/90 bg-white px-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10 dark:focus-visible:ring-amber-400/40 dark:focus-visible:ring-offset-neutral-950";

const menuPanelClass =
  "absolute right-0 top-full z-[100] mt-1.5 w-[min(100vw-1rem,14rem)] rounded-lg border border-neutral-200/90 bg-white py-1 shadow-lg dark:border-white/15 dark:bg-neutral-950 dark:shadow-black/30";

const menuListClass = "m-0 list-none p-0";

const menuItemLinkClass =
  "block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-neutral-900 no-underline outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400/60 dark:text-white dark:hover:bg-white/10 dark:focus-visible:bg-white/10";

const menuItemButtonClass =
  "w-full cursor-pointer rounded-md border-0 bg-transparent px-3 py-2.5 text-left text-sm font-medium text-neutral-900 outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400/60 dark:text-white dark:hover:bg-white/10";

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

export type GoogleSignInButtonProps = {
  className?: string;
  /** `header`: compact top-bar style. `default`: wide solid card (e.g. mobile menu). */
  appearance?: "default" | "header";
};

/**
 * Google OAuth (Supabase) + signed-in account menu.
 */
export function GoogleSignInButton({ className, appearance = "default" }: GoogleSignInButtonProps) {
  const { data: session, status } = useAppAuth();
  const { supabase } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useDismissOnEscapeAndOutside(open, setOpen, rootRef, triggerRef);

  const base = appearance === "header" ? headerTriggerClass : solidTriggerClass;
  const triggerCn = [base, className].filter(Boolean).join(" ");

  const signInGoogle = useCallback(() => {
    if (!supabase) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  }, [supabase]);

  if (status === "loading") {
    const loadCn = [
      appearance === "header" ? headerTriggerClass : solidTriggerClass,
      "cursor-wait opacity-60",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <button
        type="button"
        className={loadCn}
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
          className={triggerCn}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={toggle}
        >
          <span className="truncate">{label}</span>
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
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemButtonClass}
                  onClick={async () => {
                    if (supabase) await supabase.auth.signOut();
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
    <button type="button" className={triggerCn} onClick={signInGoogle}>
      Sign in
    </button>
  );
}
