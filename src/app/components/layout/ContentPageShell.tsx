import type { ReactNode } from "react";

import IslandNav from "../IslandNav";
import HomeFooter from "../HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";

type ContentPageShellProps = {
  children: ReactNode;
  /** Extra classes for `<main>` (layout, spacing, typography). */
  mainClassName?: string;
  /** Classes for the inner centered column (width, flex, gaps). */
  innerClassName?: string;
};

const defaultMainClassName = "flex justify-center px-5 pb-12 sm:px-14";

const defaultInnerClassName = "flex w-full max-w-3xl flex-col gap-6";

/**
 * Shared app shell for former-platform pages: editorial nav + footer,
 * matching the marketing site's look. `paddingTop: "8rem"` clears the
 * floating IslandNav pill (it isn't a full-width bar, so there's no
 * `--header-offset` to lean on here).
 */
export function ContentPageShell({
  children,
  mainClassName = defaultMainClassName,
  innerClassName = defaultInnerClassName,
}: ContentPageShellProps) {
  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className={mainClassName} style={{ paddingTop: "8rem" }}>
        <div className={innerClassName}>{children}</div>
      </main>
      <HomeFooter />
    </div>
  );
}
