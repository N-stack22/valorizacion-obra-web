const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function readRequired(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Falta archivo requerido: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

const sonar = readRequired('sonar-project.properties');
const workflow = readRequired('.github/workflows/quality-sonarqube.yml');
const vitest = readRequired('vitest.config.ts');

const requiredSonarTokens = [
  'sonar.organization=',
  'sonar.projectKey=',
  'sonar.sources=src,supabase',
  'sonar.tests=src,e2e,tests',
  'sonar.javascript.lcov.reportPaths=coverage/lcov.info',
  'sonar.qualitygate.wait=true',
];

for (const token of requiredSonarTokens) {
  if (sonar && !sonar.includes(token)) {
    failures.push(`sonar-project.properties no contiene: ${token}`);
  }
}

const requiredWorkflowTokens = [
  'actions/checkout@v5',
  'actions/setup-node@v5',
  'actions/upload-artifact@v5',
  'SonarSource/sonarqube-scan-action@v6',
  'fetch-depth: 0',
  'npm ci --no-audit',
  'npm run test:coverage',
  'coverage/lcov.info',
  'SONAR_TOKEN',
];

for (const token of requiredWorkflowTokens) {
  if (workflow && !workflow.includes(token)) {
    failures.push(`quality-sonarqube.yml no contiene: ${token}`);
  }
}

for (const token of ['provider: "v8"', 'reporter: ["text", "text-summary", "json", "html", "lcov"]', 'reportsDirectory: "coverage"']) {
  if (vitest && !vitest.includes(token)) {
    failures.push(`vitest.config.ts no contiene: ${token}`);
  }
}

const pkg = JSON.parse(readRequired('package.json') || '{}');
const scripts = pkg.scripts || {};
for (const scriptName of ['test:coverage', 'sonar:verify', 'quality:preflight']) {
  if (!scripts[scriptName]) {
    failures.push(`package.json no define script: ${scriptName}`);
  }
}

if (failures.length > 0) {
  console.error('Verificacion SonarSource fallida:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Configuracion SonarSource/GitHub lista.');
