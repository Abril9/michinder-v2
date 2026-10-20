-- Ocultar conversaciones de usuarios bloqueados por el propio usuario.
-- El bloqueo inverso no se puede leer por RLS; send_message ya lo impide.

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
  where (c.owner_id = auth.uid() or c.interested_id = auth.uid())
    and not exists (
      select 1 from public.blocks b
      where b.blocker_id = auth.uid()
        and b.blocked_id in (c.owner_id, c.interested_id)
    )
  order by c.last_message_at desc nulls last;
$$;

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
  where (c.owner_id = auth.uid() or c.interested_id = auth.uid())
    and not exists (
      select 1 from public.blocks b
      where b.blocker_id = auth.uid()
        and b.blocked_id in (c.owner_id, c.interested_id)
    );
$$;
