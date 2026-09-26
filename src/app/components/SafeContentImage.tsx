"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_SRC = "/placeholders/content-cover.svg";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  blurDataURL: string;
  unoptimized?: boolean;
  /** Above-the-fold images: load immediately instead of lazily. */
  priority?: boolean;
};

/**
 * Image wrapper that degrades to a local placeholder if remote assets 404.
 */
export default function SafeContentImage({
  src,
  alt,
  className,
  sizes,
  blurDataURL,
  unoptimized,
  priority = false,
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
  }, [src]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      className={[
        className,
        "transition-all duration-500 ease-out",
        loaded ? "blur-0 opacity-100" : "blur-sm opacity-70",
      ]
        .filter(Boolean)
        .join(" ")}
      sizes={sizes}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurDataURL}
      unoptimized={unoptimized || currentSrc === FALLBACK_SRC}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (currentSrc !== FALLBACK_SRC) setCurrentSrc(FALLBACK_SRC);
      }}
    />
  );
}
