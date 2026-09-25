import Image from "next/image";

import { Marquee } from "@/components/ui/marquee";

export type LogoTickerItem = {
  name: string;
  /**
   * Path to a logo file under /public (e.g. "/logos/nike.svg"). Leave unset
   * to fall back to a text wordmark — drop the real asset in and set this
   * to switch that entry over, no other changes needed.
   */
  logoSrc?: string;
  /** Tailwind height override for logos whose artwork is unusually tight or padded. */
  heightClass?: string;
};

export default function LogoTicker({
  items,
  ink,
}: {
  items: LogoTickerItem[];
  /** Text color for wordmark fallbacks (CSS color/var string). */
  ink: string;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <Marquee className="[--duration:28s] [--gap:4.5rem] py-2">
        {items.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex shrink-0 items-center justify-center" style={{ height: 56 }}>
            {item.logoSrc ? (
              <Image
                src={item.logoSrc}
                alt={item.name}
                width={180}
                height={56}
                className={`${item.heightClass ?? "h-10"} w-auto max-w-[120px] object-contain opacity-80 brightness-0 dark:opacity-90 dark:invert`}
                unoptimized
              />
            ) : (
              <span
                className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.08em]"
                style={{ color: ink }}
              >
                {item.name}
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
