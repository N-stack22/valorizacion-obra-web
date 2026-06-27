import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const e2eSpec = readFileSync(path.join(process.cwd(), "e2e", "security-auth.spec.ts"), "utf8");
const testPlan = readFileSync(path.join(process.cwd(), "docs", "PLAN-PRUEBAS.md"), "utf8");

describe("usabilidad - cobertura declarada", () => {
  it("mantiene pruebas e2e para login publico y mobile", () => {
    expect(e2eSpec).toContain("login no ofrece registro publico");
    expect(e2eSpec).toContain("login mobile no genera overflow horizontal");
    expect(e2eSpec).toContain("input[type=\"email\"]");
    expect(e2eSpec).toContain("input[type=\"password\"]");
  });

  it("documenta revisiones manuales de viewport y mensajes", () => {
    expect(testPlan).toContain("390px");
    expect(testPlan).toContain("1920px");
    expect(testPlan).toContain("mensajes de error");
  });
});
