-- Seed fake users plus publishable profile lists for social/discovery UI.
-- Safe to re-run with ON CONFLICT guards.

insert into public.users (id, email, name, username, hashed_password, auth_provider_id)
values
  ('11111111-1111-4111-8111-111111111111', 'sofia.ramirez@example.com', 'Sofia Ramirez', 'sofiawanders', null, null),
  ('22222222-2222-4222-8222-222222222222', 'mateo.vargas@example.com', 'Mateo Vargas', 'mateoviaja', null, null),
  ('33333333-3333-4333-8333-333333333333', 'adeola.adesina@example.com', 'Adeola Adesina', 'adeolamoves', null, null),
  ('44444444-4444-4444-8444-444444444444', 'tomi.balogun@example.com', 'Tomi Balogun', 'tomiinlagos', null, null),
  ('55555555-5555-4555-8555-555555555555', 'leila.haddad@example.com', 'Leila Haddad', 'leila.routes', null, null),
  ('66666666-6666-4666-8666-666666666666', 'noah.bennett@example.com', 'Noah Bennett', 'noahcompass', null, null),
  ('77777777-7777-4777-8777-777777777777', 'amara.okafor@example.com', 'Amara Okafor', 'amaraexplores', null, null),
  ('88888888-8888-4888-8888-888888888888', 'lucas.moreau@example.com', 'Lucas Moreau', 'lucasjourneys', null, null)
on conflict (id) do update
set
  email = excluded.email,
  name = excluded.name,
  username = excluded.username;

insert into public.user_spot_lists (id, user_id, title, place_label, list_type, description, is_published)
values
  ('a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'Barcelona Slow Weekend', 'Barcelona', 'itinerary', 'A 3-day pace with neighborhood mornings and sunset architecture walks.', true),
  ('a2222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', 'Barcelona Tapas by District', 'Barcelona', 'highlights', 'Favorite tapas addresses grouped by El Born, Gracia, and Poble-sec.', true),
  ('a3333333-3333-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333', 'Lagos Mainland to Island Flow', 'Lagos', 'itinerary', 'A day-by-day route that keeps transfers short and evenings open.', true),
  ('a4444444-4444-4444-8444-444444444444', '44444444-4444-4444-8444-444444444444', 'Lagos Food & Music Picks', 'Lagos', 'collection', 'Spots for brunch, suya stops, and live sessions after dark.', true),
  ('a5555555-5555-4555-8555-555555555555', '55555555-5555-4555-8555-555555555555', 'Marrakech Design Corners', 'Marrakech', 'highlights', 'Studios, riads, and markets with strong craft and visual culture.', true),
  ('a6666666-6666-4666-8666-666666666666', '66666666-6666-4666-8666-666666666666', 'Cape Town First-Timer Plan', 'Cape Town', 'itinerary', 'Coastal views, local food, and one culture stop each day.', true),
  ('a7777777-7777-4777-8777-777777777777', '77777777-7777-4777-8777-777777777777', 'Accra Creative Weekend', 'Accra', 'collection', 'Galleries, design cafés, and low-key community events.', true),
  ('a8888888-8888-4888-8888-888888888888', '88888888-8888-4888-8888-888888888888', 'Paris Left Bank Notes', 'Paris', 'highlights', 'Bookshops, hidden courtyards, and evening river walks.', true),
  ('a9999999-9999-4999-8999-999999999999', '11111111-1111-4111-8111-111111111111', 'Lisbon Work + Wander Week', 'Lisbon', 'itinerary', 'Remote-work-friendly cafés plus post-work neighborhood routes.', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33333333-3333-4333-8333-333333333333', 'Lagos Photo Walk Route', 'Lagos', 'highlights', 'Color-rich streets, architecture frames, and golden-hour spots.', true)
on conflict (id) do update
set
  title = excluded.title,
  place_label = excluded.place_label,
  list_type = excluded.list_type,
  description = excluded.description,
  is_published = excluded.is_published;

insert into public.user_spot_list_items (id, list_id, title, notes, url, sort_order)
values
  ('b1111111-1111-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'Gracia morning coffee', 'Start around 9am before streets get busier.', null, 0),
  ('b1111111-1111-4111-8111-111111111112', 'a1111111-1111-4111-8111-111111111111', 'Casa Vicens exterior stop', 'Pair with nearby bakery break.', null, 1),
  ('b1111111-1111-4111-8111-111111111113', 'a1111111-1111-4111-8111-111111111111', 'Bunkers sunset view', 'Arrive 40 minutes before sunset.', null, 2),

  ('b2222222-2222-4222-8222-222222222221', 'a2222222-2222-4222-8222-222222222222', 'El Born tapas crawl', 'Pick 3 spots max to keep quality high.', null, 0),
  ('b2222222-2222-4222-8222-222222222222', 'a2222222-2222-4222-8222-222222222222', 'Poble-sec late bites', 'Great for post-show meals.', null, 1),

  ('b3333333-3333-4333-8333-333333333331', 'a3333333-3333-4333-8333-333333333333', 'Yaba design district', 'Cluster galleries before lunch.', null, 0),
  ('b3333333-3333-4333-8333-333333333332', 'a3333333-3333-4333-8333-333333333333', 'Lekki evening stop', 'Keep rides pre-booked at peak hours.', null, 1),

  ('b4444444-4444-4444-8444-444444444441', 'a4444444-4444-4444-8444-444444444444', 'Sunday brunch pick', 'Reserve ahead for larger groups.', null, 0),
  ('b4444444-4444-4444-8444-444444444442', 'a4444444-4444-4444-8444-444444444444', 'Late-night live set', 'Ideal on Friday/Saturday nights.', null, 1),

  ('b5555555-5555-4555-8555-555555555551', 'a5555555-5555-4555-8555-555555555555', 'Medina textile lane', 'Best bargaining before noon.', null, 0),
  ('b6666666-6666-4666-8666-666666666661', 'a6666666-6666-4666-8666-666666666666', 'Bo-Kaap photo stop', 'Respect local residents while shooting.', null, 0),
  ('b7777777-7777-4777-8777-777777777771', 'a7777777-7777-4777-8777-777777777777', 'Osu creative cluster', 'Walkable route with 4 quick stops.', null, 0),
  ('b8888888-8888-4888-8888-888888888881', 'a8888888-8888-4888-8888-888888888888', 'Shakespeare & Co. area', 'Arrive early to avoid queues.', null, 0),
  ('b9999999-9999-4999-8999-999999999991', 'a9999999-9999-4999-8999-999999999999', 'Morning coworking café', 'Reliable Wi-Fi and power sockets.', null, 0),
  ('baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Makoko waterfront frame', 'Golden hour for best light.', null, 0)
on conflict (id) do update
set
  title = excluded.title,
  notes = excluded.notes,
  url = excluded.url,
  sort_order = excluded.sort_order;

insert into public.user_follows (follower_user_id, following_user_id)
values
  ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333'),
  ('11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444'),
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111'),
  ('55555555-5555-4555-8555-555555555555', '66666666-6666-4666-8666-666666666666'),
  ('77777777-7777-4777-8777-777777777777', '33333333-3333-4333-8333-333333333333')
on conflict (follower_user_id, following_user_id) do nothing;
