-- Login identity. Specs: specs/12-data-model.md
-- One auth.users row, one public.profiles row. JWT role stays authenticated.
-- Admin is profiles.is_admin. There is no screen that grants it.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  language text not null,
  is_admin boolean not null default false,
  email text,
  created_at timestamptz not null default now(),
  constraint profiles_language_check check (language in ('en', 'pt-BR'))
);

comment on table public.profiles is
  'App identity for a signed-in account. Supabase Auth owns login.';

comment on column public.profiles.language is
  'en or pt-BR. Chosen at signup. Later changes are written here and are not copied back from user metadata.';

comment on column public.profiles.is_admin is
  'False on every signup. True only for the owner, set once in SQL. The browser cannot change it.';

comment on column public.profiles.email is
  'Copy of auth.users.email. Kept in sync when the auth email is inserted or changed.';

create index profiles_email_idx on public.profiles (email);

revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (language) on table public.profiles to authenticated;

alter table public.profiles enable row level security;

create or replace function public.is_admin()
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

comment on function public.is_admin() is
  'True when the signed-in account has profiles.is_admin. Policies use this so the owner can read every profile.';

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_admin())
  );

create policy profiles_update_own_language
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Signup metadata may carry language. is_admin in that metadata is ignored.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen text;
begin
  chosen := new.raw_user_meta_data ->> 'language';
  if chosen is null or chosen not in ('en', 'pt-BR') then
    raise exception 'signup language must be en or pt-BR';
  end if;

  insert into public.profiles (id, language, is_admin, email)
  values (new.id, chosen, false, new.email);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Email stays a copy. Language is not rewritten from metadata on later auth updates.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;

  if not found then
    raise exception 'profile missing for user %', new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_profile_email() from public, anon, authenticated;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.sync_profile_email();

-- Column grants already block the browser. This stops any other role except
-- the database owner from changing id, is_admin, email, or created_at.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.is_admin is distinct from old.is_admin
    or new.email is distinct from old.email
    or new.created_at is distinct from old.created_at
  then
    if current_user not in ('postgres', 'supabase_admin') then
      raise exception 'profiles allows updates to language only';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.protect_profile_columns() from public, anon, authenticated;

create trigger profiles_protect_columns
  before update on public.profiles
  for each row
  execute function public.protect_profile_columns();
