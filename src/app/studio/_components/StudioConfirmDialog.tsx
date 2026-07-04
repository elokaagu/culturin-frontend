"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm button in the destructive (rose) treatment. Defaults to true. */
  destructive?: boolean;
};

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type StudioConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const StudioConfirmContext = createContext<StudioConfirmContextValue | null>(null);

/** Culturin-branded stand-in for `window.confirm`, usable from any Studio page via `useStudioConfirm()`. */
export function useStudioConfirm(): StudioConfirmContextValue {
  const ctx = useContext(StudioConfirmContext);
  if (!ctx) throw new Error("useStudioConfirm must be used within StudioConfirmProvider");
  return ctx;
}

export function StudioConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<StudioConfirmContextValue>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const settle = useCallback(
    (value: boolean) => {
      pending?.resolve(value);
      setPending(null);
    },
    [pending],
  );

  useEffect(() => {
    if (!pending) return;
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") settle(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pending, settle]);

  const value = useMemo(() => confirm, [confirm]);

  return (
    <StudioConfirmContext.Provider value={value}>
      {children}
      {pending ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => settle(false)}
            aria-hidden="true"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="studio-confirm-title"
            aria-describedby={pending.description ? "studio-confirm-description" : undefined}
            className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-white/12 dark:bg-[#181818] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <p
              id="studio-confirm-title"
              className="m-0 font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-white"
            >
              {pending.title}
            </p>
            {pending.description ? (
              <p
                id="studio-confirm-description"
                className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/65"
              >
                {pending.description}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => settle(false)}
                className="inline-flex h-9 items-center rounded-full border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:text-white/85 dark:hover:bg-white/10"
              >
                {pending.cancelLabel ?? "Cancel"}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => settle(true)}
                className={
                  pending.destructive === false
                    ? "inline-flex h-9 items-center rounded-full border border-culturin-700/25 bg-white px-4 text-sm font-semibold text-neutral-900 shadow-sm transition hover:border-culturin-600/40 hover:bg-culturin-50 dark:border-culturin-400/40 dark:bg-white dark:text-black dark:hover:bg-culturin-100"
                    : "inline-flex h-9 items-center rounded-full bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500"
                }
              >
                {pending.confirmLabel ?? "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </StudioConfirmContext.Provider>
  );
}
