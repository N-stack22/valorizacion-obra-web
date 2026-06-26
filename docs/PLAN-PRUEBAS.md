# Plan de pruebas y aseguramiento

## Alcance

Este plan cubre autenticacion, autorizacion por roles, seguridad de datos, flujos de obra, calculos de metrados/valorizaciones, instalacion, documentacion, usabilidad, volumen, estres, rendimiento, calidad de codigo con SonarQube y carga con k6.

## Reglas base

- El login no permite registrar usuarios nuevos.
- El alta de usuarios se gestiona por administradores desde el modulo de usuarios y roles.
- La creacion de proyectos requiere rol `admin` o `resident`.
- Los datos de proyecto se protegen con RLS y helpers de permiso en Supabase.
- Las pruebas no deben depender de datos productivos.
- Las pruebas k6 por defecto son no destructivas y deben ejecutarse contra QA o preview local.
- El analisis SonarQube se ejecuta con cobertura LCOV generada por Vitest.

## Matriz de pruebas

| Tipo | Objetivo | Cobertura actual | Comando |
|---|---|---|---|
| Caja blanca | Validar politicas internas de auth, roles y codigo fuente sensible | `src/lib/auth-policy.test.ts`, `src/lib/security-access.test.ts` | `npm run test:security` |
| Caja negra | Validar comportamiento visible de login y rutas protegidas | `e2e/security-auth.spec.ts`, `e2e/smoke.spec.ts` | `npm run test:blackbox` |
| Seguridad | RLS, autoescalamiento, ownership, buckets y ausencia de registro publico | `src/lib/security-access.test.ts`, `src/lib/auth-policy.test.ts` | `npm run test:security` |
| Roles | Permisos de proyecto, usuarios y workflow | `src/lib/auth-policy.test.ts`, `src/lib/workflow.test.ts` | `npm run test:roles` |
| Volumen | Miles de partidas y lineas de metrado | `src/lib/volume-stress.performance.test.ts` | `npm run test:volume` |
| Estres | Ejecucion repetida y formulas invalidas o maliciosas | `src/lib/volume-stress.performance.test.ts` + k6 | `npm run test:stress` / `npm run k6:stress` |
| Performance | Tiempo maximo de calculos centrales y respuesta web bajo carga | Vitest performance + k6 | `npm run test:performance` / `npm run k6:load` |
| Usabilidad | Login usable en desktop/mobile, sin alta publica visible | `e2e/security-auth.spec.ts`, `src/lib/usability.compliance.test.ts` | `npm run test:usability` |
| Instalacion | Dependencias, build y arranque local | Script de instalacion | `npm run test:installation` |
| Documentacion | Existencia de matriz, comandos y reglas base | `src/lib/documentation.compliance.test.ts` | `npm run test:docs` |
| Calidad de codigo | Detectar deuda, bugs, duplicacion y vulnerabilidades | `sonar-project.properties`, workflow SonarQube | `npm run test:coverage` + `npm run sonar:local` |
| Carga k6 | Medir p95/p99, errores y checks bajo concurrencia | `tests/k6/scenarios/*.js` | `npm run k6:smoke`, `npm run k6:load` |
| Preflight calidad | Verificar que k6 y SonarQube no se eliminen por accidente | `scripts/verify-k6-sonar.mjs`, `quality-tooling.compliance.test.ts` | `npm run quality:preflight` |

## Implementacion SonarQube

Archivos incorporados:

- `sonar-project.properties`.
- `.github/workflows/quality-sonarqube.yml`.
- `scripts/sonar-scan.sh`.
- `src/lib/quality-tooling.compliance.test.ts`.

Criterios minimos:

- El proyecto debe generar `coverage/lcov.info` con `npm run test:coverage`.
- El Quality Gate debe ejecutarse en CI y esperar resultado.
- El codigo nuevo no debe introducir vulnerabilidades, bugs bloqueantes ni deuda critica.
- Se excluyen archivos generados, tipos Supabase autogenerados y componentes UI repetitivos para concentrar el analisis en logica propia.

## Implementacion k6

Escenarios implementados:

| Escenario | Script | Uso |
|---|---|---|
| Smoke | `tests/k6/scenarios/smoke.js` | Verificacion rapida de disponibilidad. |
| Carga esperada | `tests/k6/scenarios/load.js` | Ramp-up hasta 25 usuarios virtuales. |
| Estres | `tests/k6/scenarios/stress.js` | Ramp-up hasta 75 usuarios virtuales. |
| Pico | `tests/k6/scenarios/spike.js` | Salto rapido hasta 60 usuarios virtuales. |
| Resistencia | `tests/k6/scenarios/soak.js` | 10 usuarios virtuales durante 30 minutos. |
| Supabase read probe | `tests/k6/scenarios/supabase-read.js` | Lectura no destructiva de Supabase QA cuando existan variables. |

Umbrales principales:

- `http_req_failed < 1%` en smoke/carga/resistencia.
- `http_req_duration p95 < 3000 ms`.
- `http_req_duration p99 < 5000 ms`.
- `checks > 99%`.
- En estres y pico se permite degradacion controlada: fallos menores al 3%, p95 menor a 5 segundos y p99 menor a 8 segundos.

## Cobertura por tecnica solicitada

### Caja negra

| Caso | Tecnica | Prueba automatizada |
|---|---|---|
| Login y roles | Clases de equivalencia | `src/lib/black-box-techniques.test.ts`, `e2e/security-auth.spec.ts` |
| Importacion de presupuesto | Clases validas/no validas | `src/lib/black-box-techniques.test.ts`, `src/lib/budget-detection.test.ts` |
| Registro de metrados | Valores limite | `src/lib/black-box-techniques.test.ts` |
| Apertura de periodo | Tabla de decision | `src/lib/black-box-techniques.test.ts`, `src/lib/period-policy.ts` |
| Consulta por entidad | Acceso permitido/denegado | `src/lib/black-box-techniques.test.ts`, `src/lib/auth-policy.ts` |

### Caja blanca

| Caso | Codigo/logica revisada | Prueba automatizada |
|---|---|---|
| Calculo de metrado | Formula largo x ancho x alto x veces | `src/lib/white-box-domain-logic.test.ts`, `src/lib/expediente.ts` |
| Bloqueo de excedentes | Condicion acumulado <= contractual | `src/lib/white-box-domain-logic.test.ts`, `src/lib/expediente.ts` |
| Calculo de valorizacion | Metrado aprobado x precio unitario | `src/lib/white-box-domain-logic.test.ts`, `src/lib/expediente.ts` |
| Factor K y reajustes | Formula polinomica e indices | `src/lib/white-box-domain-logic.test.ts`, `src/lib/reajuste.test.ts` |
| Permisos por rol | Guards, transiciones y validaciones internas | `src/lib/white-box-domain-logic.test.ts`, `src/lib/workflow.test.ts`, `src/lib/auth-policy.test.ts` |
| Generacion con Claude | Payload minimo, prompt versionado y revision humana | `src/lib/white-box-domain-logic.test.ts`, `src/lib/ai/prompt.ts`, `src/lib/ai/providers/claude.server.ts` |
| Tooling calidad | Archivos k6, SonarQube y scripts de CI | `src/lib/quality-tooling.compliance.test.ts` |

Comandos directos:

- `npm run test:techniques`: ejecuta la matriz automatizada de caja negra y caja blanca.
- `npm run test:whitebox`: ejecuta pruebas blancas de dominio, seguridad y roles.
- `npm run test:blackbox`: ejecuta pruebas end-to-end visibles de login y rutas protegidas.
- `npm run test:coverage`: ejecuta pruebas con LCOV para SonarQube.
- `npm run k6:smoke`: valida disponibilidad basica.
- `npm run k6:load`: ejecuta carga esperada.
- `npm run quality:preflight`: valida que la implementacion k6/SonarQube exista.

## Casos criticos

| ID | Categoria | Caso | Resultado esperado |
|---|---|---|---|
| AUTH-001 | Seguridad | Abrir `/login` | Solo se muestran campos de ingreso; no hay boton ni modo de registro. |
| AUTH-002 | Seguridad | Intentar acceder a `/app/dashboard` sin sesion | El sistema redirige a login o impide ver contenido protegido. |
| ROLE-001 | Roles | Usuario `assistant` intenta crear proyecto | UI y politica interna no lo permiten. |
| ROLE-002 | Roles | Usuario `resident` crea proyecto | La politica interna lo permite. |
| ROLE-003 | Roles | Usuario sin rol intenta gestionar usuarios | La politica interna lo bloquea. |
| RLS-001 | Seguridad | Revisar migraciones | Tablas criticas tienen RLS activo. |
| RLS-002 | Seguridad | Insertar registros sensibles | Los inserts exigen `created_by = auth.uid()`. |
| PERF-001 | Performance | Calcular valorizacion con alto volumen | Termina dentro del umbral definido y sin totales invalidos. |
| K6-001 | Carga | Ejecutar smoke con 1 VU | Sin errores 5xx y checks superiores a 99%. |
| K6-002 | Carga | Ejecutar carga esperada hasta 25 VU | p95 menor o igual a 3 segundos y fallos menores al 1%. |
| K6-003 | Estres | Ejecutar estres hasta 75 VU | Degradacion controlada y sin caida total del servicio. |
| SONAR-001 | Calidad | Ejecutar analisis SonarQube | Quality Gate aprobado o defectos priorizados antes de release. |
| DOC-001 | Documentacion | Validar este plan | Deben existir alcance, matriz, comandos y casos criticos. |

## Pruebas manuales recomendadas

1. Crear usuarios desde el panel administrativo de Supabase o modulo interno autorizado.
2. Asignar roles `admin`, `resident`, `assistant`, `supervisor` y `legal_representative`.
3. Verificar que cada rol solo ve o ejecuta acciones permitidas.
4. Ejecutar un flujo completo: proyecto, presupuesto, periodo, metrados, valorizacion, reajuste y documento.
5. Probar importacion de presupuesto con archivos grandes, vacios, corruptos y con columnas inesperadas.
6. Revisar la aplicacion en 390px, 768px, 1366px y 1920px de ancho.
7. Revisar mensajes de error sin exponer detalles tecnicos sensibles.
8. Confirmar que los buckets `expedientes`, `budget-imports` y `project-documents` no exponen archivos de otros proyectos.
9. Ejecutar `npm run k6:smoke` contra preview local.
10. Ejecutar `npm run k6:load` solo contra QA y con datos ficticios.
11. Confirmar que el reporte SonarQube no tenga issues bloqueantes o criticos en codigo nuevo.

## Criterios de salida

- `npm run test` pasa sin fallas.
- `npm run build` pasa sin errores.
- `npm run test:e2e` pasa en Chromium.
- `npm run quality:preflight` pasa sin fallas.
- `npm run test:coverage` genera `coverage/lcov.info`.
- El Quality Gate de SonarQube queda aprobado en CI.
- El escenario k6 smoke pasa antes de despliegue.
- La carga esperada k6 contra QA cumple p95/p99 y tasa de fallos definidos.
- Las reglas de login y roles se mantienen cubiertas por pruebas automatizadas.
- Este documento se actualiza cuando se agregan modulos, roles nuevos o escenarios k6.
