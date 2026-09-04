alter table public.profiles add column if not exists deleted_at timestamptz;

create or replace view public.product_comments_public as
select
  c.id,
  c.product_id,
  case when c.deleted_at is null then c.body else 'Deleted comment' end as body,
  c.created_at,
  (c.deleted_at is not null) as is_deleted,
  case
    when c.deleted_at is null and p.deleted_at is null then coalesce(p.display_name, p.username, 'Maker')
    else 'Deleted user'
  end as author_name
from public.product_comments c
join public.profiles p on p.id = c.user_id;

revoke select on public.product_comments from anon, authenticated;
grant select on public.product_comments_public to anon, authenticated;

create or replace function public.retire_own_account()
returns void
language plpgsql
security definer set search_path = ''
as $$
declare account_id uuid := auth.uid();
begin
  if account_id is null then
    raise exception 'Authentication required';
  end if;

  update public.product_comments
  set deleted_at = now()
  where user_id = account_id and deleted_at is null;

  delete from public.arena_queue q
  using public.products p
  where q.product_id = p.id and p.owner_id = account_id;

  update public.matches m
  set
    winner_product_id = case when product_a.owner_id = account_id then m.product_b_id else m.product_a_id end,
    status = 'completed',
    ends_at = now(),
    tiebreak_type = 'walkover'
  from public.products product_a, public.products product_b
  where product_a.id = m.product_a_id
    and product_b.id = m.product_b_id
    and m.status in ('scheduled', 'active', 'overtime')
    and (product_a.owner_id = account_id) <> (product_b.owner_id = account_id);

  update public.arena_entries ae
  set status = 'eliminated', eliminated_round = coalesce(eliminated_round, 0)
  from public.products p
  where ae.product_id = p.id
    and p.owner_id = account_id
    and ae.status in ('queued', 'active');

  update public.products set status = 'archived' where owner_id = account_id and status <> 'archived';
  update public.outbound_clicks set user_id = null where user_id = account_id;
  update public.analytics_events set user_id = null where user_id = account_id;
  delete from public.access_grants where user_id = account_id;

  update public.profiles
  set
    username = 'deleted-' || substr(account_id::text, 1, 8),
    display_name = 'Deleted user',
    avatar_url = null,
    bio = null,
    website_url = null,
    x_handle = null,
    role = 'user',
    deleted_at = now()
  where id = account_id;
end;
$$;

grant execute on function public.retire_own_account() to authenticated;
