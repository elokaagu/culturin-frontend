"use client";

import ReactPlayer from "react-player";

export type VideoPlayerProps = {
  /** Any URL react-player supports (YouTube, Vimeo, direct MP4, etc.). */
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** Extra classes on the outer responsive shell (width, max-width, radius). */
  className?: string;
  /** Override default 16/9 box, e.g. `aspect-[4/3]` or `aspect-square`. */
  aspectClassName?: string;
};

/**
 * Responsive embed: fills an aspect-ratio box; avoids fixed px layout and negative margins.
 */
export default function VideoPlayer({
  src,
  autoplay = true,
  muted = true,
  loop = true,
  controls = false,
  className = "",
  aspectClassName = "aspect-video",
}: VideoPlayerProps) {
  if (!src.trim()) {
    return null;
  }

  const shell = `relative w-full overflow-hidden rounded-lg bg-black ${aspectClassName} ${className}`.trim();

  return (
    <div className={shell}>
      <div className="absolute inset-0">
        <ReactPlayer
          url={src}
          width="100%"
          height="100%"
          controls={controls}
          playing={autoplay}
          muted={muted}
          loop={loop}
          playsinline
          config={{
            youtube: {
              playerVars: { modestbranding: 1, playsinline: 1 },
            },
          }}
        />
      </div>
    </div>
  );
}
