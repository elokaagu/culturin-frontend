"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type BlurImageProps = Omit<ImageProps, "onLoad"> & {
  /** Wrapper classes when not using `fill` */
  wrapperClassName?: string;
};

/**
 * next/image wrapper that softly fades the loaded photo in over Next's own
 * blurDataURL placeholder. Animates only opacity/transform (compositor-only,
 * no repaint) — an earlier version animated `filter: blur()` down to 0, which
 * forces the browser to repaint the full image every frame of the transition
 * and was a real source of jank on large photos (hero, gallery grid). Purely
 * presentational — all Image props pass through.
 */
export default function BlurImage({
  className = "",
  style,
  wrapperClassName,
  ...props
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      onLoad={() => setLoaded(true)}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "scale(1)" : "scale(1.02)",
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}
