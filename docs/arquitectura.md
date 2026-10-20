# Arquitectura

## Capas

- **UI**: App Router, Server Components para datos y Client Components para interacción.
- **API**: route handlers para explorar, swipe, mensajes, reportes, bloqueos y no leídos.
- **Datos**: consultas tipadas en `src/lib/data` con Supabase server client.
- **Base**: Postgres + PostGIS, RLS, vistas públicas, triggers y RPCs.
- **Storage**: bucket público `post-photos`, fotos optimizadas en WebP.

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Home, accesos y avisos recientes |
| `/explorar` | Público | Filtros, swipe y grilla |
| `/publicacion/[id]` | Público | Detalle; mapa exacto solo con sesión |
| `/publicar` | Sesión | Crear aviso |
| `/publicacion/[id]/editar` | Autor | Editar datos y ubicación |
| `/mis-publicaciones` | Sesión | Gestión de avisos |
| `/chats`, `/chats/[id]` | Sesión | Conversaciones y mensajes |
| `/perfil` | Sesión | Datos y WhatsApp |
| `/ingresar`, `/registrarme` | Público | Auth |
| `/legal/privacidad`, `/legal/terminos` | Público | Legales |

## Modelo de datos

- `profiles`: nombre, ciudad, WhatsApp y visibilidad.
- `posts`: estado, especie, datos de la mascota, descripción, ubicación `geography(Point,4326)`, radio, fecha y resolución.
- `post_photos`: hasta 3 fotos por aviso.
- `interactions`: like/pass único por usuario y aviso.
- `conversations`: dueño del aviso e interesado, único por aviso/interesado.
- `messages`: cuerpo de 1 a 1000 caracteres.
- `conversation_reads`: último lectura por usuario.
- `blocks`: bloqueos entre usuarios.
- `reports`: reportes de aviso o usuario.

## Búsqueda

`nearby_posts` devuelve avisos activos y aplica:

- Filtros de estado, especie, sexo, edad y tamaño.
- Exclusión de avisos propios, ya swipeados y de usuarios bloqueados.
- Intersección de radios: `distancia <= radio_usuario + search_radius_km`.
- Distancia calculada con `ST_Distance` sobre geografía.

## Chat

- `swipe_post` crea la conversación al hacer like y aplica límites anti-spam.
- `send_message` valida pertenencia, bloqueo, límites y duplicados.
- `mark_conversation_read` actualiza la lectura.
- El cliente hace polling cada 3 s y deduplica por `id`.
- No se usa Realtime en v1.

## Seguridad

- RLS activo en todas las tablas de dominio.
- `posts` no es legible por `anon`; solo por usuarios autenticados.
- Vistas `profiles_public` y `posts_public` devuelven `null` para ubicación exacta y WhatsApp sin sesión.
- `nearby_posts` calcula distancias para invitados sin exponer coordenadas.
- El servidor valida con Zod; el cliente no es fuente de verdad.
- La ubicación exacta se renderiza solo para usuarios con sesión.
- Bloquear oculta la conversación de la lista y evita nuevos mensajes.
- Service role solo en seed y procesos administrativos.
- Headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- Fotos: límite de 3, 8 MB por archivo, compresión cliente y Sharp en servidor.

## Límites anti-spam

- 10 conversaciones nuevas por día.
- 20 mensajes por minuto.
- 200 mensajes por día.
- Mensaje duplicado bloqueado por 30 segundos.

## Decisiones de simplicidad

- Polling en lugar de WebSockets.
- Sin panel admin en v1; reportes en tabla para revisión manual.
- Sin edición de fotos en avisos existentes.
- Datos demo idempotentes con IDs fijos.
- Un solo bucket público para fotos.
