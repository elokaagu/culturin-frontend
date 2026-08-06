"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const InteractiveDeckViewer = dynamic(
  () => import("@/app/components/InteractiveDeckViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a]">
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">
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
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-white/60">Invalid deck link.</p>
      </div>
    );
  }

  return <InteractiveDeckViewer token={token} />;
}
