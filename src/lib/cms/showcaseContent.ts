import type {
  curatorCard,
  fullBlog,
  fullCurator,
  fullProvider,
  fullVideo,
  providerHeroCard,
  simpleBlogCard,
  videoCard,
} from "@/lib/interface";
import { REMOTE_DEMO_IMAGES } from "../remoteImageUrls";

/** Demo hosted-player ID shared across seeded showcase videos (see `/stream`). */
const SHOWCASE_DEMO_PLAYBACK_ID = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";

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
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-iceland-coastal-quiet",
      title: "Iceland’s coastal quiet: hot pools, long light, and when to skip the crowds",
      currentSlug: "iceland-coastal-quiet",
      summary:
        "Iceland — ring-road pacing, weather-wise stops, and small harbours where the North Atlantic feels personal.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-mexico-oaxaca-market-dawn",
      title: "Mexico’s Oaxaca dawn: markets, mole, and the hour before the city wakes",
      currentSlug: "mexico-oaxaca-market-dawn",
      summary:
        "Mexico — Oaxaca through scent and sound: early mercados, family kitchens, and the walk home before the heat arrives.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-south-africa-cape-light",
      title: "South Africa’s Cape light: peninsula drives, wind, and long ocean afternoons",
      currentSlug: "south-africa-cape-light",
      summary:
        "South Africa — Cape Town and the peninsula: cliff roads, wine pockets, and when to stop chasing the perfect photo.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
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
  "ghana-accra-creative-pulse": {
    card: {
      title: "Ghana's Accra creative pulse: galleries, music, and a city rewriting its story",
      summary:
        "Ghana — Accra's arts scene from wax-print studios to live highlife: the neighbourhoods where a new generation is making culture on their own terms.",
      currentSlug: "ghana-accra-creative-pulse",
      titleImageUrl:
        "https://images.unsplash.com/photo-1580746738099-a01d18e06e1a?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-ghana-accra-creative-pulse",
      title: "Ghana's Accra creative pulse: galleries, music, and a city rewriting its story",
      currentSlug: "ghana-accra-creative-pulse",
      summary:
        "Ghana — Accra's arts scene from wax-print studios to live highlife: the neighbourhoods where a new generation is making culture on their own terms.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1580746738099-a01d18e06e1a?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "gh1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "gh1c",
              text: "Accra does not slow down for visitors. It keeps its own rhythm — a city of makerspaces, outdoor stages, and supper clubs that exist because someone decided the neighbourhood needed them.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "gh2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "gh2c", text: "Where to look first", marks: [] }],
        },
        {
          _type: "block",
          _key: "gh3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "gh3c",
              text: "Start in the gallery districts: conversations here are free and generous. Move toward live music in the evening — highlife and Afrobeats share the same streets, often within earshot of each other.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "gh4",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "gh4c", text: "A city in motion", marks: [] }],
        },
        {
          _type: "block",
          _key: "gh5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "gh5c",
              text: "Ghana's creative energy is not curated for tourists — it is genuinely local and entirely alive. Show up with curiosity and a willingness to be surprised, and Accra will exceed whatever you planned.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "india-rajasthan-painted-towns": {
    card: {
      title: "India's painted towns: Rajasthan forts, desert light, and rooms with stories",
      summary:
        "India — slow travel through Rajasthan's blue city, ochre forts, and silk-road caravanserais where history is still warm to the touch.",
      currentSlug: "india-rajasthan-painted-towns",
      titleImageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-india-rajasthan-painted-towns",
      title: "India's painted towns: Rajasthan forts, desert light, and rooms with stories",
      currentSlug: "india-rajasthan-painted-towns",
      summary:
        "India — slow travel through Rajasthan's blue city, ochre forts, and silk-road caravanserais where history is still warm to the touch.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "raj1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "raj1c",
              text: "Rajasthan is not one colour — it is an argument between ochre, blue, and rose that shifts with the hour. Fort walls hold centuries of trade routes; havelis hold painted ceilings that took lifetimes to finish.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "raj2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "raj2c", text: "Morning on the rooftop", marks: [] }],
        },
        {
          _type: "block",
          _key: "raj3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "raj3c",
              text: "Wake before the desert heat arrives. Chai on a rooftop, a fort silhouette in the early haze, then the bazaar opening stall by stall. The slowest hours here are the most generous.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "raj4",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "raj4c", text: "How to pace it", marks: [] }],
        },
        {
          _type: "block",
          _key: "raj5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "raj5c",
              text: "Two nights minimum per town. Rajasthan does not reveal itself in an afternoon. The region rewards those who eat locally, wander without agenda, and accept that every guesthouse owner has a story worth hearing.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "colombia-cartagena-walled": {
    card: {
      title: "Colombia's walled city: Cartagena heat, colour, and the walk that never repeats",
      summary:
        "Colombia — inside Cartagena's old walls: Caribbean light on bougainvillea, colonial plazas, and the rooftop hour that makes the humidity worth it.",
      currentSlug: "colombia-cartagena-walled",
      titleImageUrl:
        "https://images.unsplash.com/photo-1562619371-b67725b6fde2?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-colombia-cartagena-walled",
      title: "Colombia's walled city: Cartagena heat, colour, and the walk that never repeats",
      currentSlug: "colombia-cartagena-walled",
      summary:
        "Colombia — inside Cartagena's old walls: Caribbean light on bougainvillea, colonial plazas, and the rooftop hour that makes the humidity worth it.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1562619371-b67725b6fde2?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "col1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "col1c",
              text: "Cartagena is best understood as a colour conversation. Every street inside the walls offers a different argument between yellow walls, red bougainvillea, and the blue sky above balconies loaded with plants.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "col2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "col2c", text: "Midday rules", marks: [] }],
        },
        {
          _type: "block",
          _key: "col3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "col3c",
              text: "The heat owns noon. Retreat: a courtyard lunch, a slow coffee, a hammock if one is available. Return to the streets at four when the walls glow golden and the squares fill with locals rather than tour groups.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "col4",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "col4c", text: "Beyond the postcard", marks: [] }],
        },
        {
          _type: "block",
          _key: "col5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "col5c",
              text: "The neighbourhoods outside the walls are where Cartagena actually lives — cumbia at corner stores, fruit carts in the morning, and conversations that go long past any reasonable dinner hour.",
              marks: [],
            },
          ],
        },
      ],
    },
  },
  "new-zealand-south-island-fjords": {
    card: {
      title: "New Zealand's southern silence: fjords, single-lane roads, and skies without edges",
      summary:
        "New Zealand — South Island slow driving: Milford Sound, valley camping, and the particular quiet that only arrives when you are hundreds of kilometres from the nearest city.",
      currentSlug: "new-zealand-south-island-fjords",
      titleImageUrl:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-new-zealand-south-island-fjords",
      title: "New Zealand's southern silence: fjords, single-lane roads, and skies without edges",
      currentSlug: "new-zealand-south-island-fjords",
      summary:
        "New Zealand — South Island slow driving: Milford Sound, valley camping, and the particular quiet that only arrives when you are hundreds of kilometres from the nearest city.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      body: [
        {
          _type: "block",
          _key: "nz1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "nz1c",
              text: "The South Island gives scale back to you. Mountains arrive before you are ready, then waterfalls, then a fjord that makes the drive feel entirely earned. Nothing about it is subtle.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "nz2",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "nz2c", text: "The road as the point", marks: [] }],
        },
        {
          _type: "block",
          _key: "nz3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "nz3c",
              text: "Do not rush to Milford. The road through the valley — mountain streams, moss-covered rock, single-lane bridges — is the experience. Build two hours of buffer and stop whenever the light changes, because it will.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "nz4",
          style: "h2",
          markDefs: [],
          children: [{ _type: "span", _key: "nz4c", text: "Night on the island", marks: [] }],
        },
        {
          _type: "block",
          _key: "nz5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "nz5c",
              text: "After dark, the South Island gives you stars that feel close enough to name. Find a valley with no road noise, make something warm, and stay outside longer than is sensible. It is always worth it.",
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
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    },
    full: {
      _id: "showcase-vietnam-hanoi-street-dawn",
      title: "Vietnam’s Hanoi streets: dawn phở, old-quarter corners, and the rhythm of scooters",
      currentSlug: "vietnam-hanoi-street-dawn",
      summary:
        "Vietnam — Hanoi before rush hour: soup steam, sidewalk stools, and the blocks where history still feels lived-in.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
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
  "pontoon-muse-alexis-doyle": {
    card: {
      title: "Pontoon Muse: Alexis Doyle",
      summary:
        "Travel photographer Alexis Doyle approaches the world with curiosity and a refined appreciation for culture and place. We speak with her about creativity, a life in motion, and finding a sense of home in unexpected places.",
      currentSlug: "pontoon-muse-alexis-doyle",
      titleImageUrl:
        "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1200&q=80",
      curatorSlug: "pontoon",
    },
    full: {
      _id: "showcase-pontoon-muse-alexis-doyle",
      title: "Pontoon Muse: Alexis Doyle",
      currentSlug: "pontoon-muse-alexis-doyle",
      summary:
        "Travel photographer Alexis Doyle approaches the world with curiosity and a refined appreciation for culture and place. We speak with her about creativity, a life in motion, and finding a sense of home in unexpected places.",
      titleImageUrl:
        "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1200&q=80",
      publishedAt: "2026-03-31T00:00:00Z",
      curatorSlug: "pontoon",
      body: [
        {
          _type: "block", _key: "ad0", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad0c", marks: [], text: "Alexis Doyle is a travel photographer and creative based across Cairo, Rome, and New York. Her work sits at the intersection of place, identity, and visual storytelling — built from three years of near-constant motion and a deep curiosity about how people belong to places." }],
        },
        {
          _type: "block", _key: "ad1q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad1qc", marks: [], text: "Where are you from? Where do you feel you belong now — geographically, culturally, and emotionally?" }],
        },
        {
          _type: "block", _key: "ad1a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad1ac", marks: [], text: "I'm originally from Michigan in the US and spent most of my life there from ages 8–22. However, when I turned 23 I set off on a trip that has since become somewhat of a nomadic lifestyle. I've spent most of the last three years traveling, and while I do still return to Michigan for pockets of time here and there, I'm not sure I'd say it's where I belong. During my travels, I've been lucky enough to find new places that have become something like home to me, namely Cairo and Rome. These are two of the cities I find myself returning to most often — I don't think I ever could tire of them. I've found that I am most inspired by places with rich history, culture, beautiful architecture, proud people, and I find all of these things in those places. Currently, I am semi-basing myself in New York City for the first time, which has been a dream of mine since I was a child. I have a feeling that this might be the next addition to my list of places I find myself at home in." }],
        },
        {
          _type: "block", _key: "ad2q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad2qc", marks: [], text: "Tell us what you're working on right now." }],
        },
        {
          _type: "block", _key: "ad2a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad2ac", marks: [], text: "A few things! I am currently trying to work more on capturing travel stories, am doing some test shoots in hopes of shooting a bit more fashion work, and am toying with the idea of sharing more of my words through Substack. The idea of curating a photo book of my work has also been in my back pocket for a while and I've been taking more steps towards making that a reality recently. In general I am trying to dive more deeply into my craft — I also work as a social media manager and while it's a wonderful job, I do find that it can take from my creativity sometimes, so I am trying to make a more concerted effort to make time for furthering my creative skills." }],
        },
        {
          _type: "block", _key: "ad3q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad3qc", marks: [], text: "Is there a word, phrase, or image that describes how your identity has evolved through your travels or transitions?" }],
        },
        {
          _type: "block", _key: "ad3a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad3ac", marks: [], text: "Perspective. Traveling to so many different regions of the world and experiencing different cultures really taught me a lot about people and the way the world works. It's allowed me to have a more grounded understanding of reality and to better be able to compare and contrast things — my views and perception are much more multidimensional now." }],
        },
        {
          _type: "block", _key: "ad4q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad4qc", marks: [], text: "How does your global lifestyle influence your daily life, work, and relationships?" }],
        },
        {
          _type: "block", _key: "ad4a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad4ac", marks: [], text: "It has influenced me in so many ways. Being relatively nomadic has allowed me to partner with clients from all over the world and see the different ways that they work, which has been very interesting. It's allowed me to immerse myself in new cultures as part of my job, and has helped a lot with building my confidence, both professionally and personally. As far as daily life goes, it has definitely made me a much better problem-solver and more adaptable. When every day can look so different you never really know what to expect — you have to be prepared to deal with anything, because often times, you don't have the choice not to be. It's really sink or swim a lot of the times, and while it can get tiring sometimes, it has pushed me in ways I'm not sure I ever would have been otherwise. It's also taught me a lot about materialism and consumption and what's a need vs. a want. In my relationships, it has definitely been the source of strain at times. I'm usually pretty on-the-go when I travel, and navigating a busy schedule and time zone differences with my loved ones has been something I've struggled with. I'm grateful that all of my friends and family are super supportive of the life I've built for myself, but it can get hard when I'm missing nights out with girlfriends, birthdays, parties. However, all of the time spent away from everyone that I know has made me much better at connecting with new people and navigating different personalities, which I am very glad for." }],
        },
        {
          _type: "block", _key: "ad5q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad5qc", marks: [], text: "Can you describe a recent moment where you felt completely \"at home\" in an unexpected place?" }],
        },
        {
          _type: "block", _key: "ad5a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad5ac", marks: [], text: "I would say I felt this most strongly when I was in Cairo this past fall. For the first time in years I felt like I had truly settled into a place — I had lots of work lined up, lots of friends I could call to meet up with, and a somewhat stable routine. I've always loved Egypt, but I never expected it to feel so much like a home to me. I think I mostly have my friends there to thank for this. If I had to chose a specific time, there is one day in particular that this feeling really hit me. It felt like a perfect day to me — I worked out in the morning, had a shoot in the afternoon, attended a fashion show and got to bring a friend, was introduced to some new friends at the show, and went back to an apartment that I shared with another friend that was so homey and calming to come back to. That day really stuck with me because I felt so lucky to have found that all in a place I never expected to find it." }],
        },
        {
          _type: "block", _key: "ad6q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad6qc", marks: [], text: "What is a recent discovery — about yourself, your work, or the world — that has inspired or transformed you?" }],
        },
        {
          _type: "block", _key: "ad6a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad6ac", marks: [], text: "A recent perspective shift for me came from seeing someone online set a challenge for herself to collect 1,000 rejections in a year. It completely reframed the way I think about failure. Like many creative people, I can be very hard on myself and used to find the idea of failing at something intimidating. But that idea made me realize how often we dismiss ourselves before anyone else even has the chance to. Since then, I've been trying to approach opportunities more boldly and to see discomfort or uncertainty not as a reason to stop, but as a challenge to move through and overcome. I've found that confidence is built mostly through trying, whether things work in your favor or not — because they inevitably will at some point." }],
        },
        {
          _type: "block", _key: "ad7q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad7qc", marks: [], text: "Share a resource, book, tool, or person who has recently influenced your growth." }],
        },
        {
          _type: "block", _key: "ad7a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad7ac", marks: [], text: "I'd say Zoë Yasmin and her Substack — I find myself going to her page a lot as I've tried to further grow and sharpen my creative identity." }],
        },
        {
          _type: "block", _key: "ad8q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad8qc", marks: [], text: "How do you actively nurture curiosity amid change or uncertainty?" }],
        },
        {
          _type: "block", _key: "ad8a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad8ac", marks: [], text: "I think that for me it is during times of change and uncertainty that my curiosity most naturally arises. For as long as I can remember I have been curious about anything and everything, and I feel that curiosity heightened when I'm in a new place or experiencing a new culture. Being outside of the familiar makes me pay closer attention and ask more questions. I also think that the sort of superposition I can find myself in during times of change — when more seems possible than usual — also leads me to assess all of the potential outcomes of a situation, and to think myself towards best case scenarios, often on the base question \"what if?\"." }],
        },
        {
          _type: "block", _key: "ad9q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad9qc", marks: [], text: "How do you build and maintain meaningful connections across cultures and distances?" }],
        },
        {
          _type: "block", _key: "ad9a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad9ac", marks: [], text: "Social media has actually been instrumental in this. I've been fortunate to grow a network through Instagram that connects me with people from all over the world, which makes it much easier to meet people when I'm traveling somewhere new. It also allows me to stay connected to their lives even when we're far apart. In terms of how those relationships really develop, it often happens when someone invites me into a ritualistic aspect of their life. It might be an activity they love, showing me a favorite viewpoint in their town, or welcoming me into a dinner that's culturally significant to them. I've found that these moments when someone shares something intimate or personal about their world are often where the strongest connections are built — because those experiences are the moments when you realize how as humans we are all much more similar than we are different." }],
        },
        {
          _type: "block", _key: "ad10q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad10qc", marks: [], text: "Tell us about a relationship or mentorship that has profoundly impacted your journey." }],
        },
        {
          _type: "block", _key: "ad10a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad10ac", marks: [], text: "I'd have to say the most impactful has actually been a sort of mentorship through one of my social media clients. She is a photographer herself and has worked with huge clients across an array of industries. She's been so helpful in helping me to understand the world of photography and the way that it works, both in a practical and creative sense. As someone that comes from an entirely different background — I studied Biomedical Sciences in university — I have had to do a lot of self-education to understand the workings of this industry, and she has helped me with this in ways I never would have been able to help myself." }],
        },
        {
          _type: "block", _key: "ad11q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad11qc", marks: [], text: "What practices or rituals help you find sanctuary and balance during transitions?" }],
        },
        {
          _type: "block", _key: "ad11a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad11ac", marks: [], text: "Exercise and movement is definitely a big one for me — I try to go for runs wherever I am and that really helps me to feel grounded in a place. Kind of similar, but also going for a slower walk where I am always helps. I'll bring my camera and just shoot whatever captures my eye and really focus on being present and observant of my surroundings." }],
        },
        {
          _type: "block", _key: "ad12q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad12qc", marks: [], text: "What advice would you offer other women cultivating their own sense of belonging?" }],
        },
        {
          _type: "block", _key: "ad12a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad12ac", marks: [], text: "I think it's important to remember that when you're creating your own sense of belonging, there often isn't a clear path to follow, and because of that, comparing yourself to others can sometimes be counterproductive, especially when it leads to negative self-talk. Everyone's circumstances are different, so it's rarely a fair comparison. I do think comparison can be helpful when it inspires you or motivates you to push yourself, but otherwise I try to focus more on developing myself in a way that makes me someone I'm proud to be. That pride comes from being genuinely kind to others and from accomplishing goals. From there, the community and sense of belonging tend to follow naturally." }],
        },
        {
          _type: "block", _key: "ad13q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad13qc", marks: [], text: "What impact do you hope to create locally and globally through your work, relationships, or presence?" }],
        },
        {
          _type: "block", _key: "ad13a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad13ac", marks: [], text: "I feel like this is something I'm still in the process of figuring out, but in general I hope to be an example for people when it comes to listening to their instincts and pursuing the things that truly excite them, even when the path isn't clearly defined. My background is in Biomedical Sciences, and for a long time I planned to go to medical school and become an Emergency Medicine doctor. While I loved what I studied, as the med school application cycle approached I realized there were many other passions I had never given myself the chance to explore. Pursuing those meant stepping away from a very structured and respected path and moving toward something much more open-ended and fluid. I didn't know exactly what it would look like or how it would unfold, but I trusted myself enough to believe that if I worked hard, I could figure it out. If someone had told me during my senior year that within a few years I would be traveling full time, photographing in places around the world, and building a career for myself, I would have had a hard time believing it. I think the impact I hope to create is simply to show that it's possible to follow that little voice in your head that tells you there might be something more and what can happen when you trust that gut instinct and take action on it." }],
        },
        {
          _type: "block", _key: "ad14q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad14qc", marks: [], text: "Imagine a future moment where your purpose feels fully realized." }],
        },
        {
          _type: "block", _key: "ad14a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad14ac", marks: [], text: "This is another thing that I still feel like I'm figuring out, but when I imagine a moment where my purpose feels fully realized, I think it would involve using my skills — creative or analytical — to help other people pursue their dreams. I'd love to support other entrepreneurs, women especially, through consulting, creative direction, or simply as a soundboard for bringing their ideas to life. Seeing people go after what they truly want is something that brings me a lot of joy, and I think if more people did it the world would be a much better place for it." }],
        },
        {
          _type: "block", _key: "ad15q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad15qc", marks: [], text: "Can you share a personal experience when you witnessed or were part of a moment where women uplifted, empowered, or stood together?" }],
        },
        {
          _type: "block", _key: "ad15a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad15ac", marks: [], text: "I've had the opportunity to photograph three women's group trips so far, some centered around creativity and others simply focused on travel. Even though each experience involved completely different groups of women and completely different circumstances, those trips were some of the purest and most uplifting experiences I've had. There was this constant sense of encouragement among everyone — it was literally like being in an echo chamber of compliments. I felt seen in ways I hadn't before, and experiencing that kind of support and warmth from people I had only just met was incredibly powerful. That experience really reinforced for me how important it is to have people in your life who genuinely want to uplift you and remind you of your worth, and I think this can be found most purely through female friendships." }],
        },
        {
          _type: "block", _key: "ad16q", style: "h3", markDefs: [],
          children: [{ _type: "span", _key: "ad16qc", marks: [], text: "If Pontoon is a vessel carrying women through evolving journeys, what would your \"message in a bottle\" be for our community?" }],
        },
        {
          _type: "block", _key: "ad16a", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "ad16ac", marks: [], text: "My message in a bottle would be to really tune in to your gut feelings and intuition. I like to think of that voice as your future self gently guiding you toward the life you're meant to grow into — even when things seem unclear, that'll be what keeps you steady. There's a reason we dream of the things we do, and I believe we owe it to ourselves, and to the world around us, to follow those dreams." }],
        },
      ],
    },
  },
};

type ShowcaseCurator = {
  card: curatorCard;
  full: fullCurator;
};

const SHOWCASE_CURATORS: Record<string, ShowcaseCurator> = {
  pontoon: {
    card: {
      slug: "pontoon",
      name: "Pontoon",
      tagline: "Stories for women in motion",
      avatarUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      websiteUrl: "https://pontooncommunity.com",
      instagramUrl: "https://www.instagram.com/pontoon_co/",
      shopUrl: "https://pontooncommunity.com/shop",
      specialties: ["Travel", "Women's voices", "Culture", "Identity", "Photography"],
    },
    full: {
      slug: "pontoon",
      name: "Pontoon",
      tagline: "Stories for women in motion",
      description:
        "Pontoon is an editorial community built around women who move through the world on their own terms — photographers, writers, explorers, and makers who find meaning in motion. Through long-form interviews, travel stories, and cultural dispatches, Pontoon documents the lives of women whose sense of home is always evolving. Culturin is proud to feature Pontoon's work as part of our curated editorial programme.",
      avatarUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      bannerUrl:
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      websiteUrl: "https://pontooncommunity.com",
      instagramUrl: "https://www.instagram.com/pontoon_co/",
      shopUrl: "https://pontooncommunity.com/shop",
      specialties: ["Travel", "Women's voices", "Culture", "Identity", "Photography"],
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
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
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
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
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
      playbackId: SHOWCASE_DEMO_PLAYBACK_ID,
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
  return Object.values(SHOWCASE_VIDEOS).map((v) => ({
    ...v.card,
    playbackId: v.full.playbackId,
  }));
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

export function getShowcaseCuratorCards(): curatorCard[] {
  return Object.values(SHOWCASE_CURATORS).map((c) => c.card);
}

export function getShowcaseFullCurator(slug: string): fullCurator | null {
  return SHOWCASE_CURATORS[slug]?.full ?? null;
}

export function getShowcaseBlogsBycurator(curatorSlug: string): simpleBlogCard[] {
  return Object.values(SHOWCASE_ARTICLES)
    .filter((a) => a.card.curatorSlug === curatorSlug)
    .map((a) => a.card);
}
