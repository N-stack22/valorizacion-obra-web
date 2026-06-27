import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const checkK6 = args.size === 0 || args.has('--k6');
const checkSonar = args.size === 0 || args.has('--sonar');

const failures = [];
const required = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Falta archivo requerido: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
};

if (checkSonar) {
  const sonar = required('sonar-project.properties');
  for (const token of [
    'sonar.projectKey=',
    'sonar.sources=src',
    'sonar.tests=',
    'sonar.test.inclusions=',
    'sonar.javascript.lcov.reportPaths=coverage/lcov.info',
    'sonar.qualitygate.wait=false',
  ]) {
    if (sonar && !sonar.includes(token)) failures.push(`sonar-project.properties no contiene: ${token}`);
  }

  const workflow = required('.github/workflows/quality-sonarqube.yml');
  for (const token of [
    'SonarSource/sonarqube-scan-action@v6',
    'SONAR_TOKEN',
    'coverage/lcov.info',
    'npm run test:coverage',
    'npm run build',
  ]) {
    if (workflow && !workflow.includes(token)) failures.push(`quality-sonarqube.yml no contiene: ${token}`);
  }
}

if (checkK6) {
  const config = required('tests/k6/shared/config.js');
  for (const token of [
    "http_req_failed: ['rate<0.01']",
    "http_req_duration: ['p(95)<3000', 'p(99)<5000']",
    'LOAD_STAGES',
    'STRESS_STAGES',
    'SPIKE_STAGES',
    'SOAK_SCENARIO',
  ]) {
    if (config && !config.includes(token)) failures.push(`tests/k6/shared/config.js no contiene: ${token}`);
  }

  for (const scenario of ['smoke', 'load', 'stress', 'spike', 'soak', 'supabase-read']) {
    required(`tests/k6/scenarios/${scenario}.js`);
  }
  required('scripts/run-k6.mjs');
  required('.github/workflows/k6-load-tests.yml');
}

const packageJson = JSON.parse(required('package.json') || '{}');
const scripts = packageJson.scripts || {};
for (const scriptName of ['test:coverage', 'k6:smoke', 'k6:load', 'k6:stress', 'sonar:scan', 'sonar:local', 'quality:preflight']) {
  if (!scripts[scriptName]) failures.push(`package.json no define script: ${scriptName}`);
}

if (failures.length > 0) {
  console.error('Verificacion de k6/SonarQube fallida:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Configuracion k6 y SonarQube verificada correctamente.');
