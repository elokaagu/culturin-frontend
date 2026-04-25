"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../../components/Header";
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

function formatPrice(value: number) {
  if (!Number.isFinite(value)) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export default function ProviderDetailClient({ data }: { data: fullProvider }) {
  const bookUrl = externalBookHref(data.contactWebsite);
  const gallery = buildGallery(data);
  const subtitle = subtitleText(data);
  const title = (data.eventName || data.name || "Experience").trim() || "Experience";
  const priceLine = data.prices?.length ? compactPriceList(data.prices) : null;
  const minimumPrice = data.prices?.length ? Math.min(...data.prices) : null;
  const displayPrice = minimumPrice !== null ? formatPrice(minimumPrice) : null;
  const primaryGallery = gallery[0];
  const secondaryGallery = gallery.slice(1, 5);
  const hasMorePhotos = gallery.length > 5;
  const listingTitle = subtitle ? `Entire curated experience in ${subtitle}` : "Entire curated experience";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pb-16 pt-[var(--header-offset)] text-neutral-900">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 pt-4" aria-label="Breadcrumb">
            <Link
              href="/providers"
              className="text-sm text-neutral-600 no-underline transition hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              ← All experiences
            </Link>
          </nav>

          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="m-0 text-[1.95rem] font-semibold tracking-tight text-neutral-900 sm:text-[2.05rem]">{title}</h1>
              {subtitle ? <p className="mt-2 text-base text-neutral-600">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 underline underline-offset-2 transition hover:bg-neutral-100"
              >
                Share
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 underline underline-offset-2 transition hover:bg-neutral-100"
              >
                Save
              </button>
            </div>
          </header>

          {primaryGallery ? (
            <section className="relative mb-8 overflow-hidden rounded-2xl" aria-label="Image gallery preview">
              <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
                <div className="relative min-h-[19rem] md:min-h-[27rem]">
                  <Image
                    src={primaryGallery.src}
                    alt={primaryGallery.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    draggable={false}
                    unoptimized={isBundledPlaceholderSrc(primaryGallery.src)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryGallery.map((item, index) => (
                    <div key={item.key + index} className="relative min-h-[9.25rem] md:min-h-[13.3rem]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 17vw"
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        draggable={false}
                        unoptimized={isBundledPlaceholderSrc(item.src)}
                      />
                    </div>
                  ))}
                  {secondaryGallery.length === 0 ? (
                    <div className="col-span-2 flex min-h-[9.25rem] items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500 md:min-h-[13.3rem]">
                      No additional photos
                    </div>
                  ) : null}
                </div>
              </div>

              {hasMorePhotos ? (
                <a
                  href="#all-photos"
                  className="absolute bottom-4 right-4 inline-flex items-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 no-underline shadow-sm transition hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  Show all photos
                </a>
              ) : null}
            </section>
          ) : null}

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <section className="min-w-0">
              <div className="border-b border-neutral-200 pb-6">
                <h2 className="m-0 text-[1.9rem] font-semibold leading-tight text-neutral-900">{listingTitle}</h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {data.name ? `Hosted by ${data.name}` : "Hosted experience"} · Curated by Culturin
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-neutral-200 px-5 py-4">
                <p className="m-0 text-base font-semibold text-neutral-900">Guest favourite</p>
                <p className="m-0 mt-1 text-sm text-neutral-600">
                  One of the most loved curated experiences on Culturin.
                </p>
              </div>

              {data.description ? (
                <section className="border-b border-neutral-200 py-6" aria-labelledby="exp-about">
                  <h3 id="exp-about" className="m-0 text-xl font-semibold text-neutral-900">
                    About this experience
                  </h3>
                  <p className="mb-0 mt-4 text-base leading-7 text-neutral-700">{data.description}</p>
                </section>
              ) : null}

              <section className="py-6" aria-label="Contact information">
                <h3 className="m-0 text-xl font-semibold text-neutral-900">Contact</h3>
                <div className="mt-4 space-y-3 text-[0.96rem] text-neutral-700">
                  {data.contactEmail ? (
                    <p className="m-0">
                      Email:{" "}
                      <a className="text-neutral-900 underline decoration-neutral-400 underline-offset-2" href={`mailto:${data.contactEmail}`}>
                        {data.contactEmail}
                      </a>
                    </p>
                  ) : null}
                  {data.contactPhone ? (
                    <p className="m-0">
                      Phone:{" "}
                      <a
                        className="text-neutral-900 underline decoration-neutral-400 underline-offset-2"
                        href={`tel:${data.contactPhone.replace(/\s+/g, "")}`}
                      >
                        {data.contactPhone}
                      </a>
                    </p>
                  ) : null}
                  {data.contactWebsite ? (
                    <p className="m-0 break-all">
                      Website:{" "}
                      <a
                        className="text-neutral-900 underline decoration-neutral-400 underline-offset-2"
                        href={bookUrl || `https://${data.contactWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.contactWebsite}
                      </a>
                    </p>
                  ) : null}
                </div>
              </section>

              {gallery.length > 0 ? (
                <section id="all-photos" className="border-t border-neutral-200 pt-6" aria-label="All photos">
                  <h3 className="m-0 text-xl font-semibold text-neutral-900">All photos</h3>
                  <ul className="mt-4 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                    {gallery.map((g, i) => (
                      <li key={g.key + i} className="relative overflow-hidden rounded-xl bg-neutral-100">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, 30vw"
                            className="object-cover"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            draggable={false}
                            unoptimized={isBundledPlaceholderSrc(g.src)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </section>

            <aside className="lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)]">
              <div className="mb-4 rounded-xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm font-medium text-neutral-700">
                Rare find! This experience is usually booked.
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <p className="m-0 text-2xl font-semibold text-neutral-900">
                  {displayPrice ?? "Contact for pricing"}
                  {displayPrice ? <span className="ml-1 text-base font-normal text-neutral-500">/ person</span> : null}
                </p>
                {priceLine ? (
                  <p className="mt-2 text-sm text-neutral-500" aria-label="Indicative pricing">
                    Other rates: {priceLine}
                  </p>
                ) : null}
                <div className="mt-5 overflow-hidden rounded-xl border border-neutral-300">
                  <div className="grid grid-cols-2 divide-x divide-neutral-300 border-b border-neutral-300">
                    <div className="px-3 py-2.5">
                      <p className="m-0 text-[0.64rem] font-semibold uppercase tracking-wide text-neutral-500">Check-in</p>
                      <p className="m-0 mt-0.5 text-sm text-neutral-900">Flexible</p>
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="m-0 text-[0.64rem] font-semibold uppercase tracking-wide text-neutral-500">Checkout</p>
                      <p className="m-0 mt-0.5 text-sm text-neutral-900">Flexible</p>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="m-0 text-[0.64rem] font-semibold uppercase tracking-wide text-neutral-500">Guests</p>
                    <p className="m-0 mt-0.5 text-sm text-neutral-900">1 guest</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {bookUrl ? (
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#ff385c] px-5 text-sm font-semibold text-white no-underline transition hover:bg-[#e61e4d] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#ff385c]/40"
                    >
                      Reserve
                    </a>
                  ) : null}
                  {data.contactEmail ? (
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-500"
                    >
                      Ask a question
                    </a>
                  ) : null}
                </div>
                <p className="m-0 mt-3 text-center text-xs text-neutral-500">You won&apos;t be charged yet</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
