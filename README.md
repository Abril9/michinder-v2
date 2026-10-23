# Michinder

App web para publicar y encontrar mascotas perdidas o encontradas. El logo es una gatita negra con pañuelo rojo.

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
| `chacha@demo.com` | `demo1234` | Cuenta demo principal |
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
src/app/          páginas, rutas y API
src/components/   UI, componentes de dominio y marcos de página
src/lib/          auth, datos, validaciones, formato, geo y tipos
src/lib/acciones/ Server Actions de auth, avisos y perfil
supabase/         migraciones y configuración local
scripts/          seed demo
docs/             documentación técnica (ver docs/README.md)
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

1. Crear el proyecto en Supabase Cloud y linkearlo:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

2. Configurar en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL` (URL del proyecto Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable o anon del mismo proyecto)
   - `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)
   - `NEXT_PUBLIC_APP_URL` (URL del sitio en Netlify)
3. Deploy desde Netlify. Si cambiás variables `NEXT_PUBLIC_*`, hace falta **Clear cache and deploy site**: se embeben en el build.

La `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor y nunca debe exponerse con prefijo `NEXT_PUBLIC_`.

Guía completa, seed en Cloud y troubleshooting: [docs/despliegue.md](docs/despliegue.md).

## Documentación

| Documento | Contenido |
| --- | --- |
| [docs/README.md](docs/README.md) | Índice y orden de lectura |
| [docs/arquitectura.md](docs/arquitectura.md) | Capas, rutas y render |
| [docs/flujos.md](docs/flujos.md) | Flujos end-to-end y dónde tocar cada cosa |
| [docs/api.md](docs/api.md) | Endpoints y Server Actions |
| [docs/base-de-datos.md](docs/base-de-datos.md) | Tablas, RLS, RPCs y Storage |
| [docs/convenciones.md](docs/convenciones.md) | Estilo, capas y cómo agregar features |
| [docs/despliegue.md](docs/despliegue.md) | Supabase Cloud + Netlify |
| [docs/decisiones.md](docs/decisiones.md) | ADRs |
| [docs/pruebas.md](docs/pruebas.md) | Pruebas y resultados |
| [docs/plan.md](docs/plan.md) | Roadmap |
