import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const scenario = process.argv[2] || 'smoke';
const script = path.join('tests', 'k6', 'scenarios', `${scenario}.js`);
const availableScenarios = ['smoke', 'load', 'stress', 'spike', 'soak', 'supabase-read'];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) return env;

      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) return env;

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key) env[key] = value;
      return env;
    }, {});
}

function commandExists(command, args = ['--version']) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'ignore',
    shell: os.platform() === 'win32',
  });

  return result.status === 0;
}

function dockerBaseUrl(baseUrl) {
  if (os.platform() !== 'win32' && os.platform() !== 'darwin') return baseUrl;

  return baseUrl
    .replace('http://localhost:', 'http://host.docker.internal:')
    .replace('https://localhost:', 'https://host.docker.internal:')
    .replace('http://127.0.0.1:', 'http://host.docker.internal:')
    .replace('https://127.0.0.1:', 'https://host.docker.internal:');
}

if (!fs.existsSync(path.join(root, script))) {
  console.error(`Escenario k6 no encontrado: ${script}`);
  console.error(`Escenarios disponibles: ${availableScenarios.join(', ')}`);
  process.exit(1);
}

const envFile = path.join(root, '.env.k6.local');
const env = {
  ...parseEnvFile(envFile),
  ...process.env,
};

env.BASE_URL = env.BASE_URL || 'http://127.0.0.1:5173';
env.THINK_TIME_MIN = env.THINK_TIME_MIN || '0.5';
env.THINK_TIME_MAX = env.THINK_TIME_MAX || '2';
env.VUS = env.VUS || '5';
env.DURATION = env.DURATION || '2m';

if (fs.existsSync(envFile)) {
  console.log('Variables k6 cargadas desde .env.k6.local');
}

if (commandExists('k6')) {
  console.log(`Ejecutando k6 local: ${script}`);
  const result = spawnSync('k6', ['run', script], {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: os.platform() === 'win32',
  });
  process.exit(result.status ?? 1);
}

if (commandExists('docker', ['--version'])) {
  console.log(`k6 no esta instalado localmente; usando Docker grafana/k6:latest`);
  const dockerEnv = {
    ...env,
    BASE_URL: dockerBaseUrl(env.BASE_URL),
  };

  if (dockerEnv.BASE_URL !== env.BASE_URL) {
    console.log(`BASE_URL para Docker: ${dockerEnv.BASE_URL}`);
  }

  const dockerArgs = [
    'run',
    '--rm',
    '-e',
    `BASE_URL=${dockerEnv.BASE_URL}`,
    '-e',
    `SUPABASE_URL=${dockerEnv.SUPABASE_URL || ''}`,
    '-e',
    `SUPABASE_ANON_KEY=${dockerEnv.SUPABASE_ANON_KEY || ''}`,
    '-e',
    `K6_AUTH_TOKEN=${dockerEnv.K6_AUTH_TOKEN || ''}`,
    '-e',
    `THINK_TIME_MIN=${dockerEnv.THINK_TIME_MIN}`,
    '-e',
    `THINK_TIME_MAX=${dockerEnv.THINK_TIME_MAX}`,
    '-e',
    `VUS=${dockerEnv.VUS}`,
    '-e',
    `DURATION=${dockerEnv.DURATION}`,
    '-v',
    `${root.replace(/\\/g, '/')}:/workspace`,
    '-w',
    '/workspace',
    'grafana/k6:latest',
    'run',
    script.replace(/\\/g, '/'),
  ];

  const result = spawnSync('docker', dockerArgs, {
    cwd: root,
    env: dockerEnv,
    stdio: 'inherit',
    shell: false,
  });
  process.exit(result.status ?? 1);
}

console.error('No se encontro k6 ni Docker. Instale k6 o ejecute el workflow de GitHub Actions.');
process.exit(127);
