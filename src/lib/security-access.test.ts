import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");

function readMigrations() {
  return readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => readFileSync(path.join(migrationsDir, name), "utf8"))
    .join("\n");
}

describe("seguridad y RLS - caja blanca", () => {
  const sql = readMigrations();

  it("mantiene RLS habilitado en tablas criticas", () => {
    for (const table of [
      "profiles",
      "user_roles",
      "projects",
      "project_members",
      "budget_items",
      "valuation_periods",
      "metrado_lines",
      "valuation_deductions",
      "valuations",
      "valuation_lines",
      "liquidations",
      "expediente_documents",
    ]) {
      expect(sql).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`);
    }
  });

  it("centraliza permisos por helpers SECURITY DEFINER", () => {
    expect(sql).toMatch(/CREATE OR REPLACE FUNCTION public\.can_view_project\(_project_id UUID, _user_id UUID\)/);
    expect(sql).toMatch(/CREATE OR REPLACE FUNCTION public\.can_edit_project_data\(_project_id UUID, _user_id UUID\)/);
    expect(sql).toMatch(/CREATE OR REPLACE FUNCTION public\.can_review_project_data\(_project_id UUID, _user_id UUID\)/);
    expect(sql).toMatch(/SECURITY DEFINER/);
  });

  it("bloquea autoescalamiento de roles", () => {
    expect(sql).toContain("CREATE POLICY user_roles_no_self_escalation");
    expect(sql).toContain("CREATE POLICY user_global_roles_no_self_escalation");
    expect(sql).toMatch(/ON public\.user_roles[\s\S]+AS RESTRICTIVE[\s\S]+FOR INSERT TO authenticated/);
    expect(sql).toMatch(/ON public\.user_global_roles[\s\S]+AS RESTRICTIVE[\s\S]+FOR INSERT TO authenticated/);
  });

  it("exige ownership en inserts sensibles", () => {
    expect(sql).toMatch(/CREATE POLICY metrado_lines_insert_policy[\s\S]+created_by = auth\.uid\(\)/);
    expect(sql).toMatch(/CREATE POLICY deductions_insert_policy[\s\S]+created_by = auth\.uid\(\)/);
    expect(sql).toMatch(/CREATE POLICY reajustes_insert[\s\S]+created_by = auth\.uid\(\)/);
  });

  it("protege buckets por proyecto y rol", () => {
    for (const bucket of ["expedientes", "budget-imports", "project-documents"]) {
      expect(sql).toContain(`bucket_id = '${bucket}'`);
    }
    expect(sql).toMatch(/storage\.objects[\s\S]+public\.can_view_project/);
    expect(sql).toMatch(/storage\.objects[\s\S]+public\.can_edit_project_data/);
  });
});
