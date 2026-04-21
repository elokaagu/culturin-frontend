import Link from "next/link";

type BackToHomeLinkProps = {
  className?: string;
};

export function BackToHomeLink({
  className = "inline-flex items-center gap-2 rounded-lg font-semibold text-[rgb(250,193,0)] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
}: BackToHomeLinkProps) {
  return (
    <Link href="/" aria-label="Back to home" className={className}>
      <svg
        aria-hidden="true"
        width={16}
        height={16}
        viewBox="0 0 12 12"
        className="text-current"
      >
        <path
          d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      Back
    </Link>
  );
}
