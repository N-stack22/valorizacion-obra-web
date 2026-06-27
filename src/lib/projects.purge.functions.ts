import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const purgeInput = z.object({
  projectId: z.string().uuid(),
  confirmCode: z.string().min(1).max(64),
});

type PurgeChildTable =
  | "valuation_deductions"
  | "expediente_documents"
  | "liquidations"
  | "valuations"
  | "memoria_valorizada"
  | "metrado_lines"
  | "budget_items"
  | "budget_imports"
  | "valuation_periods"
  | "workflow_comments"
  | "audit_logs"
  | "project_members";

type StorageBucket = "budget-imports" | "project-documents" | "expedientes";
type DeletedSummary = Record<string, number>;
type ProjectSnapshot = { id: string; code: string; name: string };
type SupabaseRoleReader = Pick<typeof supabaseAdmin, "from">;

// Order matters: delete leaf/child rows before parents to respect existing or future FKs.
const CHILD_TABLES = [
  "valuation_deductions",
  "expediente_documents",
  "liquidations",
  "valuations",
  "memoria_valorizada",
  "metrado_lines",
  "budget_items",
  "budget_imports",
  "valuation_periods",
  "workflow_comments",
  "audit_logs",
  "project_members",
] as const satisfies readonly PurgeChildTable[];

function addStoragePath(
  paths: Map<StorageBucket, Set<string>>,
  bucket: StorageBucket,
  path?: string | null,
) {
  const cleanPath = path?.trim();
  if (!cleanPath) return;
  if (!paths.has(bucket)) paths.set(bucket, new Set());
  paths.get(bucket)!.add(cleanPath);
}

async function deleteByProjectId(table: PurgeChildTable, projectId: string) {
  const { error, count } = await supabaseAdmin
    .from(table)
    .delete({ count: "exact" })
    .eq("project_id", projectId);
  if (error) {
    throw new Error(`No se pudo limpiar ${table}: ${error.message}`);
  }
  return count ?? 0;
}

async function assertAdminRole(supabase: SupabaseRoleReader, userId: string) {
  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (roleError) {
    throw new Error(`No se pudo verificar el rol: ${roleError.message}`);
  }
  if (!roleRow) {
    throw new Error("Solo un administrador puede purgar un proyecto.");
  }
}

async function loadProject(projectId: string): Promise<ProjectSnapshot> {
  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .select("id, code, name")
    .eq("id", projectId)
    .maybeSingle();
  if (projectError) throw new Error(projectError.message);
  if (!project) throw new Error("Proyecto no encontrado.");
  return project;
}

function assertConfirmationCode(confirmCode: string, project: ProjectSnapshot) {
  if (confirmCode.trim().toUpperCase() !== project.code.trim().toUpperCase()) {
    throw new Error("El cÃ³digo de confirmaciÃ³n no coincide con el cÃ³digo del proyecto.");
  }
}

function assertStorageRead(label: string, error?: { message: string } | null) {
  if (error) throw new Error(`${label}: ${error.message}`);
}

async function collectStoragePaths(projectId: string) {
  const storagePaths = new Map<StorageBucket, Set<string>>();
  const [budgetFiles, projectDocs, memoriaDocs, valuationDocs, liquidationDocs] = await Promise.all(
    [
      supabaseAdmin.from("budget_imports").select("file_path").eq("project_id", projectId),
      supabaseAdmin.from("expediente_documents").select("file_path").eq("project_id", projectId),
      supabaseAdmin.from("memoria_valorizada").select("document_path").eq("project_id", projectId),
      supabaseAdmin
        .from("valuations")
        .select("generated_document_path")
        .eq("project_id", projectId),
      supabaseAdmin
        .from("liquidations")
        .select("generated_document_path")
        .eq("project_id", projectId),
    ],
  );

  assertStorageRead("No se pudieron leer archivos de presupuesto", budgetFiles.error);
  assertStorageRead("No se pudieron leer documentos del expediente", projectDocs.error);
  assertStorageRead("No se pudieron leer PDFs de memoria", memoriaDocs.error);
  assertStorageRead("No se pudieron leer PDFs de valorizaciÃ³n", valuationDocs.error);
  assertStorageRead("No se pudieron leer PDFs de liquidaciÃ³n", liquidationDocs.error);

  budgetFiles.data?.forEach((row) => addStoragePath(storagePaths, "budget-imports", row.file_path));
  projectDocs.data?.forEach((row) =>
    addStoragePath(storagePaths, "project-documents", row.file_path),
  );
  projectDocs.data?.forEach((row) => addStoragePath(storagePaths, "expedientes", row.file_path));
  memoriaDocs.data?.forEach((row) =>
    addStoragePath(storagePaths, "expedientes", row.document_path),
  );
  valuationDocs.data?.forEach((row) =>
    addStoragePath(storagePaths, "expedientes", row.generated_document_path),
  );
  liquidationDocs.data?.forEach((row) =>
    addStoragePath(storagePaths, "expedientes", row.generated_document_path),
  );
  return storagePaths;
}

async function deleteValuationLines(projectId: string, deleted: DeletedSummary) {
  const { data: vals, error: valsError } = await supabaseAdmin
    .from("valuations")
    .select("id")
    .eq("project_id", projectId);
  if (valsError) throw new Error(`No se pudieron leer valorizaciones: ${valsError.message}`);

  const valuationIds = (vals ?? []).map((v) => v.id);
  if (valuationIds.length === 0) {
    deleted.valuation_lines = 0;
    return;
  }

  const { error: vlError, count: vlCount } = await supabaseAdmin
    .from("valuation_lines")
    .delete({ count: "exact" })
    .in("valuation_id", valuationIds);
  if (vlError) throw new Error(`valuation_lines: ${vlError.message}`);
  deleted.valuation_lines = vlCount ?? 0;
}

async function deleteStorageBucket(
  projectId: string,
  bucket: StorageBucket,
  storagePaths: Map<StorageBucket, Set<string>>,
  deleted: DeletedSummary,
) {
  const { data: list, error: listError } = await supabaseAdmin.storage
    .from(bucket)
    .list(projectId, { limit: 1000 });
  if (listError) throw new Error(`No se pudo listar archivos en ${bucket}: ${listError.message}`);

  list?.forEach((file) => addStoragePath(storagePaths, bucket, `${projectId}/${file.name}`));
  const paths = Array.from(storagePaths.get(bucket) ?? []);
  if (paths.length === 0) return;

  const { error: removeError } = await supabaseAdmin.storage.from(bucket).remove(paths);
  if (removeError)
    throw new Error(`No se pudieron eliminar archivos en ${bucket}: ${removeError.message}`);
  deleted[`storage.${bucket}`] = paths.length;
}

async function deleteStorageObjects(
  projectId: string,
  storagePaths: Map<StorageBucket, Set<string>>,
  deleted: DeletedSummary,
) {
  const buckets: StorageBucket[] = ["budget-imports", "project-documents", "expedientes"];
  for (const bucket of buckets) {
    await deleteStorageBucket(projectId, bucket, storagePaths, deleted);
  }
}

async function deleteChildRows(projectId: string, deleted: DeletedSummary) {
  for (const table of CHILD_TABLES) {
    deleted[table] = await deleteByProjectId(table, projectId);
  }
}

async function deleteProject(projectId: string) {
  const { error: projError, count: projectCount } = await supabaseAdmin
    .from("projects")
    .delete({ count: "exact" })
    .eq("id", projectId);
  if (projError) {
    throw new Error(`No se pudo eliminar el proyecto: ${projError.message}`);
  }
  if ((projectCount ?? 0) !== 1) {
    throw new Error(
      "La operaciÃ³n terminÃ³ sin eliminar el proyecto padre. No se confirmÃ³ la purga.",
    );
  }
}

async function verifyProjectDeleted(projectId: string) {
  const { data: remainingProject, error: verifyError } = await supabaseAdmin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();
  if (verifyError) throw new Error(`No se pudo verificar la purga: ${verifyError.message}`);
  if (remainingProject) throw new Error("El proyecto todavÃ­a existe despuÃ©s de la purga.");
}

async function writePurgeAudit(
  userId: string,
  projectId: string,
  project: ProjectSnapshot,
  deleted: DeletedSummary,
) {
  const { error: auditError } = await supabaseAdmin.from("audit_logs").insert({
    project_id: null,
    actor_user_id: userId,
    entity_type: "projects",
    entity_id: projectId,
    action: "PURGE",
    previous_data: { project, deleted },
  });
  if (auditError) console.error("No se pudo registrar la auditorÃ­a de purga", auditError);
}

export const purgeProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => purgeInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const deleted: DeletedSummary = {};

    await assertAdminRole(supabase, userId);
    const project = await loadProject(data.projectId);
    assertConfirmationCode(data.confirmCode, project);

    const storagePaths = await collectStoragePaths(data.projectId);
    await deleteValuationLines(data.projectId, deleted);
    await deleteStorageObjects(data.projectId, storagePaths, deleted);
    await deleteChildRows(data.projectId, deleted);
    await deleteProject(data.projectId);
    await verifyProjectDeleted(data.projectId);
    await writePurgeAudit(userId, data.projectId, project, deleted);

    return { success: true, deleted, project };
  });
