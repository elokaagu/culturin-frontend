-- Event photos keep the photographer's untouched file for downloads, alongside the
-- resized grid (`src`) and lightbox (`large_src`) copies shown on the site.
alter table public.gallery_images add column if not exists original_src text;

-- Photographers' originals are often over the old 10 MB cap.
update storage.buckets set file_size_limit = 52428800 where id = 'media';
