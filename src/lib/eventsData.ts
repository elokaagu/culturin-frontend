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
    slug: "cannes-film-festival-2026",
    name: "Culturin at Cannes",
    navLabel: "CANNES 2026",
    tagline: "La Croisette.\nOurs.",
    subtagline: "Culturin × Cannes Film Festival · May 2026",
    shortDescription: "Private dinners, film screenings, and cultural conversations on the French Riviera during the world's most glamorous film festival.",
    date: "May 13 – 24, 2026",
    location: "Cannes, France",
    category: "Film & Culture",
    heroImage: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85`,
    heroImageAlt: "Sunlit coastal road along the French Riviera",
    stats: [
      { value: "75+", label: "Years of cinema" },
      { value: "3K+", label: "Guests on La Croisette" },
      { value: "5", label: "Culturin evenings" },
      { value: "1", label: "Private villa" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "Cannes brings cinema to the world. Culturin brings the culture behind the camera.",
        body: "Every May, the world's best storytellers converge on a small city on the French Riviera. Culturin builds the room where those storytellers — and the founders, curators, and cultural leaders who champion them — actually meet.",
        photos: [
          {
            src: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80`,
            alt: "Elegant dinner table on a terrace at dusk",
            position: "top-16 left-[5%] w-64 rotate-[-1.5deg]",
          },
          {
            src: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80`,
            alt: "Outdoor evening dining on the Riviera",
            position: "top-44 right-[7%] w-56 rotate-[2deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Filmmakers, collectors, and the people who fund what the world watches next.",
        body: "Cannes draws a rare confluence: directors, streaming executives, festival programmers, and the collectors and patrons who make independent film possible. Culturin is the dining room where those worlds stop being transactional.",
        photos: [
          {
            src: `https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80`,
            alt: "Panel discussion with international cultural figures",
            position: "top-20 left-[7%] w-72 rotate-[1deg]",
          },
          {
            src: `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80`,
            alt: "Intimate evening gathering with warm lighting",
            position: "bottom-16 right-[5%] w-60 rotate-[-1.5deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "The films change. The conversations that matter happen off-screen.",
        body: "A private villa for Culturin programming across the festival fortnight. Evening screenings with director Q&As. Three curated dinners. A closing night terrace event overlooking the bay. Access you cannot buy.",
        photos: [
          {
            src: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80`,
            alt: "Golden-hour terrace gathering overlooking the sea",
            position: "top-10 right-[9%] w-52 rotate-[2deg]",
          },
          {
            src: `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80`,
            alt: "Art and culture gathering in an elegant space",
            position: "bottom-12 left-[5%] w-64 rotate-[-1deg]",
          },
        ],
      },
    ],
    signalHeadline: "What to expect",
    signalBody:
      "An opening dinner at a private villa in the hills above Cannes. Curated film screenings with post-show conversations. Afternoon salons on African cinema, diaspora storytelling, and the future of global distribution. A closing terrace reception with the bay as the backdrop.",
    rsvpHeadline: "Request access.",
    rsvpSubtext:
      "Cannes programming is strictly invitation-only. Drop your email and tell us about your work in film, culture, or creative investment — we review every application personally.",
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
    heroImage: u("1622279457486-62dcc4a431d6"),
    heroImageAlt: "Aerial view of a tennis stadium at night with bright court lights",
    stats: [
      { value: "18K", label: "Seat stadium" },
      { value: "2", label: "Weeks of play" },
      { value: "5", label: "Culturin evenings" },
      { value: "1", label: "Private suite" },
    ],
    sections: [
      {
        id: "vibe",
        label: "PERSPECTIVE",
        headline: "The US Open brings the world to Flushing. Culturin brings the culture to the courtside.",
        body: "For two weeks every August, New York becomes the centre of the sporting world. We take that energy and build something around it — intimate, curated, and firmly off the official schedule.",
        photos: [
          {
            src: u("1509042239860-f550ce710b93"),
            alt: "Warm light on drinks and a small table at a gathering",
            position: "top-16 left-[5%] w-64 rotate-[-1.5deg]",
          },
          {
            src: u("1517248135467-4c7edcad34c4"),
            alt: "Communal dinner table with guests in conversation",
            position: "top-40 right-[6%] w-60 rotate-[2deg]",
          },
        ],
      },
      {
        id: "who",
        label: "PROXIMITY",
        headline: "Athletes, tastemakers, and the people who move culture forward.",
        body: "Sports intersects with fashion, music, and business at the US Open like nowhere else. Culturin brings together the people who sit at all those intersections — for dinners, conversations, and access you won't find on StubHub.",
        photos: [
          {
            src: u("1475721027785-f74eccf877e2"),
            alt: "Panel discussion on stage with a live audience",
            position: "top-20 left-[8%] w-72 rotate-[1deg]",
          },
          {
            src: u("1460661419201-fd4cecdf8a8b"),
            alt: "Gallery opening with guests and contemporary art",
            position: "bottom-16 right-[5%] w-56 rotate-[-2deg]",
          },
        ],
      },
      {
        id: "signal",
        label: "POSSIBILITY",
        headline: "Sport is the occasion. Culture is the point.",
        body: "Courtside seats, a private Culturin hospitality suite, chef-curated dinners after the day's last match, and a late-night close that keeps going long after the stadium empties.",
        photos: [
          {
            src: u("1514525253161-7a46d19cd819"),
            alt: "Golden-hour rooftop gathering with city views",
            position: "top-10 right-[9%] w-52 rotate-[1.5deg]",
          },
          {
            src: u("1480714378408-67cf0d13bc1f"),
            alt: "People moving through an energetic urban setting",
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
    heroImage: u("1534430480872-fbeeec67dca2"),
    heroImageAlt: "New York City skyline viewed from across the water at dusk",
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
            src: u("1517248135467-4c7edcad34c4"),
            alt: "Formal dinner table with guests deep in conversation",
            position: "top-20 left-[5%] w-64 rotate-[-1deg]",
          },
          {
            src: u("1509042239860-f550ce710b93"),
            alt: "Intimate evening gathering with drinks and warm lighting",
            position: "top-52 right-[7%] w-56 rotate-[2deg]",
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
            src: u("1475721027785-f74eccf877e2"),
            alt: "High-level panel discussion with international participants",
            position: "top-16 left-[7%] w-72 rotate-[1.5deg]",
          },
          {
            src: u("1460661419201-fd4cecdf8a8b"),
            alt: "Reception gathering in an elegant contemporary space",
            position: "bottom-20 right-[4%] w-60 rotate-[-1.5deg]",
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
            src: u("1514525253161-7a46d19cd819"),
            alt: "Rooftop gathering at golden hour overlooking a city",
            position: "top-14 right-[8%] w-52 rotate-[2deg]",
          },
          {
            src: u("1511578314322-379afb476865"),
            alt: "Cultural gathering with art and people in conversation",
            position: "bottom-14 left-[4%] w-60 rotate-[-2deg]",
          },
          {
            src: u("1480714378408-67cf0d13bc1f"),
            alt: "People moving through a cosmopolitan urban environment",
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
