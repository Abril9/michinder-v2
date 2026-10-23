# Despliegue

Producción actual:

- **App**: Netlify (`https://michinder.netlify.app`), build automático desde GitHub.
- **Backend**: Supabase Cloud, proyecto `ogjguprgpneaiwofaurc`.
- **Base**: las 3 migraciones aplicadas y datos demo cargados.

## 1. Supabase Cloud

### Crear o linkear el proyecto

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

El `project-ref` está en la URL del panel: `supabase.com/dashboard/project/<project-ref>`.

### Aplicar migraciones

```bash
npx supabase db push
```

Aplica **todas** las migraciones pendientes de `supabase/migrations/`, no solo la inicial.

### Cargar datos demo (opcional)

El seed usa la service role y es idempotente (IDs fijos + upsert).

```bash
# .env.cloud (ignorado por git)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret key>

node --env-file=.env.cloud scripts/seed.mjs
```

### Autenticación

- **Authentication → Sign In / Providers → Email**: para el MVP conviene desactivar **Confirm email**. Si está activo, el registro envía un correo y consume el límite del plan gratuito (≈2–4 por hora), además de no crear sesión hasta confirmar.
- Si necesitás confirmación, configurá un SMTP propio (por ejemplo Resend) antes de abrir el registro al público.

## 2. Netlify

### Variables de entorno

Netlify → **Site configuration → Environment variables**:

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key (`sb_publishable_...`) o anon legacy del **mismo** proyecto |
| `NEXT_PUBLIC_APP_URL` | `https://<sitio>.netlify.app` |
| `SUPABASE_SERVICE_ROLE_KEY` | secret key del proyecto (solo servidor; hoy no se usa en runtime) |

Reglas:

- `NEXT_PUBLIC_SUPABASE_URL` es la URL de **Supabase**, no la de Netlify.
- URL y key tienen que ser del **mismo** proyecto.
- No debe haber variables duplicadas con el mismo nombre.
- `SUPABASE_SERVICE_ROLE_KEY` nunca lleva prefijo `NEXT_PUBLIC_`.

### Build y deploy

1. Netlify → **Deploys → Trigger deploy → Deploy site**.
2. Si cambiaste variables: **Clear cache and deploy site**.
3. Esperá a **Published**.

Las variables `NEXT_PUBLIC_*` se embeben en el bundle durante el build. Cambiarlas en el panel **no** afecta a un deploy ya publicado: siempre hay que redeployar.

## 3. Verificación posterior

```bash
# La API debe devolver avisos
curl https://<sitio>.netlify.app/api/posts

# El home no debe decir "Todavía no hay avisos"
curl https://<sitio>.netlify.app | grep -c "Todavía no hay avisos"
```

Checklist:

- [ ] `/api/posts` responde `200` con `posts`.
- [ ] El home muestra avisos.
- [ ] Login con una cuenta demo funciona.
- [ ] Registro con email nuevo funciona (o pide confirmación, según configuración).
- [ ] Las fotos de los avisos cargan desde Storage.

## 4. Troubleshooting

### `Invalid API key` al registrarse o iniciar sesión

Supabase rechazó la `apikey`. Causas típicas:

1. La URL es de un proyecto y la key de otro.
2. Se cargó la key demo local (`iss: supabase-demo`) en vez de la del proyecto.
3. La key tiene espacios o saltos de línea.
4. El proyecto deshabilitó las API keys legacy y se está usando una anon JWT vieja.

Diagnóstico rápido: la key correcta empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` y su `iss` es `supabase`, no `supabase-demo`.

Solución: volver a copiar la publishable/anon key del proyecto, guardarla y redeployar.

### `email rate limit exceeded`

Es el límite de correos del plan, no un error de la app. Opciones:

1. Desactivar **Confirm email** (recomendado para el MVP).
2. Esperar a que se libere el cupo.
3. Configurar SMTP propio.

### El home dice "Todavía no hay avisos"

1. Verificá `/api/posts`: si da `500`, el problema son las credenciales de Supabase.
2. Si da `200` con `posts: []`, faltan datos: corré el seed.
3. Si el deploy no cambió, faltó redeployar.

### El deploy no toma las variables nuevas

El sitio sigue sirviendo el build anterior. Verificá que el último deploy esté **Published** y sea posterior al cambio. Si no, **Clear cache and deploy site**.

## 5. Seguridad de credenciales

- `.env*` está ignorado por git salvo `.env.example`.
- La anon/publishable key es pública por diseño (va al navegador); la protección real está en RLS.
- La `service_role`/secret key evita RLS: solo scripts locales y servidor de confianza.
- Si una key se filtra, rotala en Supabase y actualizá Netlify.
