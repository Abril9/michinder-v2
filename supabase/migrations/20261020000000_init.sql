-- Michinder: esquema inicial
-- Postgres + PostGIS + RLS. Ejecutar con `npx supabase db reset`.

create extension if not exists postgis with schema extensions;

-- Enums de dominio
create type public.pet_status as enum ('lost', 'found');
create type public.pet_species as enum ('cat', 'dog', 'other');
create type public.pet_sex as enum ('male', 'female', 'unknown');
create type public.pet_age as enum ('baby', 'young', 'adult', 'senior');
create type public.pet_size as enum ('small', 'medium', 'large');
create type public.interaction_action as enum ('like', 'pass');

-- Perfiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 60),
  city text check (city is null or char_length(city) <= 80),
  whatsapp text check (whatsapp is null or whatsapp ~ '^[0-9+() -]{6,25}$'),
  show_whatsapp boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Publicaciones
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  status public.pet_status not null,
  species public.pet_species not null,
  pet_name text check (pet_name is null or char_length(pet_name) <= 60),
  sex public.pet_sex not null default 'unknown',
  age public.pet_age,
  size public.pet_size,
  description text not null check (char_length(description) between 10 and 1200),
  location_label text not null check (char_length(location_label) between 3 and 120),
  location extensions.geography(Point, 4326) not null,
  search_radius_km integer not null default 10 check (search_radius_km between 1 and 100),
  event_date date,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_photos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  url text not null,
  position smallint not null default 0 check (position between 0 and 2),
  created_at timestamptz not null default now()
);

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action public.interaction_action not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  interested_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  unique (post_id, interested_id),
  check (owner_id <> interested_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.conversation_reads (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  reported_user_id uuid references public.profiles(id) on delete set null,
  reason text not null check (char_length(reason) between 3 and 80),
  details text check (details is null or char_length(details) <= 600),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (post_id is not null or reported_user_id is not null)
);

-- Índices
create index posts_status_species_idx on public.posts (status, species) where resolved_at is null;
create index posts_author_idx on public.posts (author_id, created_at desc);
create index posts_location_idx on public.posts using gist (location);
create index post_photos_post_idx on public.post_photos (post_id, position);
create index interactions_user_idx on public.interactions (user_id, created_at desc);
create index conversations_owner_idx on public.conversations (owner_id, last_message_at desc);
create index conversations_interested_idx on public.conversations (interested_id, last_message_at desc);
create index messages_conversation_idx on public.messages (conversation_id, created_at);
create index messages_sender_idx on public.messages (sender_id, created_at desc);
create index reports_created_idx on public.reports (created_at desc);

-- Perfil automático al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger posts_touch_updated_at before update on public.posts
for each row execute function public.touch_updated_at();

-- Vista pública de perfiles (oculta WhatsApp si no está autorizado)
create view public.profiles_public
with (security_invoker = false)
as
select
  id,
  name,
  city,
  show_whatsapp,
  case when show_whatsapp then whatsapp else null end as whatsapp,
  created_at
from public.profiles;

-- Vista pública de publicaciones con autor y fotos
create view public.posts_public
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
  extensions.ST_Y(p.location::extensions.geometry) as lat,
  extensions.ST_X(p.location::extensions.geometry) as lng,
  p.search_radius_km,
  p.event_date,
  p.resolved_at,
  p.created_at,
  p.updated_at,
  pr.name as author_name,
  pr.city as author_city,
  pr.show_whatsapp as author_show_whatsapp,
  case when pr.show_whatsapp then pr.whatsapp else null end as author_whatsapp,
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

-- Búsqueda por radio. Muestra avisos cuyos radios se cruzan con el del usuario.
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
security invoker
set search_path = public, extensions
as $$
  select
    pp.*,
    case
      when p_lat is null or p_lng is null then null
      else round(
        (extensions.ST_Distance(
          extensions.ST_SetSRID(extensions.ST_MakePoint(pp.lng, pp.lat), 4326)::extensions.geography,
          extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography
        ) / 1000)::numeric,
        1
      )::double precision
    end as distance_km
  from public.posts_public pp
  where pp.resolved_at is null
    and (p_status is null or pp.status = p_status)
    and (p_species is null or pp.species = p_species)
    and (p_sex is null or pp.sex = p_sex)
    and (p_age is null or pp.age = p_age)
    and (p_size is null or pp.size = p_size)
    and (p_viewer_id is null or pp.author_id <> p_viewer_id)
    and not exists (
      select 1 from public.interactions i
      where i.post_id = pp.id and i.user_id = p_viewer_id
    )
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = p_viewer_id and b.blocked_id = pp.author_id)
         or (b.blocker_id = pp.author_id and b.blocked_id = p_viewer_id)
    )
    and (
      p_lat is null or p_lng is null
      or extensions.ST_Distance(
        extensions.ST_SetSRID(extensions.ST_MakePoint(pp.lng, pp.lat), 4326)::extensions.geography,
        extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography
      ) <= (coalesce(p_radius_km, 10) + pp.search_radius_km) * 1000
    )
  order by distance_km nulls last, pp.created_at desc
  limit 300;
$$;

-- Crear publicación
create or replace function public.create_post(
  p_status public.pet_status,
  p_species public.pet_species,
  p_pet_name text,
  p_sex public.pet_sex,
  p_age public.pet_age,
  p_size public.pet_size,
  p_description text,
  p_location_label text,
  p_lat double precision,
  p_lng double precision,
  p_search_radius_km integer,
  p_event_date date
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  insert into public.posts (
    author_id, status, species, pet_name, sex, age, size, description,
    location_label, location, search_radius_km, event_date
  ) values (
    auth.uid(), p_status, p_species, nullif(trim(p_pet_name), ''), p_sex, p_age, p_size,
    trim(p_description), trim(p_location_label),
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
    coalesce(p_search_radius_km, 10), p_event_date
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Editar publicación (sin cambiar estado ni fotos)
create or replace function public.update_post(
  p_id uuid,
  p_pet_name text,
  p_sex public.pet_sex,
  p_age public.pet_age,
  p_size public.pet_size,
  p_description text,
  p_location_label text,
  p_lat double precision,
  p_lng double precision,
  p_search_radius_km integer,
  p_event_date date
)
returns boolean
language plpgsql
security invoker
set search_path = public, extensions
as $$
begin
  update public.posts
  set
    pet_name = nullif(trim(p_pet_name), ''),
    sex = p_sex,
    age = p_age,
    size = p_size,
    description = trim(p_description),
    location_label = trim(p_location_label),
    location = extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
    search_radius_km = coalesce(p_search_radius_km, 10),
    event_date = p_event_date
  where id = p_id and author_id = auth.uid();

  if not found then
    raise exception 'NOT_FOUND';
  end if;

  return true;
end;
$$;

-- Swipe: registra interacción y crea chat si es like
create or replace function public.swipe_post(
  p_post_id uuid,
  p_action public.interaction_action
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_post record;
  v_conversation uuid;
  v_recent integer;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select id, author_id, resolved_at into v_post
  from public.posts where id = p_post_id;

  if not found then raise exception 'POST_NOT_FOUND'; end if;
  if v_post.author_id = v_user then raise exception 'OWN_POST'; end if;
  if v_post.resolved_at is not null then raise exception 'POST_RESOLVED'; end if;

  if exists (
    select 1 from public.blocks b
    where (b.blocker_id = v_user and b.blocked_id = v_post.author_id)
       or (b.blocker_id = v_post.author_id and b.blocked_id = v_user)
  ) then
    raise exception 'BLOCKED';
  end if;

  insert into public.interactions (post_id, user_id, action)
  values (p_post_id, v_user, p_action)
  on conflict (post_id, user_id)
  do update set action = excluded.action, created_at = now();

  if p_action = 'pass' then
    return null;
  end if;

  select id into v_conversation
  from public.conversations
  where post_id = p_post_id and interested_id = v_user;

  if v_conversation is not null then
    return v_conversation;
  end if;

  select count(*) into v_recent
  from public.conversations
  where interested_id = v_user and created_at > now() - interval '24 hours';

  if v_recent >= 10 then
    raise exception 'CHAT_LIMIT';
  end if;

  insert into public.conversations (post_id, owner_id, interested_id)
  values (p_post_id, v_post.author_id, v_user)
  returning id into v_conversation;

  return v_conversation;
end;
$$;

-- Mensaje con anti-spam
create or replace function public.send_message(
  p_conversation_id uuid,
  p_body text
)
returns public.messages
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_body text := trim(p_body);
  v_message public.messages;
  v_count integer;
  v_other uuid;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if v_body is null or char_length(v_body) = 0 or char_length(v_body) > 1000 then
    raise exception 'INVALID_BODY';
  end if;

  select case when owner_id = v_user then interested_id else owner_id end
  into v_other
  from public.conversations
  where id = p_conversation_id and (owner_id = v_user or interested_id = v_user);

  if not found then raise exception 'NOT_FOUND'; end if;

  if exists (
    select 1 from public.blocks b
    where (b.blocker_id = v_user and b.blocked_id = v_other)
       or (b.blocker_id = v_other and b.blocked_id = v_user)
  ) then
    raise exception 'BLOCKED';
  end if;

  select count(*) into v_count from public.messages
  where sender_id = v_user and created_at > now() - interval '1 minute';
  if v_count >= 20 then raise exception 'MESSAGE_RATE_LIMIT'; end if;

  select count(*) into v_count from public.messages
  where sender_id = v_user and created_at > now() - interval '24 hours';
  if v_count >= 200 then raise exception 'MESSAGE_DAILY_LIMIT'; end if;

  select count(*) into v_count from public.messages
  where sender_id = v_user and conversation_id = p_conversation_id
    and body = v_body and created_at > now() - interval '30 seconds';
  if v_count > 0 then raise exception 'DUPLICATE_MESSAGE'; end if;

  insert into public.messages (conversation_id, sender_id, body)
  values (p_conversation_id, v_user, v_body)
  returning * into v_message;

  update public.conversations
  set last_message_at = v_message.created_at
  where id = p_conversation_id;

  return v_message;
end;
$$;

-- Marcar conversación como leída
create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (
    select 1 from public.conversations
    where id = p_conversation_id and (owner_id = auth.uid() or interested_id = auth.uid())
  ) then
    raise exception 'NOT_FOUND';
  end if;

  insert into public.conversation_reads (conversation_id, user_id, last_read_at)
  values (p_conversation_id, auth.uid(), now())
  on conflict (conversation_id, user_id)
  do update set last_read_at = now();
end;
$$;

-- Listado de chats con último mensaje y no leídos
create or replace function public.my_conversations()
returns table (
  id uuid, post_id uuid, post_title text, post_photo text, post_status public.pet_status,
  other_id uuid, other_name text, other_city text, other_show_whatsapp boolean,
  other_whatsapp text, last_message text, last_message_at timestamptz,
  unread_count bigint, created_at timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    c.id,
    c.post_id,
    coalesce(
      p.pet_name,
      case p.species when 'cat' then 'Gato' when 'dog' then 'Perro' else 'Mascota' end
    ) as post_title,
    (select pp.url from public.post_photos pp where pp.post_id = c.post_id order by pp.position limit 1) as post_photo,
    p.status,
    other.id as other_id,
    other.name as other_name,
    other.city as other_city,
    other.show_whatsapp as other_show_whatsapp,
    other.whatsapp as other_whatsapp,
    lm.body as last_message,
    c.last_message_at,
    (
      select count(*) from public.messages m
      where m.conversation_id = c.id
        and m.sender_id <> auth.uid()
        and m.created_at > coalesce(
          (select r.last_read_at from public.conversation_reads r
           where r.conversation_id = c.id and r.user_id = auth.uid()),
          'epoch'::timestamptz
        )
    ) as unread_count,
    c.created_at
  from public.conversations c
  join public.posts p on p.id = c.post_id
  join public.profiles_public other
    on other.id = case when c.owner_id = auth.uid() then c.interested_id else c.owner_id end
  left join lateral (
    select body from public.messages m
    where m.conversation_id = c.id
    order by created_at desc limit 1
  ) lm on true
  where c.owner_id = auth.uid() or c.interested_id = auth.uid()
  order by c.last_message_at desc nulls last;
$$;

-- Contador global de no leídos
create or replace function public.unread_count()
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum((
    select count(*) from public.messages m
    where m.conversation_id = c.id
      and m.sender_id <> auth.uid()
      and m.created_at > coalesce(
        (select r.last_read_at from public.conversation_reads r
         where r.conversation_id = c.id and r.user_id = auth.uid()),
        'epoch'::timestamptz
      )
  )), 0)::integer
  from public.conversations c
  where c.owner_id = auth.uid() or c.interested_id = auth.uid();
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_photos enable row level security;
alter table public.interactions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_reads enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

create policy "profiles: leer el propio" on public.profiles
for select to authenticated using (id = auth.uid());
create policy "profiles: editar el propio" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "posts: lectura pública" on public.posts
for select to anon, authenticated using (true);
create policy "posts: crear propio" on public.posts
for insert to authenticated with check (author_id = auth.uid());
create policy "posts: editar propio" on public.posts
for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "posts: borrar propio" on public.posts
for delete to authenticated using (author_id = auth.uid());

create policy "photos: lectura pública" on public.post_photos
for select to anon, authenticated using (true);
create policy "photos: crear si es mi post" on public.post_photos
for insert to authenticated with check (
  exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
);
create policy "photos: editar si es mi post" on public.post_photos
for update to authenticated using (
  exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
);
create policy "photos: borrar si es mi post" on public.post_photos
for delete to authenticated using (
  exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
);

create policy "interactions: leer propias" on public.interactions
for select to authenticated using (user_id = auth.uid());
create policy "interactions: crear propias" on public.interactions
for insert to authenticated with check (user_id = auth.uid());
create policy "interactions: editar propias" on public.interactions
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "interactions: borrar propias" on public.interactions
for delete to authenticated using (user_id = auth.uid());

create policy "conversations: leer participantes" on public.conversations
for select to authenticated using (owner_id = auth.uid() or interested_id = auth.uid());
create policy "conversations: crear interesado" on public.conversations
for insert to authenticated with check (interested_id = auth.uid() and owner_id <> auth.uid());
create policy "conversations: actualizar participantes" on public.conversations
for update to authenticated using (owner_id = auth.uid() or interested_id = auth.uid())
with check (owner_id = auth.uid() or interested_id = auth.uid());

create policy "messages: leer participantes" on public.messages
for select to authenticated using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.owner_id = auth.uid() or c.interested_id = auth.uid())
  )
);
create policy "messages: enviar propio" on public.messages
for insert to authenticated with check (
  sender_id = auth.uid() and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.owner_id = auth.uid() or c.interested_id = auth.uid())
  )
);

create policy "reads: propias" on public.conversation_reads
for select to authenticated using (user_id = auth.uid());
create policy "reads: crear propias" on public.conversation_reads
for insert to authenticated with check (user_id = auth.uid());
create policy "reads: editar propias" on public.conversation_reads
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "blocks: leer propios" on public.blocks
for select to authenticated using (blocker_id = auth.uid());
create policy "blocks: crear propios" on public.blocks
for insert to authenticated with check (blocker_id = auth.uid());
create policy "blocks: borrar propios" on public.blocks
for delete to authenticated using (blocker_id = auth.uid());

create policy "reports: crear propios" on public.reports
for insert to authenticated with check (reporter_id = auth.uid());
create policy "reports: leer propios" on public.reports
for select to authenticated using (reporter_id = auth.uid());

-- Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-photos', 'post-photos', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

create policy "post-photos: lectura pública" on storage.objects
for select to anon, authenticated using (bucket_id = 'post-photos');
create policy "post-photos: subir propio" on storage.objects
for insert to authenticated with check (
  bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "post-photos: editar propio" on storage.objects
for update to authenticated using (
  bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "post-photos: borrar propio" on storage.objects
for delete to authenticated using (
  bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text
);

-- Permisos
grant usage on schema public to anon, authenticated;
grant select on public.posts, public.post_photos to anon;
grant select on public.profiles_public, public.posts_public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.posts, public.post_photos, public.interactions,
  public.conversations, public.messages, public.conversation_reads, public.blocks to authenticated;
grant select, insert on public.reports to authenticated;

revoke all on function public.nearby_posts(public.pet_status, public.pet_species, public.pet_sex, public.pet_age, public.pet_size, double precision, double precision, double precision, uuid) from public;
grant execute on function public.nearby_posts(public.pet_status, public.pet_species, public.pet_sex, public.pet_age, public.pet_size, double precision, double precision, double precision, uuid) to anon, authenticated;

revoke all on function public.create_post(public.pet_status, public.pet_species, text, public.pet_sex, public.pet_age, public.pet_size, text, text, double precision, double precision, integer, date) from public;
grant execute on function public.create_post(public.pet_status, public.pet_species, text, public.pet_sex, public.pet_age, public.pet_size, text, text, double precision, double precision, integer, date) to authenticated;

revoke all on function public.update_post(uuid, text, public.pet_sex, public.pet_age, public.pet_size, text, text, double precision, double precision, integer, date) from public;
grant execute on function public.update_post(uuid, text, public.pet_sex, public.pet_age, public.pet_size, text, text, double precision, double precision, integer, date) to authenticated;

revoke all on function public.swipe_post(uuid, public.interaction_action) from public;
grant execute on function public.swipe_post(uuid, public.interaction_action) to authenticated;

revoke all on function public.send_message(uuid, text) from public;
grant execute on function public.send_message(uuid, text) to authenticated;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

revoke all on function public.my_conversations() from public;
grant execute on function public.my_conversations() to authenticated;

revoke all on function public.unread_count() from public;
grant execute on function public.unread_count() to authenticated;
