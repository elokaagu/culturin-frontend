"use client";

import { ViewTransitions } from "next-view-transitions";

/**
 * Wraps the app so client navigations (via this package’s `Link` and `useTransitionRouter`)
 * use the browser View Transitions API for smooth cross-fades between routes.
 */
export default function ViewTransitionsRoot({ children }: { children: React.ReactNode }) {
  return <ViewTransitions>{children}</ViewTransitions>;
}
