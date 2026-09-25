"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Soft navigations (and next-view-transitions) can reuse a stale RSC payload for a
 * Studio page segment while the layout badge counts re-fetch — so the nav says "1"
 * while the list still renders empty. Force a refresh whenever the Studio path changes.
 */
export function useStudioPathRefresh() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [pathname, router]);
}
