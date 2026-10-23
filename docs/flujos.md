# Flujos

Recorrido de cada funcionalidad, con los archivos que intervienen. Sirve para saber dónde tocar el código sin leer todo el proyecto.

## Ciclo de una request

```text
Navegador
  → src/proxy.ts            refresca la sesión de Supabase en cada request
  → src/app/**/page.tsx     Server Component (o Client Component)
  → src/lib/auth.ts         getCurrentUser / requireUser
  → src/lib/data/**         consultas tipadas a Supabase
  → Supabase (Postgres + RLS + RPCs)
```

- Los **Server Components** leen datos y arman el HTML.
- Los **Client Components** manejan interacción y llaman a `/api/*` o a Server Actions.
- El servidor nunca confía en el cliente: todo input de escritura pasa por Zod y por RLS/RPCs.

## Sesión

1. `src/proxy.ts` crea un cliente de Supabase con las cookies del request y llama a `auth.getUser()` para refrescar el token.
2. `getCurrentUser()` (`src/lib/auth.ts`) devuelve `{ id, email, profile }` o `null`. Está memoizado con `cache()` por request.
3. `requireUser(nextPath)` redirige a `/ingresar?next=...` si no hay sesión.
4. `safeNextPath()` evita redirecciones abiertas: solo acepta rutas internas que empiezan con `/` y no con `//`.

## Registro y login

**Registro** (`src/app/registrarme/page.tsx` → `src/components/auth-form.tsx` → `src/lib/acciones/autenticacion.ts`):

1. El formulario usa `useActionState` con `registerAction`.
2. `registerSchema` valida nombre, email, contraseña y confirmación.
3. `checkAuthRateLimit` limita a 5 intentos por email cada 15 minutos (en memoria del proceso).
4. `supabase.auth.signUp` crea el usuario. El trigger `handle_new_user` crea su fila en `profiles`.
5. Si Supabase exige confirmar email, devuelve un mensaje informativo; si hay sesión, redirige al inicio.

**Login** (`loginAction`): valida con `loginSchema`, limita a 8 intentos, usa `signInWithPassword` y redirige a `safeNextPath(next)`.

**Logout** (`logoutAction`): `signOut`, revalida el layout y redirige a `/`.

> En producción, si "Confirm email" está activo, cada registro envía un correo y consume el límite de emails del plan. Ver [despliegue.md](despliegue.md).

## Publicar un aviso

`src/app/publicar/page.tsx` → `src/components/post-form.tsx` → `src/lib/acciones/avisos.ts`

1. La página exige sesión con `requireUser("/publicar")`.
2. El formulario comprime fotos en el navegador con `compressImage` (`src/lib/image.ts`, canvas → JPEG 1600 px).
3. `createPostAction` valida con `postSchema` y los límites de fotos (`MAX_PHOTOS = 3`, `MAX_PHOTO_MB = 8`).
4. Cada foto se reprocesa en el servidor con Sharp (WebP, 1600 px, calidad 82) y se sube a `post-photos`.
5. `rpc("create_post")` inserta el aviso y devuelve el `id`.
6. Se insertan las URLs en `post_photos`. Si algo falla, se limpian fotos y aviso para no dejar basura.
7. Redirige a `/publicacion/[id]?publicado=1`.

## Editar, resolver y eliminar

- **Editar**: `src/app/publicacion/[id]/editar/page.tsx` → `updatePostAction`. Solo cambia datos y ubicación; las fotos quedan fijas (ADR-08).
- **Resolver / reabrir**: `src/lib/acciones/gestion-avisos.ts` setea o limpia `resolved_at` filtrando por `author_id = user.id`.
- **Eliminar**: borra el aviso, recupera las URLs de `post_photos` y elimina los archivos del bucket con `storagePathFromPublicUrl`.

## Explorar

`src/app/explorar/page.tsx` → `src/components/explore-client.tsx`

1. La página arma los filtros iniciales desde la URL y renderiza el componente cliente.
2. El cliente pide `GET /api/posts` con `estado`, `especie`, `sexo`, `edad`, `tamano`, `lat`, `lng` y `radio`.
3. La ruta llama a `getNearbyPosts` → RPC `nearby_posts`.
4. La RPC devuelve avisos activos aplicando:
   - filtros de estado, especie, sexo, edad y tamaño;
   - exclusión de avisos propios, ya swipeados y de usuarios bloqueados;
   - intersección de radios: `distancia <= radio_usuario + search_radius_km`.
5. La ubicación del usuario sale del GPS o cae a `DEFAULT_LOCATION` (Santa Fe). Se guarda en `localStorage`.
6. El usuario puede alternar entre **swipe** y **grilla**.

### Swipe

`handleAction` en `explore-client.tsx`:

1. Si no hay sesión, abre un toast con CTA a `/ingresar?next=/explorar`.
2. `POST /api/swipe` con `{ postId, action }`.
3. La ruta valida con `swipeSchema` y llama a `rpc("swipe_post")`.
4. `like` crea (o reutiliza) la conversación y devuelve `conversationId`; `pass` devuelve `null`.
5. La UI ofrece abrir el chat y quita la tarjeta del mazo.

## Detalle de un aviso

`src/app/publicacion/[id]/page.tsx`

1. `getPostById` lee de `posts_public`. Para invitados, `lat`, `lng` y `whatsapp` llegan en `null`.
2. `getCurrentUser` define qué se muestra:
   - **Invitado**: mapa bloqueado con CTA, sin WhatsApp.
   - **Con sesión**: mapa exacto y WhatsApp solo si el autor lo autorizó.
   - **Autor**: además ve acciones de edición, resolución y borrado.
3. El mapa usa Leaflet en un Client Component (`map-inner.tsx`) cargado dinámicamente.

## Chat

`src/app/chats/page.tsx` (lista) y `src/app/chats/[id]/page.tsx` (sala) → `src/components/chat-room.tsx`

1. La lista usa `rpc("my_conversations")`: último mensaje, no leídos y datos públicos del otro usuario.
2. La sala exige sesión, carga el contexto con `getConversationContext` y marca leído.
3. `chat-room.tsx` hace polling cada **3 segundos** a `GET /api/conversations/[id]/messages?after=<último>`.
4. Los mensajes se deduplican por `id` antes de renderizar.
5. Enviar un mensaje hace `POST` a la misma ruta → `rpc("send_message")`, que aplica los límites anti-spam.
6. Bloquear a la otra persona oculta la conversación y corta los envíos (RPC + RLS).

## Perfil

`src/app/perfil/page.tsx` → `src/components/profile-form.tsx` → `src/lib/acciones/perfil.ts`

- `updateProfileAction` valida con `profileSchema`.
- Si `showWhatsapp` está activo, exige un número.
- Actualiza `profiles` y revalida el layout para refrescar el header.

## Moderación

- **Reportar**: `src/components/report-button.tsx` → `POST /api/reports` → `createReport` inserta en `reports`. El reporte apunta a un aviso o a un usuario.
- **Bloquear**: `src/components/block-button.tsx` → `POST /api/blocks` → upsert en `blocks`. A partir de ahí:
  - `nearby_posts` excluye los avisos de esa persona;
  - `my_conversations` oculta la conversación;
  - `send_message` y `swipe_post` rechazan la interacción.

## Puntos de extensión

| Si querés… | Empezá por |
| --- | --- |
| Agregar un filtro | `PostFilters` en `src/lib/types.ts`, `nearby_posts` y `explore-client.tsx` |
| Agregar un campo al aviso | migración + `postSchema` + `create_post`/`update_post` + formulario |
| Agregar una ruta | `src/app/...` y, si escribe datos, Server Action o `/api` con Zod |
| Agregar una notificación | `send_message` y `src/lib/data/conversations.ts` |
| Cambiar límites anti-spam | `CHAT_LIMITS` en `src/lib/constants.ts` y la RPC correspondiente |
