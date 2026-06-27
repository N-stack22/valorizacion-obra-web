# Sistema Web de Valorización de Obra

Proyecto preparado para subir a GitHub y ejecutar pruebas de calidad desde GitHub Actions con SonarSource/SonarQube Cloud.

## Pruebas y calidad incluidas

- Vitest con cobertura LCOV.
- SonarSource / SonarQube Cloud mediante `sonar-project.properties`.
- Quality Gate automático desde GitHub Actions.
- k6 para pruebas de carga y rendimiento.
- Evidencias descargables desde GitHub Actions.

## SonarSource en GitHub

El análisis usa estas propiedades principales:

```properties
sonar.organization=n-stack22
sonar.projectKey=n-stack22_valorizacion-obra-web
sonar.sources=src,supabase
sonar.tests=src,e2e,tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.qualitygate.wait=true
```

La cobertura se genera con:

```bash
npm run test:coverage
```

## Workflow principal

```txt
.github/workflows/quality-sonarqube.yml
```

Ese workflow ejecuta:

```bash
npm ci --no-audit
npm run quality:preflight
npm run test:coverage
npm run build
SonarSource/sonarqube-scan-action@v6
```

## Secrets requeridos

Configurar en GitHub:

```txt
Settings > Secrets and variables > Actions
```

Crear:

```txt
SONAR_TOKEN
```

Para SonarQube Server autohospedado, crear también:

```txt
SONAR_HOST_URL
```

Para SonarQube Cloud normalmente basta con `SONAR_TOKEN`.

## Guía de uso

```txt
docs/GUIA-SONARSOURCE-GITHUB.md
```

## Validación local

```bash
npm run quality:preflight
npm run test:coverage
npm run build
```

No subir `node_modules`, `coverage`, `dist`, `.env` ni tokens reales.
