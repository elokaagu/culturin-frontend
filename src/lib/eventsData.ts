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
  /** Display date string, e.g. "August 25 – September 7, 2025" */
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
    shortDescription: "Private nights, cultural conversations, and the room where the world's creative leaders actually connect — during the International Festival of Creativity.",
    date: "June 22 – 26, 2026",
    location: "Cannes, France",
    category: "Creativity & Culture",
    heroImage: "/events/cannes-lions-2026/UNIKday1-70.jpg",
    heroImageAlt: "Guests dancing under disco balls at a Culturin night in Cannes",
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
        headline: "Cannes Lions brings the world's creativity to La Croisette. Culturin brings the culture after dark.",
        body: "Every June, the global creative industry descends on a small city on the French Riviera. By day it's awards and panels. By night, Culturin builds the room where the real relationships form — over music, dinner, and the kind of conversations that don't happen on a main stage.",
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
        body: "Cannes Lions draws a rare confluence: creative directors, CMOs, agency founders, artists, and the culture-makers who influence them. Culturin is where those worlds stop being transactional — and start being human.",
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
        headline: "The awards fade. The connections made in the room don't.",
        body: "Two nights of Culturin programming across the festival week — an intimate opening, live music, and a late-night close. Curated guest lists, warm rooms, and access you cannot buy.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-58.jpg",
            alt: "DJ performing under a disco ball in red light",
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
    signalHeadline: "What to expect",
    signalBody:
      "An intimate opening night with a curated guest list. Live music and DJs across two nights. Dinners and conversations with creative leaders, founders, and cultural figures from across the diaspora and beyond. A late-night close that keeps going long after the awards do.",
    rsvpHeadline: "Request access.",
    rsvpSubtext:
      "Cannes Lions programming is strictly invitation-only. Drop your email and tell us about your work in creativity, culture, or brand-building — we review every application personally.",
  },
  {
    slug: "us-open-2025",
    name: "Culturin at the US Open",
    navLabel: "US OPEN 2025",
    tagline: "Court\nSide.",
    subtagline: "Culturin × US Open · New York 2025",
    shortDescription: "Courtside hospitality, private dinners, and curated cultural programming during the world's biggest tennis fortnight.",
    date: "August 25 – September 7, 2025",
    location: "Flushing Meadows, New York",
    category: "Sport & Culture",
    heroImage: "/events/cannes-lions-2026/UNIKday1-62.jpg",
    heroImageAlt: "Guests filling a warm-lit room at a Culturin night",
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
        body: "For two weeks every summer, New York becomes the centre of the sporting world. We take that energy and build something around it — intimate, curated, and firmly off the official schedule.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-6.jpg",
            alt: "Two guests in conversation at a Culturin evening",
            position: "top-16 left-[5%] w-64 rotate-[-1.5deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-46.jpg",
            alt: "Guests mingling in a warm-lit lounge",
            position: "top-40 right-[6%] w-60 rotate-[2deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Athletes, tastemakers, and the people who move culture forward.",
        body: "Sport intersects with fashion, music, and business at the US Open like nowhere else. Culturin brings together the people who sit at all those intersections — for dinners, conversations, and access you won't find on StubHub.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-50.jpg",
            alt: "Group of guests posing together",
            position: "top-20 left-[8%] w-72 rotate-[1deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-42.jpg",
            alt: "Two guests greeting each other warmly",
            position: "bottom-16 right-[5%] w-56 rotate-[-2deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "Sport is the occasion. Culture is the point.",
        body: "A private Culturin hospitality suite, chef-curated dinners after the day's last match, live music, and a late-night close that keeps going long after the stadium empties.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday2-16.jpg",
            alt: "Guest enjoying the evening in red light",
            position: "top-10 right-[9%] w-52 rotate-[1.5deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-66.jpg",
            alt: "Two guests sharing a moment on the dancefloor",
            position: "bottom-12 left-[6%] w-64 rotate-[-1deg]",
          },
        ],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "Day sessions followed by a Culturin dinner for 40 in a private space near Flushing. Evening conversations with athletes, brand builders, and cultural figures. A closing night party after the men's final. All of it — invite only.",
    rsvpHeadline: "Request an invite.",
    rsvpSubtext:
      "The US Open Culturin suite is a private experience. Drop your email to be considered for the guest list and we'll follow up directly.",
  },
  {
    slug: "unga-2025",
    name: "Culturin at UNGA",
    navLabel: "UNGA 2025",
    tagline: "At The\nTable.",
    subtagline: "Culturin × United Nations General Assembly · New York 2025",
    shortDescription: "Dinners, salons, and receptions bringing diplomats, diaspora founders, and cultural leaders together during UN General Assembly week.",
    date: "September 16 – 26, 2025",
    location: "Manhattan, New York",
    category: "Diplomacy & Culture",
    heroImage: "/events/cannes-lions-2026/UNIKday1-22.jpg",
    heroImageAlt: "Guests gathered together at an intimate Culturin evening",
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
        body: "The real decisions at UNGA happen in the dinners, lounges, and side events running parallel to the official sessions. Culturin builds those rooms — with cultural leaders and diplomats who understand that soft power is real power.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-14.jpg",
            alt: "Two guests in an intimate moment against a warm backdrop",
            position: "top-20 left-[5%] w-56 rotate-[-1deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday2-12.jpg",
            alt: "Group of guests gathered in conversation",
            position: "top-52 right-[7%] w-64 rotate-[2deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Diplomats, founders, and cultural ambassadors in the same room.",
        body: "UNGA week draws a rare mix: heads of state, NGO directors, diaspora entrepreneurs, and cultural figures all compressed into ten days in Manhattan. Culturin is the connective tissue — the event where those worlds actually meet.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday1-38.jpg",
            alt: "Four guests posing together at a Culturin evening",
            position: "top-16 left-[7%] w-72 rotate-[1.5deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday2-10.jpg",
            alt: "Elegantly dressed couple at a reception",
            position: "bottom-20 right-[4%] w-56 rotate-[-1.5deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "The conversations that shape the next decade start here.",
        body: "Four Culturin events across UNGA week: an opening dinner, a midweek cultural salon, a panel on diaspora and soft power, and a closing evening reception. Every seat is chosen with intention.",
        photos: [
          {
            src: "/events/cannes-lions-2026/UNIKday2-26.jpg",
            alt: "Guests on the dancefloor at a late-night reception",
            position: "top-14 right-[8%] w-52 rotate-[2deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday2-22.jpg",
            alt: "Couple posing at a branded event wall",
            position: "bottom-14 left-[4%] w-56 rotate-[-2deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-30.jpg",
            alt: "Wide view of the venue in warm red light",
            position: "top-56 left-[38%] w-44 rotate-[1deg]",
          },
        ],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "An opening dinner for 50 with guests drawn from government, diaspora business, and cultural institutions. A midweek salon on the intersection of culture and foreign policy. A panel on African soft power and global brand-building. A closing evening reception that continues into the night.",
    rsvpHeadline: "Request your seat.",
    rsvpSubtext:
      "UNGA week is by invitation. Submit your email and a brief note on your work — our team reviews every request personally.",
  },
  {
    slug: "amafrobeat-lagos-2025",
    name: "Amafrobeat Experience",
    navLabel: "AMAFROBEAT 2025",
    tagline: "Join The\nExperience.",
    subtagline: "Culturin × Lagos · 2025",
    shortDescription: "Three stages of live music, Lagos chefs, and art installations — one immersive night where culture is the only currency.",
    date: "November 8, 2025",
    location: "Victoria Island, Lagos",
    category: "Music & Culture",
    heroImage: "/events/cannes-lions-2026/UNIKday2-30.jpg",
    heroImageAlt: "Packed dancefloor under disco balls at a Culturin night",
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
            src: "/events/cannes-lions-2026/UNIKday2-4.jpg",
            alt: "Guest lit by red stage light and smoke",
            position: "top-16 left-[5%] w-56 rotate-[-2deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-26.jpg",
            alt: "Disco balls above the crowd",
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
            src: "/events/cannes-lions-2026/UNIKday1-54.jpg",
            alt: "Guests dancing and celebrating together",
            position: "top-24 left-[8%] w-72 rotate-[1deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-22.jpg",
            alt: "Guests gathered on a couch with champagne",
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
            src: "/events/cannes-lions-2026/UNIKday1-58.jpg",
            alt: "DJ performing under a disco ball in red light",
            position: "top-12 right-[10%] w-48 rotate-[2deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-62.jpg",
            alt: "Red-lit crowd on the dancefloor",
            position: "bottom-10 left-[5%] w-60 rotate-[-1deg]",
          },
          {
            src: "/events/cannes-lions-2026/UNIKday1-70.jpg",
            alt: "Guests dancing with phones raised",
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
