# Guía de Preparación: Pruebas de Carga k6

Este documento es una guía completa para ejecutar pruebas de carga con k6 en el proyecto `valorizacion-obra-web-main`.

## 📋 Estado de la Configuración

El proyecto ya cuenta con:
- ✅ Configuración de k6 completa (`tests/k6/shared/config.js`)
- ✅ Helpers reutilizables (`tests/k6/shared/helpers.js`)
- ✅ 6 escenarios de prueba predefinidos
- ✅ Scripts de ejecución (`scripts/run-k6.sh`)
- ✅ Workflows de GitHub Actions para CI/CD
- ✅ Variables de entorno configuradas (`.env.k6.local`)
- ✅ Verificación preflight (`npm run quality:preflight`)

## 🚀 Cómo Ejecutar Pruebas k6 Localmente

### Requisitos Previos

**Opción 1: Instalar k6 Localmente (Recomendado)**

```powershell
# En Windows usando Scoop
scoop install k6

# Verificar instalación
k6 version
```

**Opción 2: Usar Docker** (Si Docker Desktop está configurado con WSL2)

```powershell
# Verificar que Docker esté disponible
docker --version
```

### Preparar Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
copy .env.k6.example .env.k6.local
```

2. Editar `.env.k6.local` con tus valores:
```env
BASE_URL=http://localhost:5173
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon
K6_AUTH_TOKEN=tu-token-opcional
THINK_TIME_MIN=0.5
THINK_TIME_MAX=2
VUS=5
DURATION=2m
```

### Ejecutar Escenarios

```bash
# Smoke test (1 usuario, 1 minuto) - Verificar que todo funciona
npm run k6:smoke

# Load test (5-25 usuarios, 12 minutos) - Carga esperada
npm run k6:load

# Stress test (25-75 usuarios, 10 minutos) - Encontrar límites
npm run k6:stress

# Spike test (5→60→5 usuarios) - Cambios bruscos de carga
npm run k6:spike

# Soak test (10 usuarios, 30 minutos) - Resistencia prolongada
npm run k6:soak

# Supabase read probe (Validar acceso a BD)
npm run k6:supabase
```

## 📊 Escenarios Disponibles

| Escenario | VUS | Duración | Propósito |
|-----------|-----|----------|-----------|
| `smoke` | 1 | 1 min | Verificación rápida del sistema |
| `load` | 5-25 | 12 min | Carga esperada en producción |
| `stress` | 25-75 | 10 min | Encontrar punto de ruptura |
| `spike` | 5-60 | 3 min | Respuesta ante cambios bruscos |
| `soak` | 10 | 30 min | Resistencia a largo plazo |
| `supabase-read` | 5 | 2 min | Validar acceso a Supabase |

## 📈 Umbrales de Aceptación

Los escenarios validan automáticamente:

**Escenarios normales (smoke, load, soak):**
- `http_req_failed < 1%` - Menos del 1% de fallos
- `http_req_duration p95 < 3000ms` - P95 menor a 3 segundos
- `http_req_duration p99 < 5000ms` - P99 menor a 5 segundos
- `checks > 99%` - Más del 99% de validaciones exitosas

**Escenarios de límite (stress, spike):**
- `http_req_failed < 3%` - Hasta 3% de fallos permitidos
- `http_req_duration p95 < 5000ms` - P95 mayor a 5 segundos (pero controlado)
- `http_req_duration p99 < 8000ms` - P99 mayor a 8 segundos (pero controlado)

## 🔗 Rutas Probadas

El escenario predeterminado prueba las siguientes rutas:

- `/` - Página principal
- `/login` - Página de autenticación
- `/app/dashboard` - Panel principal
- `/app/projects` - Proyectos
- `/app/budgets` - Presupuestos
- `/app/metrados` - Metrados
- `/app/valuations` - Valorizaciones
- `/app/reajustes` - Reajustes
- `/app/expediente` - Expediente

Todas las pruebas incluyen:
- Validación de que no hay errores 5xx
- Validación de respuesta con contenido
- Pruebas de lectura en Supabase (sin modificar datos)

## 🔧 Configuración Avanzada

### Variables de Entorno Personalizadas

```bash
# Ejecutar con 10 usuarios durante 5 minutos
VUS=10 DURATION=5m npm run k6:load

# Ejecutar contra ambiente QA
BASE_URL=https://qa.example.com npm run k6:smoke

# Incluir autenticación
K6_AUTH_TOKEN=tu-token npm run k6:load
```

### Ejecutar Escenario Personalizado

```bash
# Usar Docker explícitamente
bash scripts/run-k6.sh smoke
```

## 📋 Verificación Previa

Antes de ejecutar cualquier prueba, verificar la configuración:

```bash
npm run quality:preflight
```

Este comando valida:
- Presencia de archivos necesarios de k6
- Configuración de SonarQube
- Scripts en package.json
- Workflows de GitHub Actions

## 🐛 Troubleshooting

### "k6 no está instalado"
```bash
# Opción 1: Instalar con Scoop
scoop install k6

# Opción 2: Instalar con Chocolatey
choco install k6

# Opción 3: Descargar directamente
# https://dl.k6.io/releases/latest/windows/k6-latest-amd64.msi
```

### "Docker no funciona en WSL2"
1. Abrir Docker Desktop
2. Ir a Settings → Resources → WSL integration
3. Activar integración con la distribución WSL
4. Reiniciar Docker

### "Error: Base URL no responde"
```bash
# Asegurarse que la app está corriendo
npm run dev

# Verificar BASE_URL en .env.k6.local
cat .env.k6.local | findstr BASE_URL
```

### "Fallos en pruebas de Supabase"
1. Verificar que SUPABASE_URL y SUPABASE_ANON_KEY sean correctos
2. Validar que el proyecto QA esté disponible
3. Ejecutar solo con `npm run k6:supabase` para diagnosticar

## 🔐 Seguridad

- ⚠️ **NO subir** credenciales reales en `.env.k6.local`
- El archivo `.env.k6.local` está en `.gitignore`
- En CI/CD, usar secrets de GitHub Actions
- Las pruebas son **solo lectura** (no modifican datos)

## 📊 GitHub Actions

El proyecto incluye workflows automáticos:

**Ejecutar automáticamente:**
- En cada pull request → smoke test
- En push a main/develop → smoke test

**Ejecutar manualmente:**
1. Ir a **Actions** en GitHub
2. Seleccionar **"k6 Load Tests"**
3. Click en **"Run workflow"**
4. Elegir escenario: smoke, load, stress, spike, soak
5. Opcionalmente especificar URL QA

## 📚 Más Información

- [Documentación de k6](https://k6.io/docs/)
- [Guía de GitHub Actions en el proyecto](./GUIA-GITHUB-ACTIONS-PRUEBAS.md)
- [Implementación de k6 y SonarQube](./IMPLEMENTACION-K6-SONARQUBE.md)

## 🎯 Próximos Pasos

1. ✅ Instalar k6 o confirmar disponibilidad de Docker
2. ✅ Configurar `.env.k6.local` con ambiente local
3. ✅ Ejecutar `npm run k6:smoke` para validar
4. ✅ Revisar resultados en consola
5. ✅ Configurar secrets en GitHub Actions para CI/CD

---

**Última actualización:** 2025-06-26
**Ambiente:** valorizacion-obra-web-main
**Estado:** ✅ Listo para pruebas
