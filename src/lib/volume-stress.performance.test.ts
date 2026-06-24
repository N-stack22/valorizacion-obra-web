import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";

import {
  buildValuationTable,
  computeLinePartial,
  totals,
  type MetradoLine,
} from "./expediente";
import type { BudgetItemRow } from "./domain";

function makeItem(index: number): BudgetItemRow {
  const code = `${String(Math.floor(index / 100) + 1).padStart(2, "0")}.${String(index % 100).padStart(2, "0")}`;
  return {
    id: `item-${index}`,
    project_id: "project-volume",
    item_code: code,
    description: `Partida ${code}`,
    unit: index % 3 === 0 ? "m3" : "m2",
    base_quantity: 1_000 + (index % 17),
    unit_price: 10 + (index % 23),
    partial_amount: (1_000 + (index % 17)) * (10 + (index % 23)),
    category: "obra",
    sort_order: index,
    budget_import_id: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    parent_item_code: null,
    hierarchy_level: 1,
  } as BudgetItemRow;
}

function makeLine(index: number, itemCount: number, partial: number): MetradoLine {
  return {
    id: `line-${index}`,
    item_id: `item-${index % itemCount}`,
    period_id: "period-volume",
    group_label: null,
    location_ref: null,
    description: `Linea ${index}`,
    num_elements: 1,
    length: null,
    width: null,
    height: null,
    formula: null,
    partial,
    observation: null,
  };
}

describe("volumen, estres y performance", () => {
  it("procesa miles de lineas de metrado sin perder consistencia", () => {
    const itemCount = 1_200;
    const lineCount = 12_000;
    const items = Array.from({ length: itemCount }, (_, index) => makeItem(index));
    const previousLines = Array.from({ length: lineCount / 2 }, (_, index) => makeLine(index, itemCount, 0.5));
    const currentLines = Array.from({ length: lineCount / 2 }, (_, index) => makeLine(index + lineCount, itemCount, 0.75));

    const startedAt = performance.now();
    const rows = buildValuationTable({ items, previousLines, currentLines });
    const summary = totals(rows);
    const durationMs = performance.now() - startedAt;

    expect(rows).toHaveLength(itemCount);
    expect(summary.current).toBeGreaterThan(0);
    expect(summary.accum).toBeGreaterThan(summary.current);
    expect(Number.isFinite(summary.base)).toBe(true);
    expect(durationMs).toBeLessThan(5_000);
  });

  it("resiste formulas invalidas o maliciosas sin ejecutar codigo externo", () => {
    const unsafeInputs = [
      "process.exit()",
      "globalThis.alert(1)",
      "constructor.constructor('return process')()",
      "L; throw new Error('boom')",
      "1 / 0",
      "Math.max(L, A)",
    ];

    for (const formula of unsafeInputs) {
      expect(
        computeLinePartial({
          num_elements: 2,
          length: 3,
          width: 4,
          height: null,
          formula,
        }),
      ).toBe(24);
    }
  });

  it("mantiene estable el calculo bajo ejecuciones repetidas", () => {
    const items = Array.from({ length: 250 }, (_, index) => makeItem(index));
    const previousLines = Array.from({ length: 1_000 }, (_, index) => makeLine(index, items.length, 1));
    const currentLines = Array.from({ length: 1_000 }, (_, index) => makeLine(index + 1_000, items.length, 2));

    const startedAt = performance.now();
    let checksum = 0;
    for (let attempt = 0; attempt < 80; attempt++) {
      checksum += totals(buildValuationTable({ items, previousLines, currentLines })).current;
    }
    const durationMs = performance.now() - startedAt;

    expect(checksum).toBeGreaterThan(0);
    expect(durationMs).toBeLessThan(5_000);
  });
});
