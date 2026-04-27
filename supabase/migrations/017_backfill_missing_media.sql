-- Ensure all CMS media fields are populated with valid fallback URLs.
-- Safe to re-run.

-- Blogs: hero/title images
update public.cms_blogs
set title_image_url = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80'
where title_image_url is null
   or btrim(title_image_url) = '';

-- Videos: thumbnails
update public.cms_videos
set thumbnail_url = 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80'
where thumbnail_url is null
   or btrim(thumbnail_url) = '';

-- Providers/experiences: banner images
update public.cms_providers
set banner_image_url = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80'
where banner_image_url is null
   or btrim(banner_image_url) = '';

-- Providers/local guides: avatar images
update public.cms_providers
set avatar_image_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80'
where avatar_image_url is null
   or btrim(avatar_image_url) = '';
