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
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={blurDataURL}
      unoptimized={unoptimized || currentSrc === FALLBACK_SRC}
      onError={() => {
        if (currentSrc !== FALLBACK_SRC) setCurrentSrc(FALLBACK_SRC);
      }}
    />
  );
}
