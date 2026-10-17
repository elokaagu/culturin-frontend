/**
 * Copy and figures for the Culturin Partner Programme, shared by the /partners page and the
 * prospectus PDF so the two never disagree. Audience figures come from Culturin's own guest and
 * subscriber data (Studio analytics and the audience briefing); update them here when they move.
 */

const MEDIA = "https://fvnxiabwhjposfujtloa.supabase.co/storage/v1/object/public/media";

export const PROGRAMME = {
  name: "Culturin Partner Programme",
  edition: "2027",
  eyebrow: "Partner programme · 2027",
  title: "Step into the room.",
  lede:
    "Culturin builds invite-only rooms at the year’s cultural moments, from Cannes Lions to MIPCOM. Our partner programme puts your brand inside them, with a guest list worth knowing and a report that proves it.",
  pricing: "Prices on request. Packages are fixed per moment, with a preferred rate for the full calendar.",
  contactEmail: "info@culturin.com",
  contactPath: "/partner?service=moments",
  figuresAsOf: "October 2026",
} as const;

export const PHOTOS = {
  hero: { src: `${MEDIA}/events/cannes-lions-2026/large/UNIKday1-78.jpg`, alt: "A packed Culturin room under red light at Cannes Lions 2026" },
  cannes: { src: `${MEDIA}/events/cannes-lions-2026/large/UNIKday1-115.jpg`, alt: "Guests together at Culturin’s Cannes Lions 2026 night" },
  cannesCrowd: { src: `${MEDIA}/events/cannes-lions-2026/large/UNIKday1-84.jpg`, alt: "The dance floor beneath the disco balls at Cannes Lions 2026" },
  cannesGuests: { src: `${MEDIA}/events/cannes-lions-2026/large/UNIKday1-76.jpg`, alt: "Guests dancing at Culturin’s Cannes Lions 2026 night" },
} as const;

export type Moment = { name: string; month: string; city: string; theme: string; line: string; flagship?: boolean };

export const CALENDAR: Moment[] = [
  { name: "Cannes Lions", month: "June", city: "Cannes", theme: "Creativity", line: "Cannes After Dark: private nights during the International Festival of Creativity.", flagship: true },
  { name: "Notting Hill Carnival", month: "August", city: "London", theme: "Music and culture", line: "A Culturin room at Europe’s biggest street festival." },
  { name: "US Open", month: "August to September", city: "New York", theme: "Sport", line: "Courtside hospitality and private dinners during the tennis fortnight." },
  { name: "New York Fashion Week", month: "September", city: "New York", theme: "Fashion", line: "Rooms for the people shaping fashion and luxury." },
  { name: "UN General Assembly", month: "September", city: "New York", theme: "Diplomacy", line: "Dinners and salons with diplomats, founders and cultural leaders." },
  { name: "MIPCOM", month: "October", city: "Cannes", theme: "Entertainment", line: "Cannes After Dark returns for the global TV and streaming market.", flagship: true },
  { name: "Muertos Dios", month: "November", city: "Miami", theme: "Celebration", line: "Our Day of the Dead celebration in Miami." },
];

export const TRACK_RECORD = [
  {
    event: "Cannes Lions 2026",
    line: "Two nights in Cannes where the creative industry’s real relationships formed.",
    stats: [
      { value: "500+", label: "guests in the room" },
      { value: "12", label: "countries represented" },
    ],
    photo: PHOTOS.cannes,
  },
  {
    event: "MIPCOM 2026",
    line: "Culturin closed MIPCOM week with the Disco Vibe closing party. Earlier in the week our founder Unik Ernest joined Rashida Jones and Drew Buckley for the Welcome to Cannes Party, and the Cinemalistics founders for its global debut.",
    stats: [
      { value: "103", label: "approved guests at the closing party" },
      { value: "10,600+", label: "executives in Cannes for MIPCOM, the market our guests came from" },
    ],
  },
] as { event: string; line: string; stats: { value: string; label: string }[]; photo?: { src: string; alt: string } }[];

export const PRESS = ["Digiday", "Deadline", "CNBC Africa", "CEO Weekly"];

export const AUDIENCE_STATS = [
  { value: "2,181", label: "people in the Culturin network, from guest lists, subscribers and partners" },
  { value: "62%", label: "of those who share a title are VP, Director, Head or above" },
  { value: "472", label: "founders, C-suite leaders and partners" },
  { value: "60%", label: "sign up with a work email" },
];

/** Estimated from guests’ roles and companies. */
export const INDUSTRIES = [
  { name: "Advertising, agencies and marketing", people: 520 },
  { name: "Consumer brands, retail and platforms", people: 360 },
  { name: "Entertainment, TV, film and streaming", people: 320 },
  { name: "Publishers and media owners", people: 210 },
  { name: "Technology, adtech and martech", people: 170 },
];

export const COMPANIES = ["TIME", "Meta", "Omnicom", "Amazon", "Google", "LinkedIn", "VML", "Fox", "TikTok", "Deloitte"];

export type Tier = { name: string; availability: string; summary: string; includes: string[]; featured?: boolean };

export const TIERS: Tier[] = [
  {
    name: "Title partner",
    availability: "One per moment",
    summary: "Your brand presents the night.",
    featured: true,
    includes: [
      "Presenting credit on the night and on every invitation",
      "A signature moment in the room, built with our team",
      "20 guest-list places for your clients and team",
      "Introductions to the guests you most want to meet",
      "Co-branded invitation and follow-up email to the guest list",
      "The full post-event report, plus photography for your channels",
    ],
  },
  {
    name: "Supporting partner",
    availability: "Up to three per moment",
    summary: "Own a category in the room.",
    includes: [
      "Category presence: hospitality, drinks, technology or experience",
      "8 guest-list places",
      "Your brand on invitations and the follow-up email",
      "A post-event summary report and selected photography",
    ],
  },
  {
    name: "Calendar partner",
    availability: "Across the season",
    summary: "Every moment, one relationship.",
    includes: [
      "Title or supporting partnership at the moments you choose",
      "A preferred rate for the full calendar",
      "First refusal on the following year",
      "A quarterly Culturin audience briefing",
      "One planning lead across the year",
    ],
  },
];

export const REPORT_CONTENTS = [
  { title: "Who was in the room", line: "The guest list by seniority, industry and company." },
  { title: "The photography", line: "A gallery of the night, with every download tracked." },
  { title: "The follow-up", line: "Opens and clicks on the post-event email to every guest." },
  { title: "Press and highlights", line: "Coverage, moments and what guests said afterwards." },
];

export const STEPS = [
  { title: "Choose your moments", line: "Pick one night or the whole calendar." },
  { title: "Build the room together", line: "We shape your moment around the guest list." },
  { title: "Be in the room", line: "Your team hosts, meets and is introduced." },
  { title: "Get the report", line: "Proof of who you met, within two weeks." },
];
