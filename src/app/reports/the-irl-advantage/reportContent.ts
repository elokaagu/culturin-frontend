export const REPORT_SLUG = "the-irl-advantage";
export const REPORT_SOURCE = "report-irl-advantage-2026";
export const REPORT_TITLE = "The In Real Life Advantage";
export const REPORT_SUBTITLE = "Why real rooms win in a synthetic internet";
export const REPORT_EDITION = "Culturin Intelligence · Edition 01 · 2026";

export type Source = { id: number; label: string; url: string };

export const SOURCES: Source[] = [
  { id: 1, label: "Imperva (Thales), 2025 Bad Bot Report", url: "https://www.imperva.com/resources/resource-library/reports/2025-bad-bot-report/" },
  { id: 2, label: "Ahrefs, “74% of New Webpages Include AI Content (Study of 900k Pages)”, 2025", url: "https://ahrefs.com/blog/what-percentage-of-new-content-is-ai-generated/" },
  { id: 3, label: "Lumen Research, “Time spent ≠ attention”", url: "https://lumen-research.com/blog/mary-meeker-time-spent-%E2%89%A0-attention/" },
  { id: 4, label: "Ipsos MORI × Lumen, Attention 2.0, 2018", url: "https://www.ipsos.com/sites/default/files/ct/publication/documents/2018-06/ipsoslumen_attention_2.0_tp_may_18.pdf" },
  { id: 5, label: "SimplicityDX, Customer acquisition research, 2022", url: "https://www.simplicitydx.com/press/press-release-brands-losing-a-record-29-for-each-new-customer-acquired" },
  { id: 6, label: "Event Marketer × Sparks, EventTrack 2026 Executive Summary", url: "https://www.eventmarketer.com/wp-content/uploads/2025/11/eventtrack-2026-executive-summary.pdf" },
  { id: 7, label: "Edelman, 2025 Trust Barometer Special Report: Brand Trust, From We to Me", url: "https://www.edelman.com/trust/2025/trust-barometer/special-report-brands" },
  { id: 8, label: "Eventbrite × Harris Poll, Millennials: Fueling the Experience Economy, 2014", url: "http://eventbrite-s3.s3.amazonaws.com/marketing/Millennials_Research/Gen_PR_Final.pdf" },
];

export type Stat = { value: string; label: string; source: number };

/** Shown above the gate, so they must work as the hook on their own. */
export const HEADLINE_STATS: Stat[] = [
  { value: "51%", label: "of all web traffic is now bots, not people", source: 1 },
  { value: "61%", label: "of consumers are more inclined to buy after a live brand experience", source: 6 },
  { value: "73%", label: "trust a brand that reflects culture over one that ignores it", source: 7 },
];

export const EXECUTIVE_SUMMARY = [
  "The internet has never been louder, or less human. More than half of web traffic is automated, most new pages carry machine-written text, and the average display ad gets looked at for barely a second. Buying attention online now costs more and returns less every year.",
  "Real rooms move the other way. A live experience is the one channel that can’t be scrolled past, faked, or generated. People who attend a brand experience come away warmer, more likely to buy, and eager to tell everyone they know.",
  "This report brings together the latest independent data on that shift, and sets out the Culturin playbook for brands that want to stand out by showing up in person, in culture.",
];

export const CHAPTERS = [
  { n: "01", title: "The synthetic internet" },
  { n: "02", title: "Attention got expensive" },
  { n: "03", title: "Why rooms work" },
  { n: "04", title: "Culture is the trust lever" },
  { n: "05", title: "The Culturin playbook" },
  { n: "06", title: "Measuring the room" },
];

export const CH1_STATS: Stat[] = [
  { value: "51%", label: "of all web traffic in 2024 was automated, the first time in a decade bots outnumbered humans", source: 1 },
  { value: "74%", label: "of 900,000 newly published web pages contained AI-generated content", source: 2 },
  { value: "1.3s", label: "average time people actually look at a desktop display ad", source: 3 },
  { value: "82%", label: "of technically viewable ads are never actually viewed", source: 4 },
];

export const CH2_COMPARISON = {
  before: { year: "2013", value: 9 },
  after: { year: "2022", value: 29 },
  change: "+222%",
  source: 5,
};

/** Paired bars: the ad baseline vs the live-experience outcome. */
export const CH3_BARS: { label: string; ad: number; live: number; adLabel: string; liveLabel: string; source: number }[] = [
  {
    label: "Leave with positive feelings about the brand",
    ad: 4,
    live: 59,
    adLabel: "Ads remembered positively",
    liveLabel: "Attendees after a live event",
    source: 6,
  },
];

export const CH3_STATS: Stat[] = [
  { value: "61%", label: "are more inclined to purchase after a live experience", source: 6 },
  { value: "82%", label: "told friends and family about their engagement with the brand", source: 6 },
  { value: "59%", label: "capture content at live experiences, turning guests into your media channel", source: 6 },
  { value: "34%", label: "say their most recent event interaction was with a brand they didn’t already know", source: 6 },
];

export const CH3_DRIVERS = ["Trying the product or service", "Understanding the product or service", "Connection with the brand"];

export const CH4_STATS: Stat[] = [
  { value: "80%", label: "trust the brands they use, more than business, media, government or NGOs", source: 7 },
  { value: "73%", label: "would trust a brand that authentically reflects today’s culture over one that focuses solely on product", source: 7 },
  { value: "51%", label: "say it’s very or extremely important that brands give them community", source: 7 },
  { value: "78%", label: "of millennials would rather spend on an experience than a thing", source: 8 },
];

export const PLAYBOOK = [
  {
    title: "Curate the room before you design it",
    body: "The guest list is the product. Twenty of the right people will do more for a brand than two thousand of the wrong ones. Start with who needs to be in the room, then build the night around them.",
  },
  {
    title: "Build around culture, not the product",
    body: "Guests come for the music, the food, the conversation, and the people. The brand earns its place by making that possible, woven in with intention rather than bolted on.",
  },
  {
    title: "Design for capture",
    body: "Most attendees film and share. Give them light worth filming, moments worth posting, and a photographer on the night, so every guest extends the reach of the room.",
  },
  {
    title: "Let people touch it",
    body: "Trial and understanding are the strongest purchase drivers after an event. Make the product part of the experience: tasted, worn, used, talked about.",
  },
  {
    title: "Show up where culture already gathers",
    body: "Cannes, Frieze, Basel, UNGA, the Super Bowl. The audience is already in town and already open to discovery. Plug into those moments rather than competing with them.",
  },
  {
    title: "Follow up within the week",
    body: "Goodwill fades fast. Send the photos, make the introductions, and open the next conversation while the night is still warm.",
  },
];

export const MEASUREMENT = [
  { stage: "In the room", metrics: ["Guest list fit against target profile", "Attendance rate against RSVPs", "Dwell time and product trial"] },
  { stage: "Around the room", metrics: ["Guest-generated posts and reach", "Earned press and creator coverage", "Content captured for owned channels"] },
  { stage: "After the room", metrics: ["Introductions and meetings booked", "Pipeline or sales attributed to attendees", "Brand sentiment among guests at 30 days"] },
];

export const CASE_STUDY = {
  eyebrow: "In practice",
  title: "Culturin × Cannes Lions 2026",
  body: "During Cannes Lions, Culturin built a run of nights on the Croisette for the world’s creative industry: CMOs, agency founders, artists, and brand builders. Curated guest lists, live music, warm rooms, and brand partnerships woven in with intention.",
  stats: [
    { value: "500+", label: "guests" },
    { value: "12", label: "countries in the room" },
  ],
};
