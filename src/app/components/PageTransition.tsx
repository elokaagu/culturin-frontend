"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Soft fade + slight vertical motion on App Router navigations.
 * Respects `prefers-reduced-motion` (opacity-only, effectively instant).
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const reduce = prefersReducedMotion === true;

  return (
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={pathname}
        className="w-full"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
        transition={{
          duration: reduce ? 0.01 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
