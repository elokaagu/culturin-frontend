-- Culturin Card membership pipeline: event RSVPs and advisor applications
-- feed into this review table, Studio staff invite promising applicants,
-- and an invitee "claims" their invite by signing in with a matching email
-- (see src/app/culturin-card/claim and src/app/api/card-applications/claim).
create table if not exists public.card_applications (
  id                       uuid        primary key default gen_random_uuid(),
  email                    text        not null,
  first_name               text,
  last_name                text,
  company                  text,
  title                    text,
  linkedin_url             text,
  source                   text        not null check (source in ('event_rsvp', 'advisor_application', 'manual')),
  source_event_slug        text,
  source_rsvp_id           uuid        references public.event_rsvps(id),
  status                   text        not null default 'pending' check (status in ('pending', 'invited', 'active', 'declined')),
  invite_token             text        unique,
  invite_token_expires_at  timestamptz,
  invited_at               timestamptz,
  activated_at             timestamptz,
  user_id                  uuid        references public.users(id),
  reviewed_by              uuid        references public.users(id),
  created_at               timestamptz not null default now()
);

create index if not exists card_applications_status_idx on public.card_applications (status, created_at desc);
create index if not exists card_applications_email_idx on public.card_applications (lower(email));

alter table public.card_applications enable row level security;

-- Public application forms (advisors page, event RSVP) may only ever insert a
-- fresh pending row for themselves — every privileged column must be null so
-- a crafted request can't self-approve or plant its own invite token.
drop policy if exists "card_applications_insert" on public.card_applications;
create policy "card_applications_insert"
  on public.card_applications for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and invite_token is null
    and invite_token_expires_at is null
    and invited_at is null
    and activated_at is null
    and user_id is null
    and reviewed_by is null
  );

-- No select policy: same trust model as event_rsvps/partner_inquiries. Studio
-- and the claim flow read exclusively through the service-role client, so
-- invite_token is never reachable from the anon/authenticated RLS surface.

alter table public.users
  add column if not exists card_status text not null default 'none'
    check (card_status in ('none', 'invited', 'active', 'revoked')),
  add column if not exists card_activated_at timestamptz;

-- Atomically activates a claimed invite: flips the application to 'active',
-- links it to the claiming user, burns the (now single-use) token, and marks
-- the user as a Card member. Runs as service_role only — the claim API route
-- has already verified the token/email/expiry before calling this, and the
-- WHERE clause re-checks them here too so a retried/racing call is a no-op.
create or replace function public.activate_card_membership(p_token text, p_user_id uuid, p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app_id uuid;
begin
  update public.card_applications
    set status = 'active', activated_at = now(), user_id = p_user_id, invite_token = null
    where invite_token = p_token
      and status = 'invited'
      and invite_token_expires_at > now()
      and lower(email) = lower(p_email)
    returning id into v_app_id;

  if v_app_id is null then
    return false;
  end if;

  update public.users set card_status = 'active', card_activated_at = now() where id = p_user_id;

  return true;
end;
$$;

revoke all on function public.activate_card_membership(text, uuid, text) from public;
grant execute on function public.activate_card_membership(text, uuid, text) to service_role;
