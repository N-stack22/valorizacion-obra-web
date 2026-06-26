# Guía para ejecutar las pruebas desde GitHub Actions

## Objetivo

Esta guía explica cómo ejecutar directamente desde GitHub las pruebas de calidad, cobertura, SonarQube/SonarCloud y k6 del proyecto **Sistema Web de Valorización de Obra**. Para la configuración específica de `sonar.sources`, cobertura LCOV y secrets de Sonar, revisar también `docs/GUIA-SONARQUBE-GITHUB.md`.

El repositorio ya incluye los workflows necesarios en `.github/workflows/`:

| Workflow | Archivo | Cuándo se ejecuta | Qué valida |
|---|---|---|---|
| SonarSource Quality Gate | `.github/workflows/quality-sonarqube.yml` | `push`, `pull_request` y manual | Dependencias, preflight, pruebas con cobertura, build y análisis SonarQube/SonarCloud |
| k6 Load Tests | `.github/workflows/k6-load-tests.yml` | `push`, `pull_request` y manual | Pruebas k6 smoke automáticas y carga/estrés/pico/resistencia bajo ejecución manual |

## 1. Subir correctamente el proyecto a GitHub

Subir el contenido de la carpeta del proyecto, no el ZIP completo como archivo suelto.

La raíz del repositorio debe quedar así:

```txt
.github/workflows/quality-sonarqube.yml
.github/workflows/k6-load-tests.yml
sonar-project.properties
package.json
package-lock.json
src/
tests/k6/
scripts/
docs/
public/
```

## 2. Configurar Secrets en GitHub

Ir a:

```txt
Repositorio → Settings → Secrets and variables → Actions → New repository secret
```

### Secrets obligatorios para SonarQube/SonarCloud

| Secret | Valor |
|---|---|
| `SONAR_TOKEN` | Token generado en SonarQube/SonarCloud |
| `SONAR_HOST_URL` | URL del servidor SonarQube. Para SonarCloud no es obligatorio, aunque puede usarse `https://sonarcloud.io` |

### Secrets opcionales para k6 contra QA/Supabase

| Secret | Valor |
|---|---|
| `QA_SUPABASE_URL` | URL del proyecto Supabase de pruebas |
| `QA_SUPABASE_ANON_KEY` | Clave anon pública del ambiente QA |
| `QA_K6_AUTH_TOKEN` | Token temporal de QA para endpoints protegidos, si aplica |

No subir tokens reales al repositorio. Todo secreto debe ir en GitHub Secrets.

## 3. Ajustar SonarCloud si corresponde

En `sonar-project.properties`, cambiar el identificador del proyecto por el que use el equipo:

```properties
sonar.projectKey=n-stack22_valorizacion-obra-web
sonar.projectName=Sistema Web de Valorizacion de Obra
sonar.sources=src,supabase
```

Si se usa SonarCloud, añadir la organización:

```properties
sonar.organization=n-stack22
```

## 4. Ejecución automática

Al hacer `push` hacia `main`, `develop` o `leonardo/**`, o al abrir un `pull_request` hacia `main` o `develop`, GitHub ejecutará:

```txt
SonarSource Quality Gate
k6 Load Tests
```

En los eventos automáticos, k6 ejecuta por defecto el escenario `smoke` para evitar carga excesiva en cada commit.

## 5. Ejecutar k6 manualmente desde GitHub

Ir a:

```txt
Repositorio → Actions → k6 Load Tests → Run workflow
```

Elegir el escenario:

| Escenario | Uso recomendado |
|---|---|
| `smoke` | Verificar que la app responde |
| `load` | Carga esperada |
| `stress` | Límite gradual |
| `spike` | Pico repentino |
| `soak` | Resistencia de 30 minutos |
| `supabase-read` | Lectura no destructiva sobre Supabase QA |

En `base_url`, colocar la URL del ambiente QA o producción controlada, por ejemplo:

```txt
https://tu-app-qa.com
```

Si `base_url` queda vacío, el workflow levanta un preview local con Vite dentro del runner de GitHub.

## 6. Evidencias generadas por GitHub

Los workflows publican artefactos descargables desde cada ejecución:

| Artefacto | Contenido |
|---|---|
| `coverage-lcov` | Cobertura generada por Vitest para Sonar |
| `k6-summary-*` | Resumen JSON de k6 por escenario ejecutado |

Estas evidencias pueden anexarse al informe o al plan de pruebas.

## 7. Reglas recomendadas para proteger la rama `main`

Ir a:

```txt
Repositorio → Settings → Branches → Add branch protection rule
```

Activar:

- Require a pull request before merging.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Bloquear merge si fallan los workflows de calidad y k6 smoke.

Checks sugeridos:

```txt
Vitest coverage, build y SonarSource
Pruebas de carga con k6
```

## 8. Comandos equivalentes en local

```bash
npm ci
npm run quality:preflight
npm run test:coverage
npm run build
npm run k6:smoke
npm run k6:load
```

## 9. Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| Falla Sonar por token | No se configuró `SONAR_TOKEN` | Crear el secret en GitHub |
| Sonar no encuentra proyecto | `sonar.projectKey` no coincide | Cambiar el projectKey en `sonar-project.properties` |
| k6 no puede consultar QA | `base_url` incorrecta o ambiente caído | Verificar URL y despliegue QA |
| k6 falla con rutas protegidas | No hay token QA | Configurar `QA_K6_AUTH_TOKEN` o limitar escenario a rutas públicas |
| `npm ci` falla | `package-lock.json` desactualizado | Ejecutar `npm install` localmente y subir el lockfile actualizado |

---

## Sección adicional: SonarSource listo para GitHub

El proyecto incluye un workflow específico para GitHub Actions:

```txt
.github/workflows/quality-sonarqube.yml
```

Este workflow ejecuta pruebas unitarias, genera cobertura LCOV, compila el proyecto y ejecuta la acción oficial:

```txt
SonarSource/sonarqube-scan-action@v6
```

La configuración principal se encuentra en:

```txt
sonar-project.properties
```

La propiedad correcta para indicar el código fuente es:

```properties
sonar.sources=src,supabase
```

No se debe usar `sonarqube.source`. Si SonarCloud solicita organización, configurar:

```properties
sonar.organization=TU_ORGANIZACION_SONARCLOUD
```

Secrets requeridos en GitHub Actions:

```txt
SONAR_TOKEN
SONAR_HOST_URL
```

`SONAR_HOST_URL` solo es obligatorio si se usa SonarQube Server autohospedado. Para SonarCloud normalmente basta con `SONAR_TOKEN`.

Para SonarCloud, `SONAR_HOST_URL` puede ser `https://sonarcloud.io`.

## Guía específica de SonarSource

Para el análisis de calidad en GitHub con SonarSource/SonarQube Cloud, revisar también:

```txt
docs/GUIA-SONARSOURCE-GITHUB.md
```
