"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Splits "500+" into a numeric target (500) and a trailing suffix ("+"). Anything non-numeric renders as-is, unanimated. */
function parseValue(raw: string): { target: number; suffix: string } | null {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { target: Number(match[1]), suffix: match[2] };
}

export default function CountUpStat({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseValue(value);
    if (!el || !parsed) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = value;
      return;
    }

    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: parsed.target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${Math.round(counter.n)}${parsed.suffix}`;
      },
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  const parsed = parseValue(value);

  return (
    <p ref={ref} className={className} style={style}>
      {parsed ? "0" : value}
    </p>
  );
}
