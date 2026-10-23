# API

Michinder usa dos mecanismos de escritura:

- **Server Actions** para formularios (auth, publicar, perfil, gestión de avisos).
- **Route Handlers** (`/api/*`) para llamadas desde Client Components (explorar, swipe, chat, moderación).

## Convenciones

- Toda entrada se valida en el servidor con **Zod** (`src/lib/validation.ts`).
- Las rutas que modifican datos exigen sesión con `getCurrentUser()`.
- Los errores de negocio viven en las RPCs de Postgres y se traducen a HTTP en la ruta.
- Las respuestas de lectura usan `Cache-Control: no-store`.
- No se expone `SUPABASE_SERVICE_ROLE_KEY` al cliente.

## Endpoints HTTP

### `GET /api/posts`

Busca avisos cercanos. Público.

| Query | Valores | Default |
| --- | --- | --- |
| `estado` | `perdido` \| `encontrado` | `perdido` |
| `especie` | `gato` \| `perro` \| `otro` | todos |
| `sexo` | `macho` \| `hembra` \| `no-se` | todos |
| `edad` | `cachorro` \| `joven` \| `adulto` \| `mayor` | todos |
| `tamano` | `chico` \| `mediano` \| `grande` | todos |
| `lat`, `lng` | coordenadas | Santa Fe |
| `radio` | 1–50 km | 10 |

```json
{ "posts": [/* Post[] */], "count": 12 }
```

- Invitado: `lat`, `lng` y `whatsapp` vienen en `null`.
- Con sesión: incluye distancia y datos autorizados.
- Error: `500 { "error": "No pudimos cargar los avisos. Intentá de nuevo." }`.

### `POST /api/swipe`

Registra un like o pass. Requiere sesión.

```json
{ "postId": "uuid", "action": "like" }
```

```json
{ "ok": true, "conversationId": "uuid-o-null" }
```

| Error RPC | HTTP | Mensaje |
| --- | --- | --- |
| `CHAT_LIMIT` | 429 | Límite de 10 chats nuevos por día |
| `MESSAGE_RATE_LIMIT` | 429 | Escribís demasiado rápido |
| `BLOCKED` | 403 | No podés interactuar con este usuario |
| `OWN_POST` | 400 | No podés swipear tu propia publicación |
| `POST_RESOLVED` | 409 | La publicación ya se resolvió |
| `POST_NOT_FOUND` | 404 | La publicación no existe |

### `GET /api/conversations/[id]/messages`

Requiere sesión y pertenencia a la conversación.

- Query opcional `after=<ISO>` para traer solo mensajes nuevos (polling).
- Devuelve hasta 100 mensajes ordenados por fecha.
- Marca la conversación como leída con `mark_conversation_read`.

```json
{ "messages": [/* ChatMessage[] */] }
```

### `POST /api/conversations/[id]/messages`

```json
{ "body": "Hola, ¿lo encontraste?" }
```

```json
{ "message": { "id": "uuid", "conversationId": "uuid", "senderId": "uuid", "body": "...", "createdAt": "ISO" } }
```

| Error RPC | HTTP | Mensaje |
| --- | --- | --- |
| `MESSAGE_RATE_LIMIT` | 429 | 20 mensajes por minuto |
| `MESSAGE_DAILY_LIMIT` | 429 | 200 mensajes por día |
| `DUPLICATE_MESSAGE` | 429 | Mismo texto en 30 segundos |
| `BLOCKED` | 403 | No podés escribir en esta conversación |
| `NOT_FOUND` | 404 | Conversación no encontrada |
| `INVALID_BODY` | 400 | Mensaje vacío o de más de 1000 caracteres |

### `POST /api/reports`

Requiere sesión. Apunta a un aviso o a un usuario (al menos uno).

```json
{ "postId": "uuid?", "reportedUserId": "uuid?", "reason": "Spam", "details": "opcional" }
```

### `POST /api/blocks`

Requiere sesión. Bloquea a otro usuario (idempotente).

```json
{ "userId": "uuid" }
```

### `GET /api/unread`

Devuelve el total de mensajes no leídos. Sin sesión responde `{ "count": 0 }`.

## Server Actions

### Autenticación — `src/lib/acciones/autenticacion.ts`

| Action | Entrada | Resultado |
| --- | --- | --- |
| `registerAction` | `name`, `email`, `password`, `confirmPassword` | Redirige al inicio o pide confirmar email |
| `loginAction` | `email`, `password`, `next?` | Redirige a `next` seguro |
| `logoutAction` | — | Cierra sesión y redirige a `/` |

Devuelven `AuthState`: `{ error?, message?, fieldErrors? }`.

### Avisos — `src/lib/acciones/avisos.ts`

| Action | Entrada | Resultado |
| --- | --- | --- |
| `createPostAction` | campos de `postSchema` + `photos` (1–3) | Redirige al detalle |
| `updatePostAction` | campos de `postSchema` + `postId` | Redirige al detalle |

Devuelven `FormState`. Las fotos se comprimen en cliente y se reprocesan con Sharp en servidor.

### Gestión — `src/lib/acciones/gestion-avisos.ts`

| Action | Entrada | Resultado |
| --- | --- | --- |
| `resolvePostAction` | `postId` | Marca `resolved_at` |
| `reopenPostAction` | `postId` | Limpia `resolved_at` |
| `deletePostAction` | `postId` | Borra aviso, fotos de la tabla y archivos del bucket |

Todas filtran por `author_id = user.id`: si el aviso no es tuyo, no se modifica.

### Perfil — `src/lib/acciones/perfil.ts`

| Action | Entrada | Resultado |
| --- | --- | --- |
| `updateProfileAction` | `name`, `city?`, `whatsapp?`, `showWhatsapp` | Actualiza `profiles` |

## Validaciones

Todas en `src/lib/validation.ts`:

- `registerSchema`, `loginSchema`, `profileSchema`
- `postSchema` (incluye radios 1–100 km y fecha `YYYY-MM-DD`)
- `messageSchema` (1–1000 caracteres)
- `swipeSchema`, `reportSchema`

Los límites visibles para el usuario están en `src/lib/constants.ts` (`MAX_PHOTOS`, `MAX_PHOTO_MB`, `CHAT_LIMITS`).
