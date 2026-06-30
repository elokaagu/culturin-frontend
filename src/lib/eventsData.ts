const q = "auto=format&fit=crop&w=1200&q=80";
const u = (id: string) => `https://images.unsplash.com/photo-${id}?${q}`;

export type EventPhoto = {
  src: string;
  alt: string;
};

export type EventStat = {
  value: string;
  label: string;
};

export type EventSection = {
  id: string;
  label: string;
  headline: string;
  body: string;
  photos: Array<EventPhoto & { position: string }>;
};

export type CulturinEvent = {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  subtagline: string;
  heroImage: string;
  heroImageAlt: string;
  sections: EventSection[];
  stats: EventStat[];
  signalHeadline: string;
  signalBody: string;
  rsvpHeadline: string;
  rsvpSubtext: string;
};

export const events: CulturinEvent[] = [
  {
    slug: "amafrobeat-lagos-2025",
    name: "Amafrobeat Experience",
    navLabel: "AMAFROBEAT 2025",
    tagline: "Join The\nExperience.",
    subtagline: "Culturin × Lagos · 2025",
    heroImage: u("1459749411175-04bf5292ceea"),
    heroImageAlt: "Crowd at a live Afrobeat concert with stage lights",
    stats: [
      { value: "500+", label: "Guests" },
      { value: "12", label: "Cities represented" },
      { value: "3", label: "Stages" },
      { value: "1", label: "Night to remember" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "Lagos brings the world into one room. Culturin brings the right people around the same floor.",
        body: "The Amafrobeat Experience is a night where culture is the currency. Artists, founders, and cultural leaders come together not to network — but to feel something.",
        photos: [
          {
            src: u("1480714378408-67cf0d13bc1f"),
            alt: "People walking through a vibrant city neighborhood",
            position: "top-16 left-[5%] w-64 rotate-[-2deg]",
          },
          {
            src: u("1460661419201-fd4cecdf8a8b"),
            alt: "Contemporary art installation with visitors",
            position: "top-48 right-[6%] w-56 rotate-[1.5deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "The conversations that matter.",
        body: "Founders, artists, and cultural leaders. People who build things, tell stories, and move between cities. The Amafrobeat Experience is the room where those worlds collide.",
        photos: [
          {
            src: u("1475721027785-f74eccf877e2"),
            alt: "Panel discussion on stage with audience",
            position: "top-24 left-[8%] w-72 rotate-[1deg]",
          },
          {
            src: u("1517248135467-4c7edcad34c4"),
            alt: "Communal dinner table with guests",
            position: "bottom-20 right-[4%] w-64 rotate-[-1.5deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "The right people, brought together with purpose.",
        body: "Every detail is curated. The music, the food, the lineup, the people — all chosen to create an atmosphere that feels both intimate and electric. Expect the unexpected. Plan to stay late.",
        photos: [
          {
            src: u("1514525253161-7a46d19cd819"),
            alt: "DJ set on a rooftop at golden hour",
            position: "top-12 right-[10%] w-48 rotate-[2deg]",
          },
          {
            src: u("1511578314322-379afb476865"),
            alt: "Creative market stalls and visitors browsing",
            position: "bottom-10 left-[5%] w-60 rotate-[-1deg]",
          },
          {
            src: u("1511379938547-c1f69419868d"),
            alt: "Musicians performing in an intimate venue",
            position: "top-52 left-[40%] w-44 rotate-[1deg]",
          },
        ],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "Three stages of live music across Afrobeats, Afro-soul, and Afro-fusion. A curated food corridor with Lagos-based chefs. Immersive art installations. A late-night close with a headliner you'll be talking about for weeks.",
    rsvpHeadline: "Secure your place.",
    rsvpSubtext:
      "Capacity is limited. Drop your email and we'll send full details, ticket access, and a pre-event guide to the best of Lagos.",
  },
];

export function getEventBySlug(slug: string): CulturinEvent | undefined {
  return events.find((e) => e.slug === slug);
}
