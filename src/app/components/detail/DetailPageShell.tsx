import type { ReactNode } from "react";

import Header from "../Header";

type DetailPageShellProps = {
  children: ReactNode;
  /** Constrain the main content column; default matches reference (narrow, centered). */
  contentMaxClassName?: string;
};

const defaultContentMax = "max-w-md sm:max-w-lg";

/**
 * Shared dark “detail” canvas: full black, Culturin header, centered column.
 * Use for experience / video / place detail pages.
 */
export function DetailPageShell({
  children,
  contentMaxClassName = defaultContentMax,
}: DetailPageShellProps) {
  return (
    <>
      <Header />
      <main
        className="min-h-screen bg-black text-white antialiased selection:bg-amber-500/30"
        data-detail-page
      >
        <div
          className={[
            "mx-auto flex w-full flex-col gap-6 px-4 pb-20 pt-[var(--header-offset)] sm:gap-8 sm:px-6 sm:pt-[calc(var(--header-offset)+0.5rem)]",
            contentMaxClassName,
          ].join(" ")}
        >
          {children}
        </div>
      </main>
    </>
  );
}
