"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type BlurImageProps = Omit<ImageProps, "onLoad"> & {
  /** Wrapper classes when not using `fill` */
  wrapperClassName?: string;
};

/**
 * next/image wrapper that softly fades from a slight blur/scale into the loaded
 * photo. Combined with a real per-image blurDataURL this gives the "blur-in"
 * effect on lazy-loaded imagery. Purely presentational — all Image props pass
 * through.
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
        filter: loaded ? "blur(0px)" : "blur(12px)",
        transform: loaded ? "scale(1)" : "scale(1.02)",
        transition:
          "filter 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}
