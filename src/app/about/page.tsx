import Link from "next/link";

import { ContentPageShell } from "../components/layout/ContentPageShell";

export default function AboutPage() {
  return (
    <ContentPageShell>
      <section aria-labelledby="about-heading">
        <h1
          id="about-heading"
          className="max-w-prose text-3xl font-semibold leading-tight sm:text-4xl"
        >
          About Culturin
        </h1>
        <p className="mt-3 max-w-prose text-base text-white/90 sm:text-lg">
          Culturin is an online culture and travel platform that curates the best
          cultural gems from around the world. Welcome to Culturin, where exploration
          meets inspiration.
        </p>
      </section>

      <section
        aria-label="Mission and approach"
        className="flex flex-col gap-4"
      >
        <p className="max-w-prose text-base text-white/85">
          Our mission is to take you on a journey through the vibrant tapestry of
          global cultures, connecting you with places you have never been and people
          you have never met. At Culturin, travel is more than just a destination; it
          is an immersive experience that offers insight into the local traditions,
          art, cuisine, history, and philosophy that shape our global community.
        </p>
        <p className="max-w-prose text-base text-white/85">
          Our expertly curated content guides you through both the well-trodden tourist
          paths and the hidden gems that offer a more authentic perspective. Whether you
          are planning your next big adventure or simply looking to explore from the
          comfort of your home, Culturin provides a window into the cultures that shape
          our world. It is not just about where you go; it is about what you discover
          along the way.
        </p>
        <p className="max-w-prose text-base text-white/85">
          Embark on a cultural journey with Culturin, and find the inspiration that
          fuels your wanderlust. Dive into our articles, browse our destination guides,
          and become part of a community that celebrates the richness and diversity of
          our world.
        </p>
      </section>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          Explore
        </Link>
      </div>
    </ContentPageShell>
  );
}
