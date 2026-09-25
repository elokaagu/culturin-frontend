"use client"

import { type ReactNode } from "react"
import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

export type HeroVideoAnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
} as const satisfies Record<
  HeroVideoAnimationStyle,
  { initial: object; animate: object; exit: object }
>

export type HeroVideoModalShellProps = {
  open: boolean
  onClose: () => void
  animationStyle?: HeroVideoAnimationStyle
  /** Outer wrapper for the animated panel (width, max-width). */
  innerClassName?: string
  /** Show the Magic UI floating X above the panel (off when your content has its own header close). */
  showFloatingClose?: boolean
  children: ReactNode
}

/**
 * Magic UI–style backdrop + motion panel. Used by `HeroVideoDialog` and app video overlays (e.g. top videos rail).
 */
export function HeroVideoModalShell({
  open,
  onClose,
  animationStyle = "from-center",
  innerClassName,
  showFloatingClose = true,
  children,
}: HeroVideoModalShellProps) {
  const panel = animationVariants[animationStyle]

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-3 backdrop-blur-md sm:p-5"
          onClick={onClose}
        >
          <motion.div
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn("relative mx-auto w-full max-w-5xl", innerClassName)}
            onClick={(e) => e.stopPropagation()}
          >
            {showFloatingClose ? (
              <button
                type="button"
                aria-label="Close"
                className="absolute -top-14 right-0 z-10 rounded-full bg-neutral-900/50 p-2 text-white ring-1 ring-white/10 backdrop-blur-md transition hover:bg-neutral-800/70 dark:bg-neutral-100/50 dark:text-black dark:hover:bg-neutral-200/90"
                onClick={onClose}
              >
                <XIcon className="size-5" />
              </button>
            ) : null}
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
