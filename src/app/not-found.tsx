import { Link } from "next-view-transitions";

import IslandNav from "./components/IslandNav";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED } from "@/lib/theme/culturinTokens";

export default function NotFoundPage() {
  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main
        className="flex min-h-dvh flex-col items-center justify-center px-5 pb-16 text-center"
        style={{ paddingTop: "8rem" }}
      >
        <div className="flex max-w-lg flex-col items-center gap-4">
          <h1
            className="text-3xl font-medium sm:text-4xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Page not found
          </h1>
          <p className="text-base" style={{ color: EDITORIAL_MUTED }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--c-accent)" }}
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
