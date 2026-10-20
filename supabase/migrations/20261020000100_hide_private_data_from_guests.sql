-- Los datos sensibles solo se exponen con sesión iniciada:
-- ubicación exacta y WhatsApp autorizado. Los invitados reciben null.

create or replace view public.profiles_public
with (security_invoker = false)
as
select
  id,
  name,
  city,
  case when auth.uid() is not null then show_whatsapp else false end as show_whatsapp,
  case
    when show_whatsapp and auth.uid() is not null then whatsapp
    else null
  end as whatsapp,
  created_at
from public.profiles;

create or replace view public.posts_public
with (security_invoker = false)
as
select
  p.id,
  p.author_id,
  p.status,
  p.species,
  p.pet_name,
  p.sex,
  p.age,
  p.size,
  p.description,
  p.location_label,
  case
    when auth.uid() is not null
      then extensions.ST_Y(p.location::extensions.geometry)
    else null
  end as lat,
  case
    when auth.uid() is not null
      then extensions.ST_X(p.location::extensions.geometry)
    else null
  end as lng,
  p.search_radius_km,
  p.event_date,
  p.resolved_at,
  p.created_at,
  p.updated_at,
  pr.name as author_name,
  pr.city as author_city,
  case when auth.uid() is not null then pr.show_whatsapp else false end as author_show_whatsapp,
  case
    when pr.show_whatsapp and auth.uid() is not null then pr.whatsapp
    else null
  end as author_whatsapp,
  coalesce(ph.photos, '[]'::jsonb) as photos
from public.posts p
join public.profiles pr on pr.id = p.author_id
left join lateral (
  select jsonb_agg(
    jsonb_build_object('id', pp.id, 'url', pp.url, 'position', pp.position)
    order by pp.position
  ) as photos
  from public.post_photos pp
  where pp.post_id = p.id
) ph on true;

-- Búsqueda con distancia siempre disponible, pero coordenadas exactas solo con sesión.
create or replace function public.nearby_posts(
  p_status public.pet_status,
  p_species public.pet_species default null,
  p_sex public.pet_sex default null,
  p_age public.pet_age default null,
  p_size public.pet_size default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_radius_km double precision default 10,
  p_viewer_id uuid default null
)
returns table (
  id uuid, author_id uuid, status public.pet_status, species public.pet_species,
  pet_name text, sex public.pet_sex, age public.pet_age, size public.pet_size,
  description text, location_label text, lat double precision, lng double precision,
  search_radius_km integer, event_date date, resolved_at timestamptz,
  created_at timestamptz, updated_at timestamptz, author_name text, author_city text,
  author_show_whatsapp boolean, author_whatsapp text, photos jsonb, distance_km double precision
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  with candidates as (
    select
      p.id,
      p.author_id,
      p.status,
      p.species,
      p.pet_name,
      p.sex,
      p.age,
      p.size,
      p.description,
      p.location_label,
      case
        when auth.uid() is not null then extensions.ST_Y(p.location::extensions.geometry)
        else null
      end as lat,
      case
        when auth.uid() is not null then extensions.ST_X(p.location::extensions.geometry)
        else null
      end as lng,
      p.search_radius_km,
      p.event_date,
      p.resolved_at,
      p.created_at,
      p.updated_at,
      pr.name as author_name,
      pr.city as author_city,
      case when auth.uid() is not null then pr.show_whatsapp else false end as author_show_whatsapp,
      case
        when pr.show_whatsapp and auth.uid() is not null then pr.whatsapp
        else null
      end as author_whatsapp,
      coalesce(ph.photos, '[]'::jsonb) as photos,
      case
        when p_lat is null or p_lng is null then null
        else round(
          (extensions.ST_Distance(
            p.location,
            extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography
          ) / 1000)::numeric,
          1
        )::double precision
      end as distance_km
    from public.posts p
    join public.profiles pr on pr.id = p.author_id
    left join lateral (
      select jsonb_agg(
        jsonb_build_object('id', pp.id, 'url', pp.url, 'position', pp.position)
        order by pp.position
      ) as photos
      from public.post_photos pp
      where pp.post_id = p.id
    ) ph on true
    where p.resolved_at is null
      and (p_status is null or p.status = p_status)
      and (p_species is null or p.species = p_species)
      and (p_sex is null or p.sex = p_sex)
      and (p_age is null or p.age = p_age)
      and (p_size is null or p.size = p_size)
      and (
        coalesce(auth.uid(), p_viewer_id) is null
        or p.author_id <> coalesce(auth.uid(), p_viewer_id)
      )
      and not exists (
        select 1 from public.interactions i
        where i.post_id = p.id
          and i.user_id = coalesce(auth.uid(), p_viewer_id)
      )
      and not exists (
        select 1 from public.blocks b
        where (
          b.blocker_id = coalesce(auth.uid(), p_viewer_id)
          and b.blocked_id = p.author_id
        ) or (
          b.blocker_id = p.author_id
          and b.blocked_id = coalesce(auth.uid(), p_viewer_id)
        )
      )
      and (
        p_lat is null or p_lng is null
        or extensions.ST_Distance(
          p.location,
          extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography
        ) <= (coalesce(p_radius_km, 10) + p.search_radius_km) * 1000
      )
  )
  select *
  from candidates
  order by distance_km nulls last, created_at desc
  limit 300;
$$;

revoke select on public.posts from anon;
grant select on public.posts to authenticated;

revoke all on function public.nearby_posts(
  public.pet_status,
  public.pet_species,
  public.pet_sex,
  public.pet_age,
  public.pet_size,
  double precision,
  double precision,
  double precision,
  uuid
) from public;
grant execute on function public.nearby_posts(
  public.pet_status,
  public.pet_species,
  public.pet_sex,
  public.pet_age,
  public.pet_size,
  double precision,
  double precision,
  double precision,
  uuid
) to anon, authenticated;
