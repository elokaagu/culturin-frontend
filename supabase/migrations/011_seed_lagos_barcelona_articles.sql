-- Demo content for fuller city pages: 10 Lagos + 10 Barcelona articles.
-- Safe to re-run; existing slugs are preserved.

insert into public.cms_blogs (slug, title, summary, title_image_url, body, published_at)
values
  (
    'lagos-dawn-market-rhythm',
    'Lagos at dawn: market rhythm before the rush',
    'Nigeria — begin in Yaba and Tejuosho while shutters rise, then follow breakfast stalls as the city finds its pace.',
    'https://images.unsplash.com/photo-1504609773099-104ff2d73d6b?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg1","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg1s1","text":"Start before traffic hardens. Lagos markets are choreography: setup, banter, first sales, then full volume. The trick is to move with curiosity, not urgency.","marks":[]}]}]$json$::jsonb,
    '2025-03-01T09:00:00Z'::timestamptz
  ),
  (
    'lagos-creative-mainland-studios',
    'Inside Lagos creative studios on the mainland',
    'A neighborhood loop through design spaces, small brands, and workshop floors where ideas become products.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg2","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg2s1","text":"The mainland creative scene rewards appointments and introductions. Makers are generous with process when you show up with genuine interest and enough time.","marks":[]}]}]$json$::jsonb,
    '2025-03-03T09:00:00Z'::timestamptz
  ),
  (
    'lagos-jollof-trail-surulere',
    'A jollof trail through Surulere and beyond',
    'Taste your way across Lagos: smoky rice, grilled proteins, and the side dishes locals order without thinking twice.',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg3","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg3s1","text":"Ask for house specials first. Lagos food culture is local and opinionated in the best way; comparison is half the fun, conversation is the other half.","marks":[]}]}]$json$::jsonb,
    '2025-03-05T09:00:00Z'::timestamptz
  ),
  (
    'lagos-island-galleries-saturday',
    'A Saturday gallery circuit on Lagos Island',
    'From contemporary exhibitions to artist-run rooms, this route gives you a sharp read on Lagos visual culture.',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg4","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg4s1","text":"Pair galleries with one long lunch so the day does not feel transactional. The strongest visits are the ones where you leave room for discussion.","marks":[]}]}]$json$::jsonb,
    '2025-03-07T09:00:00Z'::timestamptz
  ),
  (
    'lagos-waterfront-evening-walks',
    'Lagos waterfront evenings: where to slow down',
    'A soft itinerary for golden-hour views, open-air spots, and end-of-day city light.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg5","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg5s1","text":"The waterfront is best treated as a reset, not a checklist. Watch the sky change, order something simple, and let the city move around you.","marks":[]}]}]$json$::jsonb,
    '2025-03-09T09:00:00Z'::timestamptz
  ),
  (
    'lagos-live-music-night-guide',
    'Where to catch live music in Lagos tonight',
    'A practical guide to venues, band nights, and how locals build a full evening around sound.',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg6","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg6s1","text":"Arrive before headliners and stay after sets. In Lagos, the social rhythm around music can be as memorable as the performance itself.","marks":[]}]}]$json$::jsonb,
    '2025-03-11T09:00:00Z'::timestamptz
  ),
  (
    'lagos-sunday-brunch-loop',
    'A Lagos Sunday brunch loop that actually works',
    'Traffic-aware planning for weekend mornings, from coffee and pastries to heavier late brunch plates.',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg7","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg7s1","text":"Pick two anchors and one wildcard stop. Keep your route compact and your expectations flexible; Sunday Lagos rewards adaptable plans.","marks":[]}]}]$json$::jsonb,
    '2025-03-13T09:00:00Z'::timestamptz
  ),
  (
    'lagos-fashion-retail-discovery',
    'Lagos fashion discovery: local labels to know',
    'An intro to independent brands, concept spaces, and tailoring culture shaping the city.',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg8","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg8s1","text":"Ask staff about drops and collaborations. Lagos retail is relationship-driven, and recommendations often lead to your best finds.","marks":[]}]}]$json$::jsonb,
    '2025-03-15T09:00:00Z'::timestamptz
  ),
  (
    'lagos-traffic-smart-city-day',
    'Traffic-smart Lagos: build a better city day',
    'A practical planning framework for sequencing neighborhoods and making the most of your time.',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg9","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg9s1","text":"Design your day by zones, not by wish lists. One district in depth beats five disconnected stops trapped behind long transfers.","marks":[]}]}]$json$::jsonb,
    '2025-03-17T09:00:00Z'::timestamptz
  ),
  (
    'lagos-first-timer-three-days',
    'Lagos for first-timers: a balanced 3-day plan',
    'Culture, food, and nightlife in a sequence that keeps energy high without burning out.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"lg10","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"lg10s1","text":"Alternate intensity and recovery. Lagos is expansive and rewarding, but your best memories usually come from moments you did not over-schedule.","marks":[]}]}]$json$::jsonb,
    '2025-03-19T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-morning-in-gracia',
    'Barcelona mornings in Gracia: cafés and quiet squares',
    'Spain — a neighborhood-first route through bakeries, side streets, and plazas before midday crowds arrive.',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc1","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc1s1","text":"Barcelona feels most local before 11. Walk without rushing, order simply, and let each square decide your next turn.","marks":[]}]}]$json$::jsonb,
    '2025-03-02T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-modernisme-route',
    'A modernisme route beyond the headline landmarks',
    'Look past the busiest façades and find the smaller architectural moments that shape daily Barcelona.',
    'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc2","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc2s1","text":"Pair one major site with lesser-known blocks nearby. Contrast helps you notice detail instead of collecting monuments.","marks":[]}]}]$json$::jsonb,
    '2025-03-04T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-tapas-neighborhood-guide',
    'Barcelona tapas by neighborhood, not hype',
    'How to eat across districts with better timing, better counters, and fewer tourist traps.',
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc3","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc3s1","text":"Stand where locals stand and ask what came in today. The best tapas nights are built on two or three strong stops, not ten average ones.","marks":[]}]}]$json$::jsonb,
    '2025-03-06T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-beach-and-books-afternoon',
    'Beach-and-books Barcelona: a soft afternoon plan',
    'From the sea wall to independent bookstores, this route blends coast air with culture breaks.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc4","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc4s1","text":"Use the beach as a reset, then return inland for coffee and pages. Barcelona rewards days with rhythm changes.","marks":[]}]}]$json$::jsonb,
    '2025-03-08T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-nightlife-without-chaos',
    'Barcelona nightlife without the chaos',
    'A calmer night strategy: vermut, live rooms, and late plates in the right order.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc5","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc5s1","text":"Begin earlier than the crowd. You can still finish late, but front-loading quality stops keeps the night intentional.","marks":[]}]}]$json$::jsonb,
    '2025-03-10T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-design-shops-and-studios',
    'Design shops and studio finds in Barcelona',
    'Independent makers, ceramics, prints, and thoughtful retail clusters for slower browsing.',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc6","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc6s1","text":"Ask about local production and limited runs. The most meaningful souvenirs are usually the ones with a maker story attached.","marks":[]}]}]$json$::jsonb,
    '2025-03-12T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-raval-culture-walk',
    'A culture walk through El Raval and nearby',
    'Museums, street texture, and food stops that reveal a layered side of central Barcelona.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc7","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc7s1","text":"Treat Raval as a conversation between institutions and street life. Step between both and the district starts to make sense.","marks":[]}]}]$json$::jsonb,
    '2025-03-14T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-day-trip-by-train',
    'Best Barcelona day trips by train',
    'A practical guide to nearby escapes with easy rail connections and enough time to be back for dinner.',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc8","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc8s1","text":"Choose one clear objective per trip: coastal swim, mountain walk, or old-town wandering. Simplicity is what makes day trips feel like rest.","marks":[]}]}]$json$::jsonb,
    '2025-03-16T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-rainy-day-playbook',
    'Barcelona rainy-day playbook',
    'When weather shifts, pivot to covered markets, long lunches, and indoor cultural anchors.',
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc9","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc9s1","text":"Rainy Barcelona is underrated. Build your day around warm interiors and let short walks stitch the plan together.","marks":[]}]}]$json$::jsonb,
    '2025-03-18T09:00:00Z'::timestamptz
  ),
  (
    'barcelona-first-timer-four-days',
    'Barcelona for first-timers: a complete 4-day flow',
    'A balanced plan for architecture, food, beach time, and neighborhoods that still feel lived-in.',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&auto=format&fit=crop&q=80',
    $json$[{"_type":"block","_key":"bc10","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"bc10s1","text":"Keep one empty window each day. Barcelona offers surprises around corners, and your best memory may not come from your original list.","marks":[]}]}]$json$::jsonb,
    '2025-03-20T09:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;
