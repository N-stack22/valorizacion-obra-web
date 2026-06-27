#!/usr/bin/env bash
set -euo pipefail

SCENARIO="${1:-smoke}"
SCRIPT="tests/k6/scenarios/${SCENARIO}.js"

if [[ ! -f "$SCRIPT" ]]; then
  echo "Escenario k6 no encontrado: $SCRIPT" >&2
  echo "Escenarios disponibles: smoke, load, stress, spike, soak, supabase-read" >&2
  exit 1
fi

if command -v k6 >/dev/null 2>&1; then
  echo "Ejecutando k6 local: $SCRIPT"
  k6 run "$SCRIPT"
  exit $?
fi

if command -v docker >/dev/null 2>&1; then
  echo "k6 no esta instalado localmente; usando Docker grafana/k6:latest"
  docker run --rm --network host \
    -e BASE_URL="${BASE_URL:-http://127.0.0.1:5173}" \
    -e SUPABASE_URL="${SUPABASE_URL:-}" \
    -e SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}" \
    -e K6_AUTH_TOKEN="${K6_AUTH_TOKEN:-}" \
    -e THINK_TIME_MIN="${THINK_TIME_MIN:-0.5}" \
    -e THINK_TIME_MAX="${THINK_TIME_MAX:-2}" \
    -e VUS="${VUS:-5}" \
    -e DURATION="${DURATION:-2m}" \
    -v "${PWD}:/workspace" \
    -w /workspace \
    grafana/k6:latest run "$SCRIPT"
  exit $?
fi

echo "No se encontro k6 ni Docker. Instale k6 o ejecute el workflow de GitHub Actions." >&2
exit 127
