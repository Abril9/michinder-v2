<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Michinder

## Contexto

MVP de avisos de mascotas perdidas y encontradas en Santa Fe, Argentina. El producto se llama **Michinder** y el logo es una gatita negra con pañuelo rojo en homenaje a Chacha.

## Reglas del proyecto

- Hablar y codificar en español.
- No hacer commits salvo pedido explícito.
- Commits cortos y granulares cuando se pidan.
- Comentarios solo cuando aporten contexto; el código debe ser autoexplicativo.
- No editar `src/lib/database.types.ts` a mano: usar `npm run db:types`.
- Mantener RLS y validación del lado servidor; nunca confiar solo en el cliente.
- La `SUPABASE_SERVICE_ROLE_KEY` es solo para scripts locales y servidor. No exponerla.

## Stack y comandos

- Next.js 16 + React 19 + TypeScript + Tailwind 4.
- Supabase local con PostGIS, Auth y Storage.
- `npm run local` (Supabase + seed + Next), `npm run local:reset` (reinicia datos), `npm run dev`, `npm run build`, `npm run lint`, `npm run seed`, `npm run db:reset`.

Node 22 es obligatorio. Si el sistema usa Node 18:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22
```

## Arquitectura

- `src/app` rutas públicas, de usuario y de acceso (`/ingresar`, `/registrarme`).
- `src/app/api` endpoints de explorar, swipe, chats, reportes, bloqueos y no leídos.
- `src/lib/acciones` Server Actions de auth, avisos y perfil.
- `src/lib/data` consultas tipadas a Supabase.
- `src/lib/supabase` clientes server/browser/admin.
- `src/components` UI y componentes de dominio.
- `supabase/migrations` esquema, RLS, triggers, vistas y RPCs.
- `scripts/seed.mjs` datos demo idempotentes.

## Decisiones clave

- Backend real desde el día 1; sin mocks.
- Login email/contraseña.
- Navegar es público; publicar, swipear y chatear requiere sesión.
- El detalle muestra el mapa exacto solo a usuarios logueados.
- WhatsApp visible únicamente si el autor lo autoriza y el visitante tiene sesión.
- Chat por polling cada 3 s, no Realtime.
- Búsqueda por intersección de radios (`nearby_posts`), no solo distancia al centro.
- Fotos optimizadas en cliente y servidor; bucket público `post-photos`.
- En esta versión, las fotos de un aviso no se editan: se elimina y se crea otro.

## Documentación

- `docs/ideas.md`
- `docs/plan.md`
- `docs/arquitectura.md`
- `docs/decisiones.md`
- `docs/pruebas.md`
