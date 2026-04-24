import Image from "next/image";
import { Link } from "next-view-transitions";

import { travelGuideCategories } from "../../lib/travelGuidesCategories";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

const cardClass =
  "group relative block min-h-[18.5rem] w-full overflow-hidden rounded-2xl no-underline outline-none ring-offset-2 transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-amber-400 sm:min-h-[24rem] sm:rounded-3xl dark:ring-offset-black";

/**
 * Full-bleed image, colour overlay, article count + title (Travel Tools / Trippin-style).
 */
export default function TravelGuidesCategoryGrid() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6">
      {travelGuideCategories.map((c) => (
        <Link key={c.href} href={c.href} className={cardClass} aria-label={`${c.title} — ${c.articleCount} articles`}>
          <div className="absolute inset-0 z-0">
            <Image
              src={c.imageUrl}
              alt=""
              fill
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
            <div
              className={`absolute inset-0 z-[1] ${c.overlayClass}`}
              aria-hidden
            />
            <div
              className="absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-black/20 to-black/5"
              aria-hidden
            />
          </div>
          <div className="relative z-10 flex h-full min-h-[18.5rem] flex-col p-5 sm:min-h-[24rem] sm:p-6 md:min-h-[26rem] md:p-7">
            <p className="m-0 self-start rounded border border-white/30 bg-white/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
              {c.articleCount} article{c.articleCount === 1 ? "" : "s"}
            </p>
            <h2 className="m-0 mt-auto text-balance pr-1 text-2xl font-bold leading-tight tracking-tight text-white drop-shadow sm:text-3xl md:max-w-[95%] md:text-3xl">
              {c.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
