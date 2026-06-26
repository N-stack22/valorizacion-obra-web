# Implementacion de pruebas k6 y SonarQube

## Objetivo

Se incorporaron pruebas de rendimiento con k6 y analisis de calidad con SonarQube/SonarCloud al proyecto `valorizacion-obra-web-main`. La configuracion esta alineada al dominio de valorizacion de obra: navegacion del flujo principal, rutas protegidas, expediente, metrados, presupuestos, valorizaciones, reajustes, reportes y lectura no destructiva de Supabase cuando existan variables de entorno QA.

## Archivos implementados

| Archivo | Proposito |
|---|---|
| `sonar-project.properties` | Configuracion principal de SonarQube, LCOV, exclusiones y Quality Gate. |
| `.github/workflows/quality-sonarqube.yml` | Pipeline CI para instalar dependencias, ejecutar cobertura, build y analisis SonarQube. |
| `.github/workflows/k6-load-tests.yml` | Pipeline manual/CI para ejecutar k6 contra preview local o URL QA. |
| `tests/k6/shared/config.js` | Umbrales, URL base, escenarios y variables comunes. |
| `tests/k6/shared/helpers.js` | Helpers para navegar la SPA y consultar Supabase de forma no destructiva. |
| `tests/k6/scenarios/*.js` | Escenarios smoke, carga esperada, estres, pico, resistencia y lectura Supabase. |
| `scripts/run-k6.sh` | Ejecutor local con k6 o Docker. |
| `scripts/sonar-scan.sh` | Ejecutor local con sonar-scanner o Docker. |
| `scripts/verify-k6-sonar.mjs` | Preflight que valida que k6 y Sonar esten configurados. |
| `src/lib/quality-tooling.compliance.test.ts` | Prueba automatizada que bloquea regresiones de configuracion. |
| `.env.k6.example` | Plantilla de variables para QA. |

## Comandos principales

```bash
npm run quality:preflight
npm run test:coverage
npm run sonar:local
npm run k6:smoke
npm run k6:load
npm run k6:stress
npm run k6:spike
npm run k6:soak
```

## Variables k6

| Variable | Uso |
|---|---|
| `BASE_URL` | URL de la app, por ejemplo `http://localhost:5173` o ambiente QA. |
| `SUPABASE_URL` | URL Supabase QA para probes de lectura. |
| `SUPABASE_ANON_KEY` | Clave anon publica de QA. |
| `K6_AUTH_TOKEN` | Token QA opcional para endpoints protegidos. |
| `THINK_TIME_MIN` / `THINK_TIME_MAX` | Pausas entre acciones para simular uso humano. |

## Umbrales k6

- `http_req_failed < 1%` en smoke/carga/resistencia.
- `http_req_duration p95 < 3000 ms`.
- `http_req_duration p99 < 5000 ms`.
- `checks > 99%`.
- En estres y pico se flexibiliza temporalmente a `p95 < 5000 ms`, `p99 < 8000 ms` y fallos menores al 3%, porque esos escenarios buscan identificar limite y degradacion controlada.

## SonarQube

El proyecto genera cobertura con Vitest y V8 en `coverage/lcov.info`; SonarQube consume ese reporte mediante `sonar.javascript.lcov.reportPaths`. Se excluyen archivos generados, UI de libreria y tipos autogenerados para que la medicion se concentre en logica propia de negocio.

Variables de CI requeridas:

| Secreto | Uso |
|---|---|
| `SONAR_TOKEN` | Token del proyecto SonarQube/SonarCloud. |
| `SONAR_HOST_URL` | URL del servidor SonarQube. En SonarCloud puede omitirse o configurarse segun la organizacion. |

## Criterios de aceptacion

1. `npm run quality:preflight` termina correctamente.
2. `npm run test:coverage` genera `coverage/lcov.info`.
3. El workflow `Quality Gate - SonarQube` ejecuta el analisis y espera el Quality Gate.
4. El workflow `k6 Load Tests` ejecuta al menos smoke en pull request y permite carga/estres/pico/resistencia de forma manual.
5. Los escenarios k6 solo hacen pruebas no destructivas por defecto.

## Ejecución directa en GitHub Actions

El proyecto queda preparado para que las pruebas se ejecuten desde GitHub al hacer `push`, abrir `pull_request` o ejecutar manualmente los workflows desde la pestaña **Actions**.

| Workflow | Archivo | Ejecución automática | Ejecución manual |
|---|---|---|---|
| Quality Gate - GitHub + SonarQube | `.github/workflows/quality-sonarqube.yml` | Sí, en `main` y `develop` | Sí |
| k6 Load Tests | `.github/workflows/k6-load-tests.yml` | Sí, escenario `smoke` | Sí, permite elegir `smoke`, `load`, `stress`, `spike`, `soak` o `supabase-read` |

Para la configuración completa de secrets, ramas protegidas, ejecución manual y evidencias, revisar `docs/GUIA-GITHUB-ACTIONS-PRUEBAS.md`.
