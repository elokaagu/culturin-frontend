-- Mateo’s previous banner stock photo read as an unrelated “kids” scene; use a tango / night-life image that matches the host profile.
update public.cms_providers
set
  banner_image_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
  banner_image_alt = 'Tango and evening culture in Buenos Aires'
where slug = 'guide-mateo-buenos-aires';
