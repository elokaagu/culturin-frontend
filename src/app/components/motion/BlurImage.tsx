"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type BlurImageProps = Omit<ImageProps, "onLoad"> & {
  /** Wrapper classes when not using `fill` */
  wrapperClassName?: string;
};

/**
 * next/image wrapper that softly scales the loaded photo into place over
 * Next's own blurDataURL placeholder. Animates only `transform`
 * (compositor-only, no repaint) — an earlier version also animated `filter:
 * blur()`, which forces a repaint of the full image every frame and was a
 * real source of jank on large photos (hero, gallery grid).
 *
 * Deliberately does NOT touch opacity: Next renders `placeholder="blur"` as a
 * `background-image` on this same <img> element, so setting opacity:0 before
 * load hides that placeholder too, leaving a blank gap instead of the
 * intended blur-up preview. Keeping opacity at 1 the whole time lets Next's
 * native blur-up work untouched — the real image just quietly replaces the
 * placeholder the moment it decodes, no fade needed.
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
        transform: loaded ? "scale(1)" : "scale(1.02)",
        transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}
