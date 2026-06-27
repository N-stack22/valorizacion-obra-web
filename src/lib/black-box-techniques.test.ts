import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import type { AppRole } from "./domain";
import {
  PUBLIC_USER_REGISTRATION_ENABLED,
  canCreateProjectWithRoles,
  canManageUsersWithRoles,
  canQueryEntity,
} from "./auth-policy";
import { detectBudgetWorkbook } from "./business";
import { computeLinePartial } from "./expediente";
import { validatePeriodOpening, type PeriodOpeningFailureReason } from "./period-policy";

function makeWorkbookFile(rows: (string | number | null)[][]): File {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Presupuesto");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return new File([buffer], "presupuesto.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

describe("caja negra - tecnicas solicitadas", () => {
  it("login y roles por clases de equivalencia", () => {
    const allowedProjectCreators: AppRole[][] = [["admin"], ["resident"]];
    const blockedProjectCreators: AppRole[][] = [[], ["assistant"], ["supervisor"], ["legal_representative"]];

    expect(PUBLIC_USER_REGISTRATION_ENABLED).toBe(false);
    allowedProjectCreators.forEach((roles) => expect(canCreateProjectWithRoles(roles)).toBe(true));
    blockedProjectCreators.forEach((roles) => expect(canCreateProjectWithRoles(roles)).toBe(false));

    expect(canManageUsersWithRoles({ appRoles: ["admin"] })).toBe(true);
    expect(canManageUsersWithRoles({ appRoles: ["resident"] })).toBe(false);
  });

  it("importacion de presupuesto por clases validas y no validas", async () => {
    const validFile = makeWorkbookFile([
      ["Item", "Descripcion", "Und.", "Metrado", "Precio Unitario", "Parcial"],
      ["01.01", "Excavacion", "m3", 12, 30, 360],
    ]);
    const invalidFile = makeWorkbookFile([
      ["texto", "sin", "estructura"],
      ["otro", "bloque", "libre"],
    ]);

    const valid = await detectBudgetWorkbook(validFile);
    const invalid = await detectBudgetWorkbook(invalidFile);

    expect(valid.rows).toHaveLength(1);
    expect(valid.rows[0]).toMatchObject({
      item_code: "01.01",
      description: "Excavacion",
      unit: "m3",
      base_quantity: 12,
      unit_price: 30,
      partial_amount: 360,
    });
    expect(invalid.rows).toHaveLength(0);
    expect(invalid.warnings.length).toBeGreaterThan(0);
  });

  it("registro de metrados por valores limite", () => {
    expect(computeLinePartial({ num_elements: 1, length: 1, width: 1, height: 1 })).toBe(1);
    expect(computeLinePartial({ num_elements: 0, length: 5, width: 2, height: 1 })).toBe(0);
    expect(computeLinePartial({ num_elements: 1, length: 0, width: 2, height: 1 })).toBe(0);
    expect(computeLinePartial({ num_elements: 1, length: 0.0001, width: 1, height: 1 })).toBeCloseTo(0.0001, 8);
  });

  it("apertura de periodo por tabla de decision", () => {
    const base: Parameters<typeof validatePeriodOpening>[0] = {
      hasProject: true,
      hasUser: true,
      hasBudgetItems: true,
      form: { number: 1, from: "2026-01-01", to: "2026-01-31" },
      periods: [],
      project: { start_date: "2026-01-01", planned_end_date: "2026-01-31" },
    };

    const cases: Array<{
      name: string;
      patch: Partial<Parameters<typeof validatePeriodOpening>[0]>;
      reason: "ok" | PeriodOpeningFailureReason;
    }> = [
      { name: "cumple todas las condiciones", patch: {}, reason: "ok" },
      { name: "sin presupuesto", patch: { hasBudgetItems: false }, reason: "missing_budget" },
      { name: "fechas invalidas", patch: { form: { number: 1, from: "x", to: "2026-01-31" } }, reason: "invalid_dates" },
      { name: "hasta antes de desde", patch: { form: { number: 1, from: "2026-01-31", to: "2026-01-01" } }, reason: "date_order" },
      { name: "antes del inicio del proyecto", patch: { form: { number: 1, from: "2025-12-31", to: "2026-01-15" } }, reason: "before_project_start" },
      { name: "fuera de tolerancia de fin", patch: { form: { number: 1, from: "2026-01-01", to: "2026-03-05" } }, reason: "after_project_end_tolerance" },
      {
        name: "no continua despues del periodo anterior",
        patch: {
          form: { number: 2, from: "2026-01-31", to: "2026-02-28" },
          periods: [{ period_number: 1, date_from: "2026-01-01", date_to: "2026-01-31" }],
        },
        reason: "not_after_previous_period",
      },
      {
        name: "se solapa con otro periodo",
        patch: {
          form: { number: 1, from: "2026-02-10", to: "2026-02-15" },
          periods: [{ period_number: 2, date_from: "2026-02-01", date_to: "2026-02-28" }],
        },
        reason: "overlap",
      },
    ];

    for (const row of cases) {
      const decision = validatePeriodOpening({ ...base, ...row.patch });
      expect(decision.reason, row.name).toBe(row.reason);
    }
  });

  it("consulta por entidad con acceso permitido y denegado", () => {
    expect(canQueryEntity({
      requestedEntityId: "entidad-1",
      allowedEntityIds: ["entidad-1", "entidad-2"],
    })).toBe(true);
    expect(canQueryEntity({
      requestedEntityId: "entidad-3",
      allowedEntityIds: ["entidad-1", "entidad-2"],
    })).toBe(false);
    expect(canQueryEntity({
      requestedEntityId: null,
      allowedEntityIds: ["entidad-1"],
    })).toBe(false);
    expect(canQueryEntity({
      isGlobalAdmin: true,
      requestedEntityId: "entidad-externa",
      allowedEntityIds: [],
    })).toBe(true);
  });
});
