import { describe, expect, it } from "vitest";

import {
  buildValuationTable,
  computeLinePartial,
  getMetradoExcess,
  isMetradoWithinContract,
  totals,
  type MetradoLine,
} from "./expediente";
import { canCreateProjectWithRoles } from "./auth-policy";
import { calcReajuste, isFormulaBalanced, type Monomio } from "./reajuste";
import { canUserPerform, getAvailableTransitions, getWorkflowTransitions } from "./workflow";
import { validatePeriodOpening } from "./period-policy";
import { computeValuationBreakdown } from "./valuation-breakdown";
import type { BudgetItemRow } from "./domain";
import type { DraftContext } from "./ai/types";
import {
  DRAFT_PROMPT_VERSION,
  HUMAN_REVIEW_REQUIRED,
  SYSTEM_PROMPT,
  buildDraftControlMetadata,
} from "./ai/prompt";
import { buildClaudeRequestBody } from "./ai/providers/claude.server";

function budgetItem(patch: Partial<BudgetItemRow>): BudgetItemRow {
  return {
    id: "item-1",
    project_id: "project-1",
    import_id: null,
    item_code: "01.01",
    description: "Concreto",
    unit: "m3",
    base_quantity: 100,
    unit_price: 12.5,
    partial_amount: 1250,
    hierarchy_level: 2,
    parent_item_code: "01",
    sort_order: 1,
    category: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...patch,
  } as BudgetItemRow;
}

function metradoLine(patch: Partial<MetradoLine>): MetradoLine {
  return {
    id: "line-1",
    item_id: "item-1",
    period_id: "period-1",
    group_label: null,
    location_ref: null,
    description: null,
    num_elements: null,
    length: null,
    width: null,
    height: null,
    formula: null,
    partial: 0,
    observation: null,
    ...patch,
  };
}

const draftContext: DraftContext = {
  project: {
    name: "Proyecto de control",
    code: "PR-001",
    entity_name: "Entidad A",
  },
  period: {
    label: "Enero 2026",
    month: "2026-01-01",
  },
  partidas: [],
  metrados: [],
  valuation: {
    progress_percent: 12,
    gross_amount: 1000,
    deductions_amount: 100,
    net_amount: 900,
  },
};

describe("caja blanca - logica interna solicitada", () => {
  it("calculo de metrado usa largo por ancho por alto por veces", () => {
    expect(computeLinePartial({ num_elements: 2, length: 3, width: 4, height: 5 })).toBe(120);
    expect(computeLinePartial({ num_elements: 2, length: 3, width: 4, height: 5, formula: "N*L*A*H" })).toBe(120);
  });

  it("bloqueo de excedentes aplica acumulado menor o igual al contractual", () => {
    expect(isMetradoWithinContract({
      contractualQuantity: 100,
      previousQuantity: 60,
      currentQuantity: 40,
    })).toBe(true);

    expect(isMetradoWithinContract({
      contractualQuantity: 100,
      previousQuantity: 60,
      currentQuantity: 40.001,
    })).toBe(false);

    expect(getMetradoExcess({
      contractualQuantity: 100,
      previousQuantity: 60,
      currentQuantity: 40.001,
    })).toBe(0.001);
  });

  it("calculo de valorizacion multiplica metrado aprobado por precio unitario", () => {
    const [row] = buildValuationTable({
      items: [budgetItem({ unit_price: 12.5 })],
      previousLines: [metradoLine({ partial: 2 })],
      currentLines: [metradoLine({ partial: 8 })],
    });

    expect(row.qtyCurrent).toBe(8);
    expect(row.amountCurrent).toBe(100);
    expect(row.qtyAccum).toBe(10);
    expect(row.amountAccum).toBe(125);
  });

  it("factor K y reajustes aplican formula polinomica e indices", () => {
    const monomios: Monomio[] = [
      { symbol: "a", coefficient: 0.5, index_code: "39", base_index_value: 100 },
      { symbol: "b", coefficient: 0.5, index_code: "47", base_index_value: 200 },
    ];

    const result = calcReajuste(monomios, [
      { code: "39", value: 110 },
      { code: "47", value: 220 },
    ], 1000);

    expect(result.k).toBeCloseTo(1.1, 6);
    expect(result.reajusteAmount).toBeCloseTo(100, 2);
    expect(result.detail.map((row) => row.ratio)).toEqual([1.1, 1.1]);
  });

  it("permisos por rol respetan guards y validaciones internas", () => {
    expect(canCreateProjectWithRoles(["admin"])).toBe(true);
    expect(canCreateProjectWithRoles(["assistant"])).toBe(false);

    const [approval] = getAvailableTransitions({
      kind: "valuation",
      status: "reviewed",
      roles: ["supervisor_inspector"],
    }).filter((transition) => transition.action === "approved");

    expect(approval).toBeDefined();
    expect(canUserPerform(approval, ["supervisor_inspector"])).toBe(true);
    expect(canUserPerform(approval, ["residente_obra"])).toBe(false);
    expect(getWorkflowTransitions("memoria_valorizada").find((transition) => transition.action === "rejected")?.requiresComment).toBe(true);
  });

  it("generacion con Claude usa payload minimo, prompt versionado y revision humana", () => {
    const control = buildDraftControlMetadata(["generalidades", "metas"]);
    const body = buildClaudeRequestBody({
      context: draftContext,
      sections: ["generalidades", "metas"],
      model: "claude-test",
    });
    const serializedBody = JSON.stringify(body);
    const prompt = body.messages[0].content;

    expect(control).toEqual({
      promptVersion: DRAFT_PROMPT_VERSION,
      humanReviewRequired: HUMAN_REVIEW_REQUIRED,
      requestedSections: ["generalidades", "metas"],
    });
    expect(Object.keys(body).sort()).toEqual(["max_tokens", "messages", "model", "system", "temperature"].sort());
    expect(body.messages).toHaveLength(1);
    expect(serializedBody).not.toContain("x-api-key");
    expect(serializedBody).not.toContain("ANTHROPIC_API_KEY");
    expect(prompt).toContain(DRAFT_PROMPT_VERSION);
    expect(prompt).toContain('"humanReviewRequired": true');
    expect(prompt).toContain('"generalidades"');
    expect(prompt).toContain('"metas"');
    expect(prompt).not.toContain('"conclusiones":');
    expect(SYSTEM_PROMPT).toContain("NO INVENTES");
    expect(SYSTEM_PROMPT).toContain("NO calcules");
    expect(SYSTEM_PROMPT).toContain("NO apruebes");
  });

  it("formula custom invalida cae al calculo geometrico interno", () => {
    expect(computeLinePartial({ num_elements: 2, length: 3, width: 4, height: 5, formula: "alert(1)" })).toBe(120);
    expect(computeLinePartial({ num_elements: 1, length: 2, width: 3, formula: "L*A" })).toBe(6);
    expect(computeLinePartial({ num_elements: 1, length: 2, formula: "L" })).toBe(2);
  });

  it("buildValuationTable calcula saldo y porcentajes acumulados por partida", () => {
    const secondItem = budgetItem({
      id: "item-2",
      item_code: "01.02",
      base_quantity: 50,
      unit_price: 20,
    });
    const rows = buildValuationTable({
      items: [budgetItem({ base_quantity: 100, unit_price: 10 }), secondItem],
      previousLines: [metradoLine({ item_id: "item-1", partial: 30 })],
      currentLines: [
        metradoLine({ item_id: "item-1", partial: 20 }),
        metradoLine({ id: "line-2", item_id: "item-2", partial: 10 }),
      ],
    });

    expect(rows[0].qtyAccum).toBe(50);
    expect(rows[0].qtyBalance).toBe(50);
    expect(rows[0].pctAccum).toBe(50);
    expect(rows[1].amountCurrent).toBe(200);
    expect(rows[1].qtyBalance).toBe(40);
  });

  it("calcReajuste marca monomios faltantes sin sumarlos al factor K", () => {
    const result = calcReajuste(
      [
        { symbol: "a", coefficient: 0.5, index_code: "39", base_index_value: 100 },
        { symbol: "b", coefficient: 0.5, index_code: "99", base_index_value: 200 },
      ],
      [{ code: "39", value: 120 }],
      1_000,
    );

    expect(result.detail.find((row) => row.symbol === "b")?.missing).toBe(true);
    expect(result.k).toBeCloseTo(0.6, 6);
    expect(result.reajusteAmount).toBeCloseTo(-400, 2);
  });

  it("computeValuationBreakdown aplica ramas distintas de retencion", () => {
    const perValuation = computeValuationBreakdown({
      monthlyDirectCostAtReference: 10_000,
      overheadPercentage: 0,
      profitPercentage: 0,
      relationFactor: 1,
      reajusteK: 1,
      retentionPercentage: 0.1,
      retentionMode: "per_valuation",
    });
    const singleRetention = computeValuationBreakdown({
      monthlyDirectCostAtReference: 10_000,
      overheadPercentage: 0,
      profitPercentage: 0,
      relationFactor: 1,
      reajusteK: 1,
      retentionPercentage: 0.1,
      retentionMode: "single",
      contractAmount: 100_000,
      retentionAlreadyRetained: 5_000,
    });

    expect(perValuation.retentionAmount).toBeCloseTo(1_000, 2);
    expect(singleRetention.retentionAmount).toBeCloseTo(5_000, 2);
    expect(singleRetention.netToPay).toBeLessThan(perValuation.netToPay);
  });

  it("validatePeriodOpening distingue faltantes de proyecto y presupuesto", () => {
    const missingProject = validatePeriodOpening({
      hasProject: false,
      hasUser: true,
      hasBudgetItems: true,
      form: { number: 1, from: "2026-01-01", to: "2026-01-31" },
      periods: [],
    });
    const missingBudget = validatePeriodOpening({
      hasProject: true,
      hasUser: true,
      hasBudgetItems: false,
      form: { number: 1, from: "2026-01-01", to: "2026-01-31" },
      periods: [],
      project: { start_date: "2026-01-01", planned_end_date: "2026-01-31" },
    });

    expect(missingProject.ok).toBe(false);
    expect(missingBudget.ok).toBe(false);
    if (!missingProject.ok) expect(missingProject.reason).toBe("missing_project_or_user");
    if (!missingBudget.ok) expect(missingBudget.reason).toBe("missing_budget");
  });

  it("totals agrega solo hojas estructurales e ignora partidas padre", () => {
    const parent = budgetItem({
      id: "parent-1",
      item_code: "01",
      base_quantity: 0,
      unit_price: 0,
      partial_amount: 0,
      hierarchy_level: 1,
    });
    const leaf = budgetItem({
      id: "leaf-1",
      item_code: "01.01",
      base_quantity: 100,
      unit_price: 10,
      partial_amount: 1_000,
      hierarchy_level: 2,
      parent_item_code: "01",
    });
    const rows = buildValuationTable({
      items: [parent, leaf],
      previousLines: [],
      currentLines: [metradoLine({ id: "line-leaf", item_id: "leaf-1", partial: 25 })],
    });

    const summary = totals(rows);
    expect(summary.base).toBeCloseTo(1_000, 2);
    expect(summary.current).toBeCloseTo(250, 2);
    expect(summary.balance).toBeCloseTo(750, 2);
  });

  it("isFormulaBalanced valida suma unitaria de coeficientes polinomicos", () => {
    const balanced: Monomio[] = [
      { symbol: "a", coefficient: 0.4, index_code: "39", base_index_value: 100 },
      { symbol: "b", coefficient: 0.6, index_code: "47", base_index_value: 200 },
    ];

    expect(isFormulaBalanced(balanced)).toBe(true);
    expect(isFormulaBalanced([{ symbol: "a", coefficient: 0.95, index_code: "39", base_index_value: 100 }])).toBe(false);
    expect(isFormulaBalanced([{ symbol: "a", coefficient: 1.002, index_code: "39", base_index_value: 100 }])).toBe(false);
  });

  it("getAvailableTransitions permite bypass interno para admin global", () => {
    const transitions = getAvailableTransitions({
      kind: "valuation",
      status: "reviewed",
      roles: [],
      isGlobalAdmin: true,
    });

    expect(transitions.some((transition) => transition.action === "approved")).toBe(true);
    expect(canUserPerform(transitions[0], [])).toBe(false);
    expect(canUserPerform(transitions[0], [], true)).toBe(true);
  });
});
