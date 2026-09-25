"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
  caption: string;
  blurDataURL?: string;
};

const SLIDE_MS = 6500;

export default function HeroSlideshow({
  slides,
  left,
  right,
}: {
  slides: HeroSlide[];
  left: ReactNode;
  right: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The progress bar's animation doubles as the autoplay timer, so pausing it pauses the slideshow.
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar || count < 2 || reducedMotion) return;
    const animation = bar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: SLIDE_MS,
      easing: "linear",
      fill: "forwards",
    });
    animation.onfinish = () => setActive((i) => (i + 1) % count);
    animationRef.current = animation;
    return () => animation.cancel();
  }, [active, count, reducedMotion]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;
    if (paused) animation.pause();
    else if (animation.playState === "paused") animation.play();
  }, [paused, active]);

  const current = slides[active];

  return (
    <div
      className="relative flex min-h-[calc(100dvh-5.5rem)] flex-col justify-end overflow-hidden rounded-3xl sm:min-h-[calc(100dvh-6.5rem)] sm:rounded-[2rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Snapshots from Culturin events"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            placeholder={slide.blurDataURL ? "blur" : "empty"}
            blurDataURL={slide.blurDataURL}
            style={{
              transform: i === active && !reducedMotion ? "scale(1.06)" : "scale(1)",
              transition: `transform ${SLIDE_MS + 1400}ms linear`,
            }}
          />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div className="relative z-10 px-6 pb-6 sm:px-10 sm:pb-8 lg:px-14 lg:pb-10">
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12">
          <div>{left}</div>
          <div className="flex flex-col items-start md:items-end md:text-right">{right}</div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 flex min-w-0 items-baseline gap-3 text-xs text-white/70" aria-live="polite">
            <span className="shrink-0 font-semibold tabular-nums tracking-[0.2em] text-white">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <span className="truncate">{current?.caption}</span>
          </p>
          {count > 1 ? (
            <div className="flex shrink-0 items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show slide ${i + 1}: ${slide.caption}`}
                  aria-current={i === active}
                  className="relative h-[3px] w-10 overflow-hidden rounded-full bg-white/25 transition hover:bg-white/45 sm:w-14"
                >
                  {i === active ? (
                    <span
                      ref={progressRef}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={{ transform: reducedMotion ? "scaleX(1)" : "scaleX(0)" }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
