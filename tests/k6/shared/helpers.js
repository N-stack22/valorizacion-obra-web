import { check, group, sleep } from "k6";
import exec from "k6/execution";
import http from "k6/http";
import {
  BASE_URL,
  PAGE_PATHS,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  K6_AUTH_TOKEN,
  THINK_TIME_MIN,
  THINK_TIME_MAX,
} from "./config.js";

function randomBetween(min, max) {
  const seed = `${exec.vu.idInTest}:${exec.vu.iterationInInstance}:${exec.scenario.iterationInTest}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10_000;
  }
  return min + (hash / 10_000) * (max - min);
}

export function thinkTime() {
  sleep(randomBetween(THINK_TIME_MIN, THINK_TIME_MAX));
}

export function browserHeaders(extra = {}) {
  const authHeaders = K6_AUTH_TOKEN ? { Authorization: `Bearer ${K6_AUTH_TOKEN}` } : {};

  return {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "User-Agent": "k6-valorizacion-obra/1.0",
    ...authHeaders,
    ...extra,
  };
}

export function apiHeaders(extra = {}) {
  const supabaseHeaders = SUPABASE_ANON_KEY
    ? {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${K6_AUTH_TOKEN || SUPABASE_ANON_KEY}`,
      }
    : {};

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...supabaseHeaders,
    ...extra,
  };
}

export function requestPage(path, expectedName = path) {
  const url = `${BASE_URL}${path}`;
  const response = http.get(url, {
    headers: browserHeaders(),
    tags: { name: `GET ${expectedName}` },
  });

  check(response, {
    "pagina sin error 5xx": (r) => r.status < 500,
    "respuesta con contenido": (r) => Boolean(r.body && r.body.length > 0),
  });

  return response;
}

export function requestCorePages() {
  group("navegacion SPA principal", () => {
    for (const path of PAGE_PATHS) {
      requestPage(path);
      thinkTime();
    }
  });
}

export function requestSupabaseReadProbe() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  const response = http.get(`${SUPABASE_URL}/rest/v1/projects?select=id,name,status&limit=1`, {
    headers: apiHeaders({ Prefer: "count=exact" }),
    tags: { name: "GET Supabase projects read probe" },
  });

  check(response, {
    "supabase responde sin 5xx": (r) => r.status < 500,
    "supabase no expone error interno": (r) =>
      !String(r.body || "")
        .toLowerCase()
        .includes("stack"),
  });

  return response;
}

export function requestSupabaseAuthSettingsProbe() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  const response = http.get(`${SUPABASE_URL}/auth/v1/settings`, {
    headers: apiHeaders(),
    tags: { name: "GET Supabase auth settings probe" },
  });

  check(response, {
    "auth settings sin error 5xx": (r) => r.status < 500,
  });

  return response;
}

export function runReadOnlyValuationJourney() {
  group("flujo lectura valorizacion obra", () => {
    requestPage("/");
    thinkTime();
    requestPage("/login");
    thinkTime();
    requestPage("/app/dashboard");
    thinkTime();
    requestPage("/app/projects");
    thinkTime();
    requestPage("/app/budgets");
    thinkTime();
    requestPage("/app/metrados");
    thinkTime();
    requestPage("/app/valuations");
    thinkTime();
    requestPage("/app/reajustes");
    thinkTime();
    requestPage("/app/expediente");
    thinkTime();
    requestSupabaseAuthSettingsProbe();
    requestSupabaseReadProbe();
  });
}
