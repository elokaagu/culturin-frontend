import type { Metadata } from "next";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import ChatComponent from "../components/ChatComponent";

export const metadata: Metadata = {
  title: "Atlas | Culturin",
  description:
    "Ask Culturin Atlas for itineraries, cultural context, and local recommendations.",
};

export default function AssistantPage() {
  return (
    <ContentPageShell
      mainClassName="flex min-h-screen w-full flex-col items-center bg-neutral-50 px-4 pb-6 pt-[var(--header-offset)] text-neutral-900 sm:px-5 dark:bg-black dark:text-white"
      innerClassName="flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-6 lg:max-w-4xl"
    >
      <header className="shrink-0 space-y-2">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Atlas</h1>
        <p className="max-w-prose text-sm text-white/70">
          Your Culturin assistant. Ask for itineraries, cultural context, and local
          recommendations.
        </p>
      </header>

      <div className="flex min-h-[min(32rem,calc(100dvh-14rem))] flex-1 flex-col min-h-0 lg:min-h-[min(36rem,calc(100dvh-13rem))]">
        <ChatComponent />
      </div>
    </ContentPageShell>
  );
}
