// Configuracion comun para pruebas k6 del Sistema Web de Valorizacion de Obra.
// No colocar credenciales reales en este archivo. Usar variables de entorno.

export const BASE_URL = (__ENV.BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
export const SUPABASE_URL = (__ENV.SUPABASE_URL || '').replace(/\/$/, '');
export const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || '';
export const K6_AUTH_TOKEN = __ENV.K6_AUTH_TOKEN || '';

export const THINK_TIME_MIN = Number(__ENV.THINK_TIME_MIN || 0.5);
export const THINK_TIME_MAX = Number(__ENV.THINK_TIME_MAX || 2.0);

export const DEFAULT_THRESHOLDS = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<3000', 'p(99)<5000'],
  checks: ['rate>0.99'],
  iteration_duration: ['p(95)<6000'],
};

export const PAGE_PATHS = [
  '/',
  '/login',
  '/app/dashboard',
  '/app/projects',
  '/app/budgets',
  '/app/metrados',
  '/app/valuations',
  '/app/reajustes',
  '/app/expediente',
  '/app/reports',
];

export const SMOKE_SCENARIO = {
  executor: 'constant-vus',
  vus: 1,
  duration: '1m',
  gracefulStop: '20s',
};

export const LOAD_STAGES = [
  { duration: '2m', target: 5 },
  { duration: '4m', target: 25 },
  { duration: '4m', target: 25 },
  { duration: '2m', target: 0 },
];

export const STRESS_STAGES = [
  { duration: '2m', target: 25 },
  { duration: '3m', target: 50 },
  { duration: '3m', target: 75 },
  { duration: '2m', target: 0 },
];

export const SPIKE_STAGES = [
  { duration: '30s', target: 5 },
  { duration: '30s', target: 60 },
  { duration: '1m', target: 60 },
  { duration: '30s', target: 5 },
  { duration: '30s', target: 0 },
];

export const SOAK_SCENARIO = {
  executor: 'constant-vus',
  vus: 10,
  duration: '30m',
  gracefulStop: '1m',
};
