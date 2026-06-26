# Quick Start: k6 Load Tests

Guia rapida para ejecutar pruebas de carga k6 en 5 minutos.

## Inicio Rapido

### 1. Instalar k6 o Docker

Windows con Scoop:
```powershell
scoop install k6
```

Windows con Chocolatey:
```powershell
choco install k6
```

Tambien puedes usar Docker. Los scripts npm detectan si `k6` no esta instalado y ejecutan `grafana/k6:latest` automaticamente.

### 2. Configurar variables

Crea un archivo local llamado `.env.k6.local` si necesitas variables para tu entorno. Ese archivo no se versiona. El runner lo carga automaticamente:

```env
BASE_URL=http://localhost:5173
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon-key
K6_AUTH_TOKEN=
```

Para pruebas locales de navegacion, `BASE_URL=http://localhost:5173` es suficiente. En Docker sobre Windows, el runner traduce esa URL a `host.docker.internal` para que el contenedor pueda alcanzar la app local.

### 3. Ejecutar pruebas

En una terminal:
```powershell
npm run dev
```

En otra terminal:
```powershell
npm run k6:validate
npm run k6:smoke
npm run k6:load
npm run k6:stress
npm run k6:spike
npm run k6:soak
npm run k6:supabase
```

## Escenarios

| Comando | Usuarios | Duracion | Proposito |
|---------|----------|----------|-----------|
| `npm run k6:smoke` | 1 | 1 min | Verificacion rapida |
| `npm run k6:load` | 5 a 25 | 12 min | Carga esperada |
| `npm run k6:stress` | 25 a 75 | 10 min | Encontrar limites |
| `npm run k6:spike` | 5 a 60 a 5 | 3 min | Picos bruscos |
| `npm run k6:soak` | 10 | 30 min | Resistencia prolongada |
| `npm run k6:supabase` | configurable | 2 min | Lecturas Supabase |

## Interpretar resultados

k6 marcara la prueba como fallida si no se cumplen los umbrales:

```text
checks..................... rate > 99%
http_req_failed............ rate < 1%
http_req_duration.......... p95 < 3000ms, p99 < 5000ms
iteration_duration......... p95 < 6000ms
```

## Solucionar problemas

Si aparece `Connection refused`, confirma que la app esta corriendo con `npm run dev` y que `BASE_URL` apunta al puerto correcto.

Si Docker no puede descargar `grafana/k6:latest`, instala k6 localmente o inicia Docker Desktop y vuelve a ejecutar el comando.

Si el escenario `supabase-read` no realiza lecturas utiles, reemplaza `SUPABASE_URL` y `SUPABASE_ANON_KEY` con valores de QA.
