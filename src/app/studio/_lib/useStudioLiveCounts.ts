"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { StudioContentCounts } from "@/lib/studio/getStudioCounts";

type StudioNavCounts = Pick<
  StudioContentCounts,
  | "blogs"
  | "videos"
  | "providers"
  | "curators"
  | "galleryImages"
  | "salesDecks"
  | "subscribers"
  | "partnerInquiries"
  | "eventRsvps"
  | "galleryDownloads"
  | "cardApplications"
>;

/**
 * Layout server props don't always re-run on soft Studio navigations.
 * Keep badge counts in sync with the DB on every path change.
 */
export function useStudioLiveCounts(initial: StudioNavCounts): StudioNavCounts {
  const pathname = usePathname();
  const [counts, setCounts] = useState(initial);

  useEffect(() => {
    setCounts(initial);
    // Primitive fields only — avoid resetting on a new object identity each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from server props by value
  }, [
    initial.blogs,
    initial.videos,
    initial.providers,
    initial.curators,
    initial.galleryImages,
    initial.salesDecks,
    initial.subscribers,
    initial.partnerInquiries,
    initial.eventRsvps,
    initial.galleryDownloads,
    initial.cardApplications,
  ]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/studio/counts", { cache: "no-store" });
        if (!res.ok) return;
        const body = (await res.json()) as StudioNavCounts;
        if (!cancelled && body && typeof body.videos === "number") {
          setCounts(body);
        }
      } catch (err) {
        console.error("Studio live counts failed", err);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return counts;
}
