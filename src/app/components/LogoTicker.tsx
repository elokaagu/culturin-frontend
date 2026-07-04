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
      <Marquee className="[--duration:28s] [--gap:4rem] py-2">
        {items.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex shrink-0 items-center justify-center" style={{ height: 80 }}>
            {item.logoSrc ? (
              <Image
                src={item.logoSrc}
                alt={item.name}
                width={300}
                height={80}
                className="h-20 w-auto object-contain opacity-80 grayscale"
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
