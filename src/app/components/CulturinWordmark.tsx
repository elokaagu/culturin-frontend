import type { CSSProperties, HTMLAttributes } from "react";

/**
 * The "CULTURIN" text lockup — serif display font, all-caps, matching the
 * giant background signature in the footer. Used next to the icon mark in
 * the nav, the app header, and the footer's top logo so all three read as
 * the same wordmark instead of three different treatments.
 */
export default function CulturinWordmark({
  isDark,
  className = "",
  style,
  ...rest
}: {
  isDark: boolean;
  className?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-display), 'Times New Roman', serif",
        color: isDark ? "#FAC100" : "#1c1a17",
        ...style,
      }}
      {...rest}
    >
      CULTURIN<sup className="text-[0.4em]">TM</sup>
    </span>
  );
}
