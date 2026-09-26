import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  EDITORIAL_ACCENT,
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import { SERVICES, getService } from "@/lib/services";
import { getSiteImagesMap, manifestDefault, resolveSiteImage } from "@/lib/siteImages";
import { blurForSrc } from "@/lib/culturinImages";
import SiteHeader from "@/app/components/SiteHeader";
import HomeFooter from "@/app/components/HomeFooter";
import BlurImage from "@/app/components/motion/BlurImage";
import Reveal from "@/app/components/motion/Reveal";
import WordReveal from "@/app/components/motion/WordReveal";

export const revalidate = 120;

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;
const DISPLAY = "var(--font-display), 'Times New Roman', serif";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.label} | Culturin`,
    description: service.promise,
  };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
      {children}
    </p>
  );
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const siteImages = await getSiteImagesMap();
  const imageFor = (slug: string) =>
    resolveSiteImage(siteImages, `homepage-service-${slug}`, manifestDefault(`homepage-service-${slug}`));
  const hero = imageFor(service.slug);
  const others = SERVICES.filter((s) => s.slug !== service.slug).map((s) => ({ ...s, image: imageFor(s.slug) }));
  const index = SERVICES.findIndex((s) => s.slug === service.slug);
  const contactHref = `/partner?service=${service.slug}`;

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <SiteHeader />

      {/* Hero: copy beside a 4:5 image card, the same proportions as the homepage service cards */}
      <section className="px-8 pt-28 sm:px-14 sm:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal y={32} className="order-2 lg:order-1">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
              {String(index + 1).padStart(2, "0")} · {service.label}
            </p>
            <h1 className="m-0 max-w-2xl text-4xl font-medium leading-[1.05] sm:text-6xl" style={{ fontFamily: DISPLAY }}>
              {service.headline}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: MUTED }}>
              {service.promise}
            </p>
            <Link
              href={contactHref}
              className="mt-8 inline-flex items-center rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: ACCENT, color: SURFACE_DARK }}
            >
              Talk to us
            </Link>
          </Reveal>
          <Reveal y={24} delay={120} className="order-1 lg:order-2">
            <div
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border lg:max-w-none"
              style={{ borderColor: RULE, background: SURFACE_DARK }}
            >
              {hero.src ? (
                <BlurImage
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 448px) 28rem, 100vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={blurForSrc(hero.src)}
                />
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-8 sm:px-14">
        {/* Intro */}
        <section className="grid grid-cols-1 gap-12 py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <Reveal>
              <Eyebrow>The service</Eyebrow>
            </Reveal>
            <WordReveal
              className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
              style={{ fontFamily: DISPLAY }}
              accent={ACCENT}
              segments={[{ text: "Culturin" }, { text: service.label, highlight: true }]}
            />
          </div>
          <div className="flex flex-col gap-6">
            {service.intro.map((p, i) => (
              <Reveal key={i} delay={300 + i * 150} y={32}>
                <p className="m-0 text-base leading-loose" style={{ color: i === 0 ? INK : MUTED }}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="border-t py-28" style={{ borderColor: RULE }}>
          <Reveal>
            <Eyebrow>What you get</Eyebrow>
            <h2 className="m-0 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
              Everything included.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-2" style={{ background: RULE }}>
            {service.deliverables.map((d, i) => (
              <Reveal key={d.title} as="div" delay={(i % 2) * 120} className="h-full">
                <div className="h-full p-8 sm:p-10" style={{ background: BG }}>
                  <p className="m-0 text-[11px] font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium" style={{ fontFamily: DISPLAY }}>
                    {d.title}
                  </h3>
                  <p className="mt-3 text-sm leading-loose" style={{ color: MUTED }}>
                    {d.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t py-28" style={{ borderColor: RULE }}>
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="m-0 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
              Four steps, one team.
            </h2>
          </Reveal>
          <ol className="m-0 mt-14 grid grid-cols-1 gap-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 120} className="list-none">
                <div className="border-t pt-6" style={{ borderColor: INK }}>
                  <p className="m-0 text-5xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: ACCENT }}>
                    {i + 1}
                  </p>
                  <h3 className="mt-6 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Who it's for */}
        <section className="grid grid-cols-1 gap-12 border-t py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-24" style={{ borderColor: RULE }}>
          <Reveal>
            <Eyebrow>Who it&apos;s for</Eyebrow>
            <h2 className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
              Built for brands that want to be part of culture.
            </h2>
          </Reveal>
          <ul className="m-0 flex flex-col p-0">
            {service.whoFor.map((item, i) => (
              <Reveal key={item} as="li" delay={i * 120} className="list-none">
                <div className="flex items-baseline gap-5 border-b py-6 text-lg" style={{ borderColor: RULE }}>
                  <span className="block h-px w-6 shrink-0 translate-y-[-0.3em]" style={{ background: ACCENT }} />
                  {item}
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="py-10">
          <Reveal>
            <div className="rounded-3xl p-10 sm:p-16" style={{ background: SURFACE_DARK, color: "#f1e9dc" }}>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">Start a conversation</p>
              <h2 className="m-0 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
                Let&apos;s talk about {service.label.toLowerCase()}.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-loose text-white/70">
                Tell us about your brand and what you&apos;re trying to achieve. We&apos;ll set up a call and put together a
                proposal shaped around you.
              </p>
              <Link
                href={contactHref}
                className="mt-10 inline-flex rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                style={{ background: "#e08a5b", color: SURFACE_DARK }}
              >
                Talk to us →
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Other services */}
        <section className="py-28">
          <Reveal>
            <Eyebrow>Other ways to work with us</Eyebrow>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {others.map((s, i) => (
              <Reveal key={s.slug} as="div" delay={i * 140} y={40}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative mx-auto block aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl no-underline md:max-w-none"
                >
                  {s.image.src ? (
                    <BlurImage
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:!scale-[1.05]"
                      placeholder="blur"
                      blurDataURL={blurForSrc(s.image.src)}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h3 className="m-0 text-3xl font-medium text-white" style={{ fontFamily: DISPLAY }}>
                      {s.label}
                    </h3>
                    <p className="m-0 mt-2 max-w-md text-sm leading-relaxed text-white/85">{s.promise}</p>
                    <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-transform duration-300 group-hover:translate-x-1">
                      Explore {s.label} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <HomeFooter />
    </div>
  );
}
