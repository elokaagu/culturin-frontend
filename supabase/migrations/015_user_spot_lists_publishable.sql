alter table public.user_spot_lists
  add column if not exists list_type text not null default 'itinerary',
  add column if not exists description text,
  add column if not exists is_published boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_spot_lists_list_type_check'
      and conrelid = 'public.user_spot_lists'::regclass
  ) then
    alter table public.user_spot_lists
      add constraint user_spot_lists_list_type_check
      check (list_type in ('itinerary', 'collection', 'highlights'));
  end if;
end
$$;
