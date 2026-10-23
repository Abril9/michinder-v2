# Convenciones

Guía para mantener el código consistente y fácil de escalar.

## Principios

- **Simplicidad primero**: funciones chicas, una responsabilidad por archivo.
- **Sin duplicación**: si una regla se repite, va a `src/lib`.
- **El servidor es la fuente de verdad**: el cliente valida para UX, no para seguridad.
- **Nombres en español** para dominio y UI; inglés para tipos y APIs externas (`Post`, `like`, `status`).
- **Comentarios solo cuando explican el porqué**, no el qué.

## Estructura

```text
src/app               páginas públicas, de usuario y de acceso
src/app/api           endpoints HTTP
src/components        UI, componentes de dominio y marcos de página
src/components/ui     primitivos (Button, Badge)
src/lib               auth, datos, validación, formato, geo, storage
src/lib/acciones      Server Actions (auth, avisos, perfil)
src/lib/data          consultas tipadas a Supabase
src/lib/supabase      clientes browser / server / admin
supabase/migrations   esquema versionado
scripts               seed y automatizaciones
docs                  documentación
```

## Reglas de capas

- Las páginas **no** llaman a Supabase directo: usan `src/lib/data`.
- Los componentes **no** saben de SQL ni de RLS.
- Las Server Actions y rutas `/api` son la única puerta de escritura.
- `import "server-only"` en módulos que nunca deben llegar al cliente.

## Validación

1. Definí el schema en `src/lib/validation.ts` con Zod.
2. Reutilizá el tipo inferido (`z.infer`) en lugar de duplicar interfaces.
3. Validá **siempre** en el servidor, incluso si el formulario ya validó.
4. Los mensajes de error son para la persona usuaria, en español y sin jerga.

## Base de datos

- Una migración por cambio, con timestamp mayor al anterior.
- RLS activo en toda tabla nueva.
- Para operaciones con reglas de negocio, creá una RPC y no confíes en el cliente.
- Los GRANT son explícitos: una policy sin GRANT no habilita acceso.
- Regenerá tipos con `npm run db:types` después de tocar el esquema.

## Cómo agregar una funcionalidad

Ejemplo: agregar un filtro por color.

1. **Tipo**: agregá el campo en `src/lib/types.ts`.
2. **Validación**: actualizá el schema en `src/lib/validation.ts`.
3. **Base**: nueva migración con la columna y, si aplica, el parámetro en la RPC.
4. **Datos**: adaptá `src/lib/data/*`.
5. **API/Action**: actualizá el endpoint o la Server Action.
6. **UI**: formulario o filtro en `src/components`.
7. **Docs**: `docs/flujos.md`, `docs/api.md` y `docs/base-de-datos.md`.
8. **Pruebas**: agregá el caso en `docs/pruebas.md`.

## Manejo de errores

- Errores de negocio: la RPC lanza un código (`CHAT_LIMIT`, `BLOCKED`, `NOT_FOUND`).
- La ruta traduce el código a HTTP y a un mensaje claro.
- Errores inesperados: `console.error` en servidor y mensaje genérico al cliente.
- Nunca devolver detalles internos de Postgres al navegador.

## Fotos

- Compresión en cliente (`compressImage`) y reprocesamiento en servidor (Sharp).
- WebP, lado máximo 1600 px, calidad 82.
- Ruta `${userId}/${uuid}.webp`.
- Si falla la publicación, se limpian los archivos subidos.

## UI

- Tailwind 4 con utilidades existentes (`text-ink`, `text-muted`, `text-coral`, `bg-cream`).
- Componentes de formulario con `label` visible y mensajes de error debajo del campo.
- Textos en español rioplatense, tono cercano.
- Mobile first: la navegación inferior es la principal en pantallas chicas.

## Git

- Commits cortos y granulares, en español, con prefijo convencional:
  - `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.
- Un commit = un cambio lógico.
- No mezclar refactors con features.
- No commitear `.env*`, claves ni `database.types.ts` editado a mano.

## Checklist antes de cerrar un cambio

- [ ] `npm run lint` sin errores.
- [ ] `npx tsc --noEmit` sin errores.
- [ ] `npm run build` correcto.
- [ ] Probado en local con sesión e invitado.
- [ ] RLS y validación del lado servidor revisadas.
- [ ] Documentación actualizada si cambió un flujo o contrato.
