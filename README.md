# Michinder

App web para publicar y encontrar mascotas perdidas o encontradas. Nació como homenaje a Chacha, una gatita negra con pañuelo rojo.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase: Postgres + PostGIS, Auth, Storage
- Leaflet + OpenStreetMap
- Motion, Zod, Sharp, Sonner

## Requisitos

- Node 22
- Docker (para Supabase local)
- Supabase CLI (`npx supabase`)

## Inicio rápido

```bash
nvm use 22
npm install
npx supabase start
cp .env.example .env.local   # completar con las credenciales de `npx supabase status`
npm run local:reset          # reinicia la base, carga datos demo y levanta la app
```

Abrí http://localhost:3000.

Para los siguientes arranques, sin borrar datos:

```bash
npm run local
```

`npm run local` inicia Supabase, carga los datos demo si faltan y levanta Next. `npm run local:reset` además reinicia la base y aplica las migraciones.

### Usuarios demo

| Email | Contraseña | Rol |
| --- | --- | --- |
| `chacha@demo.com` | `demo1234` | Autora de Chacha |
| `vecino@demo.com` | `demo1234` | Vecino que encuentra mascotas |
| `sofia@demo.com` | `demo1234` | Otros avisos |

Los datos demo están en Santa Fe, Argentina.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run local` | Supabase + seed + Next en un solo comando |
| `npm run local:reset` | Igual, pero reinicia la base y aplica migraciones |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |
| `npm run seed` | Carga usuarios, avisos y chats demo |
| `npm run db:reset` | Reinicia Supabase local y aplica migraciones |
| `npm run db:types` | Regenera `src/lib/database.types.ts` |

## Estructura

```text
src/app/          rutas, layouts y API
src/components/   UI reutilizable y componentes de dominio
src/lib/          auth, datos, validaciones, formato, geo y tipos
supabase/         migración inicial
scripts/          seed demo
docs/             ideas, plan, arquitectura y pruebas
public/seed/      fotos demo
```

## Funcionalidad

- Home con accesos “Perdí una mascota” y “Encontré una mascota”.
- Publicación con especie, sexo, edad, tamaño, fotos, fecha, zona exacta y radio.
- Explorar con filtros, GPS, swipe (derecha abre chat, izquierda descarta) y grilla.
- Búsqueda por intersección de radios del aviso y del usuario.
- Detalle con galería, mapa, compartir, reportar y WhatsApp autorizado.
- Chats con polling, contador de no leídos y límites anti-spam.
- Perfil editable y gestión de avisos (editar, reencontrado, eliminar).
- Moderación básica: reportar y bloquear.

## Deploy

1. Crear proyecto en Supabase Cloud y aplicar `supabase/migrations/20261020000000_init.sql`.
2. Configurar en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Deploy con Vercel.

La `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor y nunca debe exponerse con prefijo `NEXT_PUBLIC_`.
