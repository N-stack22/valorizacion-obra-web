import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
const compareText = (left: string, right: string) => left.localeCompare(right);

function readMigrations() {
  return readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort(compareText)
    .map((name) => readFileSync(path.join(migrationsDir, name), "utf8"))
    .join("\n");
}

describe("seguridad y RLS - caja blanca", () => {
  const sql = readMigrations();

  it("protege el bucket expedientes por proyecto y rol", () => {
    expect(sql).toContain("bucket_id = 'expedientes'");
    expect(sql).toMatch(/storage\.objects[\s\S]+public\.can_view_project/);
    expect(sql).toMatch(/storage\.objects[\s\S]+public\.can_edit_project_data/);
  });

  it("usa el project_id del primer segmento del path del objeto", () => {
    const projectIdFromPath = /\(\(storage\.foldername\(name\)\)\[1\]\)::uuid/;

    expect(sql).toMatch(projectIdFromPath);
    expect(sql).toContain("{projectId}/{periodId}/{filename}.pdf");
  });

  it("define politicas CRUD para expedientes", () => {
    for (const policy of [
      "expedientes_insert_project_editors",
      "expedientes_select_project_members",
      "expedientes_update_project_editors",
      "expedientes_delete_project_editors",
    ]) {
      expect(sql).toContain(`CREATE POLICY "${policy}"`);
      expect(sql).toContain(`DROP POLICY IF EXISTS "${policy}"`);
    }
  });
});
