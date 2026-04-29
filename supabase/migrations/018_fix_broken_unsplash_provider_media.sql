-- Replace Unsplash photo IDs that now 404 via Imgix (breaks Next/Image + SafeContentImage).
-- Targeted rows from 012_seed_local_guides + any rows backfilled with 017’s broken default.

update public.cms_providers
set
  banner_image_url = 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=80',
  banner_image_alt = 'Lagos city skyline and waterfront'
where slug = 'guide-adeola-lagos-culture';

update public.cms_providers
set
  banner_image_url = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=80',
  banner_image_alt = 'Lisbon rooftops and tiled streets'
where slug = 'guide-joao-lisbon-neighborhoods';

update public.cms_providers
set
  banner_image_url = 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=80',
  banner_image_alt = 'Marrakesh architecture and warm tones',
  avatar_image_url = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
where slug = 'guide-amina-marrakesh-medina';

update public.cms_providers
set
  banner_image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
  banner_image_alt = 'Mexico City urban landscape'
where slug = 'guide-camila-mexico-city';
