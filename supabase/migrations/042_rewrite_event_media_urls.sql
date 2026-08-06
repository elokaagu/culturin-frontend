-- Point gallery + site image rows that still use local /events/... paths
-- at the public Supabase Storage media bucket (events/...).
-- Upload with: node scripts/upload-event-media.mjs

update public.gallery_images
set
  src = 'https://fvnxiabwhjposfujtloa.supabase.co/storage/v1/object/public/media' || src,
  large_src = case
    when large_src like '/events/%'
      then 'https://fvnxiabwhjposfujtloa.supabase.co/storage/v1/object/public/media' || large_src
    else large_src
  end
where src like '/events/%';

update public.site_images
set src = 'https://fvnxiabwhjposfujtloa.supabase.co/storage/v1/object/public/media' || src
where src like '/events/%';
