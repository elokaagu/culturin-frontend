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
  /** Short one-line description shown on the events index card */
  shortDescription: string;
  /** Display date string, e.g. "August 25 to September 7, 2026" */
  date: string;
  /** City / venue display string */
  location: string;
  /** Category tag shown on the index card */
  category: string;
  heroImage: string;
  heroImageAlt: string;
  sections: EventSection[];
  stats: EventStat[];
  signalHeadline: string;
  signalBody: string;
  /** True once the event has actually happened: swaps the RSVP flow for a recap. */
  isPast?: boolean;
  rsvpHeadline: string;
  rsvpSubtext: string;
};

export const events: CulturinEvent[] = [
  {
    slug: "cannes-lions-2026",
    name: "Culturin at Cannes Lions",
    navLabel: "CANNES LIONS 2026",
    tagline: "La Croisette.\nOurs.",
    subtagline: "Culturin × Cannes Lions · June 2026",
    shortDescription: "Private nights and cultural conversations in the room where the world's creative leaders actually connected, during the International Festival of Creativity.",
    date: "June 22 to 26, 2026",
    location: "Cannes, France",
    category: "Creativity & Culture",
    heroImage: "/events/cannes-lions-2026/UNIKday2-14.jpg",
    heroImageAlt: "Guests laughing together beneath the disco balls in Cannes",
    isPast: true,
    stats: [
      { value: "2", label: "Nights of Culturin" },
      { value: "500+", label: "Guests in the room" },
      { value: "12", label: "Countries represented" },
      { value: "1", label: "City that never sleeps" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "Cannes Lions brought the world's creativity to La Croisette. Culturin brought the culture after dark.",
        body: "This June, the global creative industry descended on a small city on the French Riviera. By day it was awards and panels. By night, Culturin built the room where the real relationships formed, over music, dinner, and the kind of conversations that don't happen on a main stage.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-2.jpg",
            alt: "Guest in a tailored blazer against a deep red backdrop",
            position: "top-16 left-[5%] w-56 rotate-[-1.5deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-22.jpg",
            alt: "Group of guests gathered on a couch with champagne",
            position: "top-44 right-[7%] w-64 rotate-[2deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Creative leaders, founders, and the people who shape what the world pays attention to.",
        body: "Cannes Lions draws a rare confluence: creative directors, CMOs, agency founders, artists, and the culture-makers who influence them. Culturin was where those worlds stopped being transactional and started being human.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-38.jpg",
            alt: "Four guests posing together at a Culturin evening",
            position: "top-20 left-[7%] w-72 rotate-[1deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-34.jpg",
            alt: "Two guests portrait against a red-lit backdrop",
            position: "bottom-16 right-[5%] w-56 rotate-[-1.5deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "The awards faded. The connections made in the room didn't.",
        body: "Two nights of Culturin programming across the festival week: an intimate opening, live music, and a late-night close. Curated guest lists, warm rooms, and access you couldn't buy.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-77.jpg",
            alt: "Guest laughing beneath the disco ball in red light",
            position: "top-10 right-[9%] w-52 rotate-[2deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday2-30.jpg",
            alt: "Full dancefloor under disco balls late at night",
            position: "bottom-12 left-[5%] w-64 rotate-[-1deg]",
          },
        ],
      },
    ],
    signalHeadline: "What happened",
    signalBody:
      "An intimate opening night with a curated guest list. Live music and DJs across two nights. Dinners and conversations with creative leaders, founders, and cultural figures from across the diaspora and beyond. A late-night close that kept going long after the awards did.",
    rsvpHeadline: "That's a wrap.",
    rsvpSubtext:
      "Cannes Lions 2026 is behind us. See the photos from those two nights, or get on the list to hear about what's next.",
  },
  {
    slug: "us-open-2026",
    name: "Culturin at the US Open",
    navLabel: "US OPEN 2026",
    tagline: "Court\nSide.",
    subtagline: "Culturin × US Open · New York 2026",
    shortDescription: "Courtside hospitality, private dinners, and curated cultural programming during the world's biggest tennis fortnight.",
    date: "August 25 – September 7, 2026",
    location: "Flushing Meadows, New York",
    category: "Sport & Culture",
    heroImage: "",
    heroImageAlt: "",
    stats: [
      { value: "2", label: "Weeks of play" },
      { value: "5", label: "Culturin evenings" },
      { value: "300+", label: "Guests hosted" },
      { value: "1", label: "Private suite" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "The US Open brings the world to New York. Culturin brings the culture to the courtside.",
        body: "For two weeks every summer, New York becomes the centre of the sporting world. We take that energy and build something around it: intimate, curated, and firmly off the official schedule.",
        photos: [],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Athletes, tastemakers, and the people who move culture forward.",
        body: "Sport intersects with fashion, music, and business at the US Open like nowhere else. Culturin brings together the people who sit at all those intersections, for dinners, conversations, and access you won't find on StubHub.",
        photos: [],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "Sport is the occasion. Culture is the point.",
        body: "A private Culturin hospitality suite, chef-curated dinners after the day's last match, live music, and a late-night close that keeps going long after the stadium empties.",
        photos: [],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "Day sessions followed by a Culturin dinner for 40 in a private space near Flushing. Evening conversations with athletes, brand builders, and cultural figures. A closing night party after the men's final. All of it, invite only.",
    rsvpHeadline: "Request an invite.",
    rsvpSubtext:
      "The US Open Culturin suite is a private experience. Drop your email to be considered for the guest list and we'll follow up directly.",
  },
  {
    slug: "unga-2026",
    name: "Culturin at UNGA",
    navLabel: "UNGA 2026",
    tagline: "At The\nTable.",
    subtagline: "Culturin × United Nations General Assembly · New York 2026",
    shortDescription: "Dinners, salons, and receptions bringing diplomats, diaspora founders, and cultural leaders together during UN General Assembly week.",
    date: "September 16 – 26, 2026",
    location: "Manhattan, New York",
    category: "Diplomacy & Culture",
    heroImage: "",
    heroImageAlt: "",
    stats: [
      { value: "193", label: "Nations convene" },
      { value: "1", label: "Week, September" },
      { value: "4", label: "Culturin events" },
      { value: "60+", label: "Countries in the room" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "UNGA brings 193 nations to New York. Culturin brings the cultural conversation to the margins.",
        body: "The real decisions at UNGA happen in the dinners, lounges, and side events running parallel to the official sessions. Culturin builds those rooms, with cultural leaders and diplomats who understand that soft power is real power.",
        photos: [],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Diplomats, founders, and cultural ambassadors in the same room.",
        body: "UNGA week draws a rare mix: heads of state, NGO directors, diaspora entrepreneurs, and cultural figures all compressed into ten days in Manhattan. Culturin is the connective tissue, the event where those worlds actually meet.",
        photos: [],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "The conversations that shape the next decade start here.",
        body: "Four Culturin events across UNGA week: an opening dinner, a midweek cultural salon, a panel on diaspora and soft power, and a closing evening reception. Every seat is chosen with intention.",
        photos: [],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "An opening dinner for 50 with guests drawn from government, diaspora business, and cultural institutions. A midweek salon on the intersection of culture and foreign policy. A panel on African soft power and global brand-building. A closing evening reception that continues into the night.",
    rsvpHeadline: "Request your seat.",
    rsvpSubtext:
      "UNGA week is by invitation. Submit your email and a brief note on your work, and our team will review every request personally.",
  },
];

export function getEventBySlug(slug: string): CulturinEvent | undefined {
  return events.find((e) => e.slug === slug);
}
