# Arquitectura

## Capas

```text
UI        App Router: Server Components para datos, Client Components para interacción
API       Route Handlers (/api/*) y Server Actions
Datos     src/lib/data: consultas tipadas a Supabase
Base      Postgres + PostGIS, RLS, vistas, triggers y RPCs
Storage   Bucket público post-photos
```

Cada capa depende solo de la siguiente. La UI no conoce SQL; la base no conoce React.

## Ciclo de una request

1. `src/proxy.ts` refresca la sesión de Supabase usando las cookies.
2. El layout correspondiente resuelve el usuario con `getCurrentUser()` (memoizado por request).
3. La página pide datos a `src/lib/data/*`.
4. La consulta llega a Supabase con el JWT del usuario; RLS decide qué filas puede ver.
5. Si hay escritura, pasa por una Server Action o una ruta `/api` con validación Zod.

## Render

- **Server Components**: home, explorar (shell), detalle, chats, perfil, mis publicaciones.
- **Client Components**: formularios, swipe, mapa, chat, filtros y botones con estado.
- **Marcos de página**: `LayoutPublico` (header, footer y navegación móvil) y `LayoutAcceso` (login y registro). Reemplazan a los route groups y se envuelven en cada página, así las URLs no dependen de nombres entre paréntesis.
- Los datos sensibles (coordenadas exactas, WhatsApp) se resuelven en el servidor: el cliente recibe `null` cuando no corresponde.
- El mapa de Leaflet se carga con `dynamic import` para no pesar en el bundle inicial.

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
- `conversation_reads`: última lectura por usuario.
- `blocks`: bloqueos entre usuarios.
- `reports`: reportes de aviso o usuario.

Detalle de columnas, RLS y RPCs en [base-de-datos.md](base-de-datos.md).

## Búsqueda

`nearby_posts` devuelve avisos activos y aplica:

- Filtros de estado, especie, sexo, edad y tamaño.
- Exclusión de avisos propios, ya swipeados y de usuarios bloqueados.
- Intersección de radios: `distancia <= radio_usuario + search_radius_km`.
- Distancia calculada con `ST_Distance` sobre geografía.
- Límite de 300 resultados.

La intersección de radios es una decisión de producto: una mascota perdida puede haberse movido, así que no alcanza con medir la distancia al centro del aviso.

## Chat

- `swipe_post` crea la conversación al hacer like y aplica límites anti-spam.
- `send_message` valida pertenencia, bloqueo, límites y duplicados.
- `mark_conversation_read` actualiza la lectura.
- El cliente hace polling cada 3 s, pide solo mensajes posteriores a `after` y deduplica por `id`.
- No se usa Realtime en v1.

## Seguridad

- RLS activo en todas las tablas de dominio.
- `posts` no es legible por `anon`; solo por usuarios autenticados o a través de `posts_public` / `nearby_posts`.
- `profiles_public` y `posts_public` devuelven `null` para ubicación exacta y WhatsApp sin sesión.
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
- Login: 8 intentos por email cada 15 minutos.
- Registro: 5 intentos por email cada 15 minutos.

Los límites de chat viven en la base; los de login/registro en memoria del proceso (`src/lib/rate-limit.ts`). En serverless, la memoria no se comparte entre instancias: si el tráfico crece, migrar a Redis/Upstash.

## Decisiones de simplicidad

- Polling en lugar de WebSockets.
- Sin panel admin en v1; reportes en tabla para revisión manual.
- Sin edición de fotos en avisos existentes.
- Datos demo idempotentes con IDs fijos.
- Un solo bucket público para fotos.

El resto de las decisiones está en [decisiones.md](decisiones.md).

## Documentación relacionada

- Flujos paso a paso: [flujos.md](flujos.md)
- Contratos de API: [api.md](api.md)
- Esquema y RLS: [base-de-datos.md](base-de-datos.md)
- Producción: [despliegue.md](despliegue.md)
- Convenciones: [convenciones.md](convenciones.md)
