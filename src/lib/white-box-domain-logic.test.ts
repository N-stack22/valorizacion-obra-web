import { describe, expect, it } from "vitest";

import {
  buildValuationTable,
  computeLinePartial,
  getMetradoExcess,
  isMetradoWithinContract,
  type MetradoLine,
} from "./expediente";
import { canCreateProjectWithRoles } from "./auth-policy";
import { calcReajuste, type Monomio } from "./reajuste";
import { canUserPerform, getAvailableTransitions, getWorkflowTransitions } from "./workflow";
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
});
