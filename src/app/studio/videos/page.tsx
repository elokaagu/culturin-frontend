import type { Metadata } from "next";
import { StudioVideoForm } from "./StudioVideoForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Create or update Mux video entries in the CMS.",
};

export default function StudioVideosPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">CMS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Videos</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Videos with a valid Mux <span className="text-neutral-800 dark:text-white/80">playback_id</span> can appear on{" "}
        <span className="text-neutral-800 dark:text-white/80">/videos</span>, stream pages, and featured rails.
      </p>
      <StudioVideoForm />
    </div>
  );
}
