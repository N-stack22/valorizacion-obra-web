import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('implementacion de herramientas de calidad k6 y SonarQube', () => {
  it('incluye configuracion SonarQube con LCOV sin bloquear CI por Quality Gate inicial', () => {
    const sonar = read('sonar-project.properties');

    expect(sonar).toContain('sonar.projectKey=');
    expect(sonar).toContain('sonar.sources=src');
    expect(sonar).toContain('sonar.javascript.lcov.reportPaths=coverage/lcov.info');
    expect(sonar).toContain('sonar.qualitygate.wait=false');
  });

  it('incluye escenarios k6 para smoke, carga, estres, pico y resistencia', () => {
    const config = read('tests/k6/shared/config.js');

    expect(config).toContain('LOAD_STAGES');
    expect(config).toContain('STRESS_STAGES');
    expect(config).toContain('SPIKE_STAGES');
    expect(config).toContain('SOAK_SCENARIO');
    expect(config).toContain("http_req_failed: ['rate<0.01']");
    expect(config).toContain("http_req_duration: ['p(95)<3000', 'p(99)<5000']");

    for (const scenario of ['smoke', 'load', 'stress', 'spike', 'soak', 'supabase-read']) {
      expect(fs.existsSync(path.join(root, `tests/k6/scenarios/${scenario}.js`))).toBe(true);
    }
  });

  it('expone scripts npm para ejecutar calidad, k6 y SonarQube', () => {
    const packageJson = JSON.parse(read('package.json')) as { scripts: Record<string, string> };

    expect(packageJson.scripts['test:coverage']).toContain('vitest run');
    expect(packageJson.scripts['k6:load']).toContain('scripts/run-k6.mjs load');
    expect(packageJson.scripts['k6:stress']).toContain('scripts/run-k6.mjs stress');
    expect(packageJson.scripts['sonar:local']).toContain('scripts/sonar-scan.sh');
    expect(packageJson.scripts['quality:preflight']).toContain('verify-k6-sonar');
  });
});
