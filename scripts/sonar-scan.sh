#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f sonar-project.properties ]]; then
  echo "No existe sonar-project.properties en la raiz del proyecto." >&2
  exit 1
fi

if [[ ! -f coverage/lcov.info ]]; then
  echo "No existe coverage/lcov.info. Ejecute: npm run test:coverage" >&2
  exit 1
fi

if command -v sonar-scanner >/dev/null 2>&1; then
  echo "Ejecutando sonar-scanner local"
  sonar-scanner "$@"
  exit $?
fi

if command -v docker >/dev/null 2>&1; then
  echo "sonar-scanner no esta instalado localmente; usando Docker sonarsource/sonar-scanner-cli"
  docker run --rm \
    -e SONAR_HOST_URL="${SONAR_HOST_URL:-}" \
    -e SONAR_TOKEN="${SONAR_TOKEN:-}" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli:latest "$@"
  exit $?
fi

echo "No se encontro sonar-scanner ni Docker. Use el workflow de GitHub Actions o instale SonarScanner." >&2
exit 127
