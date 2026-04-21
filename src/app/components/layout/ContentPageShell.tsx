import type { ReactNode } from "react";

import Header from "../Header";

type ContentPageShellProps = {
  children: ReactNode;
  /** Extra classes for `<main>` (layout, spacing, typography). */
  mainClassName?: string;
  /** Classes for the inner centered column (width, flex, gaps). */
  innerClassName?: string;
};

const defaultMainClassName =
  "flex justify-center bg-black px-5 pb-12 pt-[var(--header-offset)] text-white";

const defaultInnerClassName = "flex w-full max-w-3xl flex-col gap-6";

/**
 * Shared app shell: fixed header + centered content column.
 * Use for long-form marketing/editorial pages that do not need a custom grid.
 */
export function ContentPageShell({
  children,
  mainClassName = defaultMainClassName,
  innerClassName = defaultInnerClassName,
}: ContentPageShellProps) {
  return (
    <>
      <Header />
      <main className={mainClassName}>
        <div className={innerClassName}>{children}</div>
      </main>
    </>
  );
}
