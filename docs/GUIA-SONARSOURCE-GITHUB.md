# Guía rápida: SonarSource / SonarQube en GitHub Actions

Repositorio destino:

```txt
https://github.com/N-stack22/valorizacion-obra-web.git
```

Este proyecto queda preparado para ejecutar análisis de calidad con SonarSource desde GitHub Actions mediante el workflow:

```txt
.github/workflows/quality-sonarqube.yml
```

## 1. Qué ejecuta el workflow

En cada `push`, `pull_request` o ejecución manual, GitHub Actions realiza:

```bash
npm ci --no-audit
npm run quality:preflight
npm run test:coverage
npm run build
SonarSource/sonarqube-scan-action@v6
```

El análisis usa:

```txt
sonar-project.properties
coverage/lcov.info
```

La cobertura se genera con Vitest/V8 en formato LCOV.

## 2. Configuración principal de Sonar

Archivo:

```txt
sonar-project.properties
```

Valores actuales:

```properties
sonar.organization=n-stack22
sonar.projectKey=n-stack22_valorizacion-obra-web
sonar.sources=src,supabase
sonar.tests=src,e2e,tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.qualitygate.wait=true
```

Si SonarSource/SonarCloud crea otro identificador de organización o de proyecto, se debe cambiar solamente:

```properties
sonar.organization=...
sonar.projectKey=...
```

## 3. Secrets necesarios en GitHub

Ir a:

```txt
Repository > Settings > Secrets and variables > Actions > New repository secret
```

Crear:

```txt
SONAR_TOKEN
```

Para SonarQube Server autohospedado, crear también:

```txt
SONAR_HOST_URL
```

Para SonarQube Cloud normalmente basta con `SONAR_TOKEN`, porque el servidor cloud se resuelve desde la configuración del proyecto.

## 4. Variables que no deben subirse al repositorio

No subir en archivos `.env`, documentación o código:

```txt
SONAR_TOKEN
SONAR_HOST_URL con credenciales
claves de Supabase
claves de Claude
credenciales de Railway
```

## 5. Cómo ejecutar en GitHub

Después de subir la rama:

```txt
GitHub > Actions > SonarSource Quality Gate > Run workflow
```

También se ejecutará automáticamente en:

```txt
push a main, develop, leonardo/**, feature/**
pull request hacia main o develop
```

## 6. Evidencias generadas

El workflow sube el artefacto:

```txt
coverage-lcov
```

Ese artefacto contiene:

```txt
coverage/lcov.info
coverage/**/*.html
coverage/**/*.json
```

## 7. Si falla el análisis

Causas frecuentes:

| Falla | Solución |
|---|---|
| Falta `SONAR_TOKEN` | Crear el secret en GitHub. |
| `Project not found` | Revisar `sonar.organization` y `sonar.projectKey`. |
| No aparece cobertura | Verificar que `npm run test:coverage` genere `coverage/lcov.info`. |
| Falla Quality Gate | Revisar bugs, vulnerabilidades, duplicación o cobertura en SonarSource. |
| Falla `npm ci` | Regenerar `package-lock.json` con `npm install --package-lock-only`. |

## 8. Comandos locales útiles

```bash
npm run quality:preflight
npm run test:coverage
npm run build
```

El análisis real de SonarSource debe ejecutarse en GitHub Actions con el `SONAR_TOKEN` configurado como secret.
