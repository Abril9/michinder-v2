# Base de datos

Postgres + PostGIS en Supabase. Todo el esquema vive en `supabase/migrations/` y se aplica con `supabase db reset` (local) o `supabase db push` (Cloud).

## Migraciones

| Archivo | Contenido |
| --- | --- |
| `20261020000000_init.sql` | Extensiones, enums, tablas, índices, triggers, vistas, RPCs, RLS y bucket |
| `20261020000100_hide_private_data_from_guests.sql` | Oculta ubicación y WhatsApp a invitados; revoca lectura directa de `posts` a `anon` |
| `20261020000200_hide_blocked_conversations.sql` | Excluye conversaciones con usuarios bloqueados de la lista y del contador |

Nunca edites una migración ya aplicada: agregá una nueva con timestamp mayor.

## Tablas

```text
auth.users ──1:1── profiles
profiles ──1:N── posts ──1:N── post_photos
posts ──1:N── interactions ──N:1── profiles
posts ──1:N── conversations ──1:N── messages
conversations ──1:N── conversation_reads
profiles ──N:M── blocks (blocker_id / blocked_id)
posts / profiles ──N:1── reports
```

### `profiles`

Extiende `auth.users` (mismo `id`). Se crea automáticamente con el trigger `handle_new_user`.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | uuid | PK, FK a `auth.users` |
| `name` | text | 2–60 caracteres |
| `city` | text | hasta 80 |
| `whatsapp` | text | formato `^[0-9+() -]{6,25}$` |
| `show_whatsapp` | boolean | opt-in, por defecto `false` |
| `created_at`, `updated_at` | timestamptz | `updated_at` por trigger |

### `posts`

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | uuid | PK |
| `author_id` | uuid | FK a `profiles` |
| `status` | `pet_status` | `lost` \| `found` |
| `species` | `pet_species` | `cat` \| `dog` \| `other` |
| `pet_name` | text | opcional |
| `sex` | `pet_sex` | `male` \| `female` \| `unknown` |
| `age` | `pet_age` | `baby` \| `young` \| `adult` \| `senior` |
| `size` | `pet_size` | `small` \| `medium` \| `large` |
| `description` | text | 10–1200 caracteres |
| `location_label` | text | 3–120 caracteres |
| `location` | `geography(Point,4326)` | índice GiST |
| `search_radius_km` | integer | 1–100 |
| `event_date` | date | opcional |
| `resolved_at` | timestamptz | `null` = activo |
| `created_at`, `updated_at` | timestamptz | |

### `post_photos`

`id`, `post_id` (FK con `on delete cascade`), `url`, `position` (0–2). Máximo 3 por aviso.

### `interactions`

`post_id`, `user_id`, `action` (`like` \| `pass`). Único por `(post_id, user_id)`.

### `conversations`

`post_id`, `owner_id` (autor del aviso), `interested_id`, `last_message_at`. Única por `(post_id, interested_id)` y con `owner_id <> interested_id`.

### `messages`

`conversation_id`, `sender_id`, `body` (1–1000), `created_at`.

### `conversation_reads`

`(conversation_id, user_id)` PK y `last_read_at`. Base para el contador de no leídos.

### `blocks`

`(blocker_id, blocked_id)` PK. Bloqueo unilateral que corta swipe, chat y visibilidad.

### `reports`

`reporter_id`, `post_id` o `reported_user_id` (al menos uno), `reason` (3–80), `details` (≤600), `resolved_at`.

## Vistas públicas

### `profiles_public`

Expone `id`, `name`, `city`, `show_whatsapp`, `whatsapp`, `created_at`. Devuelve `whatsapp = null` si no hay sesión o si el autor no lo autorizó.

### `posts_public`

Expone los datos del aviso y del autor. Para invitados devuelve `lat = null` y `lng = null`; con sesión devuelve las coordenadas exactas. Es la fuente de `getPostById`, `getRecentPosts` y `getMyPosts`.

## RPCs

Todas son `security invoker` salvo `handle_new_user`. Reciben el usuario de `auth.uid()`.

### `nearby_posts(...)`

Búsqueda principal. Parámetros: `p_status`, `p_species`, `p_sex`, `p_age`, `p_size`, `p_lat`, `p_lng`, `p_radius_km`, `p_viewer_id`.

- Filtra avisos activos (`resolved_at is null`).
- Excluye avisos propios, ya swipeados y de usuarios bloqueados.
- Aplica intersección de radios y calcula `distance_km`.
- Devuelve hasta 300 filas.
- Para invitados (`p_viewer_id = null`) no expone coordenadas exactas.

### `create_post(...)` / `update_post(...)`

Crean y editan avisos. `update_post` solo afecta filas con `author_id = auth.uid()` y lanza `NOT_FOUND` si no coincide. No tocan fotos ni estado.

### `swipe_post(p_post_id, p_action)`

- Rechaza `OWN_POST`, `POST_RESOLVED`, `POST_NOT_FOUND` y `BLOCKED`.
- Upsert en `interactions`.
- En `like`, reutiliza la conversación o la crea.
- Límite: 10 conversaciones nuevas por día (`CHAT_LIMIT`).

### `send_message(p_conversation_id, p_body)`

- Valida pertenencia y bloqueo.
- Límites: 20/minuto (`MESSAGE_RATE_LIMIT`), 200/día (`MESSAGE_DAILY_LIMIT`), duplicado en 30 s (`DUPLICATE_MESSAGE`).
- Actualiza `conversations.last_message_at`.

### `mark_conversation_read(p_conversation_id)`

Upsert en `conversation_reads` con `now()`.

### `my_conversations()`

Lista de chats del usuario con último mensaje, datos públicos del otro y `unread_count`. Excluye conversaciones bloqueadas.

### `unread_count()`

Suma de mensajes no leídos de todas las conversaciones del usuario. Excluye bloqueadas.

## RLS

RLS activo en todas las tablas de dominio.

| Tabla | Lectura | Escritura |
| --- | --- | --- |
| `profiles` | solo el propio (`id = auth.uid()`) | solo el propio |
| `posts` | `authenticated` (invitados vía vistas/RPC) | autor |
| `post_photos` | pública | autor del aviso |
| `interactions` | propias | propias |
| `conversations` | participantes | interesado al crear; participantes al actualizar |
| `messages` | participantes | remitente participante |
| `conversation_reads` | propias | propias |
| `blocks` | propios | propios |
| `reports` | propios | propios |

Además, `revoke select on public.posts from anon`: un invitado no puede leer la tabla directo, solo a través de `posts_public` y `nearby_posts`.

## Triggers

- `on_auth_user_created`: crea el perfil al registrarse.
- `profiles_touch_updated_at` y `posts_touch_updated_at`: mantienen `updated_at`.

## Storage

Bucket público `post-photos`:

- Límite de 5 MB por archivo y MIME `image/webp`, `image/jpeg`, `image/png`.
- Ruta `${userId}/${uuid}.webp`; la política de escritura exige que la primera carpeta sea el `uid`.
- Lectura pública; escritura y borrado solo del dueño.
- `storagePathFromPublicUrl` (`src/lib/storage.ts`) convierte una URL pública en el path del bucket para poder borrar.

## Cómo cambiar el esquema

1. Creá `supabase/migrations/<timestamp>_descripcion.sql`.
2. Actualizá las consultas tipadas si cambian tablas o RPCs.
3. Regenerá tipos: `npm run db:types`.
4. Actualizá `src/lib/types.ts` si cambia el contrato de la app.
5. Actualizá este documento y `docs/api.md` si cambia un contrato.
