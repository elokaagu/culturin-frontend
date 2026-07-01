type CulturinMarkProps = {
  className?: string;
  size?: number;
};

/**
 * Culturin's mark: an open threshold — a ring with a gap (reading as "C")
 * and a sliver of light passing through, tying the brand's "warm room /
 * door ajar" visual territory directly into the identity itself.
 */
export default function CulturinMark({ className = "", size = 28 }: CulturinMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M35.31 12.69 A16 16 0 1 0 35.31 35.31"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M33 17.5 L26 24.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.65}
      />
    </svg>
  );
}
