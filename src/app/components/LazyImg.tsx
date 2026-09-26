"use client";

import { useCallback, useState, type ImgHTMLAttributes } from "react";

/**
 * Drop-in `<img>` for spots that can't use next/image (avatars, admin previews, user
 * uploads): defers loading until near the viewport, decodes off the main thread, and
 * fades from a blur to sharp once loaded.
 */
export default function LazyImg({ className, onLoad, onError, alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [ready, setReady] = useState(false);

  // Cached images can finish before React attaches onLoad, so check on mount.
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setReady(true);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional plain img (see component doc)
    <img
      {...rest}
      ref={ref}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={(e) => {
        setReady(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setReady(true);
        onError?.(e);
      }}
      className={[className, "transition-[opacity,filter] duration-500 ease-out motion-reduce:transition-none", ready ? "opacity-100 blur-0" : "opacity-0 blur-md"]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
