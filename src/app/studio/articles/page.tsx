import type { Metadata } from "next";
import { StudioArticleForm } from "./StudioArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & guides",
  description: "Create or update CMS blog and guide entries.",
};

export default function StudioArticlesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">CMS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Articles &amp; guides</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Saved entries appear in <span className="text-neutral-800 dark:text-white/80">/articles</span> and on the home page when
        featured in your CMS.
      </p>
      <StudioArticleForm />
    </div>
  );
}
