import type { TravelGuideCategory } from "./travelGuidesCategories";
import { travelGuideCategories } from "./travelGuidesCategories";

type GuideSection = {
  title: string;
  body: string;
};

export type TravelGuideContent = {
  slug: string;
  title: string;
  intro: string;
  keyPoints: string[];
  sections: GuideSection[];
  searchLinks: Array<{ label: string; query: string }>;
  featuredArticleSlugs: string[];
};

const CONTENT: Record<string, TravelGuideContent> = {
  "conscious-travel": {
    slug: "conscious-travel",
    title: "Conscious travel: places, people and planet",
    intro:
      "Build trips that respect local communities, reduce impact, and still feel rich with discovery.",
    keyPoints: [
      "Choose locally owned stays and guides first.",
      "Travel slower and stay longer in fewer places.",
      "Support cultural spaces that preserve heritage.",
    ],
    sections: [
      {
        title: "How to plan responsibly",
        body:
          "Start each trip with community context. Learn which neighborhoods are over-visited, where local businesses need support, and how to spend with intention.",
      },
      {
        title: "What to book first",
        body:
          "Book your local guide, one independent stay, and one cultural workshop before anything else. This locks your budget into community impact early.",
      },
    ],
    searchLinks: [
      { label: "Eco stays", query: "eco stay" },
      { label: "Community tourism", query: "community tourism" },
      { label: "Ethical wildlife", query: "ethical wildlife" },
    ],
    featuredArticleSlugs: ["kyoto-quiet-corners", "patagonia-wind-trail"],
  },
  "black-travel": {
    slug: "black-travel",
    title: "Black travel",
    intro:
      "Discover routes, hosts, and stories shaped by Black communities across cities, coasts, and cultural capitals.",
    keyPoints: [
      "Center Black-owned experiences and operators.",
      "Use neighborhood context to travel respectfully.",
      "Combine heritage visits with contemporary culture.",
    ],
    sections: [
      {
        title: "Neighborhood-first planning",
        body:
          "Choose areas known for living Black culture, not just museums. Balance iconic landmarks with neighborhood-led food, arts, and nightlife.",
      },
      {
        title: "Travel with context",
        body:
          "Read local history before you arrive. Understanding migration, music, and community movements deepens every stop on your route.",
      },
    ],
    searchLinks: [
      { label: "Black-owned tours", query: "black owned tours" },
      { label: "Diaspora food", query: "diaspora food" },
      { label: "Afro nightlife", query: "afro nightlife" },
    ],
    featuredArticleSlugs: ["marrakech-rose-dusk", "lisbon-light-and-tiles"],
  },
  "south-asian-travel": {
    slug: "south-asian-travel",
    title: "South Asian travel",
    intro:
      "Explore South Asia through food routes, craft traditions, and neighborhood stories that go beyond checklist tourism.",
    keyPoints: [
      "Plan by region and season, not country borders alone.",
      "Mix city intensity with one slower destination.",
      "Prioritize local guides for cultural nuance.",
    ],
    sections: [
      {
        title: "Build better city days",
        body:
          "Use split-day pacing: heritage mornings, market afternoons, and quieter evenings around food and performance.",
      },
      {
        title: "Craft and culture",
        body:
          "Add one workshop to every stop—textiles, ceramics, or regional cooking classes make a trip unforgettable.",
      },
    ],
    searchLinks: [
      { label: "South Asian food tour", query: "south asian food tour" },
      { label: "Textile workshops", query: "textile workshop" },
      { label: "Heritage walks", query: "heritage walk" },
    ],
    featuredArticleSlugs: ["marrakech-rose-dusk", "kyoto-quiet-corners"],
  },
  "solo-women-travel": {
    slug: "solo-women-travel",
    title: "Solo women travel",
    intro:
      "Practical planning for confidence, safety, and meaningful solo experiences in new destinations.",
    keyPoints: [
      "Choose neighborhoods with good walkability and transit.",
      "Pre-book first-night transfer and accommodation.",
      "Build a simple daily check-in routine.",
    ],
    sections: [
      {
        title: "Safety planning that still feels free",
        body:
          "Plan two anchor points per day—where you start and where you end. Keep everything in between open for spontaneous discovery.",
      },
      {
        title: "How to meet people on the road",
        body:
          "Pick guided city walks, food classes, and community events to naturally connect with travelers and locals.",
      },
    ],
    searchLinks: [
      { label: "Solo-friendly cities", query: "solo women friendly city" },
      { label: "Safe night transit", query: "safe night transit" },
      { label: "Women-led tours", query: "women led tours" },
    ],
    featuredArticleSlugs: ["lisbon-light-and-tiles", "kyoto-quiet-corners"],
  },
  "food-and-night-markets": {
    slug: "food-and-night-markets",
    title: "Food and night markets",
    intro:
      "Street food, market culture, and evening routes designed for flavor, atmosphere, and local connection.",
    keyPoints: [
      "Arrive hungry but start with smaller portions.",
      "Follow local queues, not social media hype.",
      "Pair one market night with one chef-led meal.",
    ],
    sections: [
      {
        title: "Build a smart tasting route",
        body:
          "Start with savory staples, pause for one cultural stop, then finish with regional sweets and tea or coffee.",
      },
      {
        title: "How to avoid tourist pricing",
        body:
          "Markets reward curiosity. Ask two vendors before buying and return to stalls with regular local traffic.",
      },
    ],
    searchLinks: [
      { label: "Night market guide", query: "night market guide" },
      { label: "Street food map", query: "street food map" },
      { label: "Local chef tours", query: "local chef tour" },
    ],
    featuredArticleSlugs: ["marrakech-rose-dusk", "lisbon-light-and-tiles"],
  },
  "art-design-city-breaks": {
    slug: "art-design-city-breaks",
    title: "Art and design city breaks",
    intro:
      "Weekend itineraries around galleries, architecture, creative districts, and independent design spaces.",
    keyPoints: [
      "Choose one major museum and two small spaces daily.",
      "Book architecture walks in the morning light.",
      "Leave room for design shops and studio visits.",
    ],
    sections: [
      {
        title: "How to balance big and small spaces",
        body:
          "Large institutions give scale, but smaller artist-run venues provide local perspective and newer voices.",
      },
      {
        title: "Build a creative weekend",
        body:
          "Pair each gallery visit with a neighborhood café or bookstore to keep pace relaxed and reflective.",
      },
    ],
    searchLinks: [
      { label: "City design walk", query: "design city walk" },
      { label: "Independent galleries", query: "independent galleries" },
      { label: "Architecture tours", query: "architecture tour" },
    ],
    featuredArticleSlugs: ["kyoto-quiet-corners", "lisbon-light-and-tiles"],
  },
  "music-festival-routes": {
    slug: "music-festival-routes",
    title: "Music and festival routes",
    intro:
      "Plan routes around live music calendars, festival weekends, and local scenes that keep energy high.",
    keyPoints: [
      "Anchor travel around one key headline event.",
      "Add smaller local shows before and after.",
      "Book accommodation close to late-night transit.",
    ],
    sections: [
      {
        title: "Festival weekend structure",
        body:
          "Keep mornings low-intensity, afternoons event-focused, and evenings flexible for spontaneous local gigs.",
      },
      {
        title: "Beyond main stages",
        body:
          "The strongest moments often happen in side venues, listening bars, and community spaces around the event.",
      },
    ],
    searchLinks: [
      { label: "Festival city guides", query: "festival city guide" },
      { label: "Live music venues", query: "live music venues" },
      { label: "After-hours spots", query: "after hours music" },
    ],
    featuredArticleSlugs: ["marrakech-rose-dusk", "lisbon-light-and-tiles"],
  },
  "wellness-and-slow-living": {
    slug: "wellness-and-slow-living",
    title: "Wellness and slow living",
    intro:
      "Design calmer itineraries with intentional pacing, restorative stays, and nature-led experiences.",
    keyPoints: [
      "Travel with fewer transitions and longer stays.",
      "Prioritize sleep-friendly, walkable locations.",
      "Blend wellness with culture instead of isolation.",
    ],
    sections: [
      {
        title: "Slow itinerary framework",
        body:
          "Use a 1-1-1 rhythm: one movement activity, one cultural activity, one restorative activity each day.",
      },
      {
        title: "Choose better wellness stays",
        body:
          "Look for properties tied to local landscapes and food systems instead of generic luxury wellness branding.",
      },
    ],
    searchLinks: [
      { label: "Wellness retreats", query: "wellness retreat" },
      { label: "Slow travel routes", query: "slow travel route" },
      { label: "Nature stays", query: "nature stay" },
    ],
    featuredArticleSlugs: ["patagonia-wind-trail", "kyoto-quiet-corners"],
  },
};

export function getTravelGuideContent(slug: string): TravelGuideContent | null {
  return CONTENT[slug] ?? null;
}

export function getTravelGuideCategory(slug: string): TravelGuideCategory | null {
  return travelGuideCategories.find((category) => category.slug === slug) ?? null;
}
