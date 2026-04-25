import type {
  fullBlog,
  fullProvider,
  fullVideo,
  providerHeroCard,
  simpleBlogCard,
  videoCard,
} from "@/lib/interface";
import { REMOTE_DEMO_IMAGES } from "../remoteImageUrls";

/** Same public Mux asset used on `/stream` for consistent demo playback. */
const MUX_PLAYBACK_DEMO = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";

const IMAGES = REMOTE_DEMO_IMAGES;

type ShowcaseArticle = {
  card: simpleBlogCard;
  full: fullBlog;
};

const SHOWCASE_ARTICLES: Record<string, ShowcaseArticle> = {
  "kyoto-quiet-corners": {
    card: {
      title: "Kyoto beyond the crowds: three walks that still feel like a secret",
      summary:
        "Japan — side streets, small temples, and teahouse districts where Kyoto slows down — without the usual checklist.",
      currentSlug: "kyoto-quiet-corners",
      titleImageUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-kyoto-quiet-corners",
      title: "Kyoto beyond the crowds: three walks that still feel like a secret",
      currentSlug: "kyoto-quiet-corners",
      summary:
        "Japan — side streets, small temples, and teahouse districts where Kyoto slows down — without the usual checklist.",
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
      summary:
        "Portugal — a colour-forward Lisbon weekend that stays walkable: miradouros, vintage shops, and seafood without the summer rush.",
      currentSlug: "lisbon-light-and-tiles",
      titleImageUrl: IMAGES.fitness,
    },
    full: {
      _id: "showcase-lisbon-light-and-tiles",
      title: "Lisbon in winter light: tiles, trams, and the long Atlantic afternoon",
      currentSlug: "lisbon-light-and-tiles",
      summary:
        "Portugal — a colour-forward Lisbon weekend that stays walkable: miradouros, vintage shops, and seafood without the summer rush.",
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
      summary:
        "Morocco — how to love Marrakech’s medina energy without burning out — rhythm, rest, and honest prices.",
      currentSlug: "marrakech-rose-dusk",
      titleImageUrl: IMAGES.texture,
    },
    full: {
      _id: "showcase-marrakech-rose-dusk",
      title: "Marrakech at rose dusk: souks, courtyards, and when to put the map away",
      currentSlug: "marrakech-rose-dusk",
      summary:
        "Morocco — how to love Marrakech’s medina energy without burning out — rhythm, rest, and honest prices.",
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
      summary:
        "Argentina — Patagonia trekking: layering, lodge spacing, and the one rule experienced hikers agree on before the first mile.",
      currentSlug: "patagonia-wind-trail",
      titleImageUrl: IMAGES.portrait,
    },
    full: {
      _id: "showcase-patagonia-wind-trail",
      title: "Patagonia’s wind trail: how to plan a trek that respects the weather",
      currentSlug: "patagonia-wind-trail",
      summary:
        "Argentina — Patagonia trekking: layering, lodge spacing, and the one rule experienced hikers agree on before the first mile.",
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
  "iceland-coastal-quiet": {
    card: {
      title: "Iceland’s coastal quiet: hot pools, long light, and when to skip the crowds",
      summary:
        "Iceland — ring-road pacing, weather-wise stops, and small harbours where the North Atlantic feels personal.",
      currentSlug: "iceland-coastal-quiet",
      titleImageUrl:
        "https://images.unsplash.com/photo-1504893524553-b855314a8b66?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-iceland-coastal-quiet",
      title: "Iceland’s coastal quiet: hot pools, long light, and when to skip the crowds",
      currentSlug: "iceland-coastal-quiet",
      summary:
        "Iceland — ring-road pacing, weather-wise stops, and small harbours where the North Atlantic feels personal.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1504893524553-b855314a8b66?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "i1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "i1c",
              text: "Iceland rewards short drives and long pauses. Build days around daylight, wind, and one generous soak — the landscape will rearrange your sense of time.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "i2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "i2c", text: "A kinder pace", marks: [] }],
        },
        {
          _type: "block",
          _key: "i3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "i3c",
              text: "Skip the checklist. Choose two anchors per day — a coastal walk, a pool, a bakery in a fishing village — and let weather be the editor.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "italy-lake-como-slow": {
    card: {
      title: "Italy’s lake rhythm: Como slow days, ferries, and aperitivo on the water",
      summary:
        "Italy — Lake Como without the rush: ferry hops, shaded walks, and the art of doing very little extremely well.",
      currentSlug: "italy-lake-como-slow",
      titleImageUrl:
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-italy-lake-como-slow",
      title: "Italy’s lake rhythm: Como slow days, ferries, and aperitivo on the water",
      currentSlug: "italy-lake-como-slow",
      summary:
        "Italy — Lake Como without the rush: ferry hops, shaded walks, and the art of doing very little extremely well.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "t1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "t1c",
              text: "The lake teaches interval thinking: cross by boat, rest in shade, cross again. Italy here is quieter than the cities — but no less vivid.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "t2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "t2c", text: "One slow arc", marks: [] }],
        },
        {
          _type: "block",
          _key: "t3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "t3c",
              text: "Pick a base, then let ferries choose the corners. Afternoons are for swimming, reading, or watching light change on the opposite shore.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "mexico-oaxaca-market-dawn": {
    card: {
      title: "Mexico’s Oaxaca dawn: markets, mole, and the hour before the city wakes",
      summary:
        "Mexico — Oaxaca through scent and sound: early mercados, family kitchens, and the walk home before the heat arrives.",
      currentSlug: "mexico-oaxaca-market-dawn",
      titleImageUrl:
        "https://images.unsplash.com/photo-1512813195386-3cf96fad478d?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-mexico-oaxaca-market-dawn",
      title: "Mexico’s Oaxaca dawn: markets, mole, and the hour before the city wakes",
      currentSlug: "mexico-oaxaca-market-dawn",
      summary:
        "Mexico — Oaxaca through scent and sound: early mercados, family kitchens, and the walk home before the heat arrives.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1512813195386-3cf96fad478d?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "x1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "x1c",
              text: "Oaxaca is a morning city. Arrive before steam rises from the comal, carry small bills, and let vendors suggest what is best that hour.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "x2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "x2c", text: "Taste as map", marks: [] }],
        },
        {
          _type: "block",
          _key: "x3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "x3c",
              text: "Mexico rewards curiosity over conquest. One neighborhood, one market, one long lunch — then repeat tomorrow with a different door.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "south-africa-cape-light": {
    card: {
      title: "South Africa’s Cape light: peninsula drives, wind, and long ocean afternoons",
      summary:
        "South Africa — Cape Town and the peninsula: cliff roads, wine pockets, and when to stop chasing the perfect photo.",
      currentSlug: "south-africa-cape-light",
      titleImageUrl:
        "https://images.unsplash.com/photo-1580060839134-75a51eda4105?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-south-africa-cape-light",
      title: "South Africa’s Cape light: peninsula drives, wind, and long ocean afternoons",
      currentSlug: "south-africa-cape-light",
      summary:
        "South Africa — Cape Town and the peninsula: cliff roads, wine pockets, and when to stop chasing the perfect photo.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1580060839134-75a51eda4105?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "s1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s1c",
              text: "The Cape is contrast: warm stone, cold water, bright wind. Plan fewer stops and longer looks — the light will do the rest.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "s2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "s2c", text: "Drive as meditation", marks: [] }],
        },
        {
          _type: "block",
          _key: "s3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s3c",
              text: "South Africa asks for patience on the road and generosity at the table. Give both, and the peninsula opens in chapters instead of clips.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "vietnam-hanoi-street-dawn": {
    card: {
      title: "Vietnam’s Hanoi streets: dawn phở, old-quarter corners, and the rhythm of scooters",
      summary:
        "Vietnam — Hanoi before rush hour: soup steam, sidewalk stools, and the blocks where history still feels lived-in.",
      currentSlug: "vietnam-hanoi-street-dawn",
      titleImageUrl:
        "https://images.unsplash.com/photo-1559592419-2d97adc4792d?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-vietnam-hanoi-street-dawn",
      title: "Vietnam’s Hanoi streets: dawn phở, old-quarter corners, and the rhythm of scooters",
      currentSlug: "vietnam-hanoi-street-dawn",
      summary:
        "Vietnam — Hanoi before rush hour: soup steam, sidewalk stools, and the blocks where history still feels lived-in.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1559592419-2d97adc4792d?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "v1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "v1c",
              text: "Hanoi is best met early. Follow steam, then shade, then coffee. Vietnam here is intimate — a bowl, a plastic stool, a whole city waking beside you.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "v2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "v2c", text: "Walk small grids", marks: [] }],
        },
        {
          _type: "block",
          _key: "v3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "v3c",
              text: "Pick three blocks and repeat them at different hours. Streets change personality; your map should not pretend otherwise.",
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

type ShowcaseProvider = {
  card: providerHeroCard;
  full: fullProvider;
};

const SHOWCASE_PROVIDERS: Record<string, ShowcaseProvider> = {
  "sunrise-food-trail": {
    card: {
      name: "Culturin Collective",
      eventName: "Sunrise food trail",
      slug: "sunrise-food-trail",
      bannerImage: {
        image: {
          url: IMAGES.texture,
          alt: "A curated culinary experience with local hosts",
        },
      },
    },
    full: {
      name: "Culturin Collective",
      eventName: "Sunrise food trail",
      slug: "sunrise-food-trail",
      description:
        "A local-led morning route through independent bakeries, markets, and hidden breakfast spots. Designed for travelers who want stories with their coffee.",
      location: "London, United Kingdom",
      contactEmail: "hello@culturin.example",
      contactPhone: "+44 20 7946 0123",
      contactWebsite: "https://culturin.example/sunrise-food-trail",
      prices: [35, 55, 80],
      images: [
        { _id: "showcase-sunrise-1", url: IMAGES.texture, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-sunrise-2", url: IMAGES.fitness, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-sunrise-3", url: IMAGES.portrait, dimensions: { width: 1200, height: 800 } },
      ],
      bannerImage: {
        image: {
          url: IMAGES.texture,
          alt: "A curated culinary experience with local hosts",
        },
      },
    },
  },
  "street-culture-photo-walk": {
    card: {
      name: "Local Lens Studio",
      eventName: "Street culture photo walk",
      slug: "street-culture-photo-walk",
      bannerImage: {
        image: {
          url: IMAGES.fitness,
          alt: "Participants exploring city streets during a guided photo walk",
        },
      },
    },
    full: {
      name: "Local Lens Studio",
      eventName: "Street culture photo walk",
      slug: "street-culture-photo-walk",
      description:
        "Capture local neighborhoods through a community-first lens with guided prompts, portrait moments, and storytelling stops.",
      location: "Lagos, Nigeria",
      contactEmail: "bookings@locallens.example",
      contactPhone: "+234 800 555 4433",
      contactWebsite: "https://culturin.example/street-culture-photo-walk",
      prices: [45, 70, 110],
      images: [
        { _id: "showcase-photo-1", url: IMAGES.fitness, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-photo-2", url: IMAGES.texture, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-photo-3", url: IMAGES.portrait, dimensions: { width: 1200, height: 800 } },
      ],
      bannerImage: {
        image: {
          url: IMAGES.fitness,
          alt: "Participants exploring city streets during a guided photo walk",
        },
      },
    },
  },
  "hidden-neighbourhood-stories": {
    card: {
      name: "Roots & Routes",
      eventName: "Hidden neighbourhood stories",
      slug: "hidden-neighbourhood-stories",
      bannerImage: {
        image: {
          url: IMAGES.portrait,
          alt: "A guided local storytelling experience",
        },
      },
    },
    full: {
      name: "Roots & Routes",
      eventName: "Hidden neighbourhood stories",
      slug: "hidden-neighbourhood-stories",
      description:
        "An intimate walk through overlooked neighborhoods, meeting community historians and makers who bring local culture to life.",
      location: "Lisbon, Portugal",
      contactEmail: "hello@rootsroutes.example",
      contactPhone: "+351 21 900 1234",
      contactWebsite: "https://culturin.example/hidden-neighbourhood-stories",
      prices: [30, 50, 75],
      images: [
        { _id: "showcase-roots-1", url: IMAGES.portrait, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-roots-2", url: IMAGES.texture, dimensions: { width: 1200, height: 800 } },
        { _id: "showcase-roots-3", url: IMAGES.fitness, dimensions: { width: 1200, height: 800 } },
      ],
      bannerImage: {
        image: {
          url: IMAGES.portrait,
          alt: "A guided local storytelling experience",
        },
      },
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

/** Shown on the home page when the CMS returns no provider rows. */
export function getShowcaseProviderCards(): providerHeroCard[] {
  return Object.values(SHOWCASE_PROVIDERS).map((p) => p.card);
}

export function getShowcaseFullBlog(slug: string): fullBlog | null {
  return SHOWCASE_ARTICLES[slug]?.full ?? null;
}

export function getShowcaseFullVideo(slug: string): fullVideo | null {
  return SHOWCASE_VIDEOS[slug]?.full ?? null;
}

export function getShowcaseFullVideos(): fullVideo[] {
  return Object.values(SHOWCASE_VIDEOS).map((v) => v.full);
}

export function getShowcaseFullProvider(slug: string): fullProvider | null {
  return SHOWCASE_PROVIDERS[slug]?.full ?? null;
}
