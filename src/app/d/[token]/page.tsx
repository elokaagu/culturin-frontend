"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const InteractiveDeckViewer = dynamic(
  () => import("@/app/components/InteractiveDeckViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-50 dark:bg-[#121212]">
        <p className="animate-pulse text-sm uppercase tracking-[0.2em] text-neutral-500">
          Loading deck…
        </p>
      </div>
    ),
  },
);

export default function PublicDeckPage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";

  if (!token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-50 dark:bg-[#121212]">
        <p className="text-sm text-neutral-500">Invalid deck link.</p>
      </div>
    );
  }

  return <InteractiveDeckViewer token={token} />;
}
