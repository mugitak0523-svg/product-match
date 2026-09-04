-- `profiles` uses `username`, not `handle`.
-- Correct the auth trigger so email/password sign-ups can create a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    'maker-' || substr(new.id::text, 1, 8),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'user_name', ''),
      nullif(new.raw_user_meta_data ->> 'preferred_username', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(left(split_part(new.email, '@', 1), 5), '')
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
