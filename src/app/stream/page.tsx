"use client";

import { Link } from "next-view-transitions";
import MuxPlayer from "@mux/mux-player-react";

import Header from "../components/Header";

export default function StreamLandingPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <nav className="mb-6" aria-label="Back">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-[rgb(250,193,0)] transition-colors hover:text-neutral-900 dark:hover:text-white max-[428px]:hidden"
          >
            <svg width={16} height={16} viewBox="0 0 12 12" aria-hidden>
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </nav>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <div className="overflow-hidden rounded-[20px]">
            <MuxPlayer
              playbackId="Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s"
              style={{ borderRadius: 20, width: "100%", aspectRatio: "16 / 9" }}
              accentColor="#000"
              metadata={{
                video_id: "video-id-54321",
                video_title: "Munchies",
                viewer_user_id: "user-id-007",
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Munchies</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-neutral-700 dark:text-white/85">
              Join Anthony Bourdain as he explores New York&apos;s culinary culture and
              shares it with the world in a gritty documentation of No Reservations.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
