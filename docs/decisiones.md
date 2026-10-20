# Decisiones

## ADR-01 · Next.js 16 + Supabase

**Decisión**: App Router con Server Components y Supabase como backend único.

**Motivo**: Menos piezas, auth y storage integrados, Postgres con PostGIS para radio y despliegue simple en Vercel.

## ADR-02 · Backend real desde el inicio

**Decisión**: Sin mocks. Todo persiste en Supabase local.

**Motivo**: Detectar temprano problemas de RLS, tipos y storage.

## ADR-03 · Swipe como vista principal

**Decisión**: Explorar arranca en swipe y permite cambiar a grilla.

**Motivo**: Decidir rápido entre muchos avisos sin perder la opción de revisar en detalle.

## ADR-04 · Búsqueda por intersección de radios

**Decisión**: Un aviso aparece si su radio se cruza con el radio del usuario.

**Motivo**: Es más útil que filtrar solo por distancia al centro: una mascota perdida puede haberse movido.

## ADR-05 · Ubicación exacta solo con sesión

**Decisión**: El mapa exacto y el punto se muestran a usuarios logueados; invitados ven un bloqueo con CTA.

**Motivo**: Reduce exposición de direcciones sin impedir que el aviso sea indexable y compartible.

## ADR-06 · WhatsApp opt-in

**Decisión**: El número solo aparece si el autor activa `show_whatsapp`.

**Motivo**: Privacidad por defecto. El chat interno sigue disponible.

## ADR-07 · Chat con polling

**Decisión**: Polling cada 3 s en lugar de Realtime.

**Motivo**: Menos complejidad operativa para el MVP. La interfaz puede migrarse a Realtime sin cambiar el modelo.

## ADR-08 · Fotos fijas al editar

**Decisión**: En v1 se editan datos y ubicación, no fotos.

**Motivo**: Evita lógica de borrado/reordenamiento y carreras con Storage. Si hace falta, se elimina el aviso y se crea otro.

## ADR-09 · Límites anti-spam en base

**Decisión**: Los límites viven en RPCs de Postgres.

**Motivo**: No dependen del cliente ni de memoria del servidor; funcionan igual en Vercel.

## ADR-10 · Datos demo en Santa Fe

**Decisión**: 16 avisos, 3 usuarios y 2 chats con IDs fijos e idempotentes.

**Motivo**: Permite probar filtros, swipe, chats y WhatsApp sin depender de datos externos.
