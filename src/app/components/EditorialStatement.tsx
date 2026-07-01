import Link from "next/link";

import { blurForSrc } from "@/lib/culturinImages";
import BlurImage from "./motion/BlurImage";
import Reveal from "./motion/Reveal";

const INK = "#1c1a17";
const INK_MUTED = "#6b6456";

type StatementButton = {
  label: string;
  href: string;
  variant: "solid" | "text";
};

type EditorialStatementProps = {
  eyebrow: string;
  headline: string;
  body: string;
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
  buttons?: StatementButton[];
};

/**
 * OPUS-style alternating editorial block: small tracked eyebrow, large serif
 * headline, body copy, two CTAs (one solid pill, one text-link with chevron),
 * paired with a portrait photo that swaps sides per section.
 */
export default function EditorialStatement({
  eyebrow,
  headline,
  body,
  image,
  imageAlt,
  imageSide,
  buttons = [],
}: EditorialStatementProps) {
  const imageFirst = imageSide === "left";

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal as="div" className={imageFirst ? "lg:order-1" : "lg:order-2"}>
        <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 2 }}>
          <BlurImage
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurForSrc(image)}
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </Reveal>

      <Reveal as="div" delay={120} className={imageFirst ? "lg:order-2" : "lg:order-1"}>
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
          {eyebrow}
        </p>
        <h2
          className="m-0 whitespace-pre-line text-4xl font-medium leading-[1.12] sm:text-5xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
        >
          {headline}
        </h2>
        <p className="mt-7 max-w-md text-base leading-loose" style={{ color: INK_MUTED }}>
          {body}
        </p>
        {buttons.length > 0 ? (
          <div className="mt-9 flex flex-wrap items-center gap-6">
            {buttons.map((btn) =>
              btn.variant === "solid" ? (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className="inline-flex items-center rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition-opacity hover:opacity-85"
                  style={{ background: INK }}
                >
                  {btn.label}
                </Link>
              ) : (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                  style={{ color: INK }}
                >
                  {btn.label}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              ),
            )}
          </div>
        ) : null}
      </Reveal>
    </div>
  );
}
