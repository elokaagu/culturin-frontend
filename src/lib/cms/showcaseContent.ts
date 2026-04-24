import type { fullBlog, fullVideo, simpleBlogCard, videoCard } from "../../libs/interface";

/** Same public Mux asset used on `/stream` for consistent demo playback. */
const MUX_PLAYBACK_DEMO = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";

const IMAGES = {
  portrait: "https://res.cloudinary.com/drfkw9rgh/image/upload/v1705493709/ojcn4o1quyu8e6fdyaws.webp",
  fitness: "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/hdfbvawg6isdoft0sghq.jpg",
  texture: "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg",
} as const;

type ShowcaseArticle = {
  card: simpleBlogCard;
  full: fullBlog;
};

const SHOWCASE_ARTICLES: Record<string, ShowcaseArticle> = {
  "kyoto-quiet-corners": {
    card: {
      title: "Kyoto beyond the crowds: three walks that still feel like a secret",
      summary:
        "Side streets, small temples, and teahouse districts where the city slows down — without the usual checklist.",
      currentSlug: "kyoto-quiet-corners",
      titleImageUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-kyoto-quiet-corners",
      title: "Kyoto beyond the crowds: three walks that still feel like a secret",
      currentSlug: "kyoto-quiet-corners",
      summary:
        "Side streets, small temples, and teahouse districts where the city slows down — without the usual checklist.",
      titleImageUrl: IMAGES.portrait,
      body: [
        {
          _type: "block",
          _key: "k1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "c1",
              text: "Most first trips to Kyoto race between famous gates and bamboo groves. This route is different: it is for slow mornings, paper lanterns at dusk, and the sound of water in empty courtyards.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "k2",
          style: "h2",
          markDefs: [],
          children: [
            { _type: "span", _key: "c2", text: "Walk one: East side, before the shops open", marks: [] },
          ],
        },
        {
          _type: "block",
          _key: "k3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "c3",
              text: "Start where the light is still blue. Small cafés and family shrines are easier to feel when you are not sharing the sidewalk with a tour group. Let curiosity pick the turnings — the best streets rarely have a pin on the map.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "k4",
          style: "h2",
          markDefs: [],
          children: [
            { _type: "span", _key: "c4", text: "Why it matters", marks: [] },
          ],
        },
        {
          _type: "block",
          _key: "k5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "c5",
              text: "Culturin is built for this kind of travel: culture-first, community-shaped, and honest about pace. When your CMS is connected, your own stories will replace this preview — same layout, your voice.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "lisbon-light-and-tiles": {
    card: {
      title: "Lisbon in winter light: tiles, trams, and the long Atlantic afternoon",
      summary: "A colour-forward weekend that stays walkable — miradouros, vintage shops, and seafood without the summer rush.",
      currentSlug: "lisbon-light-and-tiles",
      titleImageUrl: IMAGES.fitness,
    },
    full: {
      _id: "showcase-lisbon-light-and-tiles",
      title: "Lisbon in winter light: tiles, trams, and the long Atlantic afternoon",
      currentSlug: "lisbon-light-and-tiles",
      summary:
        "A colour-forward weekend that stays walkable — miradouros, vintage shops, and seafood without the summer rush.",
      titleImageUrl: IMAGES.fitness,
      body: [
        {
          _type: "block",
          _key: "l1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "l1c",
              text: "Lisbon rewards vertical thinking: climb a miradouro, drop into a bakery, then ride a tram back downhill with warm light on the facades. Winter strips the city of summer noise and leaves the tiles glowing.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "l2",
          style: "h2",
          markDefs: [],
          children: [
            { _type: "span", _key: "l2c", text: "A simple day plan", marks: [] },
          ],
        },
        {
          _type: "block",
          _key: "l3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "l3c",
              text: "Morning: coffee and a slow neighborhood loop. Midday: market lunch. Late afternoon: one museum or one long coastal walk. Evenings are for fado or for doing nothing at all — the city will still be there tomorrow.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "marrakech-rose-dusk": {
    card: {
      title: "Marrakech at rose dusk: souks, courtyards, and when to put the map away",
      summary: "How to love the medina’s energy without burning out — rhythm, rest, and honest prices.",
      currentSlug: "marrakech-rose-dusk",
      titleImageUrl: IMAGES.texture,
    },
    full: {
      _id: "showcase-marrakech-rose-dusk",
      title: "Marrakech at rose dusk: souks, courtyards, and when to put the map away",
      currentSlug: "marrakech-rose-dusk",
      summary: "How to love the medina’s energy without burning out — rhythm, rest, and honest prices.",
      titleImageUrl: IMAGES.texture,
      body: [
        {
          _type: "block",
          _key: "m1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "m1c",
              text: "The medina is not a checklist. It is a sequence of courtyards, doorways, and sudden quiet. The best days alternate narrow lanes with open skies — a rooftop, a garden, a long lunch under an orange tree.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "m2",
          style: "h2",
          markDefs: [],
          children: [
            { _type: "span", _key: "m2c", text: "A gentle pace", marks: [] },
          ],
        },
        {
          _type: "block",
          _key: "m3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "m3c",
              text: "When the sun turns rose-gold, step out again. The souks look different, the calls soften, and the city feels like a story instead of a sprint.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "patagonia-wind-trail": {
    card: {
      title: "Patagonia’s wind trail: how to plan a trek that respects the weather",
      summary: "Layering, lodge spacing, and the one rule experienced hikers agree on before the first mile.",
      currentSlug: "patagonia-wind-trail",
      titleImageUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-patagonia-wind-trail",
      title: "Patagonia’s wind trail: how to plan a trek that respects the weather",
      currentSlug: "patagonia-wind-trail",
      summary: "Layering, lodge spacing, and the one rule experienced hikers agree on before the first mile.",
      titleImageUrl: IMAGES.portrait,
      body: [
        {
          _type: "block",
          _key: "p1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "p1c",
              text: "Patagonia is not “hard” in the way people think. It is honest. Wind, sun, and rain can all arrive before lunch. The trail rewards preparation and patience — the views wait for you.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "p2",
          style: "h2",
          markDefs: [],
          children: [
            { _type: "span", _key: "p2c", text: "The one rule", marks: [] },
          ],
        },
        {
          _type: "block",
          _key: "p3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "p3c",
              text: "Build buffer days. If a window opens, you will be glad you stayed flexible. If it does not, you will still be warm, dry, and ready for the next sunrise.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
};

type ShowcaseVideo = {
  card: videoCard;
  full: fullVideo;
};

const SHOWCASE_VIDEOS: Record<string, ShowcaseVideo> = {
  "golden-hour-in-the-valley": {
    card: {
      title: "Golden hour in the valley",
      currentSlug: "golden-hour-in-the-valley",
      uploader: "Culturin Studios",
      description: "Long shadows, slow music, and a route that only works at this time of day.",
      videoThumbnailUrl: IMAGES.fitness,
    },
    full: {
      _id: "showcase-golden-hour-in-the-valley",
      title: "Golden hour in the valley",
      currentSlug: "golden-hour-in-the-valley",
      uploader: "Culturin Studios",
      description: "Long shadows, slow music, and a route that only works at this time of day.",
      playbackId: MUX_PLAYBACK_DEMO,
      videoThumbnailUrl: IMAGES.fitness,
    },
  },
  "market-mornings": {
    card: {
      title: "Market mornings: sound, steam, and the first coffee",
      currentSlug: "market-mornings",
      uploader: "Culturin Studios",
      description: "A tight edit from opening hour — vendors, light, and the ritual of the first pour.",
      videoThumbnailUrl: IMAGES.texture,
    },
    full: {
      _id: "showcase-market-mornings",
      title: "Market mornings: sound, steam, and the first coffee",
      currentSlug: "market-mornings",
      uploader: "Culturin Studios",
      description: "A tight edit from opening hour — vendors, light, and the ritual of the first pour.",
      playbackId: MUX_PLAYBACK_DEMO,
      videoThumbnailUrl: IMAGES.texture,
    },
  },
  "coast-by-rail": {
    card: {
      title: "Coast by rail: one window, a hundred small harbours",
      currentSlug: "coast-by-rail",
      uploader: "Culturin Studios",
      description: "No narration — just pace, glass, and the line where land meets water.",
      videoThumbnailUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-coast-by-rail",
      title: "Coast by rail: one window, a hundred small harbours",
      currentSlug: "coast-by-rail",
      uploader: "Culturin Studios",
      description: "No narration — just pace, glass, and the line where land meets water.",
      playbackId: MUX_PLAYBACK_DEMO,
      videoThumbnailUrl: IMAGES.portrait,
    },
  },
};

/** Shown on the home page when the CMS returns no blog rows. */
export function getShowcaseBlogCards(): simpleBlogCard[] {
  return Object.values(SHOWCASE_ARTICLES).map((a) => a.card);
}

/** Shown on the home page when the CMS returns no video rows. */
export function getShowcaseVideoCards(): videoCard[] {
  return Object.values(SHOWCASE_VIDEOS).map((v) => v.card);
}

export function getShowcaseFullBlog(slug: string): fullBlog | null {
  return SHOWCASE_ARTICLES[slug]?.full ?? null;
}

export function getShowcaseFullVideo(slug: string): fullVideo | null {
  return SHOWCASE_VIDEOS[slug]?.full ?? null;
}
