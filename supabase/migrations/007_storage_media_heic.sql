-- Allow iPhone HEIC/HEIF uploads on the public `media` bucket (requires 004 applied first).

update storage.buckets
set allowed_mime_types = case
  when allowed_mime_types is null then
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']::text[]
  when not ('image/heic' = any (allowed_mime_types)) or not ('image/heif' = any (allowed_mime_types)) then
    allowed_mime_types || array['image/heic', 'image/heif']::text[]
  else allowed_mime_types
end
where id = 'media';
