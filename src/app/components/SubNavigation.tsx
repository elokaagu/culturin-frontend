import Link from "next/link";

const tabs = [
  { href: "/settings#account", label: "Account" },
  { href: "/settings#notifications", label: "Notifications" },
  { href: "/settings#payments", label: "Payments" },
] as const;

/**
 * Settings sub-nav (hash links). Styled for dark settings shell.
 */
export default function SubNavigation() {
  return (
    <nav
      aria-label="Settings sections"
      className="flex flex-wrap justify-around gap-2 border-b border-white/15 bg-neutral-950/80 px-3 py-2.5"
    >
      {tabs.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-md px-3 py-2 text-sm font-medium text-sky-400 no-underline transition-colors hover:bg-white/5 hover:text-sky-300"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
