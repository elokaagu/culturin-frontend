"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { EDITORIAL_BG } from "@/lib/theme/culturinTokens";
import BlurImage from "./BlurImage";

type ParallaxRevealProps = {
  src: string;
  alt: string;
  blurDataURL: string;
  eyebrow: string;
  headline: string;
  body?: string;
};

/**
 * Goals House-style pinned scroll section: the section is taller than the
 * viewport, and while it scrolls through, the image drifts slightly (parallax)
 * and darkens while a headline scales up and fades in, then the whole block
 * releases as the section clears, mimicking a cinematic sticky reveal.
 */
export default function ParallaxReveal({
  src,
  alt,
  blurDataURL,
  eyebrow,
  headline,
  body,
}: ParallaxRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.35, 0.65, 0.65, 0.35]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.92, 1, 1, 1.04]);
  const textY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [40, 0, 0, -30]);

  return (
    <section ref={ref} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: imageY, scale: 1.15 }}>
          <BlurImage
            src={src}
            alt={alt}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="100vw"
            unoptimized
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
        {/* Fade to the page background so the pinned section releases into the next one instead of cutting off hard. */}
        <div
          className="absolute inset-x-0 bottom-0 z-[1] h-[26dvh]"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${EDITORIAL_BG} 100%)` }}
        />
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
          style={{ opacity: textOpacity, scale: textScale, y: textY }}
        >
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/65">
            {eyebrow}
          </p>
          <h2
            className="m-0 max-w-4xl text-4xl font-medium leading-[1.08] text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            {headline}
          </h2>
          {body ? (
            <p className="mt-8 max-w-lg text-base leading-relaxed text-white/75">{body}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
