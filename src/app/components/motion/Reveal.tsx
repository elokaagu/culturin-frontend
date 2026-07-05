"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in ms before the reveal animation starts once in view */
  delay?: number;
  /** Extra classes on the wrapper */
  className?: string;
  /** How far it travels up as it fades in (px) */
  y?: number;
  as?: "div" | "section" | "li" | "figure" | "article" | "span";
};

/**
 * Fades + rises its children into view the first time they intersect the
 * viewport. Respects prefers-reduced-motion (renders immediately, no motion).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      setSettled(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shown) return;
    // Drop the GPU-layer hint once the transition finishes — dozens of these
    // wrappers on one page otherwise keep every one composited forever.
    const timer = setTimeout(() => setSettled(true), 900 + delay);
    return () => clearTimeout(timer);
  }, [shown, delay]);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: settled ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
