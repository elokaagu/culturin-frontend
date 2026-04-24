import { Link } from "next-view-transitions";

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
      className="flex flex-wrap justify-around gap-2 border-b border-neutral-200 bg-white/90 px-3 py-2.5 dark:border-white/15 dark:bg-neutral-950/80"
    >
      {tabs.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-md px-3 py-2 text-sm font-medium text-sky-600 no-underline transition-colors hover:bg-neutral-100 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-white/5 dark:hover:text-sky-300"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
