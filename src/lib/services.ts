export type ServiceSlug = "intelligence" | "programming" | "moments";

export type Service = {
  slug: ServiceSlug;
  label: string;
  /** One line, used on the homepage card. */
  promise: string;
  /** Service page hero headline. */
  headline: string;
  intro: string[];
  whoFor: string[];
  steps: { title: string; body: string }[];
  deliverables: { title: string; body: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "intelligence",
    label: "Intelligence",
    promise: "An ongoing read on what's moving in culture, and what it means for your brand.",
    headline: "Know what culture is doing before your competitors do.",
    intro: [
      "Culture moves faster than any brand plan. Culturin Intelligence gives your team a standing read on what's shifting in music, fashion, food, sport, and the rooms where taste gets made, and what each shift means for your brand.",
      "It's built on our network: the founders, artists, operators, and cultural leaders who are in the room first. Not scraped trends, but signal from the people setting them.",
    ],
    whoFor: [
      "Brands entering a new market or audience",
      "Marketing teams who need a cultural point of view on demand",
      "Leaders planning campaigns, partnerships, or launches for the year ahead",
    ],
    steps: [
      { title: "Brief", body: "We learn your brand, your markets, and the questions keeping your team up at night." },
      { title: "Listen", body: "Our network and research team track the moments, people, and shifts that matter to you." },
      { title: "Report", body: "Every month, a clear read on what's moving and what to do about it, in plain language." },
      { title: "Plan", body: "Each quarter we sit down with your team to turn the insight into decisions." },
    ],
    deliverables: [
      { title: "Monthly culture reports", body: "The shifts, the people behind them, and the opportunities for your brand." },
      { title: "Competitor monitoring", body: "How other brands are showing up in culture, what's landing, and what isn't." },
      { title: "Quarterly strategy sessions", body: "Working sessions with your team to turn insight into a plan." },
      { title: "On-call access", body: "A direct line to our team when a moment breaks and you need a view fast." },
    ],
  },
  {
    slug: "programming",
    label: "Programming",
    promise: "Culturin becomes your cultural programming partner for the year.",
    headline: "A year of rooms, built around your brand.",
    intro: [
      "One great night gets talked about. A season of them builds a reputation. With Culturin Programming, we become your cultural programming partner for the year, planning, curating, and producing the experiences that put your brand at the centre of culture.",
      "We handle the strategy, the guest lists, the talent, and the production, so your brand shows up consistently in the rooms that matter to your audience.",
    ],
    whoFor: [
      "Brands that want an always-on presence in culture, not one-off activations",
      "Teams launching in a new city or territory",
      "Companies building relationships with a specific community of leaders or creators",
    ],
    steps: [
      { title: "Strategy", body: "We map the year: the moments, cities, and communities your brand should be part of." },
      { title: "Curation", body: "We build the guest lists and book the talent, drawing on the Culturin network." },
      { title: "Production", body: "We produce each room end to end, with your brand woven in with intention." },
      { title: "Review", body: "After each experience we report back on who came, what was made, and what happened next." },
    ],
    deliverables: [
      { title: "Annual cultural strategy", body: "A calendar of moments and rooms mapped to your brand's goals." },
      { title: "Curated guest lists", body: "The right people in the room, from our network of founders, operators, and artists." },
      { title: "Talent and partnerships", body: "Artists, hosts, chefs, and collaborators who give each room its character." },
      { title: "A season of experiences", body: "Dinners, salons, parties, and screenings, produced to the Culturin standard." },
    ],
  },
  {
    slug: "moments",
    label: "Moments",
    promise: "Sponsor a room we've already built, with your brand woven in with intention.",
    headline: "Step into a room that's already built.",
    intro: [
      "Every year, the world's cultural calendar brings the right people to the same city at the same time. Culturin builds the rooms where they gather, at Cannes Lions, Frieze, Art Basel, UNGA, the US Open, and beyond.",
      "With Moments, your brand joins one of those rooms as a partner: hosted, integrated, and introduced to the people you most want to meet, without the lead time or risk of building your own.",
    ],
    whoFor: [
      "Brands that want a presence at a major cultural moment this season",
      "Teams testing experiential before committing to a full programme",
      "Companies looking to meet a specific audience of leaders in one place",
    ],
    steps: [
      { title: "Choose a moment", body: "Pick from our upcoming rooms, from Cannes to New York to Miami." },
      { title: "Shape your role", body: "We design how your brand shows up: hosting, product, talent, or a room of your own within ours." },
      { title: "Be in the room", body: "Our team produces the night and makes the introductions that matter." },
      { title: "Keep the content", body: "Photography and content from the night, ready for your channels." },
    ],
    deliverables: [
      { title: "A place at the moment", body: "Partnership in a Culturin room at a major cultural event." },
      { title: "Brand integration", body: "Your brand woven into the experience with intention, not bolted on." },
      { title: "Hosting and introductions", body: "Our team connects you with the guests you came to meet." },
      { title: "Photography and content", body: "Professional coverage of the night for your own channels." },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
