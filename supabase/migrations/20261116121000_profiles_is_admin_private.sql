-- Keep is_admin() off the Data API. Policies still call it.
-- The public copy from 20261116120000_profiles.sql is replaced here.

drop policy profiles_select_own_or_admin on public.profiles;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.is_admin
      from public.profiles as p
      where p.id = (select auth.uid())
    ),
    false
  );
$$;

comment on function private.is_admin() is
  'True when the signed-in account has profiles.is_admin. Policies use this so the owner can read every profile.';

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.is_admin())
  );

drop function public.is_admin();
