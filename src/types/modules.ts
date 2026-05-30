export type ModuleStatus = "pendiente" | "en_progreso" | "listo_para_pruebas" | "aprobado";

export type ProjectModule = {
  id: string;
  title: string;
  description: string;
  path: string;
  status: ModuleStatus;
  tables: string[];
  tests: string[];
};
