"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type WordRevealSegment = { text: string; highlight?: boolean };

const EASE = "cubic-bezier(0.16,1,0.3,1)";

/**
 * Headline that rises into view word by word the first time it's on screen.
 * Highlighted segments render in the accent colour, italic, with an underline
 * that sweeps in once the words have landed. Respects prefers-reduced-motion.
 */
export default function WordReveal({
  segments,
  className = "",
  style,
  accent,
  stagger = 70,
}: {
  segments: WordRevealSegment[];
  className?: string;
  style?: CSSProperties;
  accent: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let wordIndex = 0;
  const totalWords = segments.reduce((n, s) => n + s.text.trim().split(/\s+/).length, 0);
  const underlineDelay = totalWords * stagger + 350;

  return (
    <h2 ref={ref} className={className} style={style} aria-label={segments.map((s) => s.text).join(" ")}>
      {segments.map((segment, si) => {
        const words = segment.text.trim().split(/\s+/);
        const rendered = words.map((word, wi) => {
          const delay = wordIndex++ * stagger;
          return (
            <span key={`${si}-${wi}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
              <span
                className="inline-block"
                style={{
                  transform: shown ? "translateY(0)" : "translateY(105%)",
                  opacity: shown ? 1 : 0,
                  transition: reduced
                    ? "none"
                    : `transform 0.9s ${EASE} ${delay}ms, opacity 0.9s ${EASE} ${delay}ms`,
                }}
              >
                {word}
              </span>
              {wi < words.length - 1 || si < segments.length - 1 ? "\u00a0" : null}
            </span>
          );
        });

        if (!segment.highlight) return rendered;
        return (
          <em key={si} className="relative inline italic" style={{ color: accent }}>
            {rendered}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[0.14em] left-0 h-[2px] w-[calc(100%-0.35em)] origin-left rounded-full"
              style={{
                background: accent,
                transform: shown ? "scaleX(1)" : "scaleX(0)",
                transition: reduced ? "none" : `transform 0.9s ${EASE} ${underlineDelay}ms`,
              }}
            />
          </em>
        );
      })}
    </h2>
  );
}
