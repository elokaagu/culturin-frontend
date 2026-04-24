"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type HomeHeroFeaturedProps = {
  story: simpleBlogCard;
  headingId: string;
};

/** Short label for the top-left chip (e.g. city or theme). */
function heroLocationChip(title: string, summary: string): string {
  const beforeColon = title.split(/[:：]/)[0]?.trim() ?? "";
  if (beforeColon.length > 0 && beforeColon.length <= 28) {
    return beforeColon;
  }
  const firstLine = summary.split(/[.!?\n]/)[0]?.trim() ?? "";
  if (firstLine.length > 0 && firstLine.length <= 32) {
    return firstLine.length > 24 ? `${firstLine.slice(0, 22)}…` : firstLine;
  }
  return "Feature";
}

export default function HomeHeroFeatured({ story, headingId }: HomeHeroFeaturedProps) {
  const href = `/articles/${story.currentSlug}`;
  const chip = heroLocationChip(story.title, story.summary);
  const heroSrc = resolveContentImageSrc(story.titleImageUrl);
  const deck = story.summary?.trim() || "Read the full story and explore more on Culturin.";

  return (
    <Link
      href={href}
      className="group relative flex min-h-[min(48vh,26rem)] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628] p-8 text-left shadow-[0_28px_90px_-28px_rgba(0,0,0,0.35)] outline-none transition-[transform,box-shadow] after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-white/10 after:content-[''] focus-visible:ring-2 focus-visible:ring-amber-400/80 sm:min-h-[min(52vh,30rem)] sm:rounded-3xl sm:p-10 lg:min-h-[32rem] lg:max-h-[40rem] dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)]"
    >
      {heroSrc ? (
        <Image
          src={heroSrc}
          alt=""
          fill
          loading="eager"
          priority
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover opacity-40 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-45"
          sizes="(max-width: 1024px) 100vw, 70vw"
          unoptimized={isBundledPlaceholderSrc(heroSrc)}
          aria-hidden
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2137]/95 to-[#0a1628] dark:from-[#050a12] dark:via-[#0a1628]/90 dark:to-[#020508]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay dark:opacity-[0.3]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.14) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <span
          className="inline-flex w-fit border border-white/60 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/95 shadow-sm backdrop-blur-sm sm:text-xs"
          style={{ borderRadius: "9999px" }}
        >
          {chip}
        </span>

        <div className="mt-8 max-w-2xl">
          <h1
            id={headingId}
            className="text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.35rem] md:leading-[1.08]"
          >
            {story.title}
          </h1>
          <p className="mt-4 max-w-prose text-pretty text-sm font-medium leading-relaxed text-white/88 sm:text-base">
            {deck}
          </p>
        </div>

        <div className="mt-auto flex min-h-[6rem] items-end pt-8 sm:min-h-[7rem]">
          <p
            className="line-clamp-1 max-w-full font-black uppercase leading-none tracking-tight text-white/[0.11] [font-size:clamp(1.75rem,4.5vw+0.5rem,3.5rem)]"
            aria-hidden
          >
            {chip.length > 20 ? `${chip.slice(0, 18)}…` : chip}
          </p>
        </div>
      </div>
    </Link>
  );
}
