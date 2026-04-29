-- Demo CMS content: 15 travel guides, 15 videos, 15 curated experiences.
-- Safe to re-run: skips rows that already exist (slug conflict).
-- Replace or delete these slugs in Supabase when you publish real editorial.

-- Shared demo hosted-player ID (same asset used elsewhere in the app).
-- Thumbnails: Unsplash (hotlink-friendly params).

insert into public.cms_blogs (slug, title, summary, title_image_url, body, published_at)
values
  (
    'demo-marrakesh-medina-mornings',
    'Marrakesh medina mornings: souks before the heat',
    'Morocco — how to enjoy the red city when lanes are quiet: tea, copper light, and the rhythm before shops fully open.',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d9?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a1","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s1","text":"Arrive early. The medina feels different when footsteps echo and vendors are still arranging piles of spices. Let yourself get slightly lost — the best corners rarely match the fastest route on a map.","marks":[]}]}]$json$::jsonb,
    '2025-01-08T10:00:00Z'::timestamptz
  ),
  (
    'demo-oaxaca-mezcal-evenings',
    'Oaxaca after dark: mezcal rooms and courtyard music',
    'Mexico — a slow introduction to agave spirits, mole on small plates, and plazas that fill with conversation.',
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a2","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s2","text":"Start with one tasting flight, not three. Ask what grows nearby and who makes the batch — the story is half the flavor. End the night in a square where guitar carries over stone.","marks":[]}]}]$json$::jsonb,
    '2025-01-12T10:00:00Z'::timestamptz
  ),
  (
    'demo-helsinki-design-weekend',
    'Helsinki in 48 hours: saunas, galleries, and Baltic light',
    'Finland — compact, walkable, and surprisingly soft on the eyes: Nordic design, waterfront paths, and honest heat.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a3","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s3","text":"Book sauna time like a meal reservation. Layer a museum between walks so your eyes reset. The winter light is brief — plan one long golden-hour stroll along the harbor.","marks":[]}]}]$json$::jsonb,
    '2025-01-15T10:00:00Z'::timestamptz
  ),
  (
    'demo-mexico-city-neighborhood-stroll',
    'Mexico City: conchas, concrete, and neighborhood scale',
    'Mexico — block-by-block Mexico City without racing: bakeries, modernist facades, and parks where the city exhales.',
    'https://images.unsplash.com/photo-1503220317375-0ad578212403?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a4","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s4","text":"Pick one colonia and stay curious. Coffee, a market lunch, and a slow loop through side streets beat a checklist of distant landmarks.","marks":[]}]}]$json$::jsonb,
    '2025-01-18T10:00:00Z'::timestamptz
  ),
  (
    'demo-palermo-street-eats',
    'Palermo street eats: markets, panels, and sea breeze',
    'Italy — Sicily''s capital as a walkable feast: arancini, caponata, and the blue line at the edge of town.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a5","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s5","text":"Follow your nose through markets first. Save room for a late passeggiata toward the water — the city loosens as the light drops.","marks":[]}]}]$json$::jsonb,
    '2025-01-21T10:00:00Z'::timestamptz
  ),
  (
    'demo-seoul-late-alley',
    'Seoul after midnight: pojangmacha glow and quiet temples',
    'South Korea — neon, grilled skewers, and pockets of stillness between districts that never quite sleep.',
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a6","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s6","text":"Alternate loud and soft: a busy street, then a lane where only a convenience store hums. Let someone pour you a drink you cannot name — that is part of the grammar of the night.","marks":[]}]}]$json$::jsonb,
    '2025-01-24T10:00:00Z'::timestamptz
  ),
  (
    'demo-cape-town-wine-day',
    'Cape Town: one wine-country loop without rushing',
    'South Africa — Stellenbosch slopes, farm kitchens, and the drive back with Table Mountain in the rear mirror.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a7","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s7","text":"Two tastings beat five. Ask for food pairings early and designate a driver or car service — the views deserve unhurried eyes.","marks":[]}]}]$json$::jsonb,
    '2025-01-27T10:00:00Z'::timestamptz
  ),
  (
    'demo-vienna-coffee-houses',
    'Vienna coffee houses: marble, newspapers, and slow cups',
    'Austria — the living tradition of the Kaffeehaus as a room for thinking, not just caffeine.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a8","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s8","text":"Order melange or einspänner and stay a while. The point is the bench, the brass, and the unspoken permission to do nothing impressive.","marks":[]}]}]$json$::jsonb,
    '2025-01-30T10:00:00Z'::timestamptz
  ),
  (
    'demo-montreal-winter-markets',
    'Montreal winter: markets, maple, and warm basements',
    'Canada — cold air, hot cider, and the city''s habit of moving social life indoors without losing style.',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a9","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s9","text":"Layer like you mean it. Follow a market morning with something slow — a museum, a long lunch, or skating if the rink is calling.","marks":[]}]}]$json$::jsonb,
    '2025-02-02T10:00:00Z'::timestamptz
  ),
  (
    'demo-buenos-aires-milonga',
    'Buenos Aires: milonga nights and tiled cafés',
    'Argentina — tango as community practice, not only performance, plus the city''s sweet tooth for pastries.',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a10","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s10","text":"Go where locals dance, not only where tourists watch. Early evening cafés are for recovery; late floors are for courage.","marks":[]}]}]$json$::jsonb,
    '2025-02-05T10:00:00Z'::timestamptz
  ),
  (
    'demo-accra-gallery-weekend',
    'Accra: contemporary galleries and Atlantic light',
    'Ghana — a growing art scene, open studios, and the contrast of coast and concrete.',
    'https://images.unsplash.com/photo-1504609773099-104ff2d73d6b?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a11","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s11","text":"Check opening hours — many spaces run on conversation as much as clocks. Leave time for the sea; salt air reframes everything you just saw.","marks":[]}]}]$json$::jsonb,
    '2025-02-08T10:00:00Z'::timestamptz
  ),
  (
    'demo-dubrovnik-shoulder-season',
    'Dubrovnik shoulder season: walls, water, fewer footsteps',
    'Croatia — limestone and Adriatic blue when the cruise rhythm thins out.',
    'https://images.unsplash.com/photo-152390683465176-4f29bfc0224c?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a12","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s12","text":"Walk the walls once for the postcard, once for silence. Kayak at sunset if the wind allows — the city looks gentler from the water.","marks":[]}]}]$json$::jsonb,
    '2025-02-11T10:00:00Z'::timestamptz
  ),
  (
    'demo-edinburgh-fringe-off-program',
    'Edinburgh beyond the Fringe poster: pubs, closes, and small rooms',
    'Scotland — festival energy without surrendering the city''s older bones.',
    'https://images.unsplash.com/photo-1502917059800-f1c0a1d5a0e1?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a13","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s13","text":"Buy one ticket to something unknown. Spend another evening only walking — closes hide gardens, stairs, and sudden quiet.","marks":[]}]}]$json$::jsonb,
    '2025-02-14T10:00:00Z'::timestamptz
  ),
  (
    'demo-auckland-harbor-walks',
    'Auckland: harbor walks, ferries, and volcanic views',
    'New Zealand — a city that opens to water; short sails change the whole afternoon.',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a14","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s14","text":"Take a ferry even if you turn straight back. The skyline reads differently from the wake. One volcanic cone climb is enough for a honest appetite.","marks":[]}]}]$json$::jsonb,
    '2025-02-17T10:00:00Z'::timestamptz
  ),
  (
    'demo-siem-reap-beyond-angkor',
    'Siem Reap beyond Angkor: villages, kitchens, and slow wheels',
    'Cambodia — temples first light, then countryside pace: markets, rice fields, and home-style cooking.',
    'https://images.unsplash.com/photo-1526481280695-3c687fd643d1?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"a15","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"s15","text":"Schedule rest. Heat and stone are generous teachers. A half-day on bicycles teaches you what a tuk-tuk smooths away.","marks":[]}]}]$json$::jsonb,
    '2025-02-20T10:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;

insert into public.cms_videos (slug, title, uploader, description, thumbnail_url, playback_id, published_at)
values
  (
    'demo-film-marrakesh-light',
    'Golden hour in the medina',
    'Culturin Field Notes',
    'Short cut: copper walls, shadows, and the sound of carts — Marrakesh.',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d9?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-09T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-oaxaca-plaza',
    'Oaxaca plaza at blue hour',
    'Culturin Field Notes',
    'Bandstand, families, and the moment the square turns social.',
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-11T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-helsinki-waterfront',
    'Helsinki waterfront in snow-light',
    'Culturin Field Notes',
    'Tram bells, thin ice at the edges, and long Nordic dusk.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-14T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-cdmx-morning',
    'Mexico City: morning pan and pavement',
    'Culturin Field Notes',
    'Steam, horns, and the rhythm of a capital waking up.',
    'https://images.unsplash.com/photo-1503220317375-0ad578212403?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-17T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-palermo-market',
    'Palermo: market voices',
    'Culturin Field Notes',
    'Fish on ice, shouting vendors, and citrus in piles.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-20T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-seoul-neon',
    'Seoul neon wash',
    'Culturin Field Notes',
    'Reflections on wet pavement; a minute of stillness in Gangnam glow.',
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-23T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-stellenbosch-vines',
    'Vine rows outside Cape Town',
    'Culturin Field Notes',
    'Wind in the leaves and a table just out of frame.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-26T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-vienna-marble',
    'Vienna café marble and brass',
    'Culturin Field Notes',
    'The sound of cups — slower than traffic.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-01-29T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-montreal-snow',
    'Montreal: snow on wrought iron',
    'Culturin Field Notes',
    'Stairs, boots, and breath visible — winter as texture.',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-01T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-buenos-aires-street',
    'Buenos Aires: tiled corner',
    'Culturin Field Notes',
    'Café doors, old paint, and the pause before milonga.',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-04T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-accra-coast',
    'Accra: Atlantic haze',
    'Culturin Field Notes',
    'Heat, salt, and the line where city meets sea.',
    'https://images.unsplash.com/photo-1504609773099-104ff2d73d6b?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-07T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-dubrovnik-kayak',
    'From the water: Dubrovnik walls',
    'Culturin Field Notes',
    'Paddle cadence and limestone rising from blue.',
    'https://images.unsplash.com/photo-152390683465176-4f29bfc0224c?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-10T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-edinburgh-mist',
    'Edinburgh: mist on the castle rock',
    'Culturin Field Notes',
    'A city that looks older when the weather cooperates.',
    'https://images.unsplash.com/photo-1502917059800-f1c0a1d5a0e1?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-13T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-auckland-ferry',
    'Auckland ferry wake',
    'Culturin Field Notes',
    'Spray, gulls, and the CBD shrinking behind you.',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-16T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-siem-reap-dust',
    'Siem Reap: red dust and palms',
    'Culturin Field Notes',
    'Country roads and the quiet after temple crowds.',
    'https://images.unsplash.com/photo-1526481280695-3c687fd643d1?w=1200&auto=format&fit=crop&q=80',
    'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s',
    '2025-02-19T12:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;

insert into public.cms_providers (
  slug,
  name,
  event_name,
  description,
  location,
  contact_email,
  contact_website,
  banner_image_url,
  banner_image_alt,
  published_at
)
values
  (
    'demo-stay-riad-marrakesh',
    'Riad Dar Lumen',
    'Courtyard breakfasts & medina access',
    'Three-night stay with rooftop tea, hammam booking help, and a map drawn by people who live in the lanes.',
    'Marrakesh, Morocco',
    'hello@example-riad.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d9?w=1600&auto=format&fit=crop&q=80',
    'Courtyard riad in Marrakesh',
    '2025-01-10T09:00:00Z'::timestamptz
  ),
  (
    'demo-mezcal-oaxaca',
    'Agave & Adobe',
    'Small-batch mezcal tasting',
    'Hosted flight in a courtyard: six pours, food pairings, and zero rush.',
    'Oaxaca, Mexico',
    'tours@example-mezcal.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&auto=format&fit=crop&q=80',
    'Mezcal tasting table in Oaxaca',
    '2025-01-13T09:00:00Z'::timestamptz
  ),
  (
    'demo-sauna-helsinki',
    'Löyly East',
    'Design sauna + Baltic dip',
    'Two-hour session: wood sauna, cold plunge coaching, and herbal tea.',
    'Helsinki, Finland',
    'book@example-sauna.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop&q=80',
    'Sauna interior Helsinki',
    '2025-01-16T09:00:00Z'::timestamptz
  ),
  (
    'demo-architecture-cdmx',
    'Bloquera Walks',
    'Modernist Mexico City on foot',
    'Half-day: four buildings, one market stop, coffee included.',
    'Mexico City, Mexico',
    'walks@example-cdmx.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1503220317375-0ad578212403?w=1600&auto=format&fit=crop&q=80',
    'Mexico City architecture',
    '2025-01-19T09:00:00Z'::timestamptz
  ),
  (
    'demo-streetfood-palermo',
    'Vucciria Nights',
    'Palermo street food crawl',
    'Stops for panelle, sfincione, and one sweet you did not know you needed.',
    'Palermo, Italy',
    'eat@example-palermo.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
    'Street food Palermo',
    '2025-01-22T09:00:00Z'::timestamptz
  ),
  (
    'demo-kfood-seoul',
    'Bangtan Alley Eats',
    'Night market & pojangmacha hop',
    'Guide-led evening: skewers, soju etiquette, and one surprise dish.',
    'Seoul, South Korea',
    'night@example-seoul.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1600&auto=format&fit=crop&q=80',
    'Seoul street at night',
    '2025-01-25T09:00:00Z'::timestamptz
  ),
  (
    'demo-wine-stellenbosch',
    'Bergkelder Picnic',
    'Vineyard lunch outside Cape Town',
    'Basket, bottle, and shaded table — driver add-on available.',
    'Stellenbosch, South Africa',
    'picnic@example-wine.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
    'Vineyard Stellenbosch',
    '2025-01-28T09:00:00Z'::timestamptz
  ),
  (
    'demo-concert-vienna',
    'Musikverein Side Door',
    'Chamber night + supper club',
    'Ticket assist, dress code tips, and a reserved table nearby.',
    'Vienna, Austria',
    'culture@example-vienna.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=80',
    'Vienna concert hall exterior',
    '2025-01-31T09:00:00Z'::timestamptz
  ),
  (
    'demo-winter-montreal',
    'Marché Bonsecours Circle',
    'Winter market & ice loop',
    'Guided tasting tokens plus skate rental coordination.',
    'Montreal, Canada',
    'winter@example-mtl.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&auto=format&fit=crop&q=80',
    'Montreal winter scene',
    '2025-02-03T09:00:00Z'::timestamptz
  ),
  (
    'demo-milonga-buenosaires',
    'San Telmo Milonga',
    'Tango evening for curious beginners',
    'Partner not required; host helps with floor etiquette.',
    'Buenos Aires, Argentina',
    'dance@example-ba.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&auto=format&fit=crop&q=80',
    'Tango dancers Buenos Aires',
    '2025-02-06T09:00:00Z'::timestamptz
  ),
  (
    'demo-galleries-accra',
    'Labadi Studio Circuit',
    'Contemporary art afternoon',
    'Private minibus between three spaces; artist talk when schedules align.',
    'Accra, Ghana',
    'art@example-accra.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1504609773099-104ff2d73d6b?w=1600&auto=format&fit=crop&q=80',
    'Gallery light Accra',
    '2025-02-09T09:00:00Z'::timestamptz
  ),
  (
    'demo-kayak-dubrovnik',
    'Adriatic Paddle Co.',
    'Sunset kayak under the walls',
    'Small groups; dry bags and briefings included.',
    'Dubrovnik, Croatia',
    'paddle@example-dbk.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-152390683465176-4f29bfc0224c?w=1600&auto=format&fit=crop&q=80',
    'Kayak Dubrovnik',
    '2025-02-12T09:00:00Z'::timestamptz
  ),
  (
    'demo-fringe-edinburgh',
    'Grassmarket Fringe Pass',
    'Three small-venue shows in one night',
    'Curated comedy and theatre; walking map between venues.',
    'Edinburgh, United Kingdom',
    'shows@example-edin.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1502917059800-f1c0a1d5a0e1?w=1600&auto=format&fit=crop&q=80',
    'Edinburgh old town',
    '2025-02-15T09:00:00Z'::timestamptz
  ),
  (
    'demo-ferry-auckland',
    'Hauraki Hop',
    'Waiheke afternoon ferry + tasting',
    'Return tickets coordinated; one boutique winery stop.',
    'Auckland, New Zealand',
    'islands@example-akl.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=80',
    'Auckland harbor',
    '2025-02-18T09:00:00Z'::timestamptz
  ),
  (
    'demo-cooking-siemreap',
    'Lotus Field Kitchen',
    'Countryside cooking class',
    'Market shop, mortar and pestle work, lunch under a pergola.',
    'Siem Reap, Cambodia',
    'kitchen@example-sr.demo',
    'https://example.com',
    'https://images.unsplash.com/photo-1526481280695-3c687fd643d1?w=1600&auto=format&fit=crop&q=80',
    'Cambodian countryside cooking',
    '2025-02-21T09:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;
