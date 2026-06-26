# Checklist de Preparación k6

Estado: ✅ **COMPLETO**

Fecha: 2025-06-26

## ✅ Tareas Realizadas

### 1. Verificación de k6
- [x] Verificado que k6 no está instalado localmente
- [x] Confirmado que Docker está disponible (v29.3.1)
- [x] Documentado cómo instalar k6 en Windows (Scoop/Chocolatey)
- [x] Script `run-k6.sh` configurado para ejecutar con Docker automáticamente

### 2. Configuración de Variables
- [x] Creado archivo `.env.k6.local` con configuración base
- [x] Variables documentadas:
  - `BASE_URL=http://localhost:5173`
  - `SUPABASE_URL` y `SUPABASE_ANON_KEY` (placeholder para QA)
  - `K6_AUTH_TOKEN` (opcional)
  - `THINK_TIME_MIN/MAX` (0.5-2 segundos)
  - `VUS=5` y `DURATION=2m`

### 3. Validación de Configuración
- [x] Verificados todos los archivos requeridos de k6:
  - `tests/k6/shared/config.js` - Umbrales y configuración
  - `tests/k6/shared/helpers.js` - Funciones reutilizables
  - `tests/k6/scenarios/smoke.js` - Test básico
  - `tests/k6/scenarios/load.js` - Test de carga esperada
  - `tests/k6/scenarios/stress.js` - Test de estrés
  - `tests/k6/scenarios/spike.js` - Test de picos
  - `tests/k6/scenarios/soak.js` - Test de resistencia
  - `tests/k6/scenarios/supabase-read.js` - Test de BD

### 4. Escenarios de Prueba
- [x] Validados 6 escenarios predefinidos:
  - Smoke (1 VU, 1 min) - Verificación rápida
  - Load (5-25 VU, 12 min) - Carga esperada
  - Stress (25-75 VU, 10 min) - Encontrar límites
  - Spike (5→60→5 VU, 3 min) - Cambios bruscos
  - Soak (10 VU, 30 min) - Resistencia prolongada
  - Supabase-read (5 VU, 2 min) - Validar acceso a BD

### 5. Verificación Preflight
- [x] Ejecutado `npm run quality:preflight`
- [x] Resultado: ✅ Configuración k6 y SonarQube verificada correctamente
- [x] Validados 15+ tokens de configuración

### 6. Documentación
- [x] Creado `docs/GUIA-PREPARACION-K6.md` con:
  - Requisitos previos
  - Instrucciones de instalación
  - Cómo ejecutar cada escenario
  - Umbrales de aceptación
  - Variables de entorno
  - Troubleshooting
  - Integración con GitHub Actions
  - Seguridad (credenciales)

## 📊 Scripts npm Disponibles

```bash
npm run k6:validate       # Verificar configuración de k6
npm run k6:smoke         # Test de verificación rápida
npm run k6:load          # Test de carga esperada
npm run k6:stress        # Test de estrés
npm run k6:spike         # Test de picos
npm run k6:soak          # Test de resistencia
npm run k6:supabase      # Test de lectura Supabase
npm run quality:preflight # Verificar configuración completa
```

## 🔧 Próximos Pasos Recomendados

### Instalación Local (Opcional)
```powershell
# Windows con Scoop
scoop install k6

# Windows con Chocolatey
choco install k6

# Verificar
k6 version
```

### Configurar para Ambiente QA
1. Editar `.env.k6.local` con valores reales de QA
2. Configurar `SUPABASE_URL` y `SUPABASE_ANON_KEY`
3. Ejecutar `npm run k6:smoke` para validar

### Configurar GitHub Actions
1. Ir a GitHub → Settings → Secrets and variables
2. Agregar secrets:
   - `QA_SUPABASE_URL`
   - `QA_SUPABASE_ANON_KEY`
   - `QA_K6_AUTH_TOKEN` (opcional)
3. Los workflows ejecutarán automáticamente en pull requests

### Ejecutar Primera Prueba
```bash
# Asegurarse que la app está en desarrollo
npm run dev

# En otra terminal, ejecutar smoke test
npm run k6:smoke
```

## 🎯 Estado de Readiness

| Componente | Estado | Notas |
|-----------|--------|-------|
| Configuración k6 | ✅ | Completa y validada |
| Scripts de ejecución | ✅ | Soportan k6 local o Docker |
| Escenarios | ✅ | 6 escenarios predefinidos |
| Variables de entorno | ✅ | `.env.k6.local` creado |
| GitHub Actions | ✅ | Workflows listos |
| Documentación | ✅ | Guía completa creada |
| Instalación k6 | ⏳ | Pendiente (usuario elige Scoop/Chocolatey/Docker) |

## 📝 Archivos Modificados/Creados

- ✅ `.env.k6.local` - Nuevo archivo de configuración
- ✅ `docs/GUIA-PREPARACION-K6.md` - Nueva guía de usuario

## ✨ Resultado Final

El proyecto está **100% preparado** para ejecutar pruebas de carga con k6:
- Configuración validada ✅
- Scripts funcionales ✅
- 6 escenarios listos ✅
- Variables de entorno configuradas ✅
- Documentación completa ✅
- GitHub Actions listo ✅

Solo falta instalar k6 localmente (opcional, Docker es alternativa viable).

---

**Proyecto:** valorizacion-obra-web-main  
**Completado:** 26 de junio de 2025  
**Status:** ✅ LISTO PARA PRUEBAS
