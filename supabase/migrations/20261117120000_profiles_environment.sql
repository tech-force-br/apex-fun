-- profiles.environment. Specs: specs/12-data-model.md
-- local or production, set once at signup. The learner cannot change it.
-- Local and production share this database. Content tables are unchanged.

alter table public.profiles
  add column environment text not null,
  add constraint profiles_environment_check
    check (environment in ('local', 'production'));

comment on column public.profiles.environment is
  'local or production. Set once at signup from the app that created the account. The learner cannot change it.';

-- Signup metadata carries language and environment. is_admin in that metadata is ignored.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_language text;
  chosen_environment text;
begin
  chosen_language := new.raw_user_meta_data ->> 'language';
  if chosen_language is null or chosen_language not in ('en', 'pt-BR') then
    raise exception 'signup language must be en or pt-BR';
  end if;

  chosen_environment := new.raw_user_meta_data ->> 'environment';
  if chosen_environment is null or chosen_environment not in ('local', 'production') then
    raise exception 'signup environment must be local or production';
  end if;

  insert into public.profiles (id, language, is_admin, email, environment)
  values (new.id, chosen_language, false, new.email, chosen_environment);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Column grants already block the browser. This stops any other role except
-- the database owner from changing id, is_admin, email, environment, or created_at.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.is_admin is distinct from old.is_admin
    or new.email is distinct from old.email
    or new.environment is distinct from old.environment
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
