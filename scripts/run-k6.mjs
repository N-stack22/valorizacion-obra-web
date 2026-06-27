import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const availableScenarios = ["smoke", "load", "stress", "spike", "soak", "supabase-read"];
const scenario = normalizeScenario(process.argv[2] ?? "smoke");
const script = path.join("tests", "k6", "scenarios", `${scenario}.js`);
const scriptPath = path.join(root, script);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalizeScenario(value) {
  if (availableScenarios.includes(value)) return value;
  fail(`Escenario k6 no permitido: ${value}`);
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((env, rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) return env;

      const separatorIndex = line.indexOf("=");
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

function assertPlainEnvValue(name, value) {
  const text = String(value ?? "");
  if (/[\r\n\0]/.test(text)) {
    fail(`Variable ${name} contiene caracteres no permitidos.`);
  }
  return text;
}

function normalizeHttpUrl(name, value, fallback = "") {
  const raw = assertPlainEnvValue(name, value || fallback);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      fail(`Variable ${name} debe usar http o https.`);
    }
    const text = url.toString();
    return text.endsWith("/") ? text.slice(0, -1) : text;
  } catch {
    fail(`Variable ${name} no es una URL valida.`);
  }
}

function normalizePositiveNumber(name, value, fallback, integer = false) {
  const raw = assertPlainEnvValue(name, value || fallback);
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0 || (integer && !Number.isInteger(parsed))) {
    fail(`Variable ${name} debe ser un numero positivo${integer ? " entero" : ""}.`);
  }
  return raw;
}

function normalizeDuration(name, value, fallback) {
  const raw = assertPlainEnvValue(name, value || fallback);
  if (!/^\d+(?:ms|s|m|h)$/.test(raw)) {
    fail(`Variable ${name} debe tener formato como 30s, 2m o 1h.`);
  }
  return raw;
}

function buildK6Env(rawEnv) {
  return {
    BASE_URL: normalizeHttpUrl("BASE_URL", rawEnv.BASE_URL, "http://127.0.0.1:5173"),
    SUPABASE_URL: normalizeHttpUrl("SUPABASE_URL", rawEnv.SUPABASE_URL),
    SUPABASE_ANON_KEY: assertPlainEnvValue("SUPABASE_ANON_KEY", rawEnv.SUPABASE_ANON_KEY),
    K6_AUTH_TOKEN: assertPlainEnvValue("K6_AUTH_TOKEN", rawEnv.K6_AUTH_TOKEN),
    THINK_TIME_MIN: normalizePositiveNumber("THINK_TIME_MIN", rawEnv.THINK_TIME_MIN, "0.5"),
    THINK_TIME_MAX: normalizePositiveNumber("THINK_TIME_MAX", rawEnv.THINK_TIME_MAX, "2"),
    VUS: normalizePositiveNumber("VUS", rawEnv.VUS, "5", true),
    DURATION: normalizeDuration("DURATION", rawEnv.DURATION, "2m"),
  };
}

function fixedSearchDirs() {
  if (os.platform() === "win32") {
    return [
      "C:\\Program Files\\Grafana Labs\\k6",
      "C:\\Program Files\\Docker\\Docker\\resources\\bin",
      "C:\\ProgramData\\chocolatey\\bin",
      "C:\\Windows\\System32",
    ];
  }
  return ["/usr/local/bin", "/usr/bin", "/bin"];
}

function executableNames(command) {
  if (os.platform() !== "win32") return [command];
  return [`${command}.exe`, `${command}.cmd`, `${command}.bat`, command];
}

function findExecutable(command) {
  for (const directory of fixedSearchDirs()) {
    for (const executableName of executableNames(command)) {
      const candidate = path.join(directory, executableName);
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      } catch {
        // Keep searching fixed tool directories.
      }
    }
  }
  return null;
}

function childProcessEnv(extraEnv) {
  const env = { ...extraEnv };
  for (const key of [
    "HOME",
    "USERPROFILE",
    "APPDATA",
    "LOCALAPPDATA",
    "DOCKER_HOST",
    "DOCKER_CONFIG",
  ]) {
    const value = process.env[key];
    if (value) env[key] = assertPlainEnvValue(key, value);
  }
  if (os.platform() === "win32") {
    env.SystemRoot = "C:\\Windows";
    env.ComSpec = "C:\\Windows\\System32\\cmd.exe";
  }
  return env;
}

function commandExists(command, args = ["--version"]) {
  const executable = findExecutable(command);
  if (!executable) return null;

  const result = spawnSync(executable, args, {
    cwd: root,
    env: childProcessEnv({}),
    stdio: "ignore",
    shell: false,
  });

  return result.status === 0 ? executable : null;
}

function dockerBaseUrl(baseUrl) {
  if (os.platform() !== "win32" && os.platform() !== "darwin") return baseUrl;

  return baseUrl
    .replace("http://localhost:", "http://host.docker.internal:")
    .replace("https://localhost:", "https://host.docker.internal:")
    .replace("http://127.0.0.1:", "http://host.docker.internal:")
    .replace("https://127.0.0.1:", "https://host.docker.internal:");
}

if (!fs.existsSync(scriptPath)) {
  console.error(`Escenario k6 no encontrado: ${script}`);
  console.error(`Escenarios disponibles: ${availableScenarios.join(", ")}`);
  process.exit(1);
}

const envFile = path.join(root, ".env.k6.local");
const env = buildK6Env({
  ...parseEnvFile(envFile),
  ...process.env,
});

if (fs.existsSync(envFile)) {
  console.log("Variables k6 cargadas desde .env.k6.local");
}

const k6Executable = commandExists("k6");
if (k6Executable) {
  console.log(`Ejecutando k6 local: ${script}`);
  const result = spawnSync(k6Executable, ["run", script], {
    cwd: root,
    env: childProcessEnv(env),
    stdio: "inherit",
    shell: false,
  });
  process.exit(result.status ?? 1);
}

const dockerExecutable = commandExists("docker", ["--version"]);
if (dockerExecutable) {
  console.log("k6 no esta instalado localmente; usando Docker grafana/k6:latest");
  const dockerEnv = {
    ...env,
    BASE_URL: dockerBaseUrl(env.BASE_URL),
  };

  if (dockerEnv.BASE_URL !== env.BASE_URL) {
    console.log(`BASE_URL para Docker: ${dockerEnv.BASE_URL}`);
  }

  const dockerArgs = [
    "run",
    "--rm",
    "-e",
    `BASE_URL=${dockerEnv.BASE_URL}`,
    "-e",
    `SUPABASE_URL=${dockerEnv.SUPABASE_URL}`,
    "-e",
    `SUPABASE_ANON_KEY=${dockerEnv.SUPABASE_ANON_KEY}`,
    "-e",
    `K6_AUTH_TOKEN=${dockerEnv.K6_AUTH_TOKEN}`,
    "-e",
    `THINK_TIME_MIN=${dockerEnv.THINK_TIME_MIN}`,
    "-e",
    `THINK_TIME_MAX=${dockerEnv.THINK_TIME_MAX}`,
    "-e",
    `VUS=${dockerEnv.VUS}`,
    "-e",
    `DURATION=${dockerEnv.DURATION}`,
    "-v",
    `${root.replaceAll("\\", "/")}:/workspace`,
    "-w",
    "/workspace",
    "grafana/k6:latest",
    "run",
    script.replaceAll("\\", "/"),
  ];

  const result = spawnSync(dockerExecutable, dockerArgs, {
    cwd: root,
    env: childProcessEnv(dockerEnv),
    stdio: "inherit",
    shell: false,
  });
  process.exit(result.status ?? 1);
}

console.error("No se encontro k6 ni Docker. Instale k6 o ejecute el workflow de GitHub Actions.");
process.exit(127);
