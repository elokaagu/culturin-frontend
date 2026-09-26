-- Email broadcasts written and sent from Admin > Emails, plus unsubscribe support.
-- Sending goes through Resend to everyone in newsletter_subscribers who hasn't unsubscribed.

create table if not exists public.email_broadcasts (
  id               uuid        primary key default gen_random_uuid(),
  subject          text        not null default '',
  preheader        text        not null default '',
  -- Portable Text blocks from the admin editor (same format as articles).
  body             jsonb       not null default '[]'::jsonb,
  status           text        not null default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
  recipient_count  integer,
  sent_count       integer     not null default 0,
  failed_count     integer     not null default 0,
  sent_at          timestamptz,
  sent_by          text,
  last_error       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists email_broadcasts_created_at_idx on public.email_broadcasts (created_at desc);

drop trigger if exists trg_email_broadcasts_set_updated_at on public.email_broadcasts;
create trigger trg_email_broadcasts_set_updated_at
  before update on public.email_broadcasts
  for each row execute function public.set_updated_at();

-- Only the server (service role) reads or writes broadcasts.
alter table public.email_broadcasts enable row level security;

-- Unsubscribed people stay on record (so a re-import can't re-add them silently) but are never emailed.
alter table public.newsletter_subscribers add column if not exists unsubscribed_at timestamptz;

-- Starter draft: the Chaka Khan evening write-up.
insert into public.email_broadcasts (subject, preheader, body)
select
  'A night of music, legacy and culture',
  'Culturin brought together an intimate gathering to celebrate Chaka Khan and her extraordinary legacy.',
  $json$[{"_type": "block", "_key": "k_draft2", "style": "h4", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft1", "text": "Culturin · In the room", "marks": []}]}, {"_type": "block", "_key": "k_draft4", "style": "h2", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft3", "text": "A night of music, legacy and culture", "marks": []}]}, {"_type": "block", "_key": "k_draft6", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft5", "text": "Some evenings are about an album. Others become part of the story.", "marks": []}]}, {"_type": "block", "_key": "k_draft8", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft7", "text": "Culturin had the honor of bringing together an intimate, extraordinary gathering to celebrate Chaka Khan, her remarkable legacy and the release of Chakzilla. The evening was conceived and curated by Unik Ernest.", "marks": []}]}, {"_type": "block", "_key": "k_draft10", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft9", "text": "The room brought together music, art, fashion, entertainment and culture, a reflection of how far Chaka's influence reaches across generations.", "marks": []}]}, {"_type": "block", "_key": "k_draft12", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft11", "text": "Guests included Angélique Kidjo, fresh from receiving her star on the Hollywood Walk of Fame; Rashida Jones; the acclaimed contemporary artist Mickalene Thomas; Shaggy; Larry Jackson; Sylvia Rhone; Sherrese Clarke of HarbourView; and L. Londell McMillan, Prince's longtime manager, estate representative and collaborator.", "marks": []}]}, {"_type": "block", "_key": "k_draft14", "style": "blockquote", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft13", "text": "But the evening was about more than a new album. It was about legacy.", "marks": []}]}, {"_type": "block", "_key": "k_draft16", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft15", "text": "Cultural architects, artists, executives, tastemakers and longtime champions of music came together to honor a woman whose voice, artistry and influence have carried across generations.", "marks": []}]}, {"_type": "block", "_key": "k_draft18", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft17", "text": "For Culturin, these are the moments that matter: rooms where music, culture, legacy and real connection meet. We're honored to have created an evening worthy of Chaka Khan, celebrating where she has been, where she is today and the next chapter of an extraordinary legacy.", "marks": []}]}, {"_type": "block", "_key": "k_draft20", "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": "k_draft19", "text": "Legacy is not simply remembered. It is experienced.", "marks": ["strong"]}]}]$json$::jsonb
where not exists (select 1 from public.email_broadcasts where subject = 'A night of music, legacy and culture');
