# Indicaciones para Codex / Leonardo — subir pruebas k6 y SonarQube en una nueva rama

## Objetivo

Implementar en GitHub, mediante una **nueva rama**, la configuración de pruebas automatizadas del proyecto **Sistema Web de Valorización de Obra**. La rama debe incluir:

- GitHub Actions para calidad, cobertura, build y SonarQube/SonarCloud.
- GitHub Actions para pruebas k6 de carga.
- Scripts npm para validar k6, SonarQube y cobertura.
- Documentación técnica de uso.
- Estado del arte integrado en `docs/` y `public/docs/`.

No se debe trabajar directamente sobre `main`.

---

## 1. Rama de trabajo obligatoria

Crear una rama nueva desde `main`:

```bash
git checkout main
git pull origin main
git checkout -b leonardo/pruebas-github-actions-k6-sonar
```

Nombre recomendado de la rama:

```txt
leonardo/pruebas-github-actions-k6-sonar
```

---

## 2. Archivos que deben quedar en el repositorio

Validar que en la raíz del proyecto existan estos archivos y carpetas:

```txt
.github/workflows/quality-sonarqube.yml
.github/workflows/k6-load-tests.yml
sonar-project.properties
vitest.config.ts
package.json
package-lock.json
.env.k6.example
scripts/run-k6.sh
scripts/sonar-scan.sh
scripts/verify-k6-sonar.mjs
tests/k6/shared/config.js
tests/k6/shared/helpers.js
tests/k6/scenarios/smoke.js
tests/k6/scenarios/load.js
tests/k6/scenarios/stress.js
tests/k6/scenarios/spike.js
tests/k6/scenarios/soak.js
tests/k6/scenarios/supabase-read.js
docs/GUIA-GITHUB-ACTIONS-PRUEBAS.md
docs/IMPLEMENTACION-K6-SONARQUBE.md
docs/estado-del-arte/
public/docs/estado-del-arte/
```

También verificar que el centro de documentos de la app conserve la tarjeta para descargar el Estado del Arte:

```txt
src/components/app/workspace-pages.tsx
```

---

## 3. No subir archivos sensibles

No subir credenciales reales ni archivos `.env` privados.

Debe quedar permitido subir solo:

```txt
.env.k6.example
```

No subir:

```txt
.env
.env.local
.env.production
.env.k6
coverage/
reports/
dist/
node_modules/
playwright-report/
test-results/
```

---

## 4. Comandos de verificación local antes del commit

Ejecutar en la raíz del proyecto:

```bash
npm ci
npm run quality:preflight
npm run test:coverage
npm run build
```

Resultado esperado:

```txt
Configuración k6 y SonarQube verificada correctamente.
Pruebas con cobertura ejecutadas.
Build de producción generado sin errores bloqueantes.
```

Si `npm ci` falla por lockfile, corregir con:

```bash
npm install
npm ci
```

Luego subir también el `package-lock.json` actualizado.

---

## 5. Verificación específica de k6

La validación mínima sin ejecutar carga real es:

```bash
npm run k6:validate
```

Cuando exista k6 instalado localmente o se use Docker/GitHub Actions, se podrán ejecutar:

```bash
npm run k6:smoke
npm run k6:load
npm run k6:stress
npm run k6:spike
npm run k6:soak
npm run k6:supabase
```

En GitHub Actions, el escenario automático debe ser `smoke`. Los escenarios `load`, `stress`, `spike` y `soak` deben ejecutarse manualmente y solo contra ambiente QA o producción controlada.

---

## 6. Verificación específica de SonarQube / SonarCloud

Validación mínima:

```bash
npm run sonar:verify
```

El archivo principal es:

```txt
sonar-project.properties
```

Debe contener, como mínimo:

```properties
sonar.projectKey=n-stack22_valorizacion-obra-web
sonar.projectName=Sistema Web de Valorizacion de Obra
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.qualitygate.wait=true
```

Si se usa SonarCloud, agregar la organización real:

```properties
sonar.organization=NOMBRE_ORGANIZACION_SONARCLOUD
```

No colocar el token de Sonar en el archivo del repositorio.

---

## 7. Secrets que Leonardo debe configurar en GitHub

Configurar después de subir la rama, desde el repositorio en GitHub:

```txt
Settings → Secrets and variables → Actions → New repository secret
```

Secrets obligatorios para Sonar:

```txt
SONAR_TOKEN
SONAR_HOST_URL
```

Para SonarCloud, normalmente:

```txt
SONAR_HOST_URL=https://sonarcloud.io
```

Secrets opcionales para k6 contra QA/Supabase:

```txt
QA_SUPABASE_URL
QA_SUPABASE_ANON_KEY
QA_K6_AUTH_TOKEN
```

Estos valores no deben aparecer en commits, capturas ni documentación pública.

---

## 8. Comandos para subir la rama

Después de verificar los cambios:

```bash
git status
git add .
git commit -m "ci: implementa pruebas k6 y sonar en github actions"
git push -u origin leonardo/pruebas-github-actions-k6-sonar
```

Abrir Pull Request hacia `main`:

```txt
Base: main
Compare: leonardo/pruebas-github-actions-k6-sonar
```

Título recomendado del PR:

```txt
Implementa pruebas k6, SonarQube y ejecución en GitHub Actions
```

---

## 9. Descripción sugerida del Pull Request

Copiar esta descripción en el PR:

```md
## Resumen

Se implementa la automatización de pruebas del Sistema Web de Valorización de Obra mediante GitHub Actions.

## Cambios incluidos

- Agrega workflow de calidad con Vitest, cobertura LCOV, build y SonarQube/SonarCloud.
- Agrega workflow de k6 para pruebas smoke automáticas y carga/estrés/pico/resistencia por ejecución manual.
- Agrega configuración `sonar-project.properties`.
- Agrega escenarios k6: smoke, load, stress, spike, soak y supabase-read.
- Agrega scripts npm para preflight, cobertura, Sonar y k6.
- Integra documentación del Estado del Arte en `docs/` y `public/docs/`.
- Agrega guía de uso de GitHub Actions para el equipo.

## Evidencias esperadas

- `npm run quality:preflight` aprobado.
- `npm run test:coverage` aprobado.
- `npm run build` aprobado.
- Workflow `Quality Gate - GitHub + SonarQube` ejecutado en el PR.
- Workflow `k6 Load Tests` ejecutado en modo smoke en el PR.
- Artefactos generados: `coverage-lcov` y `k6-summary-smoke`.

## Secrets requeridos

- `SONAR_TOKEN`
- `SONAR_HOST_URL`

Opcionales para QA:

- `QA_SUPABASE_URL`
- `QA_SUPABASE_ANON_KEY`
- `QA_K6_AUTH_TOKEN`

## Nota

No se ejecutan pruebas destructivas contra producción. Los escenarios load, stress, spike y soak deben ejecutarse manualmente contra QA o ambiente autorizado.
```

---

## 10. Criterios de aceptación antes de mergear

No hacer merge a `main` hasta cumplir:

| Criterio | Estado esperado |
|---|---|
| Rama nueva creada | `leonardo/pruebas-github-actions-k6-sonar` |
| `npm ci` | Correcto |
| `npm run quality:preflight` | Correcto |
| `npm run test:coverage` | Correcto |
| `npm run build` | Correcto |
| Workflow de Sonar | Ejecutado en PR |
| Workflow k6 | Ejecutado en PR con `smoke` |
| Artefacto de cobertura | Generado |
| Artefacto k6 smoke | Generado |
| Secrets reales fuera del código | Confirmado |
| PR abierto hacia `main` | Confirmado |

---

## 11. Qué NO debe hacer Codex

- No hacer cambios directos en `main`.
- No subir el ZIP como único archivo del repositorio.
- No borrar workflows existentes sin revisar.
- No colocar tokens, claves Supabase, tokens Claude ni credenciales reales en archivos versionados.
- No ejecutar `stress`, `spike` o `soak` contra producción sin autorización.
- No cerrar el PR si fallan los checks de GitHub Actions.

---

## 12. Mensaje final esperado de Codex / Leonardo

Cuando termine, debe reportar:

```txt
Rama creada: leonardo/pruebas-github-actions-k6-sonar
Commit: ci: implementa pruebas k6 y sonar en github actions
PR abierto hacia main: Sí/No
Checks ejecutados: quality-sonarqube, k6-load-tests
Artefactos generados: coverage-lcov, k6-summary-smoke
Pendiente: configurar SONAR_TOKEN y SONAR_HOST_URL si aún no existen
```
