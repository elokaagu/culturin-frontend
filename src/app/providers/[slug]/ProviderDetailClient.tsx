"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import { DetailPageShell } from "../../components/detail/DetailPageShell";
import type { fullProvider, imageAsset } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";

function imageUrlFromAsset(img: imageAsset | undefined) {
  const u = img?.url;
  if (typeof u !== "string") return "";
  const t = u.trim();
  if (!t) return "";
  if (t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/")) return t;
  return "";
}

function buildGallery(data: fullProvider): { src: string; alt: string; key: string }[] {
  const items: { src: string; alt: string; key: string }[] = [];
  for (const img of data.images ?? []) {
    const raw = imageUrlFromAsset(img);
    if (!raw) continue;
    const src = resolveContentImageSrc(raw);
    items.push({
      src,
      alt: data.eventName ? `${data.eventName} — image` : "Experience image",
      key: img._id || raw,
    });
  }
  if (items.length === 0) {
    const b = data.bannerImage?.image?.url?.trim();
    if (b) {
      const src = resolveContentImageSrc(b);
      items.push({
        src,
        alt: data.bannerImage?.image?.alt || data.eventName || "Cover",
        key: "banner",
      });
    }
  }
  return items;
}

function externalBookHref(raw: string | undefined): string {
  const s = (raw || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

const subtitleText = (data: fullProvider) => {
  const loc = (data.location || "").trim();
  if (loc) return loc;
  const n = (data.name || "").trim();
  const ev = (data.eventName || "").trim();
  if (n && ev && n.toLowerCase() !== ev.toLowerCase()) return n;
  return "";
};

function compactPriceList(prices: number[]) {
  if (!prices.length) return null;
  return prices.map((p) => (Number.isInteger(p) ? p.toString() : p.toFixed(0))).join(" · ");
}

export default function ProviderDetailClient({ data }: { data: fullProvider }) {
  const bookUrl = externalBookHref(data.contactWebsite);
  const gallery = buildGallery(data);
  const subtitle = subtitleText(data);
  const title = (data.eventName || data.name || "Experience").trim() || "Experience";
  const priceLine = data.prices?.length ? compactPriceList(data.prices) : null;

  return (
    <DetailPageShell>
      <nav className="mb-8" aria-label="Breadcrumb">
        <Link
          href="/providers"
          className="text-sm text-amber-400/90 no-underline transition hover:text-amber-300/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
        >
          ← All experiences
        </Link>
      </nav>

      <header className="text-left">
        <h1 className="m-0 text-2xl font-medium leading-tight tracking-tight text-white sm:text-[1.6rem]">{title}</h1>
        {subtitle ? (
          <p className="mt-2.5 text-sm font-normal leading-relaxed text-[#9a9a9a] sm:text-base">{subtitle}</p>
        ) : null}
      </header>

      {gallery.length > 0 ? (
        <ul className="m-0 mt-8 list-none space-y-5 p-0" role="list" aria-label="Image gallery">
          {gallery.map((g, i) => (
            <li key={g.key + i} className="overflow-hidden rounded-3xl bg-neutral-950/80 ring-1 ring-white/[0.08]">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 28rem"
                  className="object-cover"
                  loading={i < 1 ? "eager" : "lazy"}
                  priority={i < 1}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(g.src)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {data.description ? (
        <section className="mt-12" aria-labelledby="exp-about">
          <h2 id="exp-about" className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            About
          </h2>
          <p className="mb-0 mt-4 text-base font-normal leading-[1.7] text-white/[0.78]">{data.description}</p>
        </section>
      ) : null}

      {priceLine ? (
        <p className="mt-8 text-sm text-white/55" aria-label="Indicative pricing">
          <span className="text-white/40">Indicative rates: </span>
          {priceLine}
        </p>
      ) : null}

      <section className="mt-8 space-y-1.5 text-sm text-white/50" aria-label="Contact">
        {data.contactEmail ? (
          <p className="m-0">
            <a
              className="text-amber-400/90 no-underline underline-offset-2 transition hover:underline"
              href={`mailto:${data.contactEmail}`}
            >
              {data.contactEmail}
            </a>
          </p>
        ) : null}
        {data.contactPhone ? (
          <p className="m-0">
            <a
              className="text-amber-400/90 no-underline underline-offset-2 transition hover:underline"
              href={`tel:${data.contactPhone.replace(/\s+/g, "")}`}
            >
              {data.contactPhone}
            </a>
          </p>
        ) : null}
        {data.contactWebsite ? (
          <p className="m-0 break-all">
            <a
              className="text-amber-400/90 no-underline underline-offset-2 transition hover:underline"
              href={bookUrl || `https://${data.contactWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.contactWebsite}
            </a>
          </p>
        ) : null}
      </section>

      <div className="mt-10">
        {bookUrl ? (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full min-w-0 max-w-sm items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-black no-underline transition hover:bg-amber-100/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Book
          </a>
        ) : null}
      </div>
    </DetailPageShell>
  );
}
