"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";

import Header from "../../components/Header";
import { CulturinBookingDateField } from "../../components/detail/CulturinBookingDateField";
import { CulturinGuestSelect } from "../../components/detail/CulturinGuestSelect";
import { ProviderGalleryLightbox } from "../../components/detail/ProviderGalleryLightbox";
import { SaveFavoriteModal } from "../../components/detail/SaveFavoriteModal";
import { ShareLinkModal } from "../../components/detail/ShareLinkModal";
import type { fullProvider, imageAsset } from "@/lib/interface";
import { cn } from "@/lib/utils";
import {
  cmsImageUnoptimized,
  IMAGE_BLUR_DATA_URL,
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

function BlurInGalleryImage({
  src,
  alt,
  className,
  sizes,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  loading?: "eager" | "lazy" | undefined;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      placeholder="blur"
      blurDataURL={IMAGE_BLUR_DATA_URL}
      draggable={false}
      unoptimized={cmsImageUnoptimized(src)}
      loading={loading}
      onLoadingComplete={() => setRevealed(true)}
      className={cn(
        "object-cover transition-[opacity,filter] duration-500 ease-out will-change-[opacity,filter] motion-reduce:transition-none",
        revealed ? "opacity-100 [filter:blur(0px)]" : "opacity-0 [filter:blur(6px)]",
        "motion-reduce:opacity-100 motion-reduce:[filter:blur(0px)]",
        className,
      )}
    />
  );
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

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16] as const;

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type InquiryOpts = {
  title: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  kind: "book" | "ask";
  /** Full URL to this listing (filled client-side). */
  listingUrl?: string;
};

function dateContextLines(checkIn: string, checkOut: string, forAsk: boolean) {
  if (checkIn && checkOut) {
    return forAsk
      ? `Dates I’m considering: ${checkIn} → ${checkOut}`
      : `Dates: check-in ${checkIn} → check-out ${checkOut}`;
  }
  if (checkIn) {
    return forAsk
      ? `Preferred check-in: ${checkIn} (checkout to be confirmed)`
      : `Preferred check-in: ${checkIn} (checkout to be agreed)`;
  }
  return forAsk ? "Dates: flexible — happy to hear what you suggest" : "Preferred dates: flexible (please suggest options)";
}

function buildMailtoInquiry(email: string, opts: InquiryOpts) {
  const listingLine = opts.listingUrl?.trim() ? `Listing: ${opts.listingUrl.trim()}` : "";

  if (opts.kind === "ask") {
    const dateLine = dateContextLines(opts.checkIn, opts.checkOut, true);
    const lines = [
      `Hi — I have a question about «${opts.title}».`,
      "",
      ...(listingLine ? [listingLine, ""] : []),
      `Guests: ${opts.guests} ${opts.guests === 1 ? "guest" : "guests"}`,
      dateLine,
      "",
      "My question:",
      "",
      "[Please write your question here]",
    ];
    const p = new URLSearchParams();
    p.set("subject", `Question: ${opts.title}`);
    p.set("body", lines.join("\n"));
    return `mailto:${email}?${p.toString()}`;
  }

  const dateLine = dateContextLines(opts.checkIn, opts.checkOut, false);
  const lines = [
    `I would like to enquire about: ${opts.title}.`,
    "",
    ...(listingLine ? [listingLine, ""] : []),
    `Guests: ${opts.guests} ${opts.guests === 1 ? "guest" : "guests"}`,
    dateLine,
  ];
  const p = new URLSearchParams();
  p.set("subject", `Booking request: ${opts.title}`);
  p.set("body", lines.join("\n"));
  return `mailto:${email}?${p.toString()}`;
}

/** SMS / Messages app — short body; host can reply in thread. */
function buildSmsAskHref(
  phone: string,
  opts: Pick<InquiryOpts, "title" | "guests" | "checkIn" | "checkOut" | "listingUrl">,
) {
  const listing = opts.listingUrl?.trim() ? ` ${opts.listingUrl.trim()}` : "";
  const dates =
    opts.checkIn && opts.checkOut
      ? ` Dates: ${opts.checkIn}–${opts.checkOut}.`
      : opts.checkIn
        ? ` From: ${opts.checkIn}.`
        : "";
  const body = `Question about «${opts.title}». Guests: ${opts.guests}.${dates}${listing} My question: `;
  const enc = encodeURIComponent(body);
  return `sms:${phone}?body=${enc}`;
}

export default function ProviderDetailClient({ data }: { data: fullProvider }) {
  const pathname = usePathname();
  const [shareOpen, setShareOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [listingPageUrl, setListingPageUrl] = useState("");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setListingPageUrl(`${window.location.origin}${pathname || ""}`);
  }, [pathname]);

  const openShareModal = () => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    setShareOpen(true);
  };

  const openSaveModal = () => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    setSaveOpen(true);
  };

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
  const email = (data.contactEmail || "").trim();
  const listingUrlForMessage = listingPageUrl.trim() || undefined;
  const bookMailtoHref = email
    ? buildMailtoInquiry(email, {
        title,
        guests,
        checkIn,
        checkOut,
        kind: "book",
        listingUrl: listingUrlForMessage,
      })
    : "";
  const phoneTel = (data.contactPhone || "").replace(/\s+/g, "");
  const minOutDate = checkIn && checkIn >= todayIso() ? checkIn : todayIso();

  const askAction = useMemo(() => {
    const ctx = { title, guests, checkIn, checkOut, listingUrl: listingUrlForMessage };
    if (email) {
      return {
        href: buildMailtoInquiry(email, { ...ctx, kind: "ask" }),
        external: false,
      } as const;
    }
    if (phoneTel) {
      return { href: buildSmsAskHref(phoneTel, ctx), external: false } as const;
    }
    if (bookUrl) {
      return { href: bookUrl, external: true } as const;
    }
    return { href: "#contact", external: false } as const;
  }, [email, phoneTel, bookUrl, title, guests, checkIn, checkOut, listingUrlForMessage]);

  return (
    <>
      <Header />
      <main className="min-h-dvh !bg-black pb-16 pt-[var(--header-offset)] !text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 pt-4" aria-label="Breadcrumb">
            <Link
              href="/providers"
              className="text-sm text-white/65 no-underline transition hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
            >
              ← All experiences
            </Link>
          </nav>

          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="m-0 text-[1.95rem] font-semibold tracking-tight text-white sm:text-[2.05rem]">{title}</h1>
              {subtitle ? <p className="mt-2 text-base text-white/65">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <button
                type="button"
                onClick={openShareModal}
                className="rounded-lg px-3 py-1.5 underline underline-offset-2 transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                Share
              </button>
              <button
                type="button"
                onClick={openSaveModal}
                className="rounded-lg px-3 py-1.5 underline underline-offset-2 transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                Save
              </button>
            </div>
          </header>

          {primaryGallery ? (
            <section className="relative mb-8 overflow-hidden rounded-2xl" aria-label="Image gallery preview">
              <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
                <div className="relative min-h-[19rem] md:min-h-[27rem]">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="absolute inset-0 z-[1] cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`View full size: ${primaryGallery.alt}`}
                  >
                    <span className="sr-only">Open in photo viewer</span>
                  </button>
                  <BlurInGalleryImage
                    src={primaryGallery.src}
                    alt={primaryGallery.alt}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    loading="lazy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryGallery.map((item, index) => (
                    <div key={item.key + index} className="relative min-h-[9.25rem] md:min-h-[13.3rem]">
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(1 + index)}
                        className="absolute inset-0 z-[1] cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        aria-label={`View full size: ${item.alt}`}
                      >
                        <span className="sr-only">Open in photo viewer</span>
                      </button>
                      <BlurInGalleryImage
                        src={item.src}
                        alt={item.alt}
                        sizes="(max-width: 768px) 50vw, 17vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  {secondaryGallery.length === 0 ? (
                    <div className="col-span-2 flex min-h-[9.25rem] items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 text-sm text-white/60 md:min-h-[13.3rem]">
                      No additional photos
                    </div>
                  ) : null}
                </div>
              </div>

              {hasMorePhotos ? (
                <a
                  href="#all-photos"
                  className="absolute bottom-4 right-4 z-[2] inline-flex items-center rounded-lg border border-white/20 bg-black/80 px-3 py-2 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-black focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Show all photos
                </a>
              ) : null}
            </section>
          ) : null}

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <section className="min-w-0">
              <div className="border-b border-white/10 pb-6">
                <h2 className="m-0 text-[1.9rem] font-semibold leading-tight text-white">{listingTitle}</h2>
                <p className="mt-2 text-sm text-white/65">
                  {data.name ? `Hosted by ${data.name}` : "Hosted experience"} · Curated by Culturin
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-white/15 bg-black px-5 py-4">
                <p className="m-0 text-base font-semibold text-white">Guest favourite</p>
                <p className="m-0 mt-1 text-sm text-white/65">
                  One of the most loved curated experiences on Culturin.
                </p>
              </div>

              {data.description ? (
                <section className="border-b border-white/10 py-6" aria-labelledby="exp-about">
                  <h3 id="exp-about" className="m-0 text-xl font-semibold text-white">
                    About this experience
                  </h3>
                  <p className="mb-0 mt-4 text-base leading-7 text-white/80">{data.description}</p>
                </section>
              ) : null}

              <section id="contact" className="py-6" aria-label="Contact information">
                <h3 className="m-0 text-xl font-semibold text-white">Contact</h3>
                <div className="mt-4 space-y-3 text-[0.96rem] text-white/75">
                  {data.contactEmail ? (
                    <p className="m-0">
                      Email:{" "}
                      <a className="text-white underline decoration-white/40 underline-offset-2" href={`mailto:${data.contactEmail}`}>
                        {data.contactEmail}
                      </a>
                    </p>
                  ) : null}
                  {data.contactPhone ? (
                    <p className="m-0">
                      Phone:{" "}
                      <a
                        className="text-white underline decoration-white/40 underline-offset-2"
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
                        className="text-white underline decoration-white/40 underline-offset-2"
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
                <section id="all-photos" className="border-t border-white/10 pt-6" aria-label="All photos">
                  <h3 className="m-0 text-xl font-semibold text-white">All photos</h3>
                  <ul className="mt-4 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                    {gallery.map((g, i) => (
                      <li key={g.key + i} className="relative overflow-hidden rounded-xl bg-neutral-900">
                        <div className="relative aspect-[4/3] w-full">
                          <button
                            type="button"
                            onClick={() => setLightboxIndex(i)}
                            className="absolute inset-0 z-[1] cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            aria-label={`View full size: ${g.alt}`}
                          >
                            <span className="sr-only">Open in photo viewer</span>
                          </button>
                          <BlurInGalleryImage
                            src={g.src}
                            alt={g.alt}
                            sizes="(max-width: 640px) 50vw, 30vw"
                            loading="lazy"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </section>

            <aside className="lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)]">
              <div className="mb-4 rounded-xl border border-pink-200/20 bg-pink-500/10 px-4 py-3 text-sm font-medium text-white/80">
                Rare find! This experience is usually booked.
              </div>
              <div className="rounded-2xl border border-white/15 bg-black p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                <p className="m-0 text-2xl font-semibold text-white">
                  {displayPrice ?? "Contact for pricing"}
                  {displayPrice ? <span className="ml-1 text-base font-normal text-white/60">/ person</span> : null}
                </p>
                {priceLine ? (
                  <p className="mt-2 text-sm text-white/60" aria-label="Indicative pricing">
                    Other rates: {priceLine}
                  </p>
                ) : null}
                <div className="mt-5 rounded-xl border border-white/20">
                  <div className="grid grid-cols-2 divide-x divide-white/20 border-b border-white/20">
                    <div className="px-3 py-2.5">
                      <CulturinBookingDateField
                        id="book-checkin"
                        label="Check-in"
                        value={checkIn}
                        minIso={todayIso()}
                        onChange={(v) => {
                          setCheckIn(v);
                          if (checkOut && v && checkOut < v) setCheckOut(v);
                        }}
                        helpText="Leave open for flexible timing (optional)"
                      />
                    </div>
                    <div className="px-3 py-2.5">
                      <CulturinBookingDateField
                        id="book-checkout"
                        label="Checkout"
                        value={checkOut}
                        minIso={minOutDate}
                        onChange={setCheckOut}
                        alignEnd
                      />
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <CulturinGuestSelect
                      id="book-guests"
                      label="Guests"
                      value={guests}
                      options={GUEST_OPTIONS}
                      onChange={setGuests}
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {bookUrl ? (
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-400 px-5 text-sm font-semibold text-neutral-950 no-underline transition hover:bg-amber-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {displayPrice ? "Reserve" : "Book on website"}
                    </a>
                  ) : null}
                  {!bookUrl && bookMailtoHref ? (
                    <a
                      href={bookMailtoHref}
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-400 px-5 text-sm font-semibold text-neutral-950 no-underline transition hover:bg-amber-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {displayPrice ? "Request to book" : "Contact to reserve"}
                    </a>
                  ) : null}
                  {!bookUrl && !bookMailtoHref && phoneTel ? (
                    <a
                      href={`tel:${phoneTel}`}
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-400 px-5 text-sm font-semibold text-neutral-950 no-underline transition hover:bg-amber-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Call to book
                    </a>
                  ) : null}
                  {!bookUrl && !bookMailtoHref && !phoneTel ? (
                    <a
                      href="#contact"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-400 px-5 text-sm font-semibold text-neutral-950 no-underline transition hover:bg-amber-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Get in touch below
                    </a>
                  ) : null}
                  <a
                    href={askAction.href}
                    target={askAction.external ? "_blank" : undefined}
                    rel={askAction.external ? "noopener noreferrer" : undefined}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-black px-5 text-sm font-semibold text-white no-underline transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Ask a question
                  </a>
                </div>
                <p className="m-0 mt-3 text-center text-xs text-white/55">You won&apos;t be charged here — requests go to the host.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ProviderGalleryLightbox
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={gallery}
        activeIndex={lightboxIndex ?? 0}
        onActiveIndexChange={setLightboxIndex}
        title={title}
      />
      <ShareLinkModal open={shareOpen} onClose={() => setShareOpen(false)} url={pageUrl} title={title} />
      <SaveFavoriteModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save experience"
        description={
          <>
            Keep this curated experience handy. Profile saves for providers are on the way — for now, copy the link or sign in
            so we can connect your account when the feature ships.
          </>
        }
        loginHref={pathname ? `/login?next=${encodeURIComponent(pathname)}` : "/login"}
        onCopyLink={async () => {
          const u = pageUrl || (typeof window !== "undefined" ? window.location.href : "");
          if (u) await navigator.clipboard.writeText(u);
        }}
      />
    </>
  );
}
