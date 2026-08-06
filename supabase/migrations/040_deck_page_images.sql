-- Fast deck viewing: pre-rendered page JPEGs served instead of client-side PDF.js.

alter table public.sales_decks
  add column if not exists page_image_urls text[];

-- Allow JPEG page previews in the sales-decks bucket.
update storage.buckets
set allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/webp', 'image/png']::text[]
where id = 'sales-decks';

-- Return type changes require drop + recreate.
drop function if exists public.get_deck_by_token(text);
drop function if exists public.unlock_deck(text, text);

create or replace function public.get_deck_by_token(p_token text)
returns table (
  id uuid,
  title text,
  description text,
  file_url text,
  page_count integer,
  require_email boolean,
  allow_download boolean,
  has_password boolean,
  partner_link_id uuid,
  partner_label text,
  status text,
  page_image_urls text[]
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.title,
    d.description,
    case when d.password_hash is null then d.file_url else null end as file_url,
    d.page_count,
    d.require_email,
    d.allow_download,
    (d.password_hash is not null) as has_password,
    pl.id as partner_link_id,
    pl.label as partner_label,
    d.status,
    case when d.password_hash is null then d.page_image_urls else null end as page_image_urls
  from public.sales_decks d
  left join public.deck_partner_links pl
    on pl.deck_id = d.id and pl.slug = lower(p_token)
  where d.status = 'live'
    and (
      d.share_token = p_token
      or d.custom_slug = lower(p_token)
      or pl.id is not null
    )
  limit 1;
$$;

grant execute on function public.get_deck_by_token(text) to anon, authenticated;

create or replace function public.unlock_deck(p_token text, p_password text)
returns table (
  file_url text,
  page_image_urls text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  deck_row public.sales_decks%rowtype;
begin
  select d.* into deck_row
  from public.sales_decks d
  left join public.deck_partner_links pl
    on pl.deck_id = d.id and pl.slug = lower(p_token)
  where d.status = 'live'
    and (
      d.share_token = p_token
      or d.custom_slug = lower(p_token)
      or pl.id is not null
    )
  limit 1;

  if not found then
    return;
  end if;

  if deck_row.password_hash is null then
    return query select deck_row.file_url, deck_row.page_image_urls;
    return;
  end if;

  if deck_row.password_hash = extensions.crypt(p_password, deck_row.password_hash) then
    return query select deck_row.file_url, deck_row.page_image_urls;
  end if;
end;
$$;

grant execute on function public.unlock_deck(text, text) to anon, authenticated;
