import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const plan = readFileSync(path.join(process.cwd(), "docs", "PLAN-PRUEBAS.md"), "utf8");
const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
  scripts: Record<string, string>;
};

describe("documentacion de pruebas", () => {
  it("mantiene las secciones requeridas del plan", () => {
    for (const section of [
      "# Plan de pruebas",
      "## Alcance",
      "## Reglas base",
      "## Matriz de pruebas",
      "## Cobertura por tecnica solicitada",
      "## Casos criticos",
      "## Pruebas manuales recomendadas",
      "## Criterios de salida",
    ]) {
      expect(plan).toContain(section);
    }
  });

  it("documenta categorias exigidas", () => {
    for (const category of [
      "Caja blanca",
      "Caja negra",
      "Seguridad",
      "Roles",
      "Volumen",
      "Estres",
      "Performance",
      "Usabilidad",
      "Instalacion",
      "Documentacion",
    ]) {
      expect(plan).toContain(category);
    }
  });

  it("expone scripts para ejecutar cada suite", () => {
    for (const script of [
      "test:security",
      "test:roles",
      "test:whitebox",
      "test:techniques",
      "test:blackbox",
      "test:volume",
      "test:stress",
      "test:performance",
      "test:usability",
      "test:installation",
      "test:docs",
    ]) {
      expect(packageJson.scripts).toHaveProperty(script);
      expect(plan).toContain(`npm run ${script}`);
    }
  });
});
