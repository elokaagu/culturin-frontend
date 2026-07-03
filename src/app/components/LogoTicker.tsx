import Image from "next/image";

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
  const track = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="flex w-max animate-marquee items-center gap-16">
        {track.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex shrink-0 items-center justify-center" style={{ height: 56 }}>
            {item.logoSrc ? (
              <Image
                src={item.logoSrc}
                alt={item.name}
                width={220}
                height={56}
                className="h-14 w-auto object-contain opacity-80 grayscale"
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
      </div>
    </div>
  );
}
