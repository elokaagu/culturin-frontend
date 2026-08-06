import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "@/app/components/SafeContentImage";
import { getProviderBySlug } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";
import type { fullProvider } from "@/lib/interface";
import {
  cmsImageUnoptimized,
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "@/lib/imagePlaceholder";
import { normalizeSlugParam } from "@/lib/slug";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const cardStyle = { borderColor: "var(--c-rule)" };

async function getHostBySlug(slug: string): Promise<fullProvider | null> {
  const db = getCmsDbOrNull();
  if (!db) return null;
  return getProviderBySlug(db, slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const host = await getHostBySlug(normalizeSlugParam(params.slug));
  if (!host) return { title: "Local host | Culturin" };
  const title = host.name || host.eventName || "Local host";
  return {
    title: `${title} | Local host profile`,
    description: host.description || `Explore ${title}'s local guide profile on Culturin.`,
  };
}

export default async function LocalHostProfilePage({ params }: { params: { slug: string } }) {
  const host = await getHostBySlug(normalizeSlugParam(params.slug));
  if (!host) notFound();

  const profileName = host.name || host.eventName || "Local host";
  const avatarSrc = resolveContentImageSrc(host.avatarImageUrl || host.bannerImage?.image?.url || null);
  const bannerSrc = resolveContentImageSrc(host.bannerImage?.image?.url || host.avatarImageUrl || null);
  const bannerAlt = host.bannerImage?.image?.alt || `${profileName} host profile cover`;
  const specialties = host.specialties ?? [];
  const languages = host.languages ?? [];
  const photos = (host.images ?? [])
    .map((img) => resolveContentImageSrc(img.url))
    .filter((src, index, arr) => src && arr.indexOf(src) === index)
    .slice(0, 6);

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-16" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="font-medium no-underline hover:underline" style={{ color: "var(--c-accent)" }}>
              Home
            </Link>
            <span className="px-1.5" style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <Link href="/travel-guides" className="font-medium no-underline hover:underline" style={{ color: "var(--c-accent)" }}>
              Travel guides
            </Link>
            <span className="px-1.5" style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <span style={{ color: "var(--c-muted)" }}>{profileName}</span>
          </nav>

          <section className="overflow-hidden rounded-3xl border" style={cardStyle}>
            <div className="relative aspect-[21/9] min-h-[12rem] w-full sm:min-h-[14rem]">
              <SafeContentImage
                src={bannerSrc}
                alt={bannerAlt}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, min(1200px, 100vw)"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                unoptimized={isBundledPlaceholderSrc(bannerSrc) || cmsImageUnoptimized(bannerSrc)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            </div>
            <div className="relative px-4 pb-6 sm:px-6">
              <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 shadow-sm sm:h-24 sm:w-24" style={{ borderColor: "var(--c-bg)" }}>
                    <SafeContentImage
                      src={avatarSrc}
                      alt={`${profileName} avatar`}
                      className="object-cover object-top"
                      sizes="96px"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      unoptimized={isBundledPlaceholderSrc(avatarSrc) || cmsImageUnoptimized(avatarSrc)}
                    />
                  </div>
                  <div className="pb-1">
                    <h1 className="m-0 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
                      {profileName}
                    </h1>
                    {host.eventName ? <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>{host.eventName}</p> : null}
                    {host.location ? <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>Guides in: {host.location}</p> : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {host.contactWebsite ? (
                    <a
                      href={host.contactWebsite.startsWith("http") ? host.contactWebsite : `https://${host.contactWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium no-underline transition hover:opacity-80"
                      style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                    >
                      Book / Website
                    </a>
                  ) : null}
                  {host.contactEmail ? (
                    <a
                      href={`mailto:${host.contactEmail}`}
                      className="inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium no-underline transition hover:opacity-80"
                      style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                    >
                      Contact
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
            <article className="rounded-2xl border p-5 sm:p-6" style={cardStyle}>
              <h2 className="m-0 text-xl font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>About</h2>
              <p className="m-0 mt-3 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                {host.description || `${profileName} is one of our local hosts offering grounded, culture-first city experiences.`}
              </p>

              {(languages.length > 0 || specialties.length > 0) && (
                <div className="mt-5 space-y-4">
                  {languages.length > 0 ? (
                    <div>
                      <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                        Languages
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {languages.map((language) => (
                          <span
                            key={language}
                            className="rounded-full border px-2.5 py-1 text-xs font-medium"
                            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {specialties.length > 0 ? (
                    <div>
                      <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                        Specialties
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-full border px-2.5 py-1 text-xs font-medium"
                            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </article>

            <aside className="rounded-2xl border p-5 sm:p-6" style={cardStyle}>
              <h2 className="m-0 text-xl font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>Host details</h2>
              <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--c-muted)" }}>
                {host.contactEmail ? <p className="m-0">Email: {host.contactEmail}</p> : null}
                {host.contactPhone ? <p className="m-0">Phone: {host.contactPhone}</p> : null}
                {host.contactWebsite ? <p className="m-0 break-all">Website: {host.contactWebsite}</p> : null}
                {!host.contactEmail && !host.contactPhone && !host.contactWebsite ? (
                  <p className="m-0">Contact details will be shared after inquiry.</p>
                ) : null}
              </div>
            </aside>
          </section>

          {photos.length > 0 ? (
            <section className="mt-6 rounded-2xl border p-5 sm:p-6" style={cardStyle}>
              <h2 className="m-0 text-xl font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>Gallery</h2>
              <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                {photos.map((src, index) => (
                  <li key={`${src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200 dark:bg-white/5">
                    <Image
                      src={src}
                      alt={`${profileName} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      unoptimized={isBundledPlaceholderSrc(src) || cmsImageUnoptimized(src)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
