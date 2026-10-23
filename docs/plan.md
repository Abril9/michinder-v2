# Plan de implementación

## Fase 0 · Base

- [x] Crear Next.js 16 con TypeScript y Tailwind 4.
- [x] Instalar Supabase, Leaflet, Motion, Zod, Sharp y utilidades.
- [x] Levantar Supabase local con Docker.
- [x] Modelo de datos con PostGIS, RLS, triggers, vistas, RPCs y Storage.
- [x] Clientes Supabase server/browser/admin y tipos generados.

## Fase 1 · Identidad y navegación

- [x] Layout raíz, layout de sitio y layout de auth.
- [x] Home con accesos “Perdí” y “Encontré”.
- [x] Login, registro, logout y refresco de sesión.
- [x] Header, navegación móvil, footer, logo, manifest y metadatos.
- [x] Páginas legales y 404.

## Fase 2 · Avisos

- [x] Publicar con fotos comprimidas, especie, sexo, edad, tamaño, fecha, ubicación y radio.
- [x] Mapa con selector de punto y círculo de búsqueda.
- [x] Detalle con galería, mapa, autor, compartir y reportar.
- [x] Edición de datos y ubicación.
- [x] Mis publicaciones: editar, marcar reencontrado, reabrir y eliminar.
- [x] Fotos de avisos existentes: solo lectura en esta versión.

## Fase 3 · Descubrimiento

- [x] Filtros por especie, sexo, edad, tamaño y radio.
- [x] Geolocalización del navegador con fallback a zona demo.
- [x] Búsqueda por intersección de radios.
- [x] Swipe con Motion: derecha abre chat, izquierda descarta.
- [x] Grilla alternativa.
- [x] Persistencia de ubicación en `localStorage`.

## Fase 4 · Conversación

- [x] Chat interno con polling cada 3 s.
- [x] Mensajes, separadores por día y scroll automático.
- [x] No leídos y marcado de lectura.
- [x] Límites anti-spam: 10 chats nuevos/día, 20 mensajes/minuto, 200/día, duplicado 30 s.
- [x] WhatsApp opcional con autorización.
- [x] Bloqueo de usuarios.

## Fase 5 · Calidad y entrega

- [x] Seed idempotente con 16 avisos, 3 usuarios y 2 chats.
- [x] ESLint, TypeScript y build de producción sin errores.
- [x] Docs de ideas, plan, arquitectura, decisiones y pruebas.
- [x] Probar el flujo completo con dos cuentas en local.
- [x] Verificar que invitados no reciban ubicación exacta ni WhatsApp.
- [ ] Probar el flujo completo con dos cuentas en producción.
- [x] Configurar Supabase Cloud y Netlify.
- [ ] Notificaciones y panel admin (post-v1).

## Próximos pasos sugeridos

1. Probar publicación real con fotos desde mobile.
2. Revisar textos y accesibilidad con personas usuarias.
3. Agregar notificaciones por email.
4. Panel de moderación con reportes pendientes.
5. Edición de fotos y reordenamiento.
