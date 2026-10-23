# Pruebas

## Automatizadas

- `npm run lint`: sin errores ni warnings.
- `npx tsc --noEmit`: sin errores.
- `npm run build`: build de producción correcto.
- E2E con Chrome headless + Playwright Core (`playwright-core`) contra `http://localhost:3000`.

### Resultado E2E

**19/19 OK** (18 del flujo principal + 1 de bloqueo)

| Prueba | Estado |
| --- | --- |
| Home carga y tiene título | OK |
| Login redirige a explorar | OK |
| Swipe muestra tarjeta | OK |
| Cambio a grilla mantiene resultados | OK |
| Detalle logueado muestra mapa Leaflet | OK |
| WhatsApp autorizado visible con sesión | OK |
| Lista de chats muestra conversación | OK |
| Chat carga mensajes | OK |
| Envío de mensaje | OK |
| Guardado de perfil | OK |
| Publicación con foto | OK |
| Eliminación de aviso | OK |
| Logout | OK |
| Invitado no ve mapa exacto | OK |
| Invitado redirigido al login | OK |
| Home móvil sin scroll horizontal | OK |
| Reporte de aviso | OK |
| Bloqueo oculta el chat de la lista | OK |
| Sin errores de consola | OK |

## Seguridad verificada

- Invitado no recibe lat/lng en `/api/posts`.
- `posts` no es legible por `anon` por REST.
- `posts_public` devuelve lat/lng `null` para invitados.
- `posts_public` y `profiles_public` devuelven WhatsApp `null` para invitados.
- Usuario autenticado recibe ubicación y WhatsApp autorizado.
- Mapa exacto y botón de WhatsApp solo se renderizan con sesión.
- RLS y RPCs rechazan operaciones sin usuario.
- Al bloquear, el chat desaparece de la lista y no se puede volver a abrir.

## Pruebas manuales recomendadas

- [ ] Registro con email nuevo y confirmación.
- [ ] Publicar una foto real desde mobile.
- [ ] Probar GPS en un dispositivo físico.
- [ ] Verificar que el radio de búsqueda se cruce correctamente entre dos zonas.
- [ ] Swipear con dos cuentas y abrir el mismo chat desde ambos lados.
- [ ] Bloquear un usuario y confirmar que desaparecen avisos y chats.
- [ ] Reportar y revisar el registro en `public.reports`.
- [ ] Probar WhatsApp en un dispositivo con la app instalada.
- [ ] Ejecutar Lighthouse en mobile.

## Consultas útiles

```bash
# Estado de Supabase local
npx supabase status

# Reiniciar datos
npm run db:reset
npm run seed

# Ver reportes
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
  -c "select * from public.reports order by created_at desc;"
```

Las pruebas E2E crean un aviso, un mensaje y un reporte temporales. El aviso se elimina desde la propia UI; el mensaje y el reporte se limpian con SQL después de la prueba.

## Producción

Verificado contra `https://michinder.netlify.app` (Supabase Cloud):

| Prueba | Estado |
| --- | --- |
| `GET /api/posts` responde 200 con avisos | OK |
| Home muestra avisos (no el estado vacío) | OK |
| Login con `chacha@demo.com` / `demo1234` redirige al home | OK |
| Registro de cuenta nueva | Bloqueado por `email rate limit exceeded` |

El registro falla solo por el límite de emails del plan gratuito de Supabase. Para completar la prueba:

1. Desactivar **Confirm email** en Supabase (Authentication → Sign In / Providers → Email), o
2. Esperar a que se libere el cupo, o
3. Configurar SMTP propio.

Con la configuración corregida, repetir el registro y verificar que redirige al home con sesión activa. Ver [despliegue.md](despliegue.md).
